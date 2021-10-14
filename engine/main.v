import engine
import streamer
import rest
import time
import os
import json
import rand

struct Runner_data {
	id     engine.Uid
	engine engine.Engine
}

fn main() {
	mut e := engine.Engine{
		delta_time: 1.0 / 10
	}

	mut rest_srv := rest.new_server(8082)
	go rest_srv.listen_and_serve()

	mut ws_srv := streamer.new_server(8081) ?
	go ws_srv.listen()

	mut runner := os.new_process('/usr/bin/cat')
	runner.set_redirect_stdio()
	runner.run()
	pass_to_runner := fn (id engine.Uid, e engine.Engine, mut runner os.Process) ?engine.DroneInputs {
		runner.stdin_write(json.encode(Runner_data{id, e}))
		result := runner.stdout_slurp()
		return json.decode(engine.DroneInputs, result)
	}

	e.create_drone()

	for {
		println('tick')
		e.on_tick(pass_to_runner, runner)
		ws_srv.broadcast(e.export_state_render()) ?
		time.sleep(e.delta_time * time.second)
	}

	runner.close()
}

fn somehow_exec_ai(id engine.Uid, e engine.Engine, _ voidptr) ?engine.DroneInputs {
	return engine.DroneInputs{
		engine_power: 1
		rotation: rand.f64n(360.0)
	}
}
