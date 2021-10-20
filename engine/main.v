import engine
import streamer
import rest
import runner
import os
import time
import export_render
import app as app_module
import sqlite

fn example_init(mut app app_module.AppState) {
	sql app.ai_db {
		create table app_module.AiRecord
	}

	uid := app.e.create_drone()
	test_ai := app_module.AiRecord{
		uid: uid.str()
		code: os.read_file('cli/example-ai/rpatrol.js') or { panic(err) }
	}
	sql app.ai_db {
		insert test_ai into app_module.AiRecord
	}
}

fn main() {
	if 'PROJECT_ROOT' in os.environ() {
		os.chdir(os.environ()['PROJECT_ROOT']) or { panic(err) }
	}
	mut app := app_module.AppState{
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
		app.apply_ai(mut runner)
		app.e.on_tick()
		ws_srv.broadcast(export_render.encode(app.e)) ?
		time.sleep(app.e.delta_time * time.second)
	}
}

