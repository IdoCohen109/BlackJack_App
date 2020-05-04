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
let dealer = 1;
let firstHandFlag = 1; // 1 means we are in the 2 first cards of "deal first hand"
//Cards Deck
let deck = new Array();

//Bank
let bank = 1000;

//Add / Remove buttons
function addRemoveButtons() {
    document.getElementById("hitBtn").removeAttribute("disabled");
    document.getElementById("restart").removeAttribute("disabled");
    document.getElementById("stayBtn").removeAttribute("disabled");
    document.getElementById("btnStart").setAttribute("disabled", "");
}

function startblackjack() {
    addRemoveButtons();
    document.getElementById("status").style.display = "none";
    document.getElementById("bank").innerHTML = `Bank: ${bank}$`;
    currentPlayer = 0;
    createDeck();
    shuffle();
    createPlayers(2);
    createPlayersUI();
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

//Create Player
function createPlayers(num) {
    for (var i = 1; i <= num; i++) {
        let hand = new Array();
        let player = {
            Name: 'Player ' + i,
            ID: i,
            Points: 0,
            Hand: hand,
        };
        players.push(player);
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

function renderCard(card, player) {
    var hand = document.getElementById('hand_' + player);
    hand.appendChild(getCardUI(card));
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


//updates the player points 
function updatePoints() {
    for (var i = 0; i < players.length; i++) {
        getPoints(i);
        document.getElementById('points_' + i).innerHTML = players[i].Points;
    }
}

// returns the number of points that a player has in hand
function getPoints(player) {
    var points = 0;
    for (var i = 0; i < players[player].Hand.length; i++) {
        points += players[player].Hand[i].Weight;
        if (points == 21 && firstHandFlag == 1) {
            bank += (winValue * 1.5);
            stay();
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

//Updates the Deck Length
function updateDeck() {
    document.getElementById('deckcount').innerHTML = `Cards On Deck: ${deck.length}`;
}

//Hit card
function hit() {
    firstHandFlag = 0;
    let card = deck.pop();
    players[currentPlayer].Hand.push(card);
    renderCard(card, currentPlayer);
    updatePoints();
    updateDeck();
    if (currentPlayer == 0) {
        comparePoints();
    } else if (players[dealer].Points < 17) {
        hit();
    } else {
        compareFinalPoints()
    }
}

//Stay function
function stay() {
    document.getElementById("deal").removeAttribute("disabled");
    document.getElementById('player_' + currentPlayer).classList.remove('active');
    currentPlayer++;
    document.getElementById('player_' + dealer).classList.add('active');
    if (players[0].Points > 21) {
        document.getElementById("status").innerHTML = `You Have Been Burned!`;
        bank -= winValue;
        endGameDisplay();
    }
    //Dealer hand check
    else if (players[dealer].Points < 17) {
        hit();
    } else if (players[dealer].Points <= 21) {
        compareFinalPoints();
    }
}

function comparePoints() {
    if (players[0].Points > 21) {
        document.getElementById("hitBtn").setAttribute("disabled", "");
        stay();
    }
}

function compareFinalPoints() {
    if (players[dealer].Points > 21) {
        document.getElementById("status").innerHTML = `Dealer Have Been Burned! You Won!`;
        bank += winValue;
    }
    //check if player[0] has 21 and dealer has below 21
    else if (players[0].Points == 21 && players[dealer] < 21) {
        document.getElementById("status").innerHTML = `Winner in Player ${players[0].ID}`
        bank += winValue;
    }
    //check if dealer has 21 and player[0] has below 21
    else if (players[dealer].Points == 21 && players[0] < 21) {
        document.getElementById("status").innerHTML = `Dealer Has Won!`;
        bank -= winValue;
    }
    //draw
    else if (players[dealer].Points == players[0].Points) {
        document.getElementById("status").innerHTML = `We got a Draw!`;
    } else if (players[dealer].Points > players[0].Points) {
        document.getElementById("status").innerHTML = `Dealer Has Won!`;
        bank -= winValue;
    } else if (players[dealer].Points < players[0].Points) {
        document.getElementById("status").innerHTML = `Winner in Player ${players[0].ID}`
        bank += winValue;
    }
    endGameDisplay();
}

function endGameDisplay() {
    document.getElementById("status").style.display = "block";
    document.getElementById("hitBtn").disabled = true;
    document.getElementById("stayBtn").disabled = true;
    document.getElementById("bank").innerHTML = `Bank: ${bank}$`;
}

function deal() {

    document.getElementById("status").innerHTML = '';
    document.getElementById('player_' + dealer).classList.remove('active');
    currentPlayer = 0;
    // document.getElementById('player_' + 0).classList.add('active');
    clearPlayers();
}

function clearPlayers() {
    players.forEach(player => {
        player.Points = 0;
        player.Hand = new Array();
    })
    createDeck();
    shuffle();
    updateDeck();
    document.getElementById("players").innerHTML = '';
    createPlayersUI();
    dealFirstHand();
    document.getElementById('player_' + 0).classList.add('active');
}