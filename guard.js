/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('guard'); // -> 'a thing'
 */
module.exports = function (creep) {
	var targets = creep.room.findClosest(FIND_HOSTILE_CREEPS);
	if(targets.length) {
		creep.moveTo(targets);
		creep.attack(targets);
	}
}
