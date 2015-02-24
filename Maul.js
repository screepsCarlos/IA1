var CreepIA = require('CreepIA');

function Maul(){

}
Maul.prototype = new CreepIA();
// Maul.prototype.constructor=Maul;

Maul.name = 'Maul';
Maul.templates = {
  5: [Game.MOVE, Game.WORK, Game.WORK, Game.WORK, Game.CARRY],
  6: [Game.MOVE, Game.WORK, Game.WORK, Game.WORK, Game.WORK, Game.CARRY]
};

Maul.prototype.strategy = function(creep){
  if(!creep.memory || !creep.memory.target){
    var harvestedSources = [];
    var myCreeps = creep.room.find(Game.MY_CREEPS);
    _.each(myCreeps, function(creep){
      if(creep.memory.role === "Maul" && creep.memory.target){
        harvestedSources.push(creep.memory.target.id);
      }
    });
    var availableSource = creep.pos.findClosest(Game.SOURCES_ACTIVE, {
      filter: function(s){
        return !_.contains(harvestedSources, s.id);
      }
    });
    creep.memory.target = {
      id: availableSource.id,
      type: Game.SOURCES
    };
  }
  var sources = creep.room.find(Game.SOURCES);
  var target = _.find(sources, {id: creep.memory.target.id});
  creep.moveTo(target);
  if(creep.energy < creep.energyCapacity)
    creep.harvest(target);
  else {
    var gatherers = creep.pos.findInRange(Game.MY_CREEPS, 1, {
      filter: function(c){
        return (c.memory.role === 'Gatherer' && c.energy === 0);
      }
    });
    if(gatherers.length)
      creep.transferEnergy(gatherers[0]);
  }
}

module.exports = Maul;