pragma solidity ^0.4.24;

import "./safemath.sol";
// @title contract for mtgMarket, a place where you can buy cards online.
// @author Sean Cadubla
// @notice importing safemath.sol for more secure mathematical operations
contract mtgInventory {
// @notice using SafeMath from safemath.sol for uint256
    using SafeMath for uint256;
// @notice used to check if a newcard is added
    event NewCardInventory(uint cardId, string cardName, uint cardPrice);
// @notice struct for a mtgCard. 
    struct mtgCard {
        uint id;
        string name;
        string cmc;
        string cardType;
        string colors;
        uint price;
        string image;
    }
// @notice making an array of the mtgCard struct named cards
    mtgCard[] public cards;
// @notice mapping a cardID to an address so we could know who owns a card.
    mapping (uint => address) public cardToOwner;
// @notice mapping an address to the number of cards that address owns.
    mapping(address => uint) ownerCardCount;

// @notice Adds a card into the cards array
// @param _name the name of the card
// @param _cmc the converted mana cost of the card
// @param _cardType the card type of the card
// @param _colors the colors of the card
// @param _price the price of the card. The price should be in wei
// @param _image the hash image url of the card in IPFS
// @dev We take the cardID, we assign a the initial card owner and we add 1 to his card count in this function.
    function addCardToInventory(string _name, string _cmc, string _cardType,string _colors, uint _price, string _image) public {
        uint id = cards.push(mtgCard(0,_name, _cmc, _cardType, _colors, _price, _image)) - 1;
        _addCardID(cards[id], id);
        cardToOwner[id] = msg.sender;
        ownerCardCount[msg.sender] = ownerCardCount[msg.sender].add(1);
        NewCardInventory(id, _name,_price);
    }

// @notice Purchases a card in the market
// @param _id the id of the card to be purchased
/* @dev We require that the person buying a card shouldn't be the owner of the card and that the msg.value 
        being sent is equal to the card's price. After these conditions are met, we change the owner's address to the buyers, 
        while sending the original owner half of the card's selling price. 
        We then add the buyer's card count by 1 and reduce the sellers by 1*/
    function purchaseCard(uint _id) public payable {
        require(cardToOwner[_id]!= msg.sender);
        require(msg.value == cards[_id].price);
        address previousOwner = cardToOwner[_id];
        cardToOwner[_id] = msg.sender;
        previousOwner.transfer(msg.value / 2);
        ownerCardCount[previousOwner] = ownerCardCount[previousOwner].sub(1);
        ownerCardCount[msg.sender] = ownerCardCount[cardToOwner[_id]].add(1);
    }
    
// @notice Changing a card in your inventory's price
// @param _id the id of the card whose price you want to change
// @param _price the new price of the card
// @dev We require ownership of the card, then we change it if the condition is met.  
    function changeCardPrice(uint _id, uint _price) public {
        require(msg.sender == cardToOwner[_id]);
        cards[_id].price = _price;
    }
    
// @notice Gets all cards owned by an address
// @param _owner the address of the owner
// @return we return an array of card Ids that the address owns
// @dev We get all the cards an address owns, we then return an array including all those cards  
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
    
// @notice Gets all cards. Every single one of them.
// @return every single card id in the cards array
// @dev We get all the cards!
    function getAllCards() external view returns(uint[]) {
        uint[] memory result = new uint[](cards.length);
        uint counter = 0;
        for (uint i=0; i < cards.length; i++) {
            result[counter] = i;
            counter++;
        }
        return result;
    }
    
// @notice Changes a card's ID after adding it into the cards array
// @param _card the card whose Id we will change
// @param _id the id we want it to change into
// @dev This was so that we can assign an Id to a specific card.
    function _addCardID(mtgCard storage _card, uint _id) internal {
        _card.id = _id;
    }
}