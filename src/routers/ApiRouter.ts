import express from "express";
import { User, USER_TYPE } from "../classes/User";
var router = express.Router();
const Web3 = require('web3');
var DB = require('../../db/db.js');
var bodyParser = require('body-parser');
var sd = require('silly-datetime');
const { inherits } = require('util');
router.use(bodyParser.urlencoded({ extended: false }));  
router.use(bodyParser.json());
/*
* connect to ethereum node
*/ 
const ethereumUri = 'https://charimember.blockchain.azure.com:3200/m5T5YJHD7lO0SmBSPREvJUIk';
const address = '0xf6739ac4674078259E87f540b9065B3a9f70330e'; // user

function connectNode(){
	web3.setProvider(new web3.providers.HttpProvider(ethereumUri));
	web3.setProvider('wss://charimember.blockchain.azure.com:3300/m5T5YJHD7lO0SmBSPREvJUIk'); //监听合约event需要用websocket
	web3.eth.personal.unlockAccount(address, 'gp',33600);
}
let web3 = new Web3();
connectNode();
/*
* deploy contract
*/ 
//合约ABI
var abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_date",
				"type": "string"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "PoorUserList",
		"outputs": [
			{
				"internalType": "string",
				"name": "username",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "userid",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "publickey",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "usertype",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "userintro",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "ServiceProviderList",
		"outputs": [
			{
				"internalType": "string",
				"name": "servicename",
				"type": "string"
			},
			{
				"internalType": "int256",
				"name": "serviceid",
				"type": "int256"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "publickey",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "detail",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "usertype",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "p_username",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "p_userid",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "p_publickey",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "p_usertype",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "p_intro",
				"type": "string"
			}
		],
		"name": "createPoorUser",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "p_servicename",
				"type": "string"
			},
			{
				"internalType": "int256",
				"name": "p_serviceid",
				"type": "int256"
			},
			{
				"internalType": "address",
				"name": "p_publickey",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "p_detail",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "p_price",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "p_usertype",
				"type": "string"
			}
		],
		"name": "createServiceProvider",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "addr",
				"type": "address"
			}
		],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPoorUserList",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "username",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "userid",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "publickey",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "balance",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "usertype",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "userintro",
						"type": "string"
					}
				],
				"internalType": "struct CharityContract.User[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "p_serviceid",
				"type": "int256"
			}
		],
		"name": "getService",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getServiceProviderList",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "servicename",
						"type": "string"
					},
					{
						"internalType": "int256",
						"name": "serviceid",
						"type": "int256"
					},
					{
						"internalType": "uint256",
						"name": "balance",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "publickey",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "detail",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "usertype",
						"type": "string"
					}
				],
				"internalType": "struct CharityContract.Service[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "p_userid",
				"type": "string"
			}
		],
		"name": "getUser",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "print",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "date",
				"type": "string"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "sufficient",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]; 
// 合约地址    
var contract_addr = "0xD2400900A6a3F61d03C25273106cD9CA7b787fa6";
//创建合约实例
let CoinContract = new web3.eth.Contract(abi,contract_addr);
console.log('deploying contract...');
web3.eth.defaultAccount = '0xf6739ac4674078259E87f540b9065B3a9f70330e';

DB.find('user', {
    _id: 0
}, function (err:any, data:any) {
    if(data.length == 0){
        DB.insert('user',{
            name 	: "Levy",
            _id     : 0,
            type:"rich",
            balance:0,
            publicKey:"0x07eD63378b6A6Cc19960A0b18A3e2B7acE084611",
            password	: "123456"
        },function(err:any,data:any){
            if(!err){
                //   console.log(data);
            }else{
                console.log(err);
            } 
        })
    }else{
        console.log("user2 exists")
    }
});

DB.find('user', {
    _id: 1
}, function (err:any, data:any) {
    if(data.length == 0){
        DB.insert('user',{
            name 	: "Peter",
            _id     : 1,
            type:"poor",
            balance:0,
            publicKey:"0xB273EC49782F33Dd194257e2d8f9c7f35ad349fe",
            story 	: "	I'm peter, my livelihood is changed by the loss of an income when I can no longer afford masks to prevent COVID-19. I'm now jobless and battling depression.",
            password	: "123456"
          },function(err:any,data:any){
            if(!err){
                //   console.log(data);
            }else{
                console.log(err);
            } 
        })
    }else{
        console.log("user1 exists")
    }
});
DB.find('user', {
    _id: 2
}, function (err:any, data:any) {
    if(data.length == 0){
        DB.insert('user',{
            name 	: "Scott",
            _id     : 2,
            type:"poor",
            balance:0,
            publicKey:"0x57Dd90C25c971627650dF40700247d5589378623",
            story 	: "I caught the virus and have health problems, including dysphagia and epilepsy. I cannot afford expensive medical bills, my mom and dad passed away and I need a lot of help,thanks.",
            password	: "123456"
          },function(err:any,data:any){
            if(!err){
                //   console.log(data);
            }else{
                console.log(err);
            } 
        })
    }else{
        console.log("user2 exists")
    }
});

DB.find('user', {
    _id: 3
}, function (err:any, data:any) {
    if(data.length == 0){
        DB.insert('user',{
            name 	: "CDP COVID-19 Response Fund",
            _id     : 3,
            type:"poor",
            balance:0,
            publicKey:"0xB7c45d60B53bff17Ee286d750A2dd978c713EF53",
            story 	: "Help the Center for Disaster Philanthropy (CDP) support preparedness, containment efforts, response and recovery activities for those affected by COVID-19 and for the responders.",
            password	: "123456"
          },function(err:any,data:any){
            if(!err){
                //   console.log(data);
            }else{
                console.log(err);
            } 
        })
    }else{
        console.log("user3 exists")
    }
});
DB.find('user', {
    _id: 4
}, function (err:any, data:any) {
    if(data.length == 0){
        DB.insert('user',{
            name 	: "Navy",
            _id     : 4,
            type:"poor",
            balance:0,
            publicKey:"0xD5B330a5D1B4538f60eA4583F6B6939aE6e13fBc",
            story 	: "The World War II Navy vet fought a high fever, bad cough, body aches and chills — almost exclusively at home in North Bellmore under the care of two of his daughters, both of whom also caught the virus.She needs your help.",
            password	: "123456"
          },function(err:any,data:any){
            if(!err){
                //   console.log(data);
            }else{
                console.log(err);
            } 
        })
    }else{
        console.log("user4 exists")
    }
});
DB.find('user', {
    _id: 5
}, function (err:any, data:any) {
    if(data.length == 0){
        DB.insert('user',{
            name 	: "Mary",
            _id     : 5,
            type:"poor",
            balance:0,
            publicKey:"0x74e6bFAd84035a1eD83c835D69287A9fC58F4047",
            story 	: "I'm a single mother. To escape my violent and abusive husband, I fled with my three children and sought refuge at a World Vision-supported homeless shelter.I feel appreciated that you are kind to offer me basic needs.",
            password	: "123456"
          },function(err:any,data:any){
            if(!err){
                //   console.log(data);
            }else{
                console.log(err);
            } 
        })
    }else{
        console.log("user5 exists")
    }
});
DB.find('user', {
    _id: 6
}, function (err:any, data:any) {
    if(data.length == 0){
        DB.insert('user',{
            name 	: " Child Health & Nutrition Fund",
            _id     : 6,
            type:"poor",
            balance:0,
            publicKey:"0x8DFD7c3706e36bb89CffB8cd65CD8B35a91Ff777",
            story 	: "Your donations will make multiply 4 times in impact to help children and their families gain access to healthcare, medicines, medical supplies, and so much more.",
            password	: "123456"
          },function(err:any,data:any){
            if(!err){
                //   console.log(data);
            }else{
                console.log(err);
            } 
        })
    }else{
        console.log("user6 exists")
    }
});
DB.find('user', {
    _id: 7
}, function (err:any, data:any) {
    if(data.length == 0){
        DB.insert('user',{
            name 	: "NYC Health + Hospitals",
            _id     : 7,
            type:"poor",
            balance:0,
			publicKey:"0x8eCf140ADdd8E585D1B04919EC6a52877f03B5B2",
			story 	: "We are facing financial hardship as a result of this pandemic. Your non-restricted donation can help us provide much needed services and support to our doctors, nurses, and other health care workers on the front line.",
            password	: "123456"
        },function(err:any,data:any){
            if(!err){
                //   console.log(data);
            }else{
                console.log(err);
            } 
        })
    }else{
        console.log("user7 exists")
    }
});
DB.find('user', {
    _id: 8
}, function (err:any, data:any) {
    if(data.length == 0){
        DB.insert('user',{
            name 	: "Mario",
            _id     : 8,
            type:"rich",
            balance:0,
			publicKey:"0x0F43043D8636fa3CcF598754293e9D7d70D9eE4a",
			story 	: "We are facing financial hardship as a result of this pandemic. Your non-restricted donation can help us provide much needed services and support to our doctors, nurses, and other health care workers on the front line.",
            password	: "123456"
        },function(err:any,data:any){
            if(!err){
                //   console.log(data);
            }else{
                console.log(err);
            } 
        })
    }else{
        console.log("user7 exists")
    }
});
DB.find('user', {
    _id: 9
}, function (err:any, data:any) {
    if(data.length == 0){
        DB.insert('user',{
            name 	: "Koll",
            _id     : 9,
            type:"rich",
            balance:0,
			publicKey:"0x1f22775537bEFf25B9E40D7dB410FF194c1448d4",
			story 	: "We are facing financial hardship as a result of this pandemic. Your non-restricted donation can help us provide much needed services and support to our doctors, nurses, and other health care workers on the front line.",
            password	: "123456"
        },function(err:any,data:any){
            if(!err){
                //   console.log(data);
            }else{
                console.log(err);
            } 
        })
    }else{
        console.log("user7 exists")
    }
});
/*
* post /login
*/ 
router.post('/login',function(req,res){
    var username = req.body.username;
    var password = req.body.password;  
    // 连接数据库查询数据
    DB.find('user',{
        name:username
    },function(err:any,data:any){
        if(data.length>0 && data[0].password == password){
			req.session!.userid = data[0]._id;
			req.session!.usertype = data[0].type;
			req.session!.username = data[0].name;
			req.session!.useraddr = data[0].publicKey;
			res.send("ok");
        }else{
            res.status(400).send('Bad request');
        }
    })
});


router.get('/logoff',function(req,res){
    // 销毁sesssion
    req.session!.destroy(function(err){
        if(err){
            console.log(err);
        }else{
            res.send('ok');
        }
    });
})

router.get('/user',function(req,res){
	connectNode();
	if ('userid' in req.session!) {
		var userid = req.session!.userid;
		var useraddr = req.session!.useraddr;
		CoinContract.methods.getBalance(useraddr).call((err:any, val:any) => {
			if(!err){
						var u = {	
							balance:parseFloat(val)
						};
						DB.update('user', {"_id": userid}, u,
							function (err:any, data:any) {
								if (err) {
									console.log("error--:" + err);
								}else{
									DB.find('user',{
										_id:userid
									},function(err:any,data:any){
										res.send(data[0]);
									});
								}
							});
			}else
				console.log("getBalance error:"+err);		
		})
	}else
		res.status(400).send('please login first');
});
/*根据userid查账户余额 */
var dic:any = {"1":"0x324279189aD2ce8ceAF0067f4dE624bA9d293cDB","2":"0xf6739ac4674078259E87f540b9065B3a9f70330e"}
//TODO：dic1和dic2合并
router.get('/getBalance',function(req,res){
	connectNode();
    var id = req.body.userid;
	//判断userid是否存在
	if(dic[id] == null){
		res.send("User_id doesn't exist");
	};
    var balanceResult = CoinContract.methods.getBalance(dic[id]).call().then(function(result:any){
	// res.send(JSON.stringify(req.body.addr));
	var obj = {user_id:id, user_balance: result};
    res.send(JSON.stringify(obj));
    // res.send(JSON.stringify(result));

     });

});

var dic3:any = {
	// "0x324279189aD2ce8ceAF0067f4dE624bA9d293cDB":"Levy",
	"0x07eD63378b6A6Cc19960A0b18A3e2B7acE084611":"Levy",
	"0x0F43043D8636fa3CcF598754293e9D7d70D9eE4a":"Mario",
	"0x1f22775537bEFf25B9E40D7dB410FF194c1448d4":"Koll",
	"0xe087dFA4611D3aB907F7abDc1fe33640Cc955181":"MartinRich",
	"0x625165F8A132cA5dE4367cB74C1DfDB7310e8DE4":"NeilRich",
	"0x466F19d1589cD3efF5bBCa2b80e8C05DC2Ed8E32":"ShengRich",
	"0xFcEB213043351eBAe9b5F5ae7EBcE2ada8126512":"SonicRich",
	"0xfBD5bdD2BbD88df0F893cEC42C334337E8D18dE2":"WenliRich",
}

router.get('/whoHelpedMe',function(req,res){
	connectNode();
	if ('useraddr' in req.session!) {
		var useraddr = req.session!.useraddr;
		var HelperList:any = [];
		CoinContract.getPastEvents('Transfer',{
			fromBlock: 0
		}, function(error:any, event:any){
			console.log("PRINT EVENT----"+event);
			var h;
			if(event.length > 0){
				for(let i=0;i<event.length;i++){	
					if(event[i].returnValues._to == useraddr){
						var from = dic3[event[i].returnValues._from];
							h = {
									name: from,   //TODO:做address-name的match
									balance:event[i].returnValues._value,
									date:event[i].returnValues._date     //TODO:时间戳--在捐款的时候加上系统时间
								};
							HelperList.push(h);	
					}
				}
				res.send(JSON.stringify(HelperList));
			}else
				res.send('');
});
	}	
});
//获取服务提供商列表
var localServiceProviderList:any = [];
router.get('/getServiceProviderList',function(req,res){
	connectNode();
    CoinContract.methods.getServiceProviderList().call((err:any, val:any) => {
		var s;
		let ServiceProviderList: any[] = [];
		for(let i=0;i<val.length;i++){
			s = {
				name: val[i].servicename,
				id: val[i].serviceid,
				price:val[i].price,
				detail:val[i].detail,
				publicKey:val[i].publickey	
			};
			ServiceProviderList.push(s);
			localServiceProviderList = ServiceProviderList;
		}	
		res.send(JSON.stringify(ServiceProviderList));
	});
});

router.post('/donate',function(req,res){
	connectNode();
	if ('userid' in req.session!) {
		var send_addr = req.session!.useraddr;
		var receive_id = req.body.userId;
		var amount = req.body.amount;
		var private_key = req.body.privateKey; 
		var date = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
		var receive_addr:any;
		var balance;
		DB.find('user',{
			_id:receive_id
		},function(err:any,data:any){
			 receive_addr = data[0].publicKey;
			 CoinContract.methods.getBalance(send_addr).call((err:any, val:any) => {	
				balance =parseFloat(val);
				if(amount <= balance){
					//unlock
					web3.eth.personal.unlockAccount(send_addr, private_key, 300,(err:any, val:any)=>{
						if(!err){
							CoinContract.methods.transfer(receive_addr,amount,date).send({from:send_addr},(err:any, val:any) => {
								if(!err){	
									var obj = {txhash:val};
									res.send(JSON.stringify(obj));
								}else{
									console.log(err.message);		
								}
							});
						}else{
							res.status(400).send(err.message);	
						}
					});
				}else
				res.status(400).send("Insufficient balance!")
			});
		});
	}else
		res.status(400).send('please login first');
});

	
	
//假设：一个用户对应唯一主键：userid,在链上只匹配一个账户
/*创建贫困者上链*/
// router.post('/createPoorUser',function(req,res){
// 	var p_key = req.body.publicKey;

// 	// if(p_usertype == "poor"){
// 		CoinContract.methods.createPoorUser(p_key).send({from:web3.eth.defaultAccount}).then(function(result:any){
// 			var obj = {txhash:result.transactionHash};
// 			res.send(JSON.stringify(obj)); 
// 		}); 
// });

//获取被捐助者列表

router.get('/getPoorUserList',function(req,res){
	connectNode();
	DB.find('user',{
		type:"poor"
	},function(err:any,data:any){
		var u;
		var poorUserList :any[] = [];
		for(var i=0;i<data.length;i++){
			u = {
				name: data[i].name,
				id: data[i]._id,
				publicKey:data[i].publicKey,
				story:data[i].story,
				type:data[i].type
			};
			poorUserList.push(u);
		}	
	res.send(JSON.stringify(poorUserList));
	});
});
//创建服务提供商
var dic2:any= {"1":"0xD0AF7efc849A4c11048BA72D4E410061db8E1332","2":"0x1d4Ed23810a443caC2aBd5f1D6512e73d5e93A0E"}

// router.post('/createServiceProvider',function(req,res){
//     var p_name = req.body.name;
// 	var p_passwd = req.body.passwd;
// 	// var p_id = UUID.v1();
// 	var p_id = req.body.service_id;
// 	console.log(typeof(p_id));
// 	var p_detail = req.body.detail;
// 	var p_price =  req.body.price;
// 	var p_usertype =  req.body.user_type;
// 	var p_publickey = dic2[p_id];

//创建Service Provider
	var s = {
		service_name:'Blind people massage',
		service_id: 1,
		publickey:'0xD0AF7efc849A4c11048BA72D4E410061db8E1332',    //后台匹配id-公钥
		service_detail:'Most confortable foot massage provided by blind people, $20 per hour!',
		service_price: 20,
		user_type:'service'
	};
	CoinContract.methods.getService(s.service_id).call((err:any, val:any) => {	
		if(err){
			console.log(err);
		}else{
				if(val[1] == 0){
					CoinContract.methods.createServiceProvider(s.service_name,s.service_id,s.publickey,s.service_detail,s.service_price,s.user_type).send({from:web3.eth.defaultAccount}).then(function(result:any){
						var obj = {txhash:result.transactionHash};
						console.log("createServiceProvider1"+obj);
					}); 
				}else{
					console.log("service1 exists");
				}
			}
});  	 
	var s1 = {
		service_name:'KN95 face mask',
		service_id: 2,
		publickey:'0xD0AF7efc849A4c11048BA72D4E410061db8E1332',    //后台匹配id-公钥
		service_detail:'KN95 face mask which can help you prevent COVID-19, $30 for 30!',
		service_price: 30,
		user_type:'service'
	};
	CoinContract.methods.getService(s1.service_id).call((err:any, val:any) => {	
		if(err){
			console.log(err);
		}else{
				if(val[1] == 0){
					CoinContract.methods.createServiceProvider(s1.service_name,s1.service_id,s1.publickey,s1.service_detail,s1.service_price,s1.user_type).send({from:web3.eth.defaultAccount}).then(function(result:any){
						var obj = {txhash:result.transactionHash};
						console.log("createServiceProvider2"+obj);
					}); 
				}else{
					console.log("service2 exists");
				}
			}
});  	 
	var s2 = {
		service_name:'Fresh foods',
		service_id: 3,
		publickey:'0xD0AF7efc849A4c11048BA72D4E410061db8E1332',    //后台匹配id-公钥
		service_detail:'Offering fresh vegetables and fruits to individuals affected by the pandemic, $10 per kilograms!',
		service_price: 10,
		user_type:'service'
	};
	CoinContract.methods.getService(s2.service_id).call((err:any, val:any) => {	
		if(err){
			console.log(err);
		}else{
				if(val[1] == 0){
					CoinContract.methods.createServiceProvider(s2.service_name,s2.service_id,s2.publickey,s2.service_detail,s2.service_price,s2.user_type).send({from:web3.eth.defaultAccount}).then(function(result:any){
						var obj = {txhash:result.transactionHash};
						console.log("createServiceProvider3"+obj);
					}); 
				}else{
					console.log("service3 exists");
				}
			}
	});  	 

	var s3 = {
		service_name:'PCs for People',
		service_id: 4,
		publickey:'0xD0AF7efc849A4c11048BA72D4E410061db8E1332',    //后台匹配id-公钥
		service_detail:'Low-cost computers, computer repair, internet service and learning resources for individuals and families below the 200% poverty level or currently enrolled in an income-based government assistance program.',
		service_price: 5,
		user_type:'service'
	};
	CoinContract.methods.getService(s3.service_id).call((err:any, val:any) => {	
		if(err){
			console.log(err);
		}else{
				if(val[1] == 0){
					CoinContract.methods.createServiceProvider(s3.service_name,s3.service_id,s3.publickey,s3.service_detail,s3.service_price,s3.user_type).send({from:web3.eth.defaultAccount}).then(function(result:any){
						var obj = {txhash:result.transactionHash};
						console.log("createServiceProvider4"+obj);
					}); 
				}else{
					console.log("service4 exists");
				}
			}
	});  

	var s4 = {
		service_name:'Emergency medical supplies',
		service_id: 5,
		publickey:'0xD0AF7efc849A4c11048BA72D4E410061db8E1332',    //后台匹配id-公钥
		service_detail:' Delivering emergency medical supplies to health workers around the world. We are also providing hygiene and medical kits to schools and health clinics to help keep children safe.',
		service_price: 7,
		user_type:'service'
	};
	CoinContract.methods.getService(s4.service_id).call((err:any, val:any) => {	
		if(err){
			console.log(err);
		}else{
				if(val[1] == 0){
					CoinContract.methods.createServiceProvider(s4.service_name,s4.service_id,s4.publickey,s4.service_detail,s4.service_price,s4.user_type).send({from:web3.eth.defaultAccount}).then(function(result:any){
						var obj = {txhash:result.transactionHash};
						console.log("createServiceProvider5"+obj);
					}); 
				}else{
					console.log("service5 exists");
				}
			}
	});  


router.post('/buyService',function(req,res){
	connectNode();
	if ('useraddr' in req.session!) {
		var send_addr = req.session!.useraddr;
		var receive_id = req.body.serviceId;
		var amount = req.body.amount;
		var private_key = req.body.privateKey; 
		var price,balance;
		var receive_addr:any;
		var date = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
		console.log("-----"+typeof(date));
		//查询单价
		for(let i=0;i<localServiceProviderList.length;i++){
			if(localServiceProviderList[i].id == receive_id){
				price = localServiceProviderList[i].price;
				receive_addr = localServiceProviderList[i].publicKey;
			}		
		}
		//总价
		var total = price*amount;
		console.log("total is"+ total);	
		CoinContract.methods.getBalance(send_addr).call((err:any, val:any) => {	
				balance =parseFloat(val);
				if(total <= balance){
					//unlock
					web3.eth.personal.unlockAccount(send_addr, private_key, 300,(err:any, val:any)=>{
						if(!err){	
							CoinContract.methods.transfer(receive_addr,total,date).send({from:send_addr},(err:any, val:any) => {
								if(!err){
									var obj = {txhash:val};
									res.send(JSON.stringify(obj));
								}else{
									console.log(err.message);	
								}
							});
						}else{
							res.status(400).send(err.message);	
						}
					});
				}else
				res.status(400).send("Insufficient balance!")
			});
	}else
		res.status(400).send('please login first');
});
var dic4:any = {
	"0xB273EC49782F33Dd194257e2d8f9c7f35ad349fe":"Peter",
	"0x57Dd90C25c971627650dF40700247d5589378623":"Scott",
	"0xB7c45d60B53bff17Ee286d750A2dd978c713EF53":"CDP COVID-19 Response Fund",
	"0xD5B330a5D1B4538f60eA4583F6B6939aE6e13fBc":"Navy",
	"0x74e6bFAd84035a1eD83c835D69287A9fC58F4047":"Mary",
	"0x8DFD7c3706e36bb89CffB8cd65CD8B35a91Ff777":"Child Health & Nutrition Fund",
	"0xbB211f3072350982357f6fD6ea240C72C98DB967":"ShengPoor",
	"0x92ac0040AA6977C5ebDCa8A493bad03a61Af8085":"SonicPoor",
	"0x93F8FEC905DEC241a995F27DA38D48d0adD3c4fc":"WenliPoor",
}

router.post('/whereIsMyMoney',function(req,res){
	connectNode();
	if('useraddr'in req.session!){
		var useraddr = req.session!.useraddr;
		
		CoinContract.getPastEvents('Transfer',{
			fromBlock: 0
		}, function(err:any, event:any){
			if(!err){
				var r,receive_name;
				if(event.length > 0){
					var ReceiverList:any[] = [];
					for(let i=0;i<event.length;i++){
						if(event[i].returnValues._from == useraddr){
									var receive_name = dic4[event[i].returnValues._to];	
									r = {
											// txhash:event[i].transactionHash,
											to: receive_name,
											amount:event[i].returnValues._value,
											date: event[i].returnValues._date  ,  //TODO:时间戳--在捐款的时候加上系统时间
											spent:[]
										}
									ReceiverList.push(r);
						}
					}
					res.send(JSON.stringify(ReceiverList));
				}else
					res.send('');
			}else
			console.log("getPastEvents error:"+err);
		});
	}else
	res.status(400).send('please login first');
});
// function spentDetail(addr:any){

// }

router.get('/getTransactionByHash',function(req,res){
	connectNode();
    var hash = req.body.txhash;
    web3.eth.getTransaction(hash,function(error:any,result:any){
        if(!error){
            res.send(result);
        }
    })
});

router.get('/accounts',function(req,res){
	connectNode();
    // web3.eth.getAccounts().then(console.log);
    web3.eth.personal.getAccounts(function(error:any,result:any){
            if(!error)
            res.send(JSON.stringify(result));
            else
            res.send(JSON.stringify(error));
    
        });
   
});
//回溯 遍历区块
// var latestblock;
// web3.eth.getBlockNumber(function(error,result){
// 	if(!error){
// 		latestblock = result;
// 		console.log("result is"+result);
// 		console.log("latest block is"+latestblock);
// getTransactionsByAddr(web3,"0x324279189aD2ce8ceAF0067f4dE624bA9d293cDB",365000,latestblock);
// //myaccount :需要查询的地址信息，startBlockNumber：查询的其实blockNumber，endBlockNumber：查询的结束blockNumber
// async function getTransactionsByAddr(web3,myaccount,startBlockNumber,endBlockNumber) {

//     if (endBlockNumber == null) {
//       endBlockNumber = await web3.eth.blockNumber;
//       console.log("Using endBlockNumber: " + endBlockNumber);
//     }
//     if (startBlockNumber == null) {
//       startBlockNumber = endBlockNumber - 1000;
//       console.log("Using startBlockNumber: " + startBlockNumber);
//     }
//     console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks " + startBlockNumber + " and " + endBlockNumber);

//     for (var i = startBlockNumber; i <= endBlockNumber; i++) {
//       if (i % 1000 == 0) {
//         console.log("Searching block " + i);
//       }
//       var block = await web3.eth.getBlock(i, true);
//       if (block != null && block.transactions != null) {
//         block.transactions.forEach(function (e) {
//           if (myaccount == "*" || myaccount == e.from || myaccount == e.to) {
//             console.log(" tx hash : " + e.hash + "\n"
//               + " nonce : " + e.nonce + "\n"
//               + " blockHash : " + e.blockHash + "\n"
//               + " blockNumber : " + e.blockNumber + "\n"
//                + " transactionIndex: " + e.transactionIndex + "\n"
//               + " from : " + e.from + "\n" 
//               + " to : " + e.to + "\n"
//               + " value : " + web3.utils.fromWei(e.value.toString()) + "\n"
//               + " time : " + timeConverter(block.timestamp) + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
//               + " gasPrice : " + e.gasPrice + "\n"
//               + " gas : " + e.gas + "\n"
//                + " input : " + e.input
//               + "--------------------------------------------------------------------------------------------"
//             );
//           }
//         })
//       }
//     }
//   }

//   function timeConverter(UNIX_timestamp) {
//     var a = new Date(UNIX_timestamp * 1000);
//     var year = a.getFullYear();
//     var month = a.getMonth() + 1;
//     var date = a.getDate();
//     var hour = a.getHours();
//     var min = a.getMinutes();
//     var sec = a.getSeconds();
//     var time = year + '/' + month + '/' + date + ' ' + hour + ':' + min + ':' + sec;
//     return time;
//   }
// 	}
// 	else{
// 	console.log(error);
// 	}
	
// });

	
export =router;	