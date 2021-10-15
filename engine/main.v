import engine
import streamer
import rest
import runner
import os
import time
import json
import export_ai
import export_render

fn main() {
	mut e := engine.Engine{
		delta_time: 1.0 / 10
	}

	mut rest_srv := rest.new_server(8082)
	go rest_srv.listen_and_serve()

	mut ws_srv := streamer.new_server(8081) ?
	go ws_srv.listen()

	mut runner := runner.new_runner(['/usr/bin/node', 'API/AI-Runner/runner.js'])
	runner.start()

	e.create_drone()

	for {
		println('tick')
		e.on_tick(fn (id engine.Uid, e engine.Engine, mut runner runner.Runner) ?engine.AiState {
			inp := export_ai.encode(
				id: id
				engine: e
				ai: os.read_file('cli/example-ai/rpatrol.js') or { panic(err) }
			)
			out := runner.process(inp)
			return json.decode(engine.AiState, out) or {}
		}, &runner)
		ws_srv.broadcast(export_render.encode(e)) ?
		time.sleep(e.delta_time * time.second)
	}
}
