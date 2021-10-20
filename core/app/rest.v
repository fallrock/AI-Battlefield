module app

fn (mut app AppState) on_create_drone() string {
	println('Creating drone')
	return app.e.create_drone()
}

fn (mut app AppState) on_delete_drone() {
	panic('Not implemented')
}

fn (mut app AppState) on_set_ai(uid string, code string) {
	println('Creating ai for drone $uid')
	ai := AiRecord{
		uid: uid
		code: code
	}
	sql app.ai_db {
		insert ai into AiRecord
	}
}

fn (app AppState) on_get_ai(uid string) string {
	println('Sending ai for ($uid)')
	ai_rec := sql app.ai_db {
		select from AiRecord where uid == uid limit 1
	}
	return ai_rec.code
}

