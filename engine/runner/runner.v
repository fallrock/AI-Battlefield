module runner

import engine
import os
import json
import term
import export_ai

struct Runner{
	os.Process
}

pub fn new_runner() Runner {
	mut proc := os.new_process('/usr/bin/node')
	proc.set_redirect_stdio()
	proc.set_args(['API/AI-Runner/runner.js'])
	return Runner{proc}
}

pub fn (mut runner Runner) start() {
	runner.run()
}

pub fn (mut runner Runner) stop() {
	runner.close()
}

pub fn (mut runner Runner) exec(id engine.Uid, e engine.Engine) ?engine.AiState {
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
