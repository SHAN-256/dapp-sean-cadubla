pragma solidity ^0.4.24;

contract MtgMarket {
    
    address owner;
    
    struct MtgCard {
        string cardName;
        uint cardPriceWei;
        string image;
    }
    
    MtgCard[] cardLibrary;
    
    mapping (address => MtgCard[]) cardInventory;
    mapping (string => uint) cardQuantityInventory;
    mapping (string => bool) cardExistInventory;

    mapping (string => uint) cardQuantityStore;
    mapping (string => bool) cardExistStore;

    
    //Wei = 1000000000000000000
    // function addCard(string cardName, uint cardPriceWei, string cardImage) public {
    //     if(!cardExistStore[cardName])
    //     {
    //         cardLibrary.push(MtgCard(cardName, cardPriceWei, cardImage));
    //         cardQuantityStore[cardName] = 1;
    //         cardExistStore[cardName] = true;
    //     }
    //     else
    //     {
    //         cardQuantityStore[cardName] += 1;
    //     }
    // }
    
    function sellCard(uint index, address seller) public {
        MtgCard memory x = cardInventory[seller][index];
        //MtgCardCheck[x.cardName].push[seller, ]
        if(!cardExistStore[x.cardName])
        {
            cardLibrary.push(MtgCard(x.cardName, x.cardPriceWei, x.image));
            cardQuantityStore[x.cardName] = 1;
            
            cardExistStore[x.cardName] = true;
        }
        else
        {
            cardQuantityStore[x.cardName] += 1;
        }
    }
    
    //modifier setIndex {
    //   MtgCard memory x = cardLibrary[index];
    //    _;
    //}
    
    //Save extra ether as store credit
    function showCardStore(uint index) view public returns(string, uint) {
        MtgCard memory x = cardLibrary[index];
        return (x.cardName, cardQuantityStore[x.cardName]);
    }
    
    function showCardInventory(uint index, address seller) view public returns(string, uint) {
        MtgCard memory x = cardInventory[seller][index];
        return (x.cardName, cardQuantityInventory[x.cardName]);
    }
    
    function showCard2(uint index) view public returns(string) {
        MtgCard memory x = cardLibrary[index];
        return (x.cardName);
    }
    
    function purchaseCard(uint index, uint quantity) public payable {
        MtgCard memory x = cardLibrary[index];
        MtgCard memory y = cardInventory[msg.sender][index];
        require(msg.value > x.cardPriceWei * quantity && cardQuantityStore[x.cardName] >= quantity);
        if(!cardExistInventory[x.cardName])
        {
            
        }
        cardQuantityStore[x.cardName] -= quantity;
        
    }
    
    function addInventoryCard(string cardName, uint cardPriceWei, string cardImage) public {
        if(!cardExistInventory[cardName])
        {
            cardInventory[msg.sender].push(MtgCard(cardName, cardPriceWei, cardImage));
            cardQuantityInventory[cardName] = 1;
            cardExistInventory[cardName] = true;
        }
        else
        {
            cardQuantityInventory[cardName] += 1;
        }
    }
    
    
    
    
    
    
    
}