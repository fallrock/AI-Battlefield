module engine

import math
import math.complex { Complex }

fn (mut e Engine) process_world(delta_time f64) {
	for mut d in e.drones {
		rad := math.radians(d.ai_state.input.rotation)
		rot := Complex{math.cos(rad), math.sin(rad)}
		move := Complex{d.ai_state.input.engine_power, 0} * rot
		d.position += move * Complex{delta_time, 0}
		d.position = e.clamp_pos(d.position)
	}
}

fn (e Engine) clamp_pos(pos Complex) Complex {
	w := e.bounds.re
	h := e.bounds.im
	return Complex{clamp(pos.re, 0, w), clamp(pos.im, 0, h)}
}

fn clamp(x f64, a f64, b f64) f64 {
	return math.max(a, math.min(b, x))
}
