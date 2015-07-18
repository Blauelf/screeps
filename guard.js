/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('guard'); // -> 'a thing'
 */
module.exports = function (creep) {
	var target = creep.pos.findClosest(FIND_HOSTILE_CREEPS);
	if(target) {
		creep.moveTo(target);
		creep.attack(target);
	}
	if (creep.hits<creep.hitsMax/2) {
		var target = creep.pos.findClosest(FIND_MY_SPAWNS);
		if(target){creep.moveTo(target);}
	}
}
