var mtgMarketABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_cmc",
				"type": "string"
			},
			{
				"name": "_cardType",
				"type": "string"
			},
			{
				"name": "_colors",
				"type": "string"
			},
			{
				"name": "_price",
				"type": "uint256"
			},
			{
				"name": "_image",
				"type": "string"
			}
		],
		"name": "addCardToInventory",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "cards",
		"outputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "cmc",
				"type": "string"
			},
			{
				"name": "cardType",
				"type": "string"
			},
			{
				"name": "colors",
				"type": "string"
			},
			{
				"name": "price",
				"type": "uint256"
			},
			{
				"name": "image",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "uint256"
			},
			{
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "changeCardPrice",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "purchaseCard",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "getCardsByOwner",
		"outputs": [
			{
				"name": "",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "cardToOwner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "cardId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "cardName",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "cardPrice",
				"type": "uint256"
			}
		],
		"name": "NewCardInventory",
		"type": "event"
	}
]