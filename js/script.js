/*
Brandon Nguyen
Brandon_Nguyen4@student.uml.edu
*/

const RACK_MAX_TILES = 7;
var totalScore = 0;

$(document).ready(function () {
    // Initialize the Scrabble game
    ObjScrabble.init();
    initializeBoard();
    drawHand();
    refreshScoreboard();
    makeTilesDraggable();

    // Enable tile dropping on the game board
    $('.slot').droppable({
        tolerance: 'intersect',
        hoverClass: 'drop-hover',
        drop: function (event, ui) {
            handleTileDropOnBoard($(this), ui);
        }
    });

    // Enable tile dropping back into the rack
    $('#rack').droppable({
        accept: '.drawn',
        tolerance: 'intersect',
        hoverClass: 'drop-hover',
        drop: function (e, ui) {
            returnTileToRack(ui);
        }
    });

    // Reset the game on button click
    $('#reset').on('click', function (e) {
        resetGame();
    });

    // Proceed to the next word on button click
    $('#next-word').on('click', function (e) {
        proceedToNextWord();
    });
});

// Initializes the game board with default settings
function initializeBoard() {
    var $blank = $('<div>').addClass('board-blank slot droppable ui-widget-header')
        .attr('letter-mult', 1)
        .attr('word-mult', 1);
    var $doublew = $blank.clone()
        .addClass('board-double-word')
        .removeClass('board-blank')
        .attr('word-mult', 2);
    var $doublel = $blank.clone()
        .addClass('board-double-letter')
        .removeClass('board-blank')
        .attr('letter-mult', 2);
    var i = 0;
    $('#board')
        .append($blank.clone().attr('col', i++))
        .append($doublew.clone().attr('col', i++))
        .append($blank.clone().attr('col', i++))
        .append($doublel.clone().attr('col', i++))
        .append($blank.clone().attr('col', i++))
        .append($doublew.clone().attr('col', i++))
        .append($blank.clone().attr('col', i++));
}

// Handles the dropping of a tile onto the game board
function handleTileDropOnBoard($slot, ui) {
    if ($slot.children().length == 0) {
        ui.draggable
            .detach()
            .css({ top: 0, left: 0 })
            .addClass('drawn')
            .appendTo($slot);
        refreshScoreboard();
        $('#next-word').prop('disabled', false);
    }
}

// Handles the returning of a tile to the rack
function returnTileToRack(ui) {
    ui.draggable.detach()
        .removeClass('drawn')
        .css({ top: 0, left: 0 })
        .appendTo($(this));
    refreshScoreboard();
}

// Resets the Scrabble game to its initial state
function resetGame() {
    ObjScrabble.init();
    $('#board, #rack').children().empty();
    drawHand();
    makeTilesDraggable();
    refreshScoreboard();
    totalScore = 0;
    $('#total-score').text(totalScore);
}

// Proceeds to the next word in the game
function proceedToNextWord() {
    $('#board').children().empty();
    drawHand();
    makeTilesDraggable();
    var curScore = parseInt($('#cur-score').text(), 10);
    totalScore += curScore;
    $('#total-score').text(totalScore);
    refreshScoreboard();
}

// Refreshes the scoreboard based on the current tiles on the board
function refreshScoreboard() {
    var stringWord = "";
    var score = 0;
    var letterVal;
    var letterMult = 1;
    var wordMult = 1;

    $('.slot').each(function () {
        var $this = $(this);
        var $child;

        if ($this.children().length > 0) {
            $child = $this.find('img');
            stringWord += $child.attr('letter');

            letterVal = parseInt($child.attr('value'), 10);
            letterMult = parseInt($this.attr('letter-mult'), 10);

            score += (letterVal * letterMult);
            wordMult *= parseInt($this.attr('word-mult'), 10);
        } else {
            stringWord += '.';
        }
    });

    $('#word').text(stringWord);
    $('#cur-score').text(score * wordMult);
    $('#bag').text(ObjScrabble.bag.length);
}

// Draws tiles from the bag to fill the player's hand with 7 tiles
function drawHand() {
    var $rack = $('#rack');
    var $tile = $('<img>').addClass('tile draggable ui-widget-content');
    var i = $rack.children().length;

    for (; i < RACK_MAX_TILES; ++i) {
        var key = ObjScrabble.drawTileFromBag();
        if (key) {
            var strSrc = 'images/tiles/Scrabble_Tile_' + key + '.jpg';
            var $newTile = $tile.clone()
                .attr('value', ObjScrabble.dictTiles[key].value)
                .attr('letter', key)
                .attr('src', strSrc)
                .appendTo('#rack');
        }
    }
}

// Enables the tiles to be draggable
function makeTilesDraggable() {
    $('.tile').draggable({
        revert: true,
        revertDuration: 500,
        scroll: false,
        start: function (e, ui) {
            $(this).addClass('hovering');
        },
        stop: function (e, ui) {
            $(this).removeClass('hovering');
        }
    });
}

var debugging = false;
var ObjScrabble = {};
ObjScrabble.dictTiles = [];

// Initializes the Scrabble object with the tile dictionary and bag
ObjScrabble.init = function () {
    ObjScrabble.dictTiles = {
        'A': { 'value': 1, 'freq': 9, 'quantity': 9 },
        'B': { 'value': 3, 'freq': 2, 'quantity': 2 },
        'C': { 'value': 3, 'freq': 2, 'quantity': 2 },
        'D': { 'value': 2, 'freq': 4, 'quantity': 4 },
        'E': { 'value': 1, 'freq': 12, 'quantity': 12 },
        'F': { 'value': 4, 'freq': 2, 'quantity': 2 },
        'G': { 'value': 2, 'freq': 3, 'quantity': 3 },
        'H': { 'value': 4, 'freq': 2, 'quantity': 2 },
        'I': { 'value': 1, 'freq': 9, 'quantity': 9 },
        'J': { 'value': 8, 'freq': 1, 'quantity': 1 },
        'K': { 'value': 5, 'freq': 1, 'quantity': 1 },
        'L': { 'value': 1, 'freq': 4, 'quantity': 4 },
        'M': { 'value': 3, 'freq': 2, 'quantity': 2 },
        'N': { 'value': 1, 'freq': 6, 'quantity': 6 },
        'O': { 'value': 1, 'freq': 8, 'quantity': 8 },
        'P': { 'value': 3, 'freq': 2, 'quantity': 2 },
        'Q': { 'value': 10, 'freq': 1, 'quantity': 1 },
        'R': { 'value': 1, 'freq': 6, 'quantity': 6 },
        'S': { 'value': 1, 'freq': 4, 'quantity': 4 },
        'T': { 'value': 1, 'freq': 6, 'quantity': 6 },
        'U': { 'value': 1, 'freq': 4, 'quantity': 4 },
        'V': { 'value': 4, 'freq': 2, 'quantity': 2 },
        'W': { 'value': 4, 'freq': 2, 'quantity': 2 },
        'X': { 'value': 8, 'freq': 1, 'quantity': 1 },
        'Y': { 'value': 4, 'freq': 2, 'quantity': 2 },
        'Z': { 'value': 10, 'freq': 1, 'quantity': 1 },
        '_': { 'value': 0, 'freq': 2, 'quantity': 2 }
    };

    ObjScrabble.size = Object.keys(ObjScrabble.dictTiles).length;
    ObjScrabble.bag = [];

    for (var key in ObjScrabble.dictTiles) {
        for (var i = 0; i < ObjScrabble.dictTiles[key].quantity; ++i) {
            ObjScrabble.bag.push(key);
        }
    }

    if (debugging) {
        console.log('ObjScrabble.size: ', ObjScrabble.size);
        console.log('bag.length: ', ObjScrabble.bag.length);
        console.log(ObjScrabble.bag);
    }
};

// Draws a tile from the bag, updating the bag and dictionary
ObjScrabble.drawTileFromBag = function () {
    if (this.bag.length < 1)
        return null;

    var randIndex = Math.floor(Math.random() * this.bag.length);
    var strLetter = this.bag.splice(randIndex, 1);
    this.dictTiles[strLetter].quantity--;

    if (debugging)
        console.log(strLetter + ' : ' + this.dictTiles[strLetter].quantity);
    
    return strLetter;
};
