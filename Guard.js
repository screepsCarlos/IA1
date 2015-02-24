var CreepIA = require('CreepIA');

function Guard(){

}
Guard.prototype = new CreepIA();
// Guard.prototype.constructor=Guard;

Guard.name = 'Guard';
Guard.templates = {
  5: [Game.TOUGH, Game.ATTACK, Game.ATTACK, Game.MOVE, Game.MOVE],
  6: [Game.TOUGH, Game.ATTACK, Game.ATTACK, Game.MOVE, Game.MOVE, Game.MOVE]
};

Guard.prototype.strategy = function(creep){
  if(creep.getActiveBodyparts(Game.ATTACK) ===  0){
    return;
  }
  var targets = Game.spawns.Spawn1.pos.findInRange(Game.HOSTILE_CREEPS, 10);
  if(targets.length > 0) {
    var target = creep.pos.findClosest(Game.HOSTILE_CREEPS);
    if(target) {
      creep.moveTo(target);
      creep.attack(target);
      return;
    }
  }
  var mySpaws = _.filter(Game.spawns, function(s){return s.my;});
  creep.moveTo(mySpaws[0]);
}

module.exports = Guard;