var CreepIA = require('CreepIA');

function Ranger(){

}
Ranger.prototype = new CreepIA();
// Ranger.prototype.constructor=Ranger;

Ranger.name = 'Ranger';
Ranger.templates = {
  5: [Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE],
  6: [Game.TOUGH, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE, Game.MOVE, Game.MOVE]
};
Ranger.pop = 0;

Ranger.prototype.strategy = function(creep){
  if(creep.getActiveBodyparts(Game.RANGED_ATTACK) ===  0){
    return;
  }
  var targets = Game.spawns.Spawn1.pos.findInRange(Game.HOSTILE_CREEPS, 10);
  if(targets.length > 0) {
    var targetsInRange = creep.pos.findInRange(Game.HOSTILE_CREEPS, 3);
    if(targetsInRange.length > 0) {
      creep.rangedAttack(targetsInRange[0]);
      return;
    }
    var target = creep.pos.findClosest(Game.HOSTILE_CREEPS);
    if(target) {
      creep.moveTo(target);
      return;
    }
  }
  
  var mySpaws = _.filter(Game.spawns, function(s){return s.my;});
  creep.moveTo(mySpaws[0]);
}

module.exports = Ranger;