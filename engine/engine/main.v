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

type AIRunner = fn (Uid, Engine, voidptr) ?AiState

pub fn (mut e Engine) on_tick(runner AIRunner, runner_data voidptr) {
	e.apply_ai(runner, runner_data)
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

fn (mut e Engine) apply_ai(runner AIRunner, runner_data voidptr) {
	for mut d in e.drones {
		new_state := runner(d.id, e, runner_data) or { continue }
		d.ai_state = new_state
	}
}
