// 1412844 Eric Hughes
"use strict";
var layer1; // layer1 for divs and img elements
var layer2; // layer1 for divs and img elements
var flippedCards = []; // array of size 2 that contains 2 cards during match check
var CardsMatched = 0; // counter of matched pairs
var l3Counter = 0; // counter for layer3 images array as user progresses through levels
var layer2Counter = 0; // identifier for the ids of second layer
var layer1Images = [ // cached images urls for layer1
    "url(../images/alphabet/a.png)", "url(../images/alphabet/b.png)", "url(../images/alphabet/c.png)",
    "url(../images/alphabet/d.png)", "url(../images/alphabet/e.png)", "url(../images/alphabet/f.png)",
    "url(../images/alphabet/g.png)", "url(../images/alphabet/h.png)", "url(../images/alphabet/i.png)",
    "url(../images/alphabet/j.png)", "url(../images/alphabet/k.png)", "url(../images/alphabet/l.png)",
    "url(../images/alphabet/m.png)", "url(../images/alphabet/n.png)", "url(../images/alphabet/o.png)",
    "url(../images/alphabet/p.png)"
]; // cached images urls for layer1
var layer2Images = [
    "url(../images/layer2images/apple.png)", "url(../images/layer2images/bee.png)", "url(../images/layer2images/cat.png)",
    "url(../images/layer2images/dog.png)", "url(../images/layer2images/egg.png)", "url(../images/layer2images/flower.png)",
    "url(../images/layer2images/goose.png)", "url(../images/layer2images/hat.png)",
]; // cached images urls for layer1
var alphabetArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n",
    "o", "p"];
var layer3Images = [
    "url(../images/layer3images/dinosaur1_background.png)", "url(../images/layer3images/dinosaur2_background.png)", "url(../images/layer3images/dinosaur3_background.png)",
    "url(../images/layer3images/dinosaur4_background.png)", "url(../images/layer3images/dinosaur5_background.png)",
];
/**
 *  main initialization of script
 */
 addEvent(document, "DOMContentLoaded", init);
/**
 * init - initializes layer1 and layer2 layers of gameboard
 * if endGame adds events to howtoplay new game and end gameButtons
 * @return {undefined}  description
 */
function init() {
    // populate memory board at the from refresh
    populateMemoryBoard();
    // create array of layer 2 and layer1 separately for the logic checks for click events and matches
    layer2 = document.getElementsByClassName('middleLayer');
    layer1 = document.getElementsByClassName('topLayer');
    // made an extra window popup for howto play that appears and repears from click event
    addEvent(document.getElementById("howToPlayLink"), "click", howToPlay);
    addEvent(document.getElementById("newGame"), "click", newGame);
    addEvent(document.getElementById("endGame"), "click", endGame);
    // add event listener to each layer1 div element and attach it to handleClickedCard
    // add event listener to entire document for keyboard event to same handleclickedCard function
    addEvent(document, "keyup", handleClickedCard);
    var container = document.getElementById("container");
    addEvent(container,"click", handleClickedCard);
}
/**
 * populateMemoryBoard - initliazes layer3 pictures from layer3images array
 * shuffles layer2images array
 * creates cards with the designated layertype and counter for id purposes
 * @return {undefined}  description
 */
function populateMemoryBoard() {
  var layer3 = document.getElementById("layer3");
  layer3.style.backgroundImage = layer3Images[0];
    var imageCounter = 0;
    var layerType = "topLayer";
    for (var i = 1; i <= 2; i++) {
        var section = document.getElementById("layer" + i);
        for (var j = 0, n = 16; j < n; j++) {
            if (i == 2 && j == 8) {
                layer2ImageShuffle();
            }
            createCards(section, layerType, imageCounter);
            imageCounter = imageCounter + 1;
        }
        layerType = "middleLayer";
    }
}

/**
 * createCards -
 * method creates div and img elements on the page
 * checks if layerType is top layer or middle layer and choses which images to use from layer1images array or layer2images array
 * appends key + letter from alphabet array to the img elements in the top layer
 *
 * @param  {section} section     section html element
 * @param  {string} layerType    class for the layers as a string
 * @param  {int} imageCounter    id for each div element per layer
 * @return {undefined}           function does not return anything
 */
function createCards(section, layerType, imageCounter) {
    var div = document.createElement("div");
    div.className = layerType;
    div.id = "square" + imageCounter;
    div.content = "";
    section.appendChild(div);
    var divContainer = document.getElementById(div.id);
    var img = document.createElement("img");
    img.className = "img";
    if (div.className == 'topLayer') {
        img.style.backgroundImage = layer1Images[imageCounter];
        div.style.outline = '1px solid black';
        img.id = "key" + alphabetArray[imageCounter];
    } else if (div.className == 'middleLayer') {
        if (layer2Counter == 8) {
            layer2Counter = 0;
        }
        img.style.backgroundImage = layer2Images[layer2Counter];
        layer2Counter++;
    }
    divContainer.appendChild(img);
}
/**
 * handleClickedCard - description
 * this function checks if the the click vent came from mouse or  keyboard
 * checks if layer1 content is paired and flipped cards index does not equal i
 * which checks if card has been already paired or is the currently the first card being flipped searching for its pair
 * this avoids checking duplicates and same card comparisons
 * then checks compares event.id with vacant non flipped cards
 * if true pushes card to flippedcard array and loops through to update clicked card
 *
 * @param  {object} event event either of click of keyboard fired by keyup or click listener added in init function
 * @return {undefined}       undefined
 */
function handleClickedCard(event) {
    for (var i = 0; i < layer1.length; i++) {
      if (event.target.id !== "container"){
        if (layer1[i].content !== "paired" && flippedCards[0] !== i) {
            if (event.target.parentElement.id == layer1[i].id ||
                (event.which > 64 && event.which < 81 && String.fromCharCode(event.which).toLowerCase() == alphabetArray[i])) {
                flippedCards.push(i);
                loopThroughCards(i);
                break;
            }
        }
    }
  }
}
/**
 * loopThroughCards - recieves index from handledClickCard loop of matching card from vacant cards that
 * have been non flipped.
 * checks if flippedcards is 2 and removes all click and keyboard event listeners so only
 * 2 cards may be flipped at a time
 * then checks if 2 cards that are flippped match with the checkForPair function
 * @param  {int} i index from current handledClickCard function loop from event
 * @return {undefined}   undefined
 */
function loopThroughCards(i) {
    layer1[i].style.visibility = 'hidden';
    layer1[i].content = "flipped";
    var delay = 700;
    if (flippedCards.length == 2) {
        removeEvent(document, "keyup", handleClickedCard);
        removeEvent(document.getElementById("newGame"), "click", newGame);
        removeEvent(document.getElementById("endGame"), "click", endGame);
        removeEvent(container, "click",  handleClickedCard);
        setTimeout(function() {
            checkForPair();
        }, delay);
    }
}
/**
 * checkForPair - description
 * since flipped cards has a length of 2 from the previous function it checks if their contents are equal to each other
 * if they are equal make them both hidden otherwise reset flipped cards
 * if the cards matched cardsmatched is incremented by 2 and checks if the game is over
 * if cardsMatched = 16 increment l3Counter for new background image
 * if flipped cards do not equal make them visible again
 * after logic check addEventListener to cards again for keyboard and click events
 * @return {undefined}  description
 */
function checkForPair() {
    if (layer2[flippedCards[0]].firstChild.style.backgroundImage == layer2[flippedCards[1]].firstChild.style.backgroundImage) {
        for (var j = 0; j < 2; j++) {
            layer1[flippedCards[j]].content = "paired";
            layer1[flippedCards[j]].style.visbility = 'hidden';
            layer2[flippedCards[j]].style.visbility = 'hidden';
            layer2[flippedCards[j]].firstChild.style.visibility = 'hidden';
        }
        CardsMatched += 2;
        if (CardsMatched == 16) {
            newGame();
            l3Counter++;
            layer3.style.backgroundImage = layer3Images[l3Counter];
            alert("You beat level " + l3Counter + "!");
            CardsMatched = 0;
            if (l3Counter == 5) {
                alert("You beat all the levels good job!!");
                l3Counter = 0;
            }
        }
    } else {
        for (var i = 0; i < layer1.length; i++) {
            if (layer1[i].content == "flipped") {
                layer1[i].style.visibility = 'visible';
                layer1[i].content = "";
            }
        }
    }
    document.addEventListener("keyup", handleClickedCard);
    for (var k = 0; k < layer1.length; k++) {
      addEvent(layer1[k], "click", handleClickedCard);
    }
    addEvent(document.getElementById("newGame"), "click", newGame);
    addEvent(document.getElementById("endGame"), "click", endGame);
    flippedCards = [];
}
/**
 * howToPlay - description
 * took the liberty to build a popup how to play div element
 * that is appended every time the user clicks how to play
 *
 *
 * @param  {object} event click event not keyboard
 * @return {undefined}       description
 */
function howToPlay(event) {
    if (this.id == "howToPlayLink") {
        if (document.getElementById("helpWindow") == undefined) {
            var div = document.createElement("div");
            div.className = "howToPlay";
            div.style.width = "28%";
            div.style.height = "55%";
            div.style.marginTop = "50px";
            div.id = "helpWindow";
            div.content = "helpWindowVisible";
            div.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
            div.style.wordWrap = "break-word";
            div.style.whiteSpace = "pre-line";
            div.style.color = "#fff";
            div.content = "helpWindowVisible"
            var instructions = document.createElement("h3");
            instructions.textContent = "1. Turn over 1 card and try to find a match.\r\n\r\n" +
                "2. You can flip a card by either clicking on square or entering letter on keyboard\r\n\r\n" +
                "3. If a matched pair is found the squares will disapear and uncover the hidden picture.\r\n\r\n" +
                "4. The End Game button flips all cards back the way they were at the start and does not re shuffle hidden pictures underneath.\r\n\r\n" +
                "5. The New Game button flips all cards back the way they were at the start of the game and reshuffles hidden pictures .\r\n\r\n" +
                "6. There are 5 images in total to uncover and will change once a game is complete.\r\n\r\n"
            div.appendChild(instructions);
            document.body.appendChild(div);
        } else {
            var div = document.getElementById("helpWindow");
            div.parentNode.removeChild(div);
            addEvent(document.getElementById("howToPlayLink"), "click", howToPlay);
        }
    }
}
/**
 * layer2ImageShuffle - description
 * shuffles the layer2images with a generic selection sort random variable to index
 *
 * @return {undefined}  undefined
 */
function layer2ImageShuffle() {
    var i = layer2Images.length,
        j, temp;
    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        temp = layer2Images[j];
        layer2Images[j] = layer2Images[i];
        layer2Images[i] = temp;
    }
}

/**
 * newGame - description
 *
 * @return {undefined}  description
 */
function newGame() {
  CardsMatched = 0;
    layer2ImageShuffle();
    for (var i = 0; i < layer2.length; i++) {
        layer2[i].firstChild.style.backgroundImage = layer2Images[i];
        faceDown(i);
    }
    flippedCards = [];
}

/**
 * endGame - description
 *
 * @return {undefined}  description
 */
function endGame() {
  CardsMatched = 0;
    for (var i = 0; i < layer1.length; i++) {
        for (var j = 0; j < layer1.length; j++) {
            faceDown(j);
        }
    }
    flippedCards = [];
}

/**
 * faceDown - description
 * method that recieves an index from newgame or endGame
 * makes cards face down
 * @param  {type} j index from newgame or endgame
 * @return {undefined}   description
 */
function faceDown(j) {
    layer1[j].content = "";
    layer1[j].style.visibility = 'visible';
    layer2[j].style.visibility = 'visible';
    layer2[j].firstChild.style.visibility = 'visible';
}

/**
 * addEvent - description
 * eventlistener helpermethod to add event listerner for both
 * modern and older browsers
 * @param  {document} obj  description
 * @param  {function} type description
 * @param  {function} fn   description
 * @return {undefined}      description
 */
function addEvent(obj, type, fn) {
    // check whether obj exists and whether obj has addEventListener
    if (obj && obj.addEventListener) {
        // modern browser
        obj.addEventListener(type, fn, false);
    }
    else if (obj && obj.attachEvent) {
      // Older IE
        obj.attachEvent("on" + type, fn);
    }
}

/**
 * removeEvent - description
 * eventlistener helpermethod to remove event listerner for both
 * modern and older browsers
 *  @param  {document} obj  description
 * @param  {function} type description
 * @param  {function} fn   description
 * @return {undefined}      description
 */
function removeEvent(obj, type, fn) {
    // check whether obj exists and whether obj has addEventListener
    if (obj && obj.removeEventListener) {
        // modern browser
        obj.removeEventListener(type, fn, false);
    }
    else if (obj && obj.removeEvent) {
      // Older IE
      obj.detachEvent("on" + type, fn);
    }

}
