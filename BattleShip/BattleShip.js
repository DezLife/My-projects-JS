var viem = {
    displayMessage: function(msg){
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit")
    },
    displayMiss : function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss")
    }
}
var model = {
    boardSize : 7,
    numShips : 3,
    shipLenght : 3,
    shipsSunk : 0,

    ships : [{ location: [0, 0, 0], hits: ["", "", ""]},
            {location: [0, 0, 0], hits: ["", "", ""]},
            {location: [0, 0, 0], hits: ["", "", ""]}],
    
    fire : function(guess){
        for(var i = 0; i < this.numShips; i++ ){
            var ship = this.ships[i];
            Locations = ship.location;
            var index = Locations.indexOf(guess);
            if(index >= 0){
                ship.hits[index] = "hit";
                viem.displayHit(guess);
                viem.displayMessage("HIT!");
                if(this.isSunk(ship)){
                    viem.displayMessage("You sunk my battleships!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        viem.displayMiss(guess)
        viem.displayMessage("You missed!")
        return false;
    },
    isSunk : function(ship){
        for(var i = 0; i < this.shipLenght; i++){
            if(ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    },

    collision : function(Locations){
        for(var i = 0; i < this.numShips; i++){
            var ship = model.ships[i];
            console.log(Locations);
            for(var j = 0; j < Locations.length; j++){
                if(ship.location.indexOf(Locations[j]) >= 0){
                    return true;
                }
            }
        }
        return false;
    },

    genarateShip : function (){
        var direction = Math.floor(Math.random() * 2);
        var rov, col;

        if(direction === 1){
            rov = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLenght));
        }
        else
        {
            rov = Math.floor(Math.random() * (this.boardSize - this.shipLenght));
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = [];
        for(var i = 0; i < this.shipLenght; i++){
            if(direction === 1){
                newShipLocations.push(rov + "" + (col + i ));
            }
            else
            {
                newShipLocations.push((rov + i) + "" + col);
            }
        }
        return newShipLocations;
    },

    generateShipLocation : function(){
        var Locations;
        for(var i = 0; i < this.numShips; i++){
            do{
                Locations = this.genarateShip();
            }
            while(this.collision(Locations));
            this.ships[i].location = Locations;
        }
    }
}
var controller = {
    guesses : 0,
    processGuess : function(guess){
        var location = parseGuesse(guess)
        if(location){
            this.guesses++;
            var hit = model.fire(location);
            if(hit && model.shipsSunk === model.numShips){
                viem.displayMessage("You sank all my battleships, in " + this.guesses + " guesses")
            }
        }
    },
    
}

function parseGuesse(guess){
    var alphabet = ["A","B","C","D","E","F","G"];
    if(guess === null || guess.length !== 2){
        alert("Oops, please enter a letter and a number on the board...")
    }
    else{
        firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);
        if(isNaN(row) || isNaN(column)){
            alert("Oops, that isn,t on the board");
        }
        else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
            alert("Oops, that's off the board!")
        }
        else{
            return row + column;
        }
    }
    return null;
}

function handleFireButton(){
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
}

function init(){
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocation();
}

function handleKeyPress(e){
    var fireButton = document.getElementById("fireButton");
    if(e.keyCode === 13){
        fireButton.click();
        return false;
    }
}
window.onload = init;

