module engine

import json
import math.complex { Complex }
import rand

pub struct Engine {
pub mut:
	drones []Drone
	bounds Complex = Complex{10, 10}
pub:
	delta_time f64 [required]
}

type Uid = string

struct Drone {
pub:
	id Uid
pub mut:
	position Complex
	ai_state AiState
}

pub struct DroneInputs {
pub mut:
	engine_power f64 [json: enginePower]
	rotation     f64
}

pub struct AiState {
pub mut:
	initialized bool
	input       DroneInputs
	custom      string
}

pub fn (mut e Engine) on_tick() {
	e.process_world(e.delta_time)
}

// export_state_full exports engine state, suitable
// for saving to file and loading via import_state()
pub fn (e Engine) export_state_full() string {
	return json.encode(e)
}

pub fn (mut e Engine) import_state(data string) ? {
	new := json.decode(Engine, data) ?
	e = new
}

pub fn (mut e Engine) create_drone() Uid {
	d := Drone{
		id: rand.ulid()
		position: Complex{2, 2}
	}
	e.drones << d
	return d.id
}
