import engine
import streamer
import rest
import time
import os
import json
import term
import export_render
import export_ai

fn main() {
	mut e := engine.Engine{
		delta_time: 1.0 / 10
	}

	mut rest_srv := rest.new_server(8082)
	go rest_srv.listen_and_serve()

	mut ws_srv := streamer.new_server(8081) ?
	go ws_srv.listen()

	mut runner := os.new_process('/usr/bin/node')
	runner.set_redirect_stdio()
	runner.set_args(['API/AI-Runner/runner.js'])
	runner.run()
	pass_to_runner := fn (id engine.Uid, e engine.Engine, mut runner os.Process) ?engine.AiState {
		runner_data := export_ai.encode(
			id: id
			engine: e
			ai: os.read_file('cli/example-ai/rpatrol.js') or { panic(err) }
		)
		runner.stdin_write(runner_data)
		runner.stdin_write('\n')
		result := runner.stdout_read()
		dump(runner_data)
		dump(result)
		if !runner.is_alive() {
			println(term.header_left('RUNNER STDERR', '-'))
			println(term.red(runner.stderr_read()))
			println(term.h_divider('-'))
			panic('runner died')
		}
		return json.decode(engine.AiState, result)
	}

	e.create_drone()

	for {
		println('tick')
		e.on_tick(pass_to_runner, runner)
		ws_srv.broadcast(export_render.encode(e)) ?
		time.sleep(e.delta_time * time.second)
	}

	runner.close()
}
