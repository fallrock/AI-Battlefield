import aibf
import json
import os
import term

fn usage() {
	g := term.green
	y := term.yellow

	println(y('USAGE:'))
	println('    ${os.args[0]} [OPTIONS]')
	println('')

	println(y('OPTIONS:'))
	println('    ${g('-j')}, ${g('--json')}    Output json')
	println('    ${g('-h')}, ${g('--help')}    Show this help')
	println('')
}

fn main() {
	if os.args.any(it in ['-h', '--help']) {
		usage()
		exit(0)
	}

	user := aibf.create_drone() or {
		eprintln("Couldn't create drone ($err)")
		exit(1)
	}

	if os.args.any(it in ['-j', '--json']) {
		println(json.encode(user))
	} else {
		println('id: $user.id')
		println('token: $user.token')
		println('')
		println('Keep token in secret!')
		println('Use ${term.green('upload-ai')} to control your drone')
		println('See ${term.green('ai-help')} for general info')
	}
}
