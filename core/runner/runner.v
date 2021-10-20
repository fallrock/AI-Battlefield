module runner

import os
import term

struct Runner {
	os.Process
}

pub fn new_runner(prog string, args []string) Runner {
	mut proc := os.new_process(prog)
	proc.set_redirect_stdio()
	proc.set_args(args)
	return Runner{proc}
}

pub fn (mut runner Runner) start() {
	runner.run()
	go runner.handle_crash()
}

pub fn (mut runner Runner) stop() {
	runner.close()
}

pub fn (mut runner Runner) process(data string) string {
	runner.stdin_write(data)
	runner.stdin_write('\n')

	result := runner.stdout_read()

	return result
}

fn (mut runner Runner) handle_crash() {
	runner.wait()
	// runner must only be stopped with .close()
	if runner.status != .closed {
		println(term.header_left('RUNNER STDERR', '-'))
		println(term.red(runner.stderr_read()))
		println(term.h_divider('-'))
		panic('runner died')
	}
}
