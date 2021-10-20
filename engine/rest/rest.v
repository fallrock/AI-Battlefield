module rest

import net.http { CommonHeader, Request, Response, Server }
import json

interface RestEventHandler {
mut:
	on_create_drone() string
	on_delete_drone()
	on_set_ai(uid string, code string)
	on_get_ai(uid string) string
}

[heap]
pub struct Handler {
mut:
	callbacks &RestEventHandler
}

fn err_resp() Response {
	return Response{
		header: http.new_header_from_map({
			CommonHeader.content_type: 'text/plain'
		})
		status_code: int(http.Status.bad_request)
		text: 'Bad request'
	}
}

struct MultiPacket {
mut:
	id    string [required]
	token string
	ai    string
}

fn (mut h Handler) handle(req Request) Response {
	if req.url != '/drone' {
		return err_resp()
	}
	mut res := Response{
		header: http.new_header_from_map({
			CommonHeader.content_type: 'application/json'
		})
	}
	match req.method {
		.post { // Create drone
			uid := h.callbacks.on_create_drone()
			res.text = '{"id":"$uid","token":"TODO"}'
		}
		.put { // Set drone ai
			in_packet := json.decode(MultiPacket, req.data) or { return err_resp() }
			h.callbacks.on_set_ai(in_packet.id, in_packet.ai)
		}
		.get { // Get drone ai
			in_packet := json.decode(MultiPacket, req.data) or { return err_resp() }
			out_packet := MultiPacket{
				id: in_packet.id,
				ai: h.callbacks.on_get_ai(in_packet.id)
			}
			res.text = json.encode(out_packet)
		}
		else {
			return err_resp()
		}
	}
	res.status_code = 200
	return res
}

pub fn new_server(handler Handler, port int) &Server {
	return &Server{
		handler: handler
		port: port
	}
}
