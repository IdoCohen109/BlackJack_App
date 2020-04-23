//variables
//suits = cards options 
//cardValues = cards values
// deck = Array of Objects of Cards, each card is an object with properties of Value, Suite and weight

//Win Value
const winValue = 100;
const lossValue = -100;

// Creating the Cards
const suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
const cardValues = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

//Players 
let players = new Array();
let currentPlayer = 0;
let winnerPlayer = 0;

//Cards Deck
let deck = new Array();

//dealer
// let dealer = players.length - 1;
function restart() {
    location.reload();
}

function addRemoveButtons() {
    document.getElementById("hitBtn").removeAttribute("disabled");
    document.getElementById("restart").removeAttribute("disabled");
    document.getElementById("stayBtn").removeAttribute("disabled");
    document.getElementById("btnStart").setAttribute("disabled", "");
}

function startblackjack() {
    addRemoveButtons();
    document.getElementById("status").style.display = "none";
    // deal 2 cards to every player object
    currentPlayer = 0;
    createDeck();
    shuffle();
    createPlayers(2);
    createPlayersUI();
    document.getElementById("bank").innerHTML = `Player 1 Bank: ${players[0].Bank}$`;

    dealFirstHand();
    document.getElementById('player_' + currentPlayer).classList.add('active');
}

// function to create 52 cards in 1 Array of deck
function createDeck() {
    deck = new Array();
    for (var i = 0; i < suits.length; i++) {
        for (var x = 0; x < cardValues.length; x++) {
            let weight = parseInt(cardValues[x]);
            if (cardValues[x] == "J" || cardValues[x] == "Q" || cardValues[x] == "K") {
                weight = 10;
            }
            if (cardValues[x] == "A") {
                weight = 11;
            }
            var card = {
                Value: cardValues[x],
                Suit: suits[i],
                Weight: weight
            }
            deck.push(card);
        }
    }
}

//Create the UI of the Players
function createPlayersUI() {
    document.getElementById('players').innerHTML = '';
    for (var i = 0; i < players.length; i++) {
        //Create DOM elements 
        var div_player = document.createElement('div');
        var div_playerid = document.createElement('div');
        var div_hand = document.createElement('div');
        var div_points = document.createElement('div');

        div_points.className = 'points';
        div_points.id = 'points_' + i;
        div_player.id = 'player_' + i;
        div_player.className = 'player';
        div_hand.id = 'hand_' + i;

        div_playerid.innerHTML = players[i].ID;
        div_player.appendChild(div_playerid);
        div_player.appendChild(div_hand);
        div_player.appendChild(div_points);
        document.getElementById('players').appendChild(div_player);
    }
}

//Shuffle Cards
function shuffle() {
    for (var i = 0; i < 1000; i++) {
        let deckIndx1 = Math.floor((Math.random() * deck.length));
        let deckIndx2 = Math.floor((Math.random() * deck.length));
        let tmp = deck[deckIndx1];

        deck[deckIndx1] = deck[deckIndx2];
        deck[deckIndx2] = tmp;

    }
}



// create the Players object - the argument here is for the number of the players
function createPlayers(num) {
    for (var i = 1; i <= num; i++) {
        let hand = new Array();
        let player = {
            Name: 'Player ' + i,
            ID: i,
            Bank: 1000,
            Points: 0,
            Hand: hand,
        };
        players.push(player);
    }
}

//Deal 1st Hand - 2 cards per player
function dealFirstHand() {
    addRemoveButtons();
    for (var i = 0; i < 2; i++) { // 2 cards to each player
        for (var x = 0; x < players.length; x++) {
            let card = deck.pop();
            players[x].Hand.push(card);
            renderCard(card, x);
            updatePoints();
        }
    }
    updateDeck();
}

//render the card into HTML using append
function renderCard(card, player) {
    var hand = document.getElementById('hand_' + player);
    hand.appendChild(getCardUI(card));
}

// returns the number of points that a player has in hand
function getPoints(player) {
    var points = 0;
    for (var i = 0; i < players[player].Hand.length; i++) {
        points += players[player].Hand[i].Weight;
        if (points == 21) {
            endGame();
        } else if (points > 21) {
            if ((players[player].Hand[0].Value == players[player].Hand[1].Value) && (players[player].Hand[1].Value == "A")) {
                players[player].Hand[1].Weight = 1;
                points -= 10;
            }
        }
    }
    players[player].Points = points;
    return points;
}

//updates the player points 
function updatePoints() {
    for (var i = 0; i < players.length; i++) {
        getPoints(i);
        document.getElementById('points_' + i).innerHTML = players[i].Points;
    }
}

//create the Card UI with HTML Icons
function getCardUI(card) {
    var el = document.createElement('div');
    var icon = '';
    if (card.Suit == 'Hearts')
        icon = '&hearts;';
    else if (card.Suit == 'Spades')
        icon = '&spades;';
    else if (card.Suit == 'Diamonds')
        icon = '&diams;';
    else
        icon = '&clubs;';
    el.className = 'card';
    el.innerHTML = card.Value + '<br/>' + icon;
    return el;
}

//Updates the Deck Length
function updateDeck() {
    document.getElementById('deckcount').innerHTML = deck.length;
}

function hit() {

    let card = deck.pop();
    players[currentPlayer].Hand.push(card);
    renderCard(card, currentPlayer);
    updatePoints();
    updateDeck();
    checkPoints();
}


function checkPoints() {
    if (currentPlayer == players.length - 1) { // check if the current player is the dealer
        if (players[currentPlayer].Points >= 17) {
            endGame();
        } else if (players[currentPlayer - 1].Points > 21) {
            endGame();
        } else {
            hit();
        }
    }
    //check if points is above 21
    if (players[currentPlayer].Points > 21) {
        endGame();
    }
    if (players[currentPlayer].Points == 21) {
        endGame();
    }
}

function stay() {
    document.getElementById("deal").removeAttribute("disabled");
    //check if now the dealer is playing
    if (currentPlayer == players.length - 1) {
        checkPoints();
    }
    if (currentPlayer != players.length - 1) {
        document.getElementById('player_' + currentPlayer).classList.remove('active');
        currentPlayer++;
        document.getElementById('player_' + currentPlayer).classList.add('active');
        checkPoints();
    }
}

function endGameDisplay() {
    document.getElementById("status").style.display = "block";
    document.getElementById("hitBtn").disabled = true;
    document.getElementById("stayBtn").disabled = true;
}

function endGame() {
    if (currentPlayer != players.length - 1) {
        currentPlayer++;
        stay();
    }
    // check if player 1 got high points from player 2 and player 1 points are below or equal to 21
    if (players[0].Points > players[1].Points && players[0].Points <= 21) {
        winnerPlayer = 0;
        updateBank(winnerPlayer, winValue);
        document.getElementById("status").innerHTML = `Winner is Player:${players[winnerPlayer].ID} `;
    }

    // check if the dealer has won
    else if (players[0].Points < players[1].Points && players[1].Points <= 21) {
        winnerPlayer = 1;
        updateBank(winnerPlayer, lossValue);
        document.getElementById("status").innerHTML = `Winner is Player:${players[winnerPlayer].ID} `;
    }

    // check if we have a draw
    else if (players[0].Points == players[1].Points && players[1].Points <= 21) {
        document.getElementById("status").innerHTML = `We got a Draw!`;
    } else if (players[0].Points > 21) {
        winnerPlayer = 1;
        updateBank(winnerPlayer, lossValue);
        document.getElementById("status").innerHTML = `Winner is Player:${players[winnerPlayer].ID} `;
    } else if (players[1].Points > 21) {
        winnerPlayer = 0;
        updateBank(winnerPlayer, winValue);
        document.getElementById("status").innerHTML = `Winner is Player:${players[winnerPlayer].ID} `;
    }
    endGameDisplay();
}

function updateBank(player, value) {
    console.log("bank before:" + players[player].Bank)
    players[0].Bank = (players[0].Bank + (value));
    if (player == 0) {
        console.log("bank after:" + players[player].Bank)
        document.getElementById("bank").innerHTML = `Player ${players[player].ID}   Score: ${players[player].Bank}$ `;
    } else {
        document.getElementById("bank").innerHTML = `Dealer Has Won! `;
    }
}

function deal() {
    clearPlayers();
}

function clearPlayers() {
    players.forEach(player => {
        player.Points = 0;
        player.Hand = new Array();
        console.log("player Hand:" + player.Hand)
        console.log("player Points:" + player.Points)
    })
    currentPlayer = 0;
    console.log("before deck is:" + deck.length);
    createDeck();
    shuffle();
    updateDeck();
    document.getElementById("players").innerHTML = '';
    createPlayersUI();
    dealFirstHand();
    console.log("after deck is:" + deck.length);
}

//next steps:

//Deal button - clean window but save the score of the game (Local Storage)
// need to check the Bank scores update - currently it not working properly
//need to check the checkPoints() and updateBank() routing
// after deal() need to return the border to the current player
//check again why dealer is hit again after (2 first cards = 16 --> need to hit) --> (3 cards = 20 --> no need to hit, need to check why dealer hit again)