$(document).ready(function () {
  var mtgMarket;
  var userAccount;
  var viewOn = viewInventory;
  var txTest = document.getElementById('txHere');

  //Changes the view when clicking Home AKA Magic:The Ethering
  $('#linkHome').click(function () {
      viewOn = viewHome;
      showView("viewHome");
  });
  //Changes the view when clicking Inventory
  $('#linkInventory').click(function () {
      viewOn = viewInventory;
      showView("viewInventory");
  });
  //Changes the view when clicking Market
  $('#linkMarket').click(function () {
      viewOn = viewMarket;
      showView("viewMarket");
  });
  //Handles View Changes
  function showView(viewName) {
      // Hide all views and show the selected view only
      $('main > section').hide();
      $('#' + viewName).show();
  }
  //Handles the start of the app.
  function startApp() {
      //The address of the deployed Smart Contract in the Ropsten Testnet
      mtgMarketAddress = "0x70415d4efd87ebf8fdfd84aeb4d8c5fe9f6149d6";
      mtgMarket = new web3js.eth.Contract(mtgMarketABI, mtgMarketAddress);

      var account;

      //checks for the metamask account every millisecond
      var accountInterval = setInterval(function() {
         web3.eth.getAccounts((err, res) => {                   
        
          account = res[0];
        });
          // Check if account has changed
          if (account !== userAccount) {
            userAccount = account;
            // Call some function to update the UI with the new account
            if(viewOn = viewInventory)
            {
              getCardsByOwner(userAccount)
              .then(displayCards);
            }

            if(viewOn = viewMarket)
            {
              getAllCards()
              .then(displayCardsMarket);
            }
        }
      }, 100);
  }

  //Displays the owned cards of the metamask address in the inventory view
  function displayCards(ids) {
    $("#txHere").empty();
      for (id of ids){ 
          getCardDetails(id)
          .then(function(mtgCard) {
            var priceEth = mtgCard.price / 1000000000000000000;
              $("#txHere").append(`<div class="responsive">
                <div class="gallery">
                  <a target="_blank" href="https://ipfs.io/ipfs/${mtgCard.image}">
                    <img src="https://ipfs.io/ipfs/${mtgCard.image}" alt="Insert Card Here" width="600" height="400">
                  </a>
                  <div class="desc">
                  ID: <span class="idd">${mtgCard.id}</span><br/>
                  Name:${mtgCard.name}<br/>
                  Price: <span class="priceTx">${priceEth}</span> eth
                  </div>
                </div>
              </div>`);
          });
      }
  }

  //Displays all the cards in the Market view
  function displayCardsMarket(ids) {
    $("#txHereMarket").empty();
      for (id of ids){ 
          getCardDetails(id)
          .then(function(mtgCard) {
            var priceEth = mtgCard.price / 1000000000000000000;
              $("#txHereMarket").append(`<div class="responsive">
                <div class="gallery">
                  <a target="_blank" href="https://ipfs.io/ipfs/${mtgCard.image}">
                    <img src="https://ipfs.io/ipfs/${mtgCard.image}" alt="Insert Card Here" width="600" height="400">
                  </a>
                  <div class="desc">
                  ID: <span class="idd">${mtgCard.id}</span><br/>
                  Name:${mtgCard.name}<br/>
                  Price: ${priceEth} eth
                  </div>
                </div>
              </div>`);
          });
      }
  }

  //When clicking the add to inventory button, adds a card to the smart contract
  $('#buttonAddInvent').click(function () {
      var name = $("#cardName").val();
      var cmc = $("#cardCMC").val();
      var cardtype = $("#cardType").val();
      var colors = $("#cardColors").val();
      var price= $("#cardPrice").val();

      var image= "No Image Yet";

      //handles the uploading to ipfs
      var input, file, fr, imagehash;

      input = $("#uploadPhoto");

      file = $("#uploadPhoto").get(0).files[0];
      fr = new FileReader();
      fr.onload = receivedText();
      
      function receivedText() {
          fr = new FileReader();
          fr.readAsBinaryString(file);
          
          //IPFS START
          const repoPath = 'ipfs-1111' //+ Math.random()
          const ipfs = new Ipfs({ repo: repoPath })

          ipfs.on('ready', () => {
              const files = [
              {
                  path: 'image.png',
                  content: ipfs.types.Buffer.from(btoa(fr.result),"base64")
              }
              ]

              ipfs.files.add(files, function (err, files) {
                  let url = "https://ipfs.io/ipfs/"+files[0].hash;
                  console.log("Storing file on IPFS using Javascript. HASH: https://ipfs.io/ipfs/"+files[0].hash);
                  console.log("Other Link: https://raulikidj.club/examples/ipfs/ipfsimg.html?HASH="+files[0].hash);
                  ipfsPath = files[0].hash
                  ipfs.files.cat(ipfsPath, function (err, file) {
                  if (err) {
                      throw err
                  }
                  img = file.toString("base64");
                  //assigns the ipfs hash to an image
                  image = files[0].hash;

                  console.log(image);
                  //adds the card to the inventory
                  addCardToInventory(name,cmc,cardtype,colors,price,image);
                  //clears the textfields
                  clearAddInventory();
                  })
              })
          })
      }
  });

  //when you click the description box of a card in the market, you prompt to purchase the card
  $("#txHereMarket").delegate("div.desc", "click", function(){
    var purchaseID = $(this).children('span.idd').text();
    purchaseCard(purchaseID);
  });

  //when you click the description box of a card in your inventory, you prompt to change that card's price. Opens the change price modal
  $("#txHere").delegate("div.desc", "click", function(){
    var originalPrice = $(this).children('span.priceTx').text();
    var priceToWei = originalPrice * 1000000000000000000;
    var changeCardPriceID = $(this).children('span.idd').text();
    $('#cardChangePriceId').val(changeCardPriceID);
    $('#cardChangePrice').val(priceToWei);
    $('#changeCardPriceModal').modal('toggle');
  });

  //Actually initalizes the changing price process
  $('#buttonChangePrice').click(function () {
    var changePrice = $("#cardChangePrice").val();
    var changeCardPriceID = $("#cardChangePriceId").val();

    changeCardPrice(changeCardPriceID, changePrice);
    $('#changeCardPriceModal').modal('hide');
  });

  //Adds a card to inventory!
  function addCardToInventory(name, cmc, cardType, colors, price, image) {
    // Notifying the user that it will take a while
    $.notify("Adding card to blockchain, might take a while...", "info");
    // Send the tx to our contract:
    return mtgMarket.methods.addCardToInventory(name, cmc, cardType, colors, price, image)
    .send({ from: userAccount })
    .on("receipt", function(receipt) {
      $.notify("Successfully cast " + name + "!", "success");
      // Transaction was accepted into the blockchain, let's redraw the UI
      getCardsByOwner(userAccount).then(displayCards);
      getAllCards().then(displayCardsMarket);
    })
    .on("error", function(error) {
      // Do something to alert the user their transaction has failed
      $.notify(error, "error");
    });
  }

  function changeCardPrice(id, price) {
    // Notifying the user that it will take a while
    $.notify("Changing card price, might take a while...", "info");
    return mtgMarket.methods.changeCardPrice(id, price)
    .send({ from: userAccount })
    .on("receipt", function(receipt) {
      // Success! show the user that the price of the card has successfully been changed
      $.notify("Changed card price!", "success");
      getCardsByOwner(userAccount).then(displayCards);
      getAllCards().then(displayCardsMarket);
    })
    .on("error", function(error) {
      // Do something to alert the user their transaction has failed
      $.notify(error, "error");
    });
  }

  //Clears input fields in the add inventory modal
  function clearAddInventory() {
    $("#cardName").val("");
    $("#cardCMC").val("");
    $("#cardType").val("");
    $("#cardColors").val("");
    $("#cardPrice").val("1000000000000000000");
  }

  function purchaseCard(id) {
    // Notifying the user that it will take a while
    $.notify("Purchasing Card, might take a while...", "info");
    var cardPrice;
    getCardDetails(id)
    .then(function(mtgCard) {
      return mtgMarket.methods.purchaseCard(id)
      .send({ from: userAccount, value: mtgCard.price })
      .on("receipt", function(receipt) {
        // Success! show the user that they have successfully bought a card!
        $.notify("Gadzooks! Successfully bought a card!", "success");
        getCardsByOwner(userAccount).then(displayCards);
      })
      .on("error", function(error) {
        // Do something to alert the user their transaction has failed
        $.notify(error, "error");
      });
    });
  }

  //Calling the getCardDetails function from the smart contract
  function getCardDetails(id) {
      return mtgMarket.methods.cards(id).call()
  }
  //Calling the cardToOwner function from the smart contract
  function cardToOwner(id) {
      return mtgMarket.methods.cardToOwner(id).call()
  }
  //Calling the getCardsByOwner function from the smart contract
  function getCardsByOwner(owner) {
      return mtgMarket.methods.getCardsByOwner(owner).call()
  }
  //Calling the getAllCards function from the smart contract
  function getAllCards() {
      return mtgMarket.methods.getAllCards().call()
  }

  //When the site first loads, this function triggers first
  window.addEventListener('load', function() {
  //sets initial view to the Home page
  showView("viewHome");
  var txWarning = document.getElementById('txHere');
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      $.notify("You have Metamask!", "info");
      web3js = new Web3(web3.currentProvider);
    } else {
      // Handle the case where the user doesn't have web3. Probably 
      // show them a message telling them to install Metamask in 
      // order to use our app.
      $.notify("Install Metamask first!", "info");
    }
    // Starting the app and accessing web3
    startApp()
  })

  //Handles the displaying of what card photo the user has currently chosen.
  $("#uploadPhoto").change(function() {
    if($("#uploadPhoto").val() == "")
      {
          $("#imageLabel").val("No Photo Chosen");
      }
      else
      {
          var theSplit = $("#uploadPhoto").val().split('\\');
          $("#imageLabel").text(theSplit[theSplit.length-1]);
      }
  });
});