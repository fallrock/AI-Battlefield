module app

import engine
import sqlite
import runner

pub struct AppState {
pub mut:
	e      engine.Engine
	ai_db  sqlite.DB
	runner runner.Runner
}

pub fn (mut app AppState) start() {
	app.runner.start()
}

pub fn (mut app AppState) stop() {
	app.runner.stop()
}
