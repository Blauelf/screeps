var harvester = require('harvester');
var builder = require('builder');
var guard = require('guard');
var carrier = require('carrier');
var nharvester = 0;
var nbuilder = 0;
var nguard = 0;
var ncarrier = 0;

var ncreeps=0;

for(var cname in Game.creeps) {
    ncreeps++;
	var creep = Game.creeps[cname];

	if(creep.memory.role == 'harvester') {
		harvester(creep);
		nharvester++;
	}

	if(creep.memory.role == 'builder') {
	    builder(creep);
	    nbuilder++;
	}
	
	if(creep.memory.role == 'guard') {
	    guard(creep);
	    nguard++;
	}
	
	if (creep.memory.role == 'carrier') {
	    carrier(creep);
	    ncarrier++;
    }
}
for (var sname in Game.spawns) {
    var spawn = Game.spawns[sname];
    if (spawn.spawning===null) {
        if (nharvester<1 || nharvester<ncreeps*0.1) {
            var newnum=1;
            while (("Worker"+newnum) in Game.creeps) {
                newnum++;
            }
            spawn.createCreep( 	[Game.WORK, Game.WORK, Game.CARRY, Game.CARRY, Game.MOVE], 'Worker'+newnum, {role:'harvester'} );
        } else if (ncarrier<nharvester*2) {
            var newnum=1;
            while (("Carrier"+newnum) in Game.creeps) {
                newnum++;
            }
            spawn.createCreep( 	[Game.CARRY, Game.CARRY, Game.MOVE], 'Carrier'+newnum, {role:'carrier'} );
        } else if (nbuilder<ncreeps*0.3) {
            var newnum=1;
            while (("Builder"+newnum) in Game.creeps) {
                newnum++;
            }
            spawn.createCreep(  [Game.WORK, Game.WORK, Game.CARRY, Game.CARRY, Game.MOVE], 'Builder'+newnum, {role:'builder'} );
        } else if (nguard<ncreeps*0.3) {
            var newnum=1;
            while (("Guard"+newnum) in Game.creeps) {
                newnum++;
            }
            spawn.createCreep(  [Game.TOUGH, Game.ATTACK, Game.MOVE, Game.ATTACK, Game.MOVE], 'Guard'+newnum, {role:'guard'} );
        }
    }
}