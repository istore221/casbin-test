import { newEnforcer } from 'casbin';
var keyMatchFunc = require("./node_modules/casbin/lib/util").keyMatchFunc

class Sub {
  
  constructor(name, role) {
    this.Name = name;
    this.Role = role;

   }

};


class Obj {
  
  constructor(rn, owner, Groups) {
    this.RN = rn;
    this.Owner = owner;
  }


};


function CustomFn(...args){
    var arg1 = args[0]
    var arg2 = args[1]

    console.log(arg2)

    return true
}





(async function run() {


	const e = await newEnforcer('basic_model.conf', 'basic_policy.csv');
	e.addFunction("CustomFn",CustomFn)
	
	const rm = e.getRoleManager();
	await rm.addMatchingFunc("keyMatch", keyMatchFunc);
	await e.buildRoleLinks();

	
	const sub2 = new Sub("jack"); 

	const sub = new Sub("sandra"); 
	const obj = new Obj("sg/b1/f3/desk/1001", sub.Name); 
	const mod = 'book'; 
	const act = 'update';  // create|update|delete,



	const res = await e.enforce(sub, obj, mod, act);
	if (res) {
	  // permit alice to read data1
	  console.log("allowed")

	} else {
	  // deny the request, show an error
	  console.log("denied!!!!")
	}



})()


