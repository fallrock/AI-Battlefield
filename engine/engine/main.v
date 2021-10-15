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
	inputs   DroneInputs
	ai_state AiState
}

pub struct DroneInputs {
pub mut:
	engine_power f64
	rotation     f64
}

struct AiState {
pub mut:
	initialized bool
	custom      string
}

type AIRunner = fn (Uid, Engine, voidptr) ?DroneInputs

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
		inputs: DroneInputs{}
	}
	e.drones << d
	return d.id
}

fn (e Engine) apply_ai(runner AIRunner, runner_data voidptr) {
	for mut d in e.drones {
		inp := runner(d.id, e, runner_data) or { continue }
		d.inputs = inp
	}
}
