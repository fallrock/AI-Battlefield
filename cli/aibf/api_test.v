import aibf

fn test_api() ? {
	user := aibf.create_drone() ?

	ai := 'return {enginePower:1}'
	aibf.set_ai(user, ai) ?

	ret_packet := aibf.get_ai(user) ?

	expected := 'function anonymous(\n) {\nreturn {enginePower:1}\n}'
	assert ret_packet.ai == expected
}
