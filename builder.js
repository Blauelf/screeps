/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('builder'); // -> 'a thing'
 */
module.exports = function (creep) {
	if(creep.energy === 0) {
		creep.moveTo(Game.spawns.Spawn1);
		Game.spawns.Spawn1.transferEnergy(creep);
	}
	else {
		var target = creep.pos.findClosest(FIND_MY_STRUCTURES, {
            filter : function (site) {
                return site.hits<site.hitsMax/2;
            }
        });
		if(target !== null && creep.pos.isNearTo(target.pos)) {
			creep.repair(target);
			return;
		}
		target = creep.pos.findClosest(FIND_CONSTRUCTION_SITES);
		if(target !== null && creep.pos.isNearTo(target.pos)) {
			creep.build(target);
			return;
		}
		target = creep.pos.findClosest(FIND_MY_STRUCTURES, {
            filter : function (site) {
                return site.hits<site.hitsMax/2;
            }
        });
		if(target !== null) {
		    creep.move(target.pos);
			creep.repair(target);
			return;
		}
		target = creep.pos.findClosest(FIND_CONSTRUCTION_SITES);
		if(target !== null) {
		    creep.move(target.pos);
			creep.build(target);
			return;
		}
		target = creep.pos.findClosest(FIND_MY_STRUCTURES, {
            filter : function (site) {
                return site.hits<site.hitsMax;
            }
        });
        if(target !== null) {
		    console.log(""+target+" "+target.hits+" "+target.hitsMax);
		    if (!creep.pos.isNearTo(target.pos)) {
		        creep.move(target.pos);
		    } else {
			    creep.repair(target);
		    }
			return;
		}
	}
}
