/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('healer'); // -> 'a thing'
 */
module.exports = function (creep) {
    var creeps = creep.room.find(FIND_MY_CREEPS);
    if (creep.hits<creep.hitsMax) {
        creep.heal(creep);
        return;
    }
    var target = creep.room.findClosest(FIND_MY_CREEPS, {
        filter:function(creep2){
            return creep.pos.isNearTo(creep2) && creep2.hits<creep2.hitsMax;
        }
    })
    if (target) {
        creep.heal(target);
        return;
    }
    var target = creep.room.findClosest(FIND_MY_CREEPS, {
        filter:function(creep2){
            return creep2.hits<creep2.hitsMax;
        }
    })
    if (target) {
        creep.moveTo(target);
        creep.heal(target);
        return;
    }
}
