import aibf
import os
import os.cmdline
import term

// fn usage() {
//     eprintln('usage: ${os.args[0]} -u USERID -f AI_FILE')
// }

fn usage() {
	g := fn(s string) string {
		return term.green(s)
	}
	y := fn(s string) string {
		return term.yellow(s)
	}
	b := fn(s string) string {
		return term.blue(s)
	}

	eprintln(y('USAGE:'))
	eprintln('    ${os.args[0]} OPTIONS')
	eprintln('')

	eprintln(y('OPTIONS:'))
	eprintln('    ${g('-u')}, ${g('--userid')} ${b('<id>')}        User ID')
	eprintln('    ${g('-f')}, ${g('--file')} ${b('<filename>')}    Path to file with ai program')
	eprintln('    ${g('-h')}, ${g('--help')}               Show this help')
	eprintln('')

	eprintln(y('EXAMPLES:'))
	eprintln('    ${os.args[0]} ${g('--userid')} ${b('1234')} ${g('--file')} ${b('my_ai.js')}')
	eprintln('    ${os.args[0]} ${g('-u')} ${b('1234')} ${g('-f')} ${b('my_ai.js')}')
	eprintln('')
}

fn arg(param ...string) ?string {
	for p in param {
		s := cmdline.option(os.args, p, '')
		if s != '' {
			return s
		}
	}
	return error('Param not found')
}

fn main() {
	if os.args.len == 1 {
		eprintln('Missing arguments\nTry "${os.args[0]} --help" for more info')
		exit(1)
	}
	if '-h' in os.args || '--help' in os.args {
		usage()
		exit(1)
	}

	id := arg('-u', '--userid') or {
		eprintln('user id not specified')
		exit(1)
	}

	ai_fname := arg('-f', '--file') or {
		eprintln('ai file not specified')
		exit(1)
	}

	ai := os.read_file(ai_fname) or {
		eprintln('$err')
		exit(1)
	}

	token := os.input_opt('Secret token: ') or {
		eprintln('\nlaunch program interactively or pass token via stdin')
		exit(1)
	}
	if token == '' {
		eprintln('token not specified')
		exit(1)
	}

	u := aibf.User{id, token}
	aibf.set_ai(u, ai) or {
		eprintln('REST request failed ($err)')
		exit(1)
	}
	println('ai updated successfully')
}
