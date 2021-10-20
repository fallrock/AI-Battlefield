module main

import engine
import streamer
import rest
import runner
import os
import time
import export_render
import app

fn main() {
	os.chdir(os.environ()['PROJECT_ROOT']) or { panic(err) }

	mut app := app.AppState{
		e: engine.Engine{
			delta_time: 1.0 / 10
		}
		ai_db: mk_mem_db()
	}

	mut rest_srv := rest.new_server(rest.Handler{&app}, 8082)
	go rest_srv.listen_and_serve()

	mut ws_srv := streamer.new_server(8081) ?
	go ws_srv.listen()

	mut runner := runner.new_runner(['/usr/bin/node', 'API/AI-Runner/runner.js'])
	runner.start()

	for {
		app.apply_ai(mut runner)
		app.e.on_tick()
		ws_srv.broadcast(export_render.encode(app.e)) ?
		time.sleep(app.e.delta_time * time.second)
	}
}
