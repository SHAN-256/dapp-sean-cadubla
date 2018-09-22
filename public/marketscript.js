$(document).ready(function () {
  var mtgMarket;
  var userAccount;
  var viewOn = viewInventory;
  var txTest = document.getElementById('txHere');

  $('#linkHome').click(function () {
      viewOn = viewHome;
      showView("viewHome");
      //alert("clickHome");
  });
    
  $('#linkInventory').click(function () {
      viewOn = viewInventory;
      showView("viewInventory");
      //alert("clickInventory");
  });

  $('#linkMarket').click(function () {
      viewOn = viewMarket;
      showView("viewMarket");
      //alert("clickMark");
  });

   $('#linkAbout').click(function () {
      viewOn = viewAbout;
      showView("viewAbout");
      //alert("clickAbout");
  });

  function showView(viewName) {
      // Hide all views and show the selected view only
      $('main > section').hide();
      $('#' + viewName).show();
  }

  function startApp() {
      mtgMarketAddress = "0x325d773ded9529efcd755030089e3fefc998f821";
      mtgMarket = new web3js.eth.Contract(mtgMarketABI, mtgMarketAddress);

      var account;
      // // web3.eth.getAccounts(account);
      // alert(account);

      var accountInterval = setInterval(function() {
         web3.eth.getAccounts((err, res) => {                   
        
          account = res[0];
          //console.log(account);
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

  function displayCards(ids) {
    $("#txHere").empty();
      for (id of ids){ 
          getCardDetails(id)
          .then(function(mtgCard) {
            var priceEth = mtgCard.price / 1000000000000000000;
              $("#txHere").append(`<div class="responsive">
                <div class="gallery">
                  <a target="_blank" href="images/vraska.jpg">
                    <img src="images/vraska.jpg" alt="Cinque Terre" width="600" height="400">
                  </a>
                  <div class="desc">
                  ID: ${mtgCard.id}<br/>
                  Name:${mtgCard.name}<br/>
                  Price: ${priceEth} eth<br/>
                  </div>
                </div>
              </div>`);

          });
      }
  }

  function displayCardsMarket(ids) {
    $("#txHereMarket").empty();
      for (id of ids){ 
          getCardDetails(id)
          .then(function(mtgCard) {
            var priceEth = mtgCard.price / 1000000000000000000;
              $("#txHereMarket").append(`<div class="responsive">
                <div class="gallery">
                  <a target="_blank" href="images/vraska.jpg">
                    <img src="images/vraska.jpg" alt="Cinque Terre" width="600" height="400">
                  </a>
                  <div class="desc">
                  ID: ${mtgCard.id} <br/>
                  Name:${mtgCard.name}<br/>
                  Price: ${priceEth} eth<br/>
                  <input type="button" id="btnPurchase" value="Purchase"/>
                  </div>
                </div>
              </div>`);
          });
      }
  }

  $('#buttonAddInvent').click(function () {
      var name = $("#cardName").val();
      var cmc = $("#cardCMC").val();
      var cardtype = $("#cardType").val();
      var colors = $("#cardColors").val();
      var price= $("#cardPrice").val();
      var image= "No Image Yet";

      alert(name + cmc + cardtype + colors + price + image);

      addCardToInventory(name,cmc,cardtype,colors,price,image);
  });

  $('#btnPurchase').click(function () {

  });

  function addCardToInventory(name, cmc, cardType, colors, price, image) {
    // This is going to take a while, so update the UI to let the user know
    // the transaction has been sent
    $("#txNotif").text("Adding card to blockchain, might take a while...");
    // Send the tx to our contract:
    return mtgMarket.methods.addCardToInventory(name, cmc, cardType, colors, price, image)
    .send({ from: userAccount })
    .on("receipt", function(receipt) {
      $("#txNotif").text("Successfully cast " + name + "!");
      // Transaction was accepted into the blockchain, let's redraw the UI
      getCardsByOwner(userAccount).then(displayCards);
    })
    .on("error", function(error) {
      // Do something to alert the user their transaction has failed
      $("#txNotif").text(error);
    });
  }

  function purchaseCard(id) {
    document.getElementById("myOutput").innerHTML;
    $("#txNotif").text("Purchasing Card...");
    var cardPrice;
    getCardDetails(id)
    .then(function(mtgCard) {
      return mtgMarket.methods.purchaseCard(id)
      .send({ from: userAccount, value: mtgCard.price })
      .on("receipt", function(receipt) {
        $("#txNotif").text("Gadzooks! Successfully bought a card!");
      })
      .on("error", function(error) {
        $("#txNotif").text(error);
      });
    });
  }

  function getCardDetails(id) {
      return mtgMarket.methods.cards(id).call()
  }

  function cardToOwner(id) {
      return mtgMarket.methods.cardToOwner(id).call()
  }

  function getCardsByOwner(owner) {
      return mtgMarket.methods.getCardsByOwner(owner).call()
  }

  function getAllCards() {
      return mtgMarket.methods.getAllCards().call()
  }

  window.addEventListener('load', function() {
  showView("viewInventory");
  var txWarning = document.getElementById('txHere');
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      txHere.innerHTML = "yesMetamask";
      web3js = new Web3(web3.currentProvider);
    } else {
      // Handle the case where the user doesn't have web3. Probably 
      // show them a message telling them to install Metamask in 
      // order to use our app.
      txHere.innerHTML = "noMetamask";
    }

    // Now you can start your app & access web3js freely:
    startApp()

  })

  window.pressed = function(){
      var a = document.getElementById('uploadPhoto');
      var label = document.getElementById('colorLabel')
      if(a.value == "")
      {
          label.innerHTML = "Choose file";
      }
      else
      {
          var theSplit = a.value.split('\\');
          label.innerHTML = theSplit[theSplit.length-1];
      }
  };
});