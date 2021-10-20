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
	id   int    [primary; sql: serial]
	uid  string [unique]
	code string
}

struct AppState {
mut:
	e     engine.Engine
	ai_db sqlite.DB
}

fn example_init(mut app AppState) {
	sql app.ai_db {
		create table AiRecord
	}

	uid := app.e.create_drone()
	test_ai := AiRecord{
		uid: uid.str()
		code: os.read_file('cli/example-ai/rpatrol.js') or { panic(err) }
	}
	sql app.ai_db {
		insert test_ai into AiRecord
	}
}

fn (mut app AppState) on_create_drone() string {
	println('Creating drone')
	return app.e.create_drone()
}

fn (mut app AppState) on_delete_drone() {
	panic('Not implemented')
}

fn (mut app AppState) on_set_ai(uid string, code string) {
	println('Creating ai for drone $uid')
	ai := AiRecord{
		uid: uid
		code: code
	}
	sql app.ai_db {
		insert ai into AiRecord
	}
}

fn (app AppState) on_get_ai(uid string) string {
	println('Sending ai for ($uid)')
	ai_rec := sql app.ai_db {
		select from AiRecord where uid == uid limit 1
	}
	return ai_rec.code
}

fn main() {
	mut app := AppState{
		e: engine.Engine{
			delta_time: 1.0 / 10
		}
		ai_db: sqlite.connect(':memory:') ?
	}

	example_init(mut app)

	mut rest_srv := rest.new_server(rest.Handler{&app}, 8082)
	go rest_srv.listen_and_serve()

	mut ws_srv := streamer.new_server(8081) ?
	go ws_srv.listen()

	mut runner := runner.new_runner(['/usr/bin/node', 'API/AI-Runner/runner.js'])
	runner.start()

	for {
		// println('tick')
		apply_ai(mut app.e, mut runner, app.ai_db)
		app.e.on_tick()
		ws_srv.broadcast(export_render.encode(app.e)) ?
		time.sleep(app.e.delta_time * time.second)
	}
}

fn apply_ai(mut e engine.Engine, mut runner runner.Runner, ai_db sqlite.DB) {
	for mut d in e.drones {
		uid := d.id.str()
		ai_rec := sql ai_db {
			select from AiRecord where uid == uid limit 1
		}
		if ai_rec.id == 0 {
			continue
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
