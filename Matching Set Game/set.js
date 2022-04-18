/**
 * Nicholas Yu
 * CSE154 AM
 * April 28 2021
 * The javascript file functions to switch between menu and the game
 * screen and generate random and unique cards while providing with the
 * countdown timer. The script file consists of several different functions
 * each playing a role in generating unique card ID, toggling views
 * between menu and game, start timer, advance timer clock, and etc..
 */
"use strict";
(function() {

  let timerId;
  let remainingSeconds;
  const STYLES = ["solid", "outline", "striped"];
  const SHAPES = ["diamond", "oval", "squiggle"];
  const COLORS = ["green", "purple", "red"];
  const COUNTS = [1, 2, 3];
  const MINORSEC = 60;
  const ONESEC = 1000;

  window.addEventListener("load", init);

  /**
   * on window's load, the function is called and processes several
   * operations such as adding event listner to click events.
   */
  function init() {
    id("start-btn").addEventListener("click", function() {
      toggleViews();
      startTimer();
    });
    id("back-btn").addEventListener("click", function() {
      toggleViews();
      id("refresh-btn").disabled = false;
    });
    id("refresh-btn").addEventListener("click", genGameCards);
  }

  /**
   * returns nothing.
   * When called through an event listener the function 'toggles' in
   * between the menu screen and the game board.
   */
  function toggleViews() {
    let gameView = id("game-view");
    let menuView = id("menu-view");

    menuView.classList.toggle("hidden");
    gameView.classList.toggle("hidden");

    if (!gameView.classList.contains("hidden")) {
      id("set-count").textContent = 0;
      genGameCards();
    }
  }

  /**
   * keeps track of the set score on the game board. When called, updates
   * the score.
   * @param {boolean} score - whether the set is a correct set or not
   */
  function playGame(score) {
    let setCount = Number(id("set-count").textContent);
    if (score) {
      setCount++;
      id("set-count").textContent = setCount;
    }
  }

  /**
   * returns nothing. When called, the function lays out 9 to 12 cards
   * depending the level of difficulty the user chose. Initialize and
   * empties the board on default. When called upon refresh button, fills
   * the gmae board with new set of cards.
   */
  function genGameCards() {
    let board = id("board");
    let len = 12;
    board.innerHTML = "";

    if (qs("input").checked) {
      len = 9;
    }

    for (let i = 0; i < len; i++) {
      let card = generateUniqueCard(qs("input").checked);
      board.appendChild(card);
    }
  }

  /**
   * Depending on the level of difficulty the user chose, generates
   * cards with unique pattern. If the user chose an easy level, generates
   * only solid patterned cards.
   * @param {InputEvent} isEasy - accepts the level of difficulty users chose
   * @returns {Array} - array of unique pattern for a card
   */
  function generateRandomAttributes(isEasy) {
    let attributes = ["style", "shape", "color", "count"];

    attributes[0] = STYLES[Math.floor(Math.random() * 3)];
    if (isEasy) {
      attributes[0] = "solid";
    }
    attributes[1] = SHAPES[Math.floor(Math.random() * 3)];
    attributes[2] = COLORS[Math.floor(Math.random() * 3)];
    attributes[3] = COUNTS[Math.floor(Math.random() * 3)];

    return attributes;
  }

  /**
   * Accepts user's choice of level of difficulty, generates a 'card',
   * or a div element that contains a number of images with the given
   * pattern from the generateRandomAttributes function. Returns the
   * completed card.
   * @param {InputEvent} isEasy - the level of difficulty user chose
   * @returns {Element} - created div element with unique pattern of images
   */
  function generateUniqueCard(isEasy) {
    let atr = generateRandomAttributes(isEasy);
    let uniqueAtr = atr[0] + '-' + atr[1] + '-' + atr[2] + '-' + atr[3];
    while (id(uniqueAtr)) {
      atr = generateRandomAttributes(isEasy);
      uniqueAtr = atr[0] + '-' + atr[1] + '-' + atr[2] + '-' + atr[3];
    }
    let atrCount = atr.splice(3, 1);
    let card = document.createElement("div");

    card.setAttribute("id", uniqueAtr);
    card.classList.add("card");

    for (let i = 0; i < atrCount; i++) {
      let cardImg = document.createElement('img');
      cardImg.src = "img/" + atr[0] + '-' + atr[1] + '-' + atr[2] + '.png';
      cardImg.alt = uniqueAtr;
      card.appendChild(cardImg);
    }

    card.addEventListener("click", cardSelected);

    return card;
  }

  /**
   * when called, the function starts the timer on the game board.
   * Constantly called advanceTimer function every second to change the
   * timer display on the game board. Sets timerId to null and
   * remainingSeconds variable to the time users chose. Returns
   * nothing.
   */
  function startTimer() {
    let select = qs("select");
    let time = select.options[select.selectedIndex].value;
    timerId = null;
    remainingSeconds = time;

    id("time").textContent = "0" + Math.floor(remainingSeconds / MINORSEC) + ":00";

    if (remainingSeconds < 0) {
      clearInterval(timerId);
      timerId = null;
      endGame();
    } else {
      timerId = setInterval(function() {
        advanceTimer();
      }, ONESEC);
    }
  }

  /**
   * when called every second, checks if the remainingSeconds hasn't gone
   * below 0. If it did, stops the timer and calls endGame function to
   * freeze all functions. Else modify the game timer every second/
   */
  function advanceTimer() {
    const BELOWTEN = 10;

    remainingSeconds--;

    if (!remainingSeconds < 0) {
      let minutes = Math.floor(remainingSeconds / MINORSEC);
      let seconds = remainingSeconds % MINORSEC;
      let time = id("time");

      if (seconds < BELOWTEN) {
        seconds = "0" + seconds;
      }
      time.textContent = "0" + minutes + ":" + seconds;
    }
  }

  /**
   * when called, freezes gameboard features such as clicking on cards
   * or refreshing the board. Disables the refresh button, removes
   * click event listener and removes selected class from all cards.
   */
  function endGame() {
    unSelect();
    id("refresh-btn").disabled = true;
    let board = qsa(".card");
    for (let i = 0; i < board.length; i++) {
      board[i].removeEventListener("click", cardSelected);
    }
  }

  /**
   * behavior for when a card is selected. Marks the chosen card with
   * "selected" class and checks if 3 cards have been chosen. When it is,
   * calls setOrNotSet function and passes down the selected node list.
   */
  function cardSelected() {
    this.classList.toggle("selected");

    if (qsa(".selected").length === 3) {
      setOrNotSet(qsa(".selected"));
    }

  }

  /**
   * Checks the received node list with isASet function, appends paragraph
   * elements to display whether the chosen set is the correct set or not,
   * and calls unSelect and replaceBack functions to revert the chosen cards to
   * normal.
   * @param {NodeList} chosen - list of nodes that were selected
   */
  function setOrNotSet(chosen) {
    let ids = [];
    let phrase = "Not a Set";
    let set = isASet(chosen);

    for (let i = 0; i < chosen.length; i++) {
      ids.push(chosen[i].id);
    }

    if (set) {
      ids = cardReplace(ids);
      phrase = "SET!";
      playGame(true);
    }

    for (let index = 0; index < 3; index++) {
      let para = document.createElement("p");
      para.textContent = phrase;
      id(ids[index]).appendChild(para);
      id(ids[index]).classList.add("hide-imgs");
    }

    unSelect();
    setTimeout(replaceBack, ONESEC);
  }

  /**
   * accepts a list of chosen card IDs as a parameter and replaces
   * the correct set cards with a new set of cards. Returns the list
   * with updated ID of the new cards.
   * @param {list} idList - current selected card IDs
   * @returns {list} - updated list of card IDs
   */
  function cardReplace(idList) {
    for (let x = 0; x < 3; x++) {
      let newCard = generateUniqueCard(qs("input").checked);

      id("board").replaceChild(newCard, id(idList[x]));
      idList[x] = newCard.id;
    }
    return idList;
  }

  /**
   * when called, reverts the view of the card from displayed paragraph
   * element back to the card images.
   */
  function replaceBack() {
    let hiddenImgs = qsa(".hide-imgs");
    for (let y = 0; y < 3; y++) {
      let curr = hiddenImgs[y].querySelector("p");
      hiddenImgs[y].removeChild(curr);
      id("board").querySelector(".hide-imgs").classList.remove("hide-imgs");
    }
  }

  /**
   * when called disables the behavior for selected set of cards.
   */
  function unSelect() {
    let slctd = qsa(".selected");
    for (let i = 0; i < slctd.length; i++) {
      slctd[i].classList.remove("selected");
    }
  }

  /**
   * Checks whether the chosen set is the correct set or not
   * @param {NodeList} selected - a node list of selected cards.
   * @return {boolean} - whether the set of cards is correct or not.
   */
  function isASet(selected) {
    let attribute = [];
    for (let i = 0; i < selected.length; i++) {
      attribute.push(selected[i].id.split("-"));
    }
    for (let i = 0; i < attribute[0].length; i++) {
      let diff = attribute[0][i] !== attribute[1][i] &&
      attribute[1][i] !== attribute[2][i] &&
      attribute[0][i] !== attribute[2][i];
      let same = attribute[0][i] === attribute[1][i] &&
      attribute[1][i] === attribute[2][i];
      if (!(same || diff)) {
        return false;
      }
    }
    return true;
  }

  /* --- CSE 154 HELPER FUNCTIONS --- */

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} name - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(name) {
    return document.getElementById(name);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns an array of elements matching the given query.
   * @param {string} query - CSS query selector.
   * @returns {array} - Array of DOM objects matching the given query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }
})();