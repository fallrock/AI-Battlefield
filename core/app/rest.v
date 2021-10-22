module app

import x.json2

fn (mut app AppState) on_create_drone() string {
	return app.e.create_drone()
}

fn (mut app AppState) on_delete_drone() {
	panic('Not implemented')
}

fn (mut app AppState) on_set_ai(uid string, code string) {
	ai := AiRecord{
		uid: uid
		code: code
	}
	sql app.ai_db {
		insert ai into AiRecord
	}

	runner_inp := mk_packet('ai', {
		'id':   json2.Any(uid)
		'code': json2.Any(code)
	})
	app.runner.process(runner_inp)
}

fn (app AppState) on_get_ai(uid string) string {
	ai_rec := sql app.ai_db {
		select from AiRecord where uid == uid limit 1
	}
	return ai_rec.code
}
