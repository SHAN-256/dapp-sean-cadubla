pragma solidity ^0.4.24;

import "./safemath.sol";
// @title contract for mtgMarket, a place where you can buy cards online.
// @author Sean Cadubla
// @notice importing safemath.sol for more secure mathematical operations
contract mtgInventory {
// @notice using SafeMath from safemath.sol for uint256
    using SafeMath for uint256;
    
    event NewCardInventory(uint cardId, string cardName, uint cardPrice);
    
    struct mtgCard {
        uint id;
        string name;
        string cmc;
        string cardType;
        string colors;
        uint price;
        string image;
    }
    
    mtgCard[] public cards;
    
    mapping (uint => address) public cardToOwner;
    mapping(address => uint) ownerCardCount;
    
    function addCardToInventory(string _name, string _cmc, string _cardType,string _colors, uint _price, string _image) public {
        uint id = cards.push(mtgCard(0,_name, _cmc, _cardType, _colors, _price, _image)) - 1;
        _addCardID(cards[id], id);
        cardToOwner[id] = msg.sender;
        ownerCardCount[msg.sender] = ownerCardCount[msg.sender].add(1);
        NewCardInventory(id, _name,_price);
    }
    
    function purchaseCard(uint _id) public payable {
        require(cardToOwner[_id]!= msg.sender);
        require(msg.value == cards[_id].price);
        address previousOwner = cardToOwner[_id];
        cardToOwner[_id] = msg.sender;
        previousOwner.transfer(msg.value / 2);
        ownerCardCount[previousOwner] = ownerCardCount[previousOwner].sub(1);
        ownerCardCount[msg.sender] = ownerCardCount[cardToOwner[_id]].add(1);
    }
    
    function changeCardPrice(uint _id, uint _price) public {
        require(msg.sender == cardToOwner[_id]);
        cards[_id].price = _price;
    }
    
    function getCardsByOwner(address _owner) external view returns(uint[]) {
        uint[] memory result = new uint[](ownerCardCount[_owner]);
        uint counter = 0;
        for (uint i = 0; i < cards.length; i++) {
          if (cardToOwner[i] == _owner) {
            result[counter] = i;
            counter++;
          }
        }
        return result;
    }
    //newly added 9/21
    function getAllCards() external view returns(uint[]) {
        uint[] memory result = new uint[](cards.length);
        uint counter = 0;
        for (uint i=0; i < cards.length; i++) {
            result[counter] = i;
            counter++;
        }
        return result;
    }
    //newly added 9/22
    function _addCardID(mtgCard storage _card, uint _id) internal {
        _card.id = _id;
    }
}