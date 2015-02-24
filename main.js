var _ = require('lodash');

// var energyGatherer = 0;

console.log("---------------------")

if(Memory.boIndex === undefined)
  Memory.boIndex = 0;

var population = {
  creeps: [
    // {
    //   name: 'worker',
    //   templates:{
    //     5: [Game.WORK, Game.CARRY, Game.MOVE],
    //     6: [Game.WORK, Game.WORK, Game.CARRY, Game.CARRY, Game.MOVE, Game.MOVE]
    //   },
    //   pop: 0,
    //   ratio: 1,
    //   max: 5,
    //   strategy: function(creep){
    //     var constructions = creep.room.find(Game.CONSTRUCTION_SITES);
    //     var actionStrategy = {
    //       harvest: function(){
    //         if(creep.energy === creep.energyCapacity){
    //           creep.memory.target = null;
    //           actionStrategy.bringBack();
    //           return;
    //         }
    //         creep.memory.action = 'harvest';
    //         var target;
    //         var source = creep.pos.findClosest(Game.SOURCES_ACTIVE);
    //         // if(creep.memory.target)
    //         //   target = _.find(sources, {id: creep.memory.target.id});
    //         // else
    //           target = source;            
    //         creep.moveTo(target);
    //         creep.harvest(target);
    //         // creep.memory.target = {
    //         //   id: target.id,
    //         //   type: Game.SOURCES
    //         // };
    //       },
    //       gather: function(){
    //         if(creep.energy > 0){
    //           creep.memory.target = null;
    //           actionStrategy.bringBack();
    //           return;
    //         }
    //         var target;
    //         var energies = creep.room.find(Game.DROPPED_ENERGY);
    //         if(creep.memory.target)
    //           target = _.find(energies, {id: creep.memory.target.id});
    //         else{
    //           var myCreeps = creep.room.find(Game.MY_CREEPS);
    //           var targetIds = [];
    //           _.each(myCreeps, function(c){
    //             if(c.memory.role === 'worker' && c.memory.action === 'gather' && c.memory.target && c.memory.target.id){
    //               targetIds.push(c.memory.target.id);
    //               console.log('TARGETS', c.memory.target.id)
    //             }
    //           });
              
    //           target = creep.pos.findClosest(Game.DROPPED_ENERGY, {
    //             filter: function(o){
    //               return targetIds.indexOf(o.id) === -1;
    //             }
    //           });
    //         }
    //         if(!target){
    //           creep.memory.target = null;
    //           actionStrategy.harvest();
    //           return;
    //         }
    //         creep.memory.action = 'gather';
    //         creep.moveTo(target);
    //         creep.pickup(target);
    //         creep.memory.target = {
    //           id: target.id,
    //           type: Game.DROPPED_ENERGY
    //         };
    //       },
    //       build: function(){
    //         if(creep.energy === 0){
    //           actionStrategy.refill();
    //           return;
    //         }
    //         creep.memory.action = 'build';
    //         creep.moveTo(constructions[0]);
    //         creep.build(constructions[0]);
    //       },
    //       refill: function(){
    //         if(creep.energy === creep.energyCapacity){
    //           actionStrategy.build();
    //           return;
    //         }
    //         creep.memory.action = 'refill';
    //         creep.moveTo(Game.spawns.Spawn1);
    //         Game.spawns.Spawn1.transferEnergy(creep);
    //       },
    //       bringBack : function(){
    //         if(creep.energy === 0){
    //           actionStrategy.default();
    //           return;
    //         }
    //         creep.memory.action = 'bringBack';
    //         creep.moveTo(Game.spawns.Spawn1);
    //         creep.transferEnergy(Game.spawns.Spawn1)
    //       },
    //       default: function(){
    //         var droppedEnergies = creep.room.find(Game.DROPPED_ENERGY);
    //         var myCreeps = creep.room.find(Game.MY_CREEPS);
    //         var harvesters =  _.filter(myCreeps, function(c){return c.memory.role === 'harvester';});
    //         var builders = _.filter(Game.creeps, function(b){
    //           if(b.memory.role === 'harvester' && (b.memory.action === 'build' || b.memory.action === 'refill'))
    //             return true;
    //           return false;
    //         });
    //         if(builders.length < constructions.length){
    //           actionStrategy.build();
    //           return;
    //         }
    //         else if(builders.length > constructions.length){
    //           actionStrategy.default();
    //           return;
    //         } else if (harvesters.length < droppedEnergies.length){
    //           actionStrategy.gather();
    //           return;
    //         }
    //         actionStrategy.harvest();
    //       }
    //     }
    //     actionStrategy[creep.memory.action || 'default']();
    //   }
    // },
    {
      name: 'maul',
      templates: {
        5: [Game.MOVE, Game.WORK, Game.WORK, Game.WORK, Game.CARRY],
        6: [Game.MOVE, Game.WORK, Game.WORK, Game.WORK, Game.WORK, Game.CARRY]
      },
      pop: 0,
      ratio: 0,
      max: 2,
      strategy: function(creep){
        if(!creep.memory || !creep.memory.target){
          var harvestedSources = [];
          var myCreeps = creep.room.find(Game.MY_CREEPS);
          _.each(myCreeps, function(creep){
            if(creep.memory.role === "maul" && creep.memory.target){
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
              return (c.memory.role === 'gatherer' && c.energy === 0);
            }
          });
          if(gatherers.length)
            creep.transferEnergy(gatherers[0]);
        }
      }
    },
    {
      name: 'gatherer',
      templates: {
        5: [Game.MOVE, Game.MOVE, Game.CARRY, Game.CARRY],
        6: [Game.MOVE, Game.MOVE, Game.MOVE, Game.CARRY, Game.CARRY, Game.CARRY]
      },
      pop: 0,
      ratio: 0,
      max: 2,
      strategy: function(creep){
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
                if(c.memory.role === 'maul' && c.memory.target){
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
                if(c.memory.role === 'gatherer' && c.memory.target && maulBusiness[c.memory.target.id]){
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
                type: 'maul'
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
    },
    {
      name: 'guard',
      templates: {
        5: [Game.TOUGH, Game.ATTACK, Game.ATTACK, Game.MOVE, Game.MOVE],
        6: [Game.TOUGH, Game.ATTACK, Game.ATTACK, Game.MOVE, Game.MOVE, Game.MOVE]
      },
      pop: 0,
      ratio:0,
      strategy: function(creep){
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
      },
    },
    {
      name: 'ranger',
      templates: {
        5: [Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE],
        6: [Game.TOUGH, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE, Game.MOVE, Game.MOVE]
      },
      pop: 0,
      ratio:0,
      strategy: function(creep){
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
      },
    },
    {
      name: 'healer',
      templates: {
        5: [Game.HEAL, Game.HEAL, Game.MOVE, Game.MOVE],
        6: [Game.HEAL, Game.HEAL, Game.HEAL, Game.MOVE, Game.MOVE, Game.MOVE]
      },
      pop: 0,
      ratio:0,
      strategy: function(creep){
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
              return o.memory.role === 'guard';
            }
          });
          if(fighter)
            creep.moveTo(fighter);
          return;
        }
      }
    }
  ],
  bo: ['maul', 'gatherer', 'maul', 'gatherer', 'gatherer', 'guard', 'healer', 'ranger', 'maul', 'gatherer', 'gatherer', 'ranger', 'healer', 'guard', 'healer', 'ranger', 'gatherer', 'gatherer'],
  getNextCreep: function(){
    var nextCreep;
    if(Memory.boIndex < this.bo.length){
      nextCreep = _.find(this.creeps, {name: this.bo[Memory.boIndex]});
      console.log("BO: ", Memory.boIndex)
    }
    else
      nextCreep = _.min(this.creeps, function(c){return c.pop / c.ratio;});
    console.log("Next creep: ", nextCreep.name);
    return nextCreep;
  }
};

_.each(Game.creeps, function(creep){
  // console.log(creep.name, creep.memory.role, creep.memory.action);
  var creepData = _.find(population.creeps, {name: creep.memory.role});
  creepData.pop++;
  creepData.strategy(creep);
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




