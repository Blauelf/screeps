/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('carrier'); // -> 'a thing'
 */
module.exports = function (creep) {
	if(creep.energy === 0) {
	    if (creep.memory.target === null || !(creep.memory.target in Game.creeps)) {
	        var creeps = creep.room.find(FIND_MY_CREEPS);
	        var besttarget = null;
	        var maxwaiting = 0;
	        for (var i=0;i<creeps.length;i++) {
	            if ((creeps[i].memory.role==='harvester') && ('waiting' in creeps[i].memory) && (creeps[i].memory.waiting>maxwaiting)) {
	                besttarget=creeps[i].name;
	                maxwaiting=creeps[i].memory.waiting;
	            }
	        }
	        creep.memory.target=besttarget;
	    }
		if (creep.memory.target !== null) {
		    creep.moveTo(Game.creeps[creep.memory.target]);
		} else {
		    creep.move(1+Math.floor(8*Math.random()));
		}
	}
	else {
		creep.moveTo(Game.spawns.Spawn1);
		creep.transferEnergy(Game.spawns.Spawn1);
	}
}
