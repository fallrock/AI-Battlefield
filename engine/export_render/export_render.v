module export_render

import engine
import x.json2
import math.complex { Complex }

pub fn encode(e engine.Engine) string {
	mut obj := map[string]json2.Any{}
	obj['type'] = 'gamestate'
	obj['gamestate'] = engine_to_json(e)
	return obj.str()
}

fn engine_to_json(e engine.Engine) json2.Any {
	mut obj := map[string]json2.Any{}
	obj['deltaTime'] = e.delta_time
	obj['drones'] = e.drones.map(drone_to_json(it))
	obj['map'] = {
		'w': json2.Any(e.bounds.re)
		'h': json2.Any(e.bounds.im)
	}
	return obj
}

fn drone_to_json(d engine.Drone) json2.Any {
	mut obj := map[string]json2.Any{}
	obj['id'] = d.id.str()
	obj['pos'] = complex_to_json(d.position)
	obj['input'] = inputs_to_json(d.inputs)
	return obj
}

fn complex_to_json(c Complex) json2.Any {
	mut obj := map[string]json2.Any{}
	obj['x'] = c.re
	obj['y'] = c.im
	return obj
}

fn inputs_to_json(i engine.DroneInputs) json2.Any {
	mut obj := map[string]json2.Any{}
	obj['enginePower'] = i.engine_power
	obj['rotation'] = i.rotation
	return obj
}
