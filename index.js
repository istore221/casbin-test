import { newEnforcer } from 'casbin';
var keyMatchFunc = require("./node_modules/casbin/lib/util").keyMatchFunc

class Sub {
  
  constructor(name, role, groups) {
    this.Name = name;
    this.Role = role;
    this.Groups = groups;

   }

};


class Obj {
  
  constructor(rn, owner, groups) {
    this.RN = rn;
    this.Owner = owner;
    this.Groups = groups;
  }


};


function CustomFn(...args){
    var arg1 = args[0]
    var arg2 = args[1]

    console.log(arg1)
    console.log(arg2)

    return true
}



/*
	
	issues:  adding role doesnt work
			 group level access owner delete not working

*/

(async function run() {


	const e = await newEnforcer('basic_model.conf', 'basic_policy.csv');
	e.addFunction("CustomFn",CustomFn)
	
	const rm = e.getRoleManager();
	await rm.addMatchingFunc("keyMatch", keyMatchFunc);
	await e.buildRoleLinks();


	const sub2 = new Sub("jack"); 

	const sub = new Sub("jack",null,['zoneA']); 
	const obj = new Obj("sg/b1/f2/desk/123", "jack", ['zoneA']);

	sub.Group = "zoneA"

	
	const mod = 'book'; 
	const act = 'create';  // create|update|delete,



	
	//default autharization
	let authorized = await e.enforce(sub, obj, mod, act);


	// if(!authorized){

	// 	   const shared_groups = sub.Groups.filter(value => obj.Groups.includes(value));

	// 		// nop didn't work ..... try using shared group level access
	// 		if( shared_groups.length > 0){


	// 			for(let i=0;i<shared_groups.length;i++){

	// 				let tempS = {...sub, Group: shared_groups[i]}; 

	// 				let group_authorized = await e.enforce(tempS, obj, mod, act);

	// 				if(group_authorized){
	// 					authorized = true;
	// 					console.log(`-------authorized at group level ${tempS.Group} ---------`)
	// 					break;
	// 				}
					
	// 			}

	// 		}

	// }


	

	if(authorized){
		console.log(`${sub.Name} is ALLOWED to perform ${mod}/${act} on resource ${obj.RN}`)
	}else{
		console.log(`${sub.Name} is NOT ALLOWED to perform ${mod}/${act} on resource ${obj.RN}`)
	}



	



})()


