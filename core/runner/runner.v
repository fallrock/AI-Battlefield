module runner

import os
import term

struct Runner {
	os.Process
}

pub fn new_runner(argv []string) Runner {
	mut proc := os.new_process(argv.first())
	proc.set_redirect_stdio()
	proc.set_args(argv[1..])
	return Runner{proc}
}

pub fn (mut runner Runner) start() {
	runner.run()
}

pub fn (mut runner Runner) stop() {
	runner.close()
}

pub fn (mut runner Runner) process(data string) string {
	runner.stdin_write(data)
	runner.stdin_write('\n')

	result := runner.stdout_read()

	if !runner.is_alive() {
		println(term.header_left('RUNNER STDERR', '-'))
		println(term.red(runner.stderr_read()))
		println(term.h_divider('-'))
		panic('runner died')
	}
	return result
}
