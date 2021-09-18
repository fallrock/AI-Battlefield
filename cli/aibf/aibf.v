module aibf

import net.http
import json

pub struct User {
pub:
	id    string
	token string
}

struct AiPacket {
pub:
	id    string [required]
	token string
	ai    string [required]
}

// TODO unhardcode
const url = 'http://localhost:8082/drone'

pub fn create_drone() ?User {
	s := http.post_json(aibf.url, '') ?.text
	return json.decode(User, s) or {}
}

pub fn set_ai(u User, ai string) ? {
	patch := AiPacket{
		id: u.id
		token: u.token
		ai: ai
	}
	patch_json(aibf.url + '/$u.id', json.encode(patch)) ?
}

pub fn get_ai(u User) ?AiPacket {
	s := http.get(aibf.url + '/$u.id') ?.text
	return json.decode(AiPacket, s) or {}
}

// patch_json sends a PATCH HTTP request to the URL with a JSON data
fn patch_json(url string, data string) ?http.Response {
	return http.fetch(
		method: .patch
		url: url
		data: data
		header: http.new_header(key: .content_type, value: 'application/json')
	)
}
