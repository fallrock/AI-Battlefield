module streamer

import net.websocket
import term

struct Server {
mut:
	ws websocket.Server
}

pub fn (s Server) broadcast(msg string) ? {
	for i, _ in s.ws.clients {
		mut c := s.ws.clients[i]
		if c.client.state == .open {
			c.client.write(msg.bytes(), .text_frame) or {
				c.client.close(0, 'client.write failed for some reason ($err)') ?
			}
		}
	}
}

pub fn (mut s Server) listen() ? {
	s.ws.listen() ?
}

pub fn new_server(port int) ?&Server {
	mut s := websocket.new_server(.ip6, port, '')

	s.on_connect(fn (mut s websocket.ServerClient) ?bool {
		return s.resource_name == '/'
	}) ?

	s.on_close(fn (mut ws websocket.Client, code int, reason string) ? {
		println(term.green('client ($ws.id) closed connection ($code) ($reason)'))
	})

	return &Server{
		ws: s
	}
}
