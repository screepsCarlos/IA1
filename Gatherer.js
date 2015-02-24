var CreepIA = require('CreepIA');

function Gatherer(){

}
Gatherer.prototype = new CreepIA();
// Gatherer.prototype.constructor=Gatherer;

Gatherer.name = 'Gatherer';
Gatherer.templates = {
  5: [Game.MOVE, Game.MOVE, Game.CARRY, Game.CARRY],
  6: [Game.MOVE, Game.MOVE, Game.MOVE, Game.CARRY, Game.CARRY, Game.CARRY]
};
Gatherer.pop = 0;

Gatherer.prototype = function(creep){
  var actionStrategy = {
    gather: function(){

      if(creep.energy > 0){
        creep.memory.target = null;
        actionStrategy.bringBack();
        return;
      }
      var myCreeps = creep.room.find(Game.MY_CREEPS);
      if(!creep.memory.target){

        var maulBusiness = {};
        _.each(myCreeps, function(c){
          if(c.memory.role === 'Maul' && c.memory.target){
            var source = Game.getObjectById(c.memory.target.id);
            var pathToSource = Game.spawns.Spawn1.pos.findPathTo(source);
            maulBusiness[c.memory.id] = {
              instance: c,
              sourceDistance: pathToSource.length,
              gatherers: [] 
            };
          }
        });
        _.each(myCreeps, function(c){
          console.log("###", c.memory.role);
          if(c.memory.role === 'Gatherer' && c.memory.target && maulBusiness[c.memory.target.id]){
            console.log("###", c.memory.target.id);
            maulBusiness[c.memory.target.id].gatherers.push(c.id);
          }
        });
        var minGathererMaulData = _.min(maulBusiness, function(maulData){
          console.log(">>>", maulData.gatherers.length, maulData.sourceDistance, maulData.gatherers.length / maulData.sourceDistance)
          return maulData.gatherers.length / maulData.sourceDistance;
        });

        var targetMaul = minGathererMaulData.instance;
        console.log("|||", targetMaul.id);
        creep.memory.target = {
          id: targetMaul.id,
          type: 'Maul'
        };
      }
      var target = _.find(myCreeps, {id: creep.memory.target.id});
      creep.memory.action = 'gather';
      creep.moveTo(target);
    },
    bringBack : function(){
      if(creep.energy === 0){
        actionStrategy.gather();
        return;
      }
      creep.memory.action = 'bringBack';
      creep.moveTo(Game.spawns.Spawn1);
      creep.transferEnergy(Game.spawns.Spawn1);
    }
  };
  actionStrategy[creep.memory.action || 'gather']();
}

module.exports = Gatherer;