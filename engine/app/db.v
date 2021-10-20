module app

pub struct AiRecord {
	id   int    [primary; sql: serial]
	uid  string [unique]
	code string
}

