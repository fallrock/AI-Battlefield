module app

import engine
import runner
import sqlite
import json
import export_ai

pub struct AppState {
pub mut:
	e     engine.Engine
	ai_db sqlite.DB
}

pub fn (mut app AppState) apply_ai(mut runner runner.Runner) {
	for mut d in app.e.drones {
		uid := d.id.str()
		ai_rec := sql app.ai_db {
			select from AiRecord where uid == uid limit 1
		}
		if ai_rec.id == 0 {
			continue
		}
		runner_inp := export_ai.encode(
			id: d.id
			engine: app.e
			ai: ai_rec.code
		)
		runner_out := runner.process(runner_inp)

		d.ai_state = json.decode(engine.AiState, runner_out) or { continue }
	}
}
