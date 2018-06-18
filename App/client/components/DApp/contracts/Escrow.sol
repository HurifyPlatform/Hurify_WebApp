pragma solidity ^0.4.15;

contract Escrow {
	/*
	Gobal variables are declared here
	*/
	address client = 0x618104bCe7958ed2883006fec6009336dc05Bf0d;
	address developer = 0x618104bCe7958ed2883006fec6009336dc05Bf0d;
	string public title = "hurify testing";
	uint public bidValue = 1.00;
	uint public timeframe = 34;
	uint public starttime = 1514439000; 
	address hurify = 0x40e624d93110a8324920f011b80c6db0fab2b85b ;

	function pay() payable public { 
		hurify.call(bytes4(sha3("transferFrom(bool)")), client, developer, bidValue); 
	 } 

	 function refund() payable public { 
		 require( now > starttime + 34 days); 
		hurify.call(bytes4(sha3("transferFrom(bool)")), client, client, bidValue);
	}

}