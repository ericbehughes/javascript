// 1412844 Eric Hughes
"use strict";
// setup my own global namespace
var g = {
    memoryboard: {},
    layer1: {},
    layer2: {}, // = document.getElementsByClassName('middleg.layer');
    layer3: {}, // = document.getElementById("g.layer3"); // might need to change to bottom g.layer
    flippedCards: [], // array of size 2 that contains 2 cards during match check
    CardsMatched: 0, // counter of matched pairs
    layer3Counter: 0, // counter for g.layer3 images array as user progresses through levels
    layer2Counter: 0, // identifier for the ids of secondlayer
    alphabetArray: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p"],
    layer1Images: [ // cached images urls for g.layer1
        "../images/alphabet/a.png", "../images/alphabet/b.png", "../images/alphabet/c.png",
        "../images/alphabet/d.png", "../images/alphabet/e.png", "../images/alphabet/f.png",
        "../images/alphabet/g.png", "../images/alphabet/h.png", "../images/alphabet/i.png",
        "../images/alphabet/j.png", "../images/alphabet/k.png", "../images/alphabet/l.png",
        "../images/alphabet/m.png", "../images/alphabet/n.png", "../images/alphabet/o.png",
        "../images/alphabet/p.png"
    ], // cached images urls for g.layer1
    layer2Images: [
        "../images/layer2images/apple.png", "../images/layer2images/bee.png", "../images/layer2images/cat.png",
        "../images/layer2images/dog.png", "../images/layer2images/egg.png", "../images/layer2images/flower.png",
        "../images/layer2images/goose.png", "../images/layer2images/hat.png",
    ], // cached images urls for layer1
    layer3Images: [
        "../images/layer3images/dinosaur1_background.png", "../images/layer3images/dinosaur2_background.png", "../images/layer3images/dinosaur3_background.png",
        "../images/layer3images/dinosaur4_background.png", "../images/layer3images/dinosaur5_background.png",
    ],
};

/**
 *  main initialization of script
 */
addEvent(document, "DOMContentLoaded", init);
/**
 */
function init() {
    cacheImages();
    g.layer3 = document.getElementById("layer3");
    g.layer3.style.backgroundImage = "url(" + g.layer3Images[g.layer3Counter] + ")";
    populateMemoryBoard();
    g.layer1 = document.getElementsByClassName('topLayer');
    g.layer2 = document.getElementsByClassName('middleLayer');
    g.memoryboard =  document.getElementById('container');
    addEvent(document.getElementById("howToPlayLink"), "click", howToPlay);
    addEvent(g.memoryboard, "click", handleClickedCard);
    addEvent(document, "keyup", handleClickedCard);
}
/**
 * cacheImages()
 * cache all images from all 3 arrays in global namespace
 */
function cacheImages() {
    //concat all images in array for caching loop
    var array = g.layer1Images.concat(g.layer2Images, g.layer3Images);
    var pic = new Image();
    for (var i = 0; i < array.length; i++) {
        pic.backgroundImage = "url(" + array[i] + ")";
    }
}
/**
 * populateMemoryBoard
 *   3 layers inside gameboard
 *   shuffles array of pictures in layer2Images
 *   creates div>img for every cell
 */
function populateMemoryBoard() {
    var imageCounter = 0;
    var layerType = "topLayer";
    for (var i = 1; i <= 2; i++) {
        var section = document.getElementById("layer" + i);
        for (var j = 0, n = 16; j < n; j++) {
            if (i == 2 && j == 0 || j ==8) {
                layer2ImageShuffle();
            }
            createCards(section, layerType, imageCounter);
            imageCounter = imageCounter + 1;
        }
        layerType = "middleLayer";
    }
}

/**
 * createCards - method creates div and img elements on the page
 * checks if g.layerType is top or middle and choses which images to use
 * appends key + letter from alphabet array to the img elements in the top g.layer
 * @param  {section} section     section html element
 * @param  {string} layerType    class for the g.layers as a string
 * @param  {int} imageCounter    id for each div element per g.layer
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
        img.style.backgroundImage = "url(" + g.layer1Images[imageCounter] + ")"
        img.id = "key" + g.alphabetArray[imageCounter];
    } else if (div.className == 'middleLayer') {
        if (g.layer2Counter == 8) {
            g.layer2Counter = 0;
        }
        img.style.backgroundImage = "url(" + g.layer2Images[g.layer2Counter] + ")";
        g.layer2Counter++;
    }
    divContainer.appendChild(img);
}
/**
 * handleClickedCard - description
 * this function checks if the the click event came from mouse or  keyboard
 * checks if g.layer1 content is paired and flipped cards index does not equal
 * @param  {object} event event either of click of keyboard fired by keyup or click listener added in init function
 */
function handleClickedCard(event) {
    for (var i = 0; i < g.layer1.length; i++) {
        if (event.target.id !== "container") {
            if (g.layer1[i].content !== "paired" && g.flippedCards[0] !== i) {
                if (event.target.parentElement.id == g.layer1[i].id ||
                    (event.which > 64 && event.which < 81 && String.fromCharCode(event.which).toLowerCase() == g.alphabetArray[i])) {
                    g.flippedCards.push(i);
                    hideCard(i);
                    break;
                }
            }
        }
    }
}
/**
 * loopThroughCards - receives index from handledClickCard loop of matching card from vacant cards that
 * have been non flipped.
 * removes all click and key listeners
 * then checks if 2 cards that are flippped match with the checkForPair function
 * @param  {int} i index from current handledClickCard function loop from event
 */
function hideCard(i) {
    g.layer1[i].style.visibility = 'hidden';
    g.layer1[i].content = "flipped";
    removeListeners();
}

/**
 * loopThroughCards - receives index from handledClickCard loop of matching card from vacant cards that
 * have been non flipped.
 * removes all click and key listeners
 * then checks if 2 cards that are flippped match with the checkForPair function
 * @param  {int} i index from current handledClickCard function loop from event
 */
function removeListeners(){
  var delay = 600;
  if (g.flippedCards.length == 2) {
      removeEvent(document, "keyup", handleClickedCard);
      removeEvent(g.memoryboard, "click", handleClickedCard);
      setTimeout(function() {
          checkForPair();
      }, delay);
  }
}

/**
 * checkForPair -if img url contents are equal to each other
 * if they are equal make them both hidden otherwise reset flipped cards
 * if the cards matched g.CardsMatched is incremented by 2
 * if g.CardsMatched = 16 new background image
 * add event listneners
 */
function checkForPair() {
    if (g.layer2[g.flippedCards[0]].firstChild.style.backgroundImage == g.layer2[g.flippedCards[1]].firstChild.style.backgroundImage) {
        for (var j = 0; j < 2; j++) {
            g.layer1[g.flippedCards[j]].content = "paired";
            g.layer1[g.flippedCards[j]].style.visbility = 'hidden';
            g.layer2[g.flippedCards[j]].style.visbility = 'hidden';
            g.layer2[g.flippedCards[j]].firstChild.style.visibility = 'hidden';
        }
        g.CardsMatched += 2;
        if (g.CardsMatched == 16) {
            newGame();
            g.layer3Counter++;
            if (g.layer3Counter == 4) {
                alert("You beat all the levels good job!!");
                g.layer3Counter = 0;
            }
            else{
                alert("You beat level " + g.layer3Counter + "!");
            }
            g.layer3.style.backgroundImage = "url(" + g.layer3Images[g.layer3Counter] + ")";
        }
    } else {
        for (var i = 0; i < g.layer1.length; i++) {
            if (g.layer1[i].content == "flipped") {
                g.layer1[i].style.visibility = 'visible';
                g.layer1[i].content = "";
            }
        }
    }
    addEvent(document, "keyup", handleClickedCard);
    addEvent(document.getElementById("newGame"), "click", newGame);
    addEvent(document.getElementById("endGame"), "click", endGame);
    addEvent(g.memoryboard, "click", handleClickedCard);
    g.flippedCards = [];
}
/**
 * howToPlay - took the liberty to build a popup how to play div element
 * that is appended every time the user clicks how to play
 * @param  {object} event click event not keyboard
 */
function howToPlay(event) {
    if (this.id == "howToPlayLink") {
        if (document.getElementById("helpWindow") == undefined) {
            var div = document.createElement("div");
            div.className = "howToPlay";
            div.style.width = "24%";
            div.style.height = "60%";
            div.style.marginTop = "1px";
            div.id = "helpWindow";
            div.content = "helpWindowVisible";
            div.style.backgroundColor = "#fff";
            div.style.wordWrap = "break-word";
            div.style.whiteSpace = "pre-line";
            div.style.color = "#000";
            div.style.float = "left";
            div.content = "helpWindowVisible"
            var instructions = document.createElement("h3");
            instructions.textContent = "1. Turn over 1 card and try to find a match.\r\n\r\n" +
                "2. You can flip a card by either clicking on square or entering letter on keyboard\r\n\r\n" +
                "3. If a matched pair is found the squares will disapear and uncover the hidden picture.\r\n\r\n" +
                "4. The End Game button flips all cards back the way they were at the start and does not re shuffle hidden pictures underneath.\r\n\r\n" +
                "5. The New Game button flips all cards back the way they were at the start of the game and reshuffles hidden pictures .\r\n\r\n" +
                "6. There are 5 images in total to uncover and will change once a game is complete.\r\n\r\n"
              div.appendChild(instructions)
          var parentDiv = g.memoryboard.parentNode;
          parentDiv.insertBefore(div,g.memoryboard);

        } else {
            var div = document.getElementById("helpWindow");
            div.parentNode.removeChild(div);
            addEvent(document.getElementById("howToPlayLink"), "click", howToPlay);
        }
    }
}
/**
 * g.layer2ImageShuffle - description
 * shuffles the g.layer2images with a generic selection sort random variable to index
 */
function layer2ImageShuffle() {
    var i = g.layer2Images.length;
    var j = 0;
    var temp;
    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        temp = g.layer2Images[j];
        g.layer2Images[j] = g.layer2Images[i];
        g.layer2Images[i] = temp;
    }
}

/**
 * newGame - new game fired when all cards matched
 * resets g.CardsMatched and reshuffles all images for new game
 */
function newGame() {
    g.CardsMatched = 0;
    var counter = 0;
    for (var i = 0; i < 16; i++) {
        if (i == 0 || i == 8) {
            layer2ImageShuffle();
            counter = 0;
        }
        g.layer2[i].firstChild.style.backgroundImage = "url(" + g.layer2Images[counter]+")";
        counter++;
        faceDown(i);
  }
      g.flippedCards = [];
}

/**
 * endGame - description
 * makes every card face down
 * is called when user clicks end game
 */
function endGame() {
    g.CardsMatched = 0;
    for (var i = 0; i < g.layer1.length; i++) {
        for (var j = 0; j < g.layer1.length; j++) {
            faceDown(j);
        }
    }
    g.flippedCards = [];
}

/**
 * faceDown - receives an index from newgame or endGame
 * makes cards face down
 * @param  {type} //index from newgame or endgame
 */
function faceDown(j) {
    g.layer1[j].content = "";
    g.layer1[j].style.visibility = 'visible';
    g.layer2[j].style.visibility = 'visible';
    g.layer2[j].firstChild.style.visibility = 'visible';
}

/**
 * addEvent - eventlistener helpermethod to add event listerner for both
 * modern and older browsers
 * @param  {document} obj
 * @param  {function} type
 * @param  {function} fn
 */
function addEvent(obj, type, fn) {
    // check whether obj exists and whether obj has addEventListener
    if (obj && obj.addEventListener) {
        // modern browser
        obj.addEventListener(type, fn, false);
    } else if (obj && obj.attachEvent) {
        // Older IE
        obj.attachEvent("on" + type, fn);
    }
}

/**
 * removeEvent - eventlistener helpermethod to remove event listerner for both
 * modern and older browsers
 *  @param  {document} obj
 * @param  {function} type
 * @param  {function} fn
 */
function removeEvent(obj, type, fn) {
    // check whether obj exists and whether obj has addEventListener
    if (obj && obj.removeEventListener) {
        // modern browser
        obj.removeEventListener(type, fn, false);
    } else if (obj && obj.removeEvent) {
        // Older IE
        obj.detachEvent("on" + type, fn);
    }

}
