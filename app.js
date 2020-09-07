const fs = require('fs');
const Web3 = require('web3');
const solc = require('solc');
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var bodyParser = require('body-parser');
const { inherits } = require('util');
var UUID = require('uuid');
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());
/*
* connect to ethereum node
*/ 
const ethereumUri = 'https://charimember.blockchain.azure.com:3200/m5T5YJHD7lO0SmBSPREvJUIk';
const address = '0xf6739ac4674078259E87f540b9065B3a9f70330e'; // user

let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(ethereumUri));
    console.log('connected to ehterum node at ' + ethereumUri);
    let accounts = web3.eth.accounts;
    console.log("打印当前节点上的账户"+accounts);
    
    if (web3.eth.personal.unlockAccount(address, 'gp',33600)) {
        console.log(`${address} is unlocked`);
    }else{
        console.log(`unlock failed, ${address}`);
    }
console.log("WEB3.VERSION IS"+web3.version);
web3.setProvider('wss://charimember.blockchain.azure.com:3300/m5T5YJHD7lO0SmBSPREvJUIk'); //监听合约event需要用websocket
/*
* deploy contract
*/ 
//合约ABI
var abi = [
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
				"internalType": "string",
				"name": "serviceid",
				"type": "string"
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
				"internalType": "string",
				"name": "p_serviceid",
				"type": "string"
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
				"internalType": "string",
				"name": "p_serviceid",
				"type": "string"
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
						"internalType": "string",
						"name": "serviceid",
						"type": "string"
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
		"name": "initUser",
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
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
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
var contract_addr = "0x5c30E6d9cB57797266EBEEbf19c7A2778Ea912c8";
//创建合约实例
let CoinContract = new web3.eth.Contract(abi,contract_addr);
console.log('deploying contract...');
web3.eth.defaultAccount = '0xf6739ac4674078259E87f540b9065B3a9f70330e';
/*
 调用合约函数
*/

/*function */
/*初始化合约，为每个账户赋值1000 */
CoinContract.methods.initUser().send({from:'0xf6739ac4674078259E87f540b9065B3a9f70330e'});
// app.post('/initUser',function(req,res){
    // CoinContract.methods.initUser().send({from:'0xf6739ac4674078259E87f540b9065B3a9f70330e'}).then(function(result){
    //     res.send(JSON.stringify(result));

    // });
// });

/*根据userid查账户余额 */
var dic = {"001":"0x324279189aD2ce8ceAF0067f4dE624bA9d293cDB","002":"0xf6739ac4674078259E87f540b9065B3a9f70330e"}
//TODO：dic1和dic2合并
app.get('/getBalance',function(req,res){
    var id = req.body.userid;

	console.log("000000+"+dic[id]+"typeof+"+typeof(dic[id]));
	//判断userid是否存在
	if(dic[id] == null){
		res.send("User_id doesn't exist");
	};
    var balanceResult = CoinContract.methods.getBalance(dic[id]).call().then(function(result){
        console.log("返回值:" + result);
		console.log("typeof" + typeof(result));
	// res.send(JSON.stringify(req.body.addr));
	var obj = {user_id:id, user_balance: result};
    res.send(JSON.stringify(obj));
    // res.send(JSON.stringify(result));

     });

});

/*根据userid-匹配地址进行捐款 */
app.post('/donate',function(req,res){
    var send_id = req.body.send_id;
    var receive_id = req.body.receive_id;
    var amount = req.body.amount;
    var private_key = req.body.private_key; 
    //unlock
    web3.eth.personal.unlockAccount(dic[send_id], private_key, 600);
    //transfer
    var transferResult = CoinContract.methods.transfer( dic[send_id],dic[receive_id], amount).send({from:web3.eth.defaultAccount}).then(function(result){
		// console.log("----+"+result);
		var obj = {txhash:result.transactionHash};
        res.send(JSON.stringify(obj));

    });
	console.log("transferResult is ---"+transferResult);

});

	//创建account-pk,sk
    // web3.eth.personal.newAccount(p_passwd).then(result => {
    //     console.log(result);
    //     p_publickey = result;
	//     console.log("0000000000000+"+p_publickey);
	
//假设：一个用户对应唯一主键：userid,在链上只匹配一个账户
/*创建贫困者上链*/
app.post('/createPoorUser',function(req,res){
    var p_name = req.body.user_name;
	var p_passwd = req.body.user_passwd;
	// var p_id = UUID.v1();
	var p_id = req.body.user_id;
    console.log(typeof(p_id));
	var p_usertype =  req.body.user_type;
	var p_intro = req.body.user_introduction;
	var u = {
		user_name: p_name,
		user_id: p_id,
		passwd :p_passwd,   //还未处理
		user_balance:0,
		publickey:dic[p_id],
		user_type:p_usertype,    //TODO：2种类型：个人/组织
		user_intro:p_intro
	};
	// if(p_usertype == "poor"){
		CoinContract.methods.createPoorUser(u.user_name,u.user_id,u.publickey,u.user_type,u.user_intro).send({from:web3.eth.defaultAccount}).then(function(result){
			var obj = {txhash:result.transactionHash};
			res.send(JSON.stringify(obj)); 
		}); 
		//return txhash?和上面有什么区别
		// CoinContract.methods.createPoorUser(u.name,u.id,u.publickey,u.usertype).send({from:web3.eth.defaultAccount},(err, val) => {
		// 	console.log("createPoorUser(): ", err, val);
		// 	res.send(JSON.stringify(val));
		// });
	// }
});
//查看捐助者信息 TODO：+userstory/+机构作为用户
app.get('/getUser',function(req,res){
    var p_id = req.body.userid;
    // CoinContract.methods.getUser(p_id).call((err, val) => {
    //     console.log("getUser(): ", err, val)
    //     res.send(JSON.stringify(val));
	// });
	CoinContract.methods.getUser(p_id).call().then(function (result){
		var u = {
			user_name: result[0],
			user_id: result[1],
			// user_balance:result[3],
			publickey:result[2],
			user_type:result[4],
			user_intro:result[5]
		};
		res.send(JSON.stringify(u));
	})
});
//获取被捐助者列表
var poorUserList = [];
app.get('/getPoorUserList',function(req,res){
    CoinContract.methods.getPoorUserList().call((err, val) => {
		console.log("length++"+val.length);
		var u;
		for(i=0;i<val.length;i++){
			u = {
				user_name: val[i].username,
				user_id: val[i].userid,
				publickey:val[i].publickey,
				user_type:val[i].usertype
			};
			poorUserList.push(u);
		}
		
	res.send(JSON.stringify(poorUserList));
	});
});
//服务提供商对应的id-address
var dic2 = {"200":"0xD0AF7efc849A4c11048BA72D4E410061db8E1332","201":"0x1d4Ed23810a443caC2aBd5f1D6512e73d5e93A0E"}
//创建Service Provider
app.post('/createServiceProvider',function(req,res){
    var p_name = req.body.name;
	var p_passwd = req.body.passwd;
	// var p_id = UUID.v1();
	var p_id = req.body.service_id;
	console.log(typeof(p_id));
	var p_detail = req.body.detail;
	var p_price =  req.body.price;
	var p_usertype =  req.body.user_type;
	var p_publickey = dic2[p_id];
	var s = {
		service_name: p_name,
		service_id: p_id,
		passwd:p_passwd,   //还未处理
		service_balance:0,     //合约发钱
		publickey:p_publickey,    //后台匹配id-公钥
		service_detail:p_detail,
		service_price: p_price,
		user_type:p_usertype
	};
	if(p_usertype == "service"){
		CoinContract.methods.createServiceProvider(s.service_name,s.service_id,s.publickey,s.service_detail,s.service_price,s.user_type).send({from:web3.eth.defaultAccount}).then(function(result){
			var obj = {txhash:result.transactionHash};
			res.send(JSON.stringify(obj)); 
		}); 
	}  
});
//获取服务提供商列表
var ServiceProviderList = [];
app.get('/getServiceProviderList',function(req,res){
    CoinContract.methods.getServiceProviderList().call((err, val) => {
		console.log("length++"+val.length);
		var s;
		for(i=0;i<val.length;i++){
			s = {
				service_name: val[i].servicename,
				service_id: val[i].serviceid,
				publickey:val[i].publickey,
				service_detail:val[i].detail,
				service_price:val[i].price
			};
			ServiceProviderList.push(s);
		}
		
	res.send(JSON.stringify(ServiceProviderList));
	});
});

app.post('/buyService',function(req,res){
    var send_id = req.body.user_id;
    var receive_id = req.body.service_id;
    var amount = req.body.amount;
	var private_key = req.body.private_key; 
	var price;
	//查询单价
	for(i=0;i<ServiceProviderList.length;i++){
		if(ServiceProviderList[i].service_id == receive_id){
			price = ServiceProviderList[i].service_price;
			console.log("price is"+price)
		}		
	}
	//计算总价
	var total = price*amount;
	console.log("total is"+ total);
    //unlock
    web3.eth.personal.unlockAccount(dic[send_id], private_key, 600);
    //BuyService
    var BuyServiceResult = CoinContract.methods.transfer( dic[send_id],dic2[receive_id],total).send({from:web3.eth.defaultAccount}).then(function(result){
		// console.log("----+"+result);
		var obj = {txhash:result.transactionHash};
        res.send(JSON.stringify(obj));

    });
    console.log("BuyServiceResult is ---"+BuyServiceResult);
});


app.get('/whoHelpedMe',function(req,res){
	var userid = req.body.user_id;
	var useraddr = dic[userid];
	console.log("useraddr is:"+useraddr);
	
	CoinContract.getPastEvents('Transfer',{
		// filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
		fromBlock: 0
		// }, function(error, event){  })
	}, function(error, event){
		// console.log("PRINT EVENT----"+event);
		// var eventobj = JSON.stringify(event);
		// console.log("eventobj is:"+eventobj);
		console.log("eventlength is:"+event.length);
	// same results as the optional callback above
	var h;
	var HelperList = [];
	for(i=0;i<event.length;i++){
		// console.log("1---"+event[i].returnValues);
		if(event[i].returnValues._to == useraddr){
			// console.log(event[i]); 
			// console.log(event[i].returnValues._to);
			 h = {
				txhash:event[i].transactionHash,
				from: event[i].returnValues._from,   //TODO:做address-id/name的match
				to: event[i].returnValues._to,       //TODO:同上
				amount:event[i].returnValues._value,
				donate_time:"null"     //TODO:时间戳--在捐款的时候加上系统时间
			};
			HelperList.push(h);
		} 
	}
	res.send(JSON.stringify(HelperList));
	})
		// .on('data', function(event){	
		// })
		// .on('changed', function(event){
		// // remove event from local database
		// })
		// .on('error', console.error);
	
	
});

app.get('/whereIsMyMoney',function(req,res){
	var userid = req.body.user_id;
	var useraddr = dic[userid];
	console.log("useraddr is:"+useraddr);
	
	CoinContract.getPastEvents('Transfer',{
		// filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
		fromBlock: 0
		// }, function(error, event){  })
	}, function(error, event){
		// console.log("PRINT EVENT----"+event);
		// var eventobj = JSON.stringify(event);
		// console.log("eventobj is:"+eventobj);
		console.log("eventlength is:"+event.length);
	// same results as the optional callback above
	var r;
	var ReceiverList = [];
	for(i=0;i<event.length;i++){
		// console.log("1---"+event[i].returnValues);
		if(event[i].returnValues._from == useraddr){
			// console.log(event[i]); 
			// console.log(event[i].returnValues._to);
			 r = {
				txhash:event[i].transactionHash,
				from: event[i].returnValues._from,
				to: event[i].returnValues._to,
				amount:event[i].returnValues._value,
				time:"null"     //TODO:时间戳--在捐款的时候加上系统时间
			};
			ReceiverList.push(r);
		} 
	}
	res.send(JSON.stringify(ReceiverList));
	})
	
});


app.get('/getTransactionByHash',function(req,res){
    var hash = req.body.txhash;
    web3.eth.getTransaction(hash,function(error,result){
        if(!error){
            res.send(result);
        }
    })
});

app.get('/accounts',function(req,res){
    // web3.eth.getAccounts().then(console.log);
    web3.eth.personal.getAccounts(function(error,result){
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


server.listen(8080);

