var CreepIA = require('CreepIA');

function Healer(){

}
Healer.prototype = new CreepIA();
// Healer.prototype.constructor=Healer;

Healer.name = 'Healer';
Healer.templates = {
  5: [Game.HEAL, Game.HEAL, Game.MOVE, Game.MOVE],
  6: [Game.HEAL, Game.HEAL, Game.HEAL, Game.MOVE, Game.MOVE, Game.MOVE]
};

Healer.prototype.strategy = function(creep){
    var injured = creep.pos.findClosest(Game.MY_CREEPS, {
      filter: function(o){
        return o.hits < o.hitsMax;
      }
    });
    if(injured) {
      creep.moveTo(injured);
      creep.heal(injured);
    } else {
      var fighter = creep.pos.findClosest(Game.MY_CREEPS, {
        filter: function(o){
          return o.memory.role === 'Guard';
        }
      });
      if(fighter)
        creep.moveTo(fighter);
      return;
    }
  }
}

module.exports = Healer;