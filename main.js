var _ = require('lodash');

var Maul = require('Maul');
var Gatherer = require('Gatherer');
var Guard = require('Guard');
var Ranger = require('Ranger');
var Healer = require('Healer');

if(Memory.boIndex === undefined)
  Memory.boIndex = 0;

console.log('BOindex', Memory.BOindex);

var population = {
  bo: [Maul, Gatherer, Maul, Gatherer, Gatherer, Guard, Healer, Ranger, Maul, Gatherer, Gatherer, Ranger, Healer, Guard, Healer, Ranger, Gatherer, Gatherer],
  getNextCreep: function(){
    var nextCreep;
    if(Memory.boIndex < this.bo.length){
      nextCreep = this.bo[Memory.boIndex];
      console.log("BO: ", Memory.boIndex)
    }
    // else
    //   nextCreep = _.min(this.creeps, function(c){return c.pop / c.ratio;});
    // console.log("Next creep: ", nextCreep.name);
    return nextCreep;
  }
};

_.each(Game.creeps, function(creep){
  // console.log(creep.name, creep.memory.role, creep.memory.action);
  // var creepData = _.find(population.creeps, {name: creep.memory.role});
  // creepData.pop++;
  // creepData.strategy(creep);
});

_.each(Game.spawns, function(spawn){
  if(!spawn.my)
    return;
  if(!spawn.spawning){
    var nextCreep = population.getNextCreep();
    var level = 5 + _.filter(Game.structures, {structureType: 'extension'}).length;
    var addition = 1;
    var ret;
    do {
      ret = spawn.createCreep(nextCreep.templates[level], nextCreep.name + (nextCreep.pop + addition++), {role: nextCreep.name})
    } while (ret === Game.ERR_NAME_EXISTS)
    if(ret !== Game.ERR_NOT_ENOUGH_ENERGY)
      Memory.boIndex++;
    console.log('creating: ', nextCreep.name, nextCreep.pop, ret);
  } else 
    console.log('spawning: ', spawn.spawning.name, spawn.spawning.remainingTime);
});




