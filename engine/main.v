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
		apply_ai(mut e, mut runner)
		e.on_tick()
		ws_srv.broadcast(export_render.encode(e)) ?
		time.sleep(e.delta_time * time.second)
	}
}

fn apply_ai(mut e engine.Engine, mut runner runner.Runner) {
	for mut d in e.drones {
		runner_inp := export_ai.encode(
			id: d.id
			engine: e
			ai: os.read_file('cli/example-ai/rpatrol.js') or { panic(err) }
		)
		runner_out := runner.process(runner_inp)

		d.ai_state = json.decode(engine.AiState, runner_out) or { continue }
	}
}
