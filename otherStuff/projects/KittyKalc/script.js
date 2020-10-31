var updateKittyValue = function() {
  var players = parseFloat(document.getElementById("players-option").value);
  var cardsOut = 0;
  if (document.getElementById("checkbox-for-2").checked) {
    cardsOut += 4;
  }
  if (document.getElementById("checkbox-for-3").checked) {
    cardsOut += 4;
  }
  if (document.getElementById("checkbox-for-4").checked) {
    cardsOut += 4;
  }
  if (document.getElementById("checkbox-for-6").checked) {
    cardsOut += 4;
  }
  var cardsInKitty = (57-cardsOut) % players;
  if (cardsInKitty === 0) {
    cardsInKitty += players;
  }
  var cardsInHand = (57-cardsOut-cardsInKitty)/players;
  var percentOfHand1 = Math.round((cardsInKitty/cardsInHand*10000))/100;
  var percentOfHand2 = Math.round(((cardsInKitty + players)/(cardsInHand - 1)*10000))/100;
  document.getElementById("cards-in-kitty").innerHTML = `${cardsInKitty} or ${cardsInKitty + players}`;
  document.getElementById("cards-in-hand").innerHTML = `${cardsInHand} or ${cardsInHand - 1}`;
  document.getElementById("percent-of-hand").innerHTML = `${percentOfHand1} or ${percentOfHand2}`;
};

window.setInterval(updateKittyValue, 10);
