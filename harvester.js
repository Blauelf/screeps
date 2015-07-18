/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('harvester'); // -> 'a thing'
 */
module.exports = function (creep) {

	if(creep.energy < creep.energyCapacity) {
		var sources = creep.room.find(Game.SOURCES);
		var bestsource = sources[0];
		var bestpath = creep.room.findPath(creep.pos,bestsource.pos);
		for (var i = 1; i < sources.length; i++) {
		    var path = creep.room.findPath(creep.pos,sources[i].pos);
		    if (bestpath.length === 0 || (path.length > 0 && bestpath.length > path.length)) {
		        bestsource = sources[i];
		        bestpath = path;
		    }
		}
		creep.moveTo(bestsource);
		creep.harvest(bestsource);
		creep.memory.waiting=0;
	}
	else {
	    var creeps = creep.room.find(Game.MY_CREEPS);
	    for (var i=0;i<creeps.length;i++) {
	        if ((creeps[i].memory.role==='carrier' || creeps[i].memory.role==='builder') && creep.pos.isNearTo(creeps[i])) {
	            creep.transferEnergy(creeps[i]);
	        }
	    }
		if (creep.energy == creep.energyCapacity) {
		    creep.memory.waiting++;
		}
	}
}