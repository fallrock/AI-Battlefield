module main

import sqlite
import app

fn mk_mem_db() sqlite.DB {
	db := sqlite.connect(':memory:') or { panic(err) }
	sql db {
		create table app.AiRecord
	}
	return db
}
