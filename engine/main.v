import engine
import streamer
import rest
import runner
import os
import time
import json
import export_ai
import export_render
import sqlite

struct AiRecord {
	id  int    [primary; sql: serial]
	uid string [unique]
	code  string
}


fn main() {
	mut e := engine.Engine{
		delta_time: 1.0 / 10
	}

	ai_db := sqlite.connect(':memory:') ?
	sql ai_db {
		create table AiRecord
	}

	mut rest_srv := rest.new_server(8082)
	go rest_srv.listen_and_serve()

	mut ws_srv := streamer.new_server(8081) ?
	go ws_srv.listen()

	mut runner := runner.new_runner(['/usr/bin/node', 'API/AI-Runner/runner.js'])
	runner.start()

	uid := e.create_drone()
	test_ai := AiRecord{
		uid: uid.str()
		code: os.read_file('cli/example-ai/rpatrol.js') or { panic(err) }
	}
	sql ai_db {
		insert test_ai into AiRecord
	}

	for {
		println('tick')
		apply_ai(mut e, mut runner, ai_db)
		e.on_tick()
		ws_srv.broadcast(export_render.encode(e)) ?
		time.sleep(e.delta_time * time.second)
	}
}

fn apply_ai(mut e engine.Engine, mut runner runner.Runner, ai_db sqlite.DB) {
	for mut d in e.drones {
		uid := d.id.str()
		ai_rec := sql ai_db {
			select from AiRecord where uid == uid limit 1
		}
		runner_inp := export_ai.encode(
			id: d.id
			engine: e
			ai: ai_rec.code
		)
		runner_out := runner.process(runner_inp)

		d.ai_state = json.decode(engine.AiState, runner_out) or { continue }
	}
}
