'use strict';
const vm = require('vm');

const get_drone = (id, gamestate) =>
      gamestate.drones.find(d => d.id === id);
// const get_drone => (id) => db.drone[id];

const create_context = (gamestate, id) => {
  ///TODO: hide something
  ///TODO: move input to database
  // const drone = db.drone[id];
  const drone = get_drone(id, gamestate);
  const context = {
    gamestate: gamestate,
    id: id,
    input: drone.input,
    state: drone.state
  };

  ///TODO: memory leak?
  vm.createContext(context);
  return context;
};

const create_ai = (ai) => {
  ///TODO: boilerplate
  //TODO: safety
  return new vm.Script(ai);
};

const run = (gamestate, id) => {
  // const drone = db.drone[id];
  const drone = gamestate.drones.find((d) => d.id === id);
  const context = create_context(gamestate, id);
  const ai = create_ai(drone.ai);
  ai.runInContext(context);

  return context.input;
};

module.exports = { run };
