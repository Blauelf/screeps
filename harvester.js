/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('harvester'); // -> 'a thing'
 */
module.exports = function (creep) {

    if (creep.energy>0) {
        var creeps = creep.room.find(FIND_MY_CREEPS);
        for (var i=0;i<creeps.length;i++) {
            if ((creeps[i].memory.role==='carrier' || creeps[i].memory.role==='builder') && creep.pos.isNearTo(creeps[i])) {
	            creep.transferEnergy(creeps[i]);
	        }
	    }
	}
    if (creep.energy == creep.energyCapacity) {
	    creep.memory.waiting++;
	} else {
	    creep.memory.waiting=0;
	}
	var sources = creep.room.find(FIND_SOURCES);
	var bestsource;
	var bestpath;
	for (var i = 0; i < sources.length; i++) if (creep.pos.findClosest([sources[i]])) {
	    var path = creep.room.findPath(creep.pos,sources[i].pos);
	    console.log(creep.name,i,path.length,path.map(function(a){return a.x+'|'+a.y+' '+a.dx+'|'+a.dy+' '+a.direction;}).join(', '));
	    if (bestsource===undefined || bestsource.energy==0 && sources[i].energy>0 || bestpath.length > path.length) {
	        bestsource = sources[i];
	        bestpath = path;
	    }
	}
	if (bestsource) {
		creep.moveTo(bestsource);
		creep.harvest(bestsource);
	}
}
