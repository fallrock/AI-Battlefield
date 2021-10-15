module export_ai

import engine
import x.json2
import math.complex { Complex }

pub struct RunnerData {
	id     engine.Uid
	engine engine.Engine
	ai     string
}

// export_state_ai exports engine state suitable
// for ai scripts
pub fn encode(data RunnerData) string {
	mut obj := map[string]json2.Any{}
	obj['id'] = data.id.str()
	obj['engine'] = engine_to_json(data.engine)
	obj['ai'] = data.ai
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
	obj['input'] = inputs_to_json(d.ai_state.input)
	obj['ai_state'] = ai_state_to_json(d.ai_state)
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

fn ai_state_to_json(s engine.AiState) json2.Any {
	mut obj := map[string]json2.Any{}
	obj['initialized'] = s.initialized
	obj['custom'] = s.custom
	return obj
}
