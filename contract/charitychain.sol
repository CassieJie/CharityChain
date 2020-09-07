// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.7.0;
pragma experimental ABIEncoderV2;


// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract CharityContract {

    //User 结构体
    struct User{
        string username;
        string userid;
        address publickey;
        uint balance;
        string usertype;
        string userintro;
    }
    
    mapping(string => User) users;
	mapping (address => uint) balance;
    mapping(int => Service) services;

	event Transfer(address indexed _from, address indexed _to, uint256 _value,string _date);
  
    constructor()public {
     
         balance[0xB273EC49782F33Dd194257e2d8f9c7f35ad349fe] = 100;
          balance[0x8eCf140ADdd8E585D1B04919EC6a52877f03B5B2] = 9000;
           balance[0x57Dd90C25c971627650dF40700247d5589378623] = 100;
            balance[0x07eD63378b6A6Cc19960A0b18A3e2B7acE084611] = 9000;
             balance[0xB7c45d60B53bff17Ee286d750A2dd978c713EF53] = 100;
              balance[0x0F43043D8636fa3CcF598754293e9D7d70D9eE4a] = 9000;
               balance[0xD5B330a5D1B4538f60eA4583F6B6939aE6e13fBc] = 100;
                  balance[0x1f22775537bEFf25B9E40D7dB410FF194c1448d4] = 9000;
                  balance[0x74e6bFAd84035a1eD83c835D69287A9fC58F4047] = 100;
                  balance[0xe087dFA4611D3aB907F7abDc1fe33640Cc955181] = 9000;
                   balance[0x8DFD7c3706e36bb89CffB8cd65CD8B35a91Ff777] = 100;
                    balance[0x625165F8A132cA5dE4367cB74C1DfDB7310e8DE4] = 9000; 
                    balance[0xbB211f3072350982357f6fD6ea240C72C98DB967] = 100;
                     balance[0x466F19d1589cD3efF5bBCa2b80e8C05DC2Ed8E32] = 9000;
                    balance[0x92ac0040AA6977C5ebDCa8A493bad03a61Af8085] = 100;
                    balance[0xFcEB213043351eBAe9b5F5ae7EBcE2ada8126512] = 9000; 
                    balance[0x93F8FEC905DEC241a995F27DA38D48d0adD3c4fc] = 100;
                     balance[0xfBD5bdD2BbD88df0F893cEC42C334337E8D18dE2] = 9000; 
      
    }
    
 
	//Login
	// function login(string username, string passwd )public view returns(bool) {
	//     if (){        
	//     }
	// 	return msg.sender;
	// }
 

	function print()public view returns(address) {
		return msg.sender;
	}
//done
    function getBalance(address addr) public view returns(uint) {
		return balance[addr];
	}
//done
function transfer(address receiver, uint amount,string memory date) public returns(bool sufficient) {
		if (balance[msg.sender] < amount){ 
	    	return false;
		}else{
    		balance[msg.sender] -= amount;
    		balance[receiver] += amount;
    		emit Transfer(msg.sender, receiver, amount,date);
    		return true;
		}
	}
// 	function transfer(address sender, address receiver, uint amount,string memory date) public returns(bool sufficient) {
// 		if (balance[sender] < amount){ 
// 	    	return false;
// 		}else{
//     		balance[sender] -= amount;
//     		balance[receiver] += amount;
//     		emit Transfer(sender, receiver, amount,date);
//     		return true;
// 		}
// 	}
	
    function createPoorUser(string memory p_username,string memory p_userid,address p_publickey,string memory p_usertype,string memory p_intro) public returns (bool) {
            //pan'duan判断zhang'hu判断账户cun'zai
           // 		if () return false;
        uint p_balance = balance[p_publickey];
    	User memory u = User(p_username,p_userid,p_publickey,p_balance,p_usertype,p_intro);
    	PoorUserList.push(u);
    	users[p_userid] = u;
    	return true;
    }
//   function createPoorUser(string memory p_username,string memory p_userid,uint p_balance,address p_publickey,string memory p_usertype) public returns(string memory,string memory,uint,address,string memory) {
//         //pan'duan判断zhang'hu判断账户cun'zai
// // 		if () return false;
// 		User memory u = User(p_username,p_userid,p_balance,p_publickey,p_usertype);
// 		users[p_userid] = u;
// 		return (u.username,u.userid,u.balance,u.publickey,u.usertype);
// 	}
    function getUser(string memory p_userid) public view returns (string memory, string memory, address,uint, string memory,string memory) {
            User memory u = users[p_userid];
            return (
                u.username,
                u.userid,
                u.publickey,
                u.balance,
                u.usertype,
                u.userintro
            );
    }
    User[] public PoorUserList;
    function getPoorUserList() public view returns (User[] memory) {
           
            return (PoorUserList);
    }
    struct Service{
        string servicename;
        int serviceid;
        uint balance;
        address publickey;
        string detail;
        uint price;
        string usertype;
    }
    Service[] public ServiceProviderList;
      function createServiceProvider(string memory p_servicename,int p_serviceid,address p_publickey, string memory p_detail,uint p_price,string memory p_usertype) public returns (bool) {
            //pan'duan判断zhang'hu判断账户cun'zai
           // 		if () return false;
        uint p_balance = balance[p_publickey];
    	Service memory s = Service(p_servicename,p_serviceid,p_balance,p_publickey,p_detail,p_price,p_usertype);
    	ServiceProviderList.push(s);
    	services[p_serviceid] = s;
    	return true;
    }
 
    function getService(int p_serviceid) public view returns (string memory, int, uint, address, string memory, uint,string memory) {
            Service memory s = services[p_serviceid];
            return (
                s.servicename,
                s.serviceid,
                s.balance,
                s.publickey,
                s.detail,
                s.price,
                s.usertype
            );
    }
     function getServiceProviderList() public view returns (Service[] memory) {
           
            return (ServiceProviderList);
    }
 }

