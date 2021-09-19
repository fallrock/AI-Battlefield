import aibf
import os

fn load(path string) ?aibf.User {
	u := aibf.create_drone() ?
	aibf.set_ai(u, os.read_file(path) ?) ?
	return u
}

for f in os.walk_ext('cli/example-ai/', 'js') {
	u := load(f) ?
	println('${os.base(f)}: $u.id')
}
