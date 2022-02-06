module aibf

import net.http
import json

pub struct User {
pub:
	id    string
	token string
}


struct StatePacket {
pub:
	state string [required]
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
	packet := AiPacket{
		id: u.id
		token: u.token
		ai: ai
	}
	put_json(aibf.url, json.encode(packet)) ?
}

pub fn get_ai(u User) ?AiPacket {
	s := get_json(aibf.url, json.encode(u)) ?.text
	return json.decode(AiPacket, s) or {}
}

pub fn get_drone_state(u User) ?StatePacket {
	s := get_json(aibf.url+'_state', json.encode(u)) ?.text
	return json.decode(StatePacket, s) or {}
}

// get_json sends a GET HTTP request to the URL with a JSON data
fn get_json(url string, data string) ?http.Response {
	return http.fetch(
		method: .get
		url: url
		data: data
		header: http.new_header(key: .content_type, value: 'application/json')
	)
}

// put_json sends a PUT HTTP request to the URL with a JSON data
fn put_json(url string, data string) ?http.Response {
	return http.fetch(
		method: .put
		url: url
		data: data
		header: http.new_header(key: .content_type, value: 'application/json')
	)
}
