module rest

import net.http { CommonHeader, Request, Response, Server }

struct Handler {}

fn err_resp() Response {
	return Response{
		header: http.new_header_from_map({
			CommonHeader.content_type: 'text/plain'
		})
		status_code: int(http.Status.bad_request)
		text: 'Bad request'
	}
}

fn get_id(url string) ?string {
	u := '/drone/'
	if url.index(u) or { -1 } != 0 {
		return none
	}
	if url.len <= u.len {
		return none
	}
	return url[u.len..]
}

fn (h Handler) handle(req Request) Response {
	mut res := Response{
		header: http.new_header_from_map({
			CommonHeader.content_type: 'application/json'
		})
	}
	match req.method {
		.post {
			if req.url != '/drone' {
				return err_resp()
			}
			println('Creating drone')
		}
		.put {
			id := get_id(req.url) or { return err_resp() }
			ai := req.data
			println('Creating ai for drone ($id) ($ai)')
		}
		.get {
			id := get_id(req.url) or { return err_resp() }
			res.text = 'Sample_AI_FIXME'
			println('Sending ai for ($id)')
		}
		else {
			return err_resp()
		}
	}
	res.status_code = 200
	return res
}

pub fn new_server(port int) &Server {
	return &Server{
		handler: Handler{}
		port: port
	}
}
