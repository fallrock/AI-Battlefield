module app

import engine
import runner
import json
import x.json2
import export_ai

fn mk_packet(packet_type string, data json2.Any) string {
	mut obj := map[string]json2.Any{}
	obj['type'] = packet_type
	obj['data'] = data
	return obj.str()
}

struct RunnerResult {
	id       string
	ai_state engine.AiState
}

pub fn (mut app AppState) apply_ai() {
	runner_inp := mk_packet('engine', export_ai.encode(app.e))
	runner_out := app.runner.process(runner_inp)

	results := json.decode([]RunnerResult, runner_out) or {
		eprintln('runner returned invalid json: >$runner_out<')
		return
	}
	// TODO this is very bad, change to map
	for result in results {
		for mut drone in app.e.drones {
			if drone.id == result.id {
				drone.ai_state = result.ai_state
				break
			}
		}
	}
}
