pragma solidity ^0.4.15;

contract Hurify {
/* Public variables of the token */
string public name = "Hurify Token";                  // Token Name
string public symbol = "HUR";                         // Token symbol
uint public decimals = 18;                            // Token Decimal Point
uint256 public constant price = 2000;                 // Token Creation Rate
address public owner;                                 // Owner of the Token Contractuint256 public totalSupply;                           // Total Token for the Crowdsale
uint256 totalToken;                                   // The current total token supply.
bool public hault = false;                            // Crowdsale State
 /* This creates an array with all balances */
mapping (address => uint256) balances;
mapping (address => mapping (address => uint256)) allowed;

/* This generates a public event on the blockchain that will notify clients */
event Transfer(address indexed from, address indexed to, uint256 value);

event Burn(address _from, uint256 _value);

event Approval(address _from, address _to, uint256 _value);

/* Initializes contract with initial supply tokens to the creator of the contract */
function Hurify() public {
   owner = msg.sender;                                            // Assigning owner address.
   balances[msg.sender] = 100000 * (10 ** decimals);             // Assigning Total Token balance to owner
   totalToken = 100000 * (10 ** decimals);
}

/// @notice Transfer the Hurify Token based on ETH received.
function () payable public {
  require(!hault);
  uint numHUR;
  numHUR = msg.value * price;
  totalToken = safeAdd(totalToken, numHUR);
  // Assign new tokens to the sender
  balances[msg.sender] = safeAdd(balances[msg.sender], numHUR);
  // Log token creation event
  Transfer(0, msg.sender, numHUR);
}

function safeAdd(uint256 x, uint256 y) internal returns(uint256) {
  uint256 z = x + y;
  assert((z >= x) && (z >= y));
  return z;
}

function safeSub(uint256 x, uint256 y) internal returns(uint256) {
  assert(x >= y);
  uint256 z = x - y;
  return z;
}

modifier onlyPayloadSize(uint size) {
   require(msg.data.length >= size + 4) ;
   _;
}

modifier onlyowner {
  require (owner == msg.sender);
  _;
}

//Default assumes totalSupply can't be over max (2^256 - 1).
//If your token leaves out totalSupply and can issue more tokens as time goes on, you need to check requireit doesn't wrap.
//Replace the if with this one instead.
function transfer(address _to, uint256 _value) public returns (bool success) {
    require(!hault);
    require(balances[msg.sender] >= _value);
    balances[msg.sender] = safeSub(balances[msg.sender],_value);
    balances[_to] = safeAdd(balances[_to], _value);
    Transfer(msg.sender, _to, _value);
    return true;
}

function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
      if (balances[_from] < _value || allowed[_from][msg.sender] < _value) {
          // Balance or allowance too low
          revert();
      }
      require(!hault);
      balances[_to] = safeAdd(balances[_to], _value);
      balances[_from] = safeSub(balances[_from],_value);
      allowed[_from][msg.sender] = safeSub(allowed[_from][msg.sender],_value);
      Transfer(_from, _to, _value);
      return true;
}

/// @dev Sets approved amount of tokens for spender. Returns success.
/// @param _spender Address of allowed account.
/// @param _value Number of approved tokens.
/// @return Returns success of function call.
function approve(address _spender, uint256 _value)
    public
    returns (bool)
{
    allowed[msg.sender][_spender] = _value;
    Approval(msg.sender, _spender, _value);
    return true;
}

/// @dev Returns number of allowed tokens for given address.
/// @param _owner Address of token owner.
/// @param _spender Address of token spender.
/// @return Returns remaining allowance for spender.
function allowance(address _owner, address _spender)
    constant
    public
    returns (uint256)
{
    return allowed[_owner][_spender];
}

/// @notice Returns balance of HUR Tokens.
/// @param _from Balance for Address.
function balanceOf(address _from) public constant returns (uint balance) {
    return balances[_from];
  }

/// @notice Pause the crowdsale
function pauseable() onlyowner public {
    hault = true;
  }

/// @notice Unpause the crowdsale
function unpause() onlyowner public {
    hault = false;
  }

/// @notice Remove `_value` tokens from the system irreversibly
/// @param _value the amount of money to burn
function burn(uint256 _value) public onlyowner returns (bool success) {
    require (balances[msg.sender] >= _value);                                          // Check if the sender has enough
    balances[msg.sender] = safeSub(balances[msg.sender], _value);                      // Subtract from the sender
    totalToken = safeSub(totalToken, _value);                                        // Updates totalSupply
    Burn(msg.sender, _value);
    return true;
}

/// @notice Transfer Ether from contract address to the Walllet Address.
/// @param _hurclan Address to which Ether needs to transfer.
function ethtransfer(address _hurclan) onlyowner external{
  _hurclan.transfer(this.balance);
}

}
