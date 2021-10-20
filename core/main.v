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
		runner: runner.new_runner('/usr/bin/node', ['./runner/runner.js'])
	}

	mut rest_srv := rest.new_server(rest.Handler{&app}, 8082)
	go rest_srv.listen_and_serve()

	mut ws_srv := streamer.new_server(8081) ?
	go ws_srv.listen()

	app.start()

	for {
		tick_start := time.now()

		app.apply_ai()
		app.e.on_tick()
		ws_srv.broadcast(export_render.encode(app.e)) ?

		elapsed := time.now() - tick_start
		dt := time.Duration(i64(app.e.delta_time * time.second))
		time.sleep(dt - elapsed)
		if elapsed > dt {
			eprintln("Can't keep up! Frame time: $elapsed.milliseconds() / $dt.milliseconds() ms")
		}
	}

	app.stop()
}
