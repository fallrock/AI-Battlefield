import aibf

fn test_api() ? {
	user := aibf.create_drone() ?

	ai := 'start=()=>{},update=()=>{}'
	aibf.set_ai(user, ai) ?

	ret_packet := aibf.get_ai(user) ?

	assert ret_packet.ai == ai
}
