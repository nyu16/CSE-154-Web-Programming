/**
 * Nicholas Yu
 * CSE154 AM
 * May 12th, 2021
 *
 * Javascript file that executes functions and lines to GET and POST information
 * from CSE154 webservices. Actively utilizes fetch functions as well as other
 * promise functions to allow for the Pokemon game to operate.
 */

"use strict";

(function() {
  window.addEventListener("load", init);

  const BASE_URL = "https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/";
  const POKE_NAME = "pokedex.php?pokedex=all";
  const POKE_DATA = "pokedex.php?pokemon=";
  const GAME_PHP = "game.php";

  let pokemons = [];
  let gameID;
  let playerID;

  /**
   * init function called on window load. Beginning of all operations.
   */
  function init() {
    fetchPics();
  }

  /**
   * function that fetches image information from the CSE154 with the provided
   * API (POKE_NAME). Catches any occuring error and outputs them through
   * console logs.
   */
  function fetchPics() {
    fetch(BASE_URL + POKE_NAME)
      .then(statusCheck)
      .then(res => res.text())
      .then((response) => {
        genPics(response);
      })
      .catch(console.error);
  }

  /**
   * Called during the fetch and following operations. With the given parameter,
   * the function appends images on the Pokedex board. Sets 3 pokemons as default
   * pokemons in our pokedex.
   * @param {Text} response Text response received from the CSE154 website.
   */
  function genPics(response) {
    response = response.trim().split(/:|\n/);
    for (let i = 1; i < response.length; i += 2) {
      let img = document.createElement("img");
      pokemons.push(response[i]);

      img.src = BASE_URL + "sprites/" + response[i] + ".png";
      img.alt = response[i - 1];
      img.classList.add("sprite");
      img.addEventListener("click", function() {
        fetchPokeInfo(this);
      });
      img.setAttribute('id', response[i]);

      if (response[i] === 'bulbasaur' || response[i] === 'charmander' ||
        response[i] === 'squirtle') {
        img.classList.add("found");
      }

      id("pokedex-view").appendChild(img);
    }
  }

  /**
   * function to fetch the information of the pokemon found and selected by
   * player. With specific APIs and the base url, calls in a Json data of
   * the selected pokemon. Catches any error and logs them on console.
   * @param {Node} poke node of the pokemon selected.
   */
  function fetchPokeInfo(poke) {
    if (poke.classList.contains("found")) {
      fetch(BASE_URL + POKE_DATA + poke.id)
        .then(statusCheck)
        .then(res => res.json())
        .then((res) => {
          cleanCard("p1");
          pokeInfo(res, "p1");
          id("start-btn").classList.remove("hidden");
          id("start-btn").addEventListener("click", gameInit);
        })
        .catch(console.error);
    }
  }

  /**
   * function for displaying Json information we've received from the fetch
   * process after parsing the Json file. Displays information of the selected
   * pokemon for player 1 revealing some hidden elements as well.
   * @param {JSON} response Parsed json file fetched from the web.
   * @param {string} player string for player number.
   */
  function pokeInfo(response, player) {
    let deck = id(player);
    let images = response.images;

    deck.querySelector(".name").textContent = response.name;
    deck.querySelector(".pokepic").src = BASE_URL + images.photo;
    deck.querySelector(".type").src = BASE_URL + images.typeIcon;
    deck.querySelector(".weakness").src = BASE_URL + images.weaknessIcon;
    if (response['current-hp'] || response['current-hp'] === 0) {
      deck.querySelector(".hp").textContent = response['current-hp'] + "HP";
    } else {
      deck.querySelector(".hp").textContent = response.hp + "HP";
    }
    deck.querySelector(".info").textContent = response.info.description;

    healthBarUpdate(response, deck);
    buttonUpdate(response, deck);
  }

  /**
   * Updates the health bar of pokemons after being initialized and during
   * combat. Changes the health bar to red bar once it reaches below 20%
   * and calls end once one of the health bars reach 0%.
   * @param {JSON} response Parsed Json file fetched from CSE154 web
   * @param {Node} deck node with id of either player 1 or player 2
   */
  function healthBarUpdate(response, deck) {
    const hundred = 100;
    const lowHP = 20;

    if (!qs(".hp-info").classList.contains("hidden")) {
      let hpBar = deck.querySelector(".health-bar");
      let remainHP = response['current-hp'] / response['hp'] * hundred;
      hpBar.style.width = remainHP + "%";
      if (remainHP < lowHP) {
        hpBar.classList.add("low-health");
      } else {hpBar.classList.remove("low-health");}
      if (remainHP <= 0) {
        endGame();
      }
    }
  }

  /**
   * Updates the move buttons. Enables them , changes icons, adds DP information
   * based on parsed Json data and hides any unused or unfilled move button.
   * @param {JSON} response parsed Json data from CSE154 web
   * @param {Node} deck node with id of either player 1 or player 2
   */
  function buttonUpdate(response, deck) {
    let moveDiv = deck.querySelector(".moves").querySelectorAll("button");

    for (let x = 0; x < moveDiv.length; x++) {
      moveDiv[x].classList.add("hidden");
    }
    for (let i = 0; i < response.moves.length; i++) {
      moveDiv[i].classList.remove("hidden");
      moveDiv[i].querySelector(".move").textContent = response.moves[i].name;
      moveDiv[i].querySelector("img").src =
          BASE_URL + "icons/" + response.moves[i].type + ".jpg";
      if (response.moves[i].dp) {
        moveDiv[i].querySelector(".dp").textContent = response.moves[i].dp + " DP";
      }
    }
  }

  /**
   * resets the card features such as icons, name, description, and etc.
   * to default when switching in between pokemon cards. Disables all move
   * buttons.
   * @param {string} player string of either player 1 or player 2
   */
  function cleanCard(player) {
    let deck = id(player);
    let buttons = deck.querySelector(".moves").querySelectorAll("button");
    let defIcon = BASE_URL + "icons/fighting.jpg";

    deck.querySelector(".name").textContent = "Pokemon Name";
    deck.querySelector(".type").src = BASE_URL + "icons/normal.jpg";
    deck.querySelector(".pokepic").src = BASE_URL + "images/pokeball.png";
    deck.querySelector(".weakness").src = defIcon;
    deck.querySelector(".hp").textContent = "60HP";
    deck.querySelector(".info").textContent = "description here";

    for (let x = 0; x < buttons.length; x++) {
      buttons[x].classList.remove("hidden");
      buttons[x].querySelector(".dp").innerHTML = "";
      buttons[x].querySelector(".move").textContent = "Move Name Here";
      buttons[x].querySelector("img").src = defIcon;
      buttons[x].disabled = true;
    }
  }

  /**
   * sets the html to battle page. Reveals certain buttons, removes pokedex,
   * shows image of player 2, and enables the move buttons for the game to
   * be playable.
   */
  function gameInit() {
    let pokemon = qs("#p1 .name").textContent;
    pokemon = letterConvert(pokemon);

    switchView();

    id("start-btn").classList.add("hidden");
    id("flee-btn").classList.remove("hidden");
    id("flee-btn").addEventListener("click", gamePlay);

    let data = new FormData();
    data.append('startgame', 'true');
    data.append('mypokemon', pokemon);
    postPoke(data);

    let myBtns = qs("#p1 .moves").querySelectorAll("button");
    for (let i = 0; i < myBtns.length; i++) {
      myBtns[i].disabled = false;
      myBtns[i].addEventListener("click", gamePlay);
    }
  }

  /**
   * POST operation that sends the data of mypokemon and startgame, and receives
   * Json file from the PHP server based on the sent data. Catches any errors
   * thrown and logs them on console.
   * @param {FormData} data data appended with information mypokemon and startgame
   */
  function postPoke(data) {
    fetch(BASE_URL + GAME_PHP, {method: 'POST', body: data})
      .then(statusCheck)
      .then(res => res.json())
      .then((res) => {
        gameID = res.guid;
        playerID = res.pid;
        pokeInfo(res.p1, "p1");
        pokeInfo(res.p2, "p2");
        turnResults(res.results);
        id("loading").classList.add("hidden");
      })
      .catch(console.error);
  }

  /**
   * forms data based player's decision to flee, attack with a pokemon,
   * game id and player id. Loads loading animation while waiting for
   * the data to be fetched.
   */
  function gamePlay() {
    let data = new FormData();
    let move;
    if (this.id === "flee-btn") {
      move = "flee";
    } else {
      move = this.querySelector(".move").textContent;
    }

    move = letterConvert(move);

    data.append('move', move);
    data.append('guid', gameID);
    data.append('pid', playerID);

    id("loading").classList.remove("hidden");

    postPoke(data);
  }

  /**
   * Displays moves made by each player based on data received from
   * parsed Json file. If player 2's moves return as null, then the
   * texts are not shown.
   * @param {JSON} response parsed JSON file received from fetch.
   */
  function turnResults(response) {
    if (typeof (response) !== 'undefined') {
      let p1 = id("p1-turn-results");
      let p2 = id("p2-turn-results");

      id("results-container").classList.remove("hidden");
      p1.classList.remove("hidden");
      p2.classList.remove("hidden");
      p1.textContent = "Player 1 played " + response['p1-move'] + " and " +
        response['p1-result'];
      if (response['p2-result'] !== null) {
        p2.textContent = "Player 2 played " +
            response['p2-move'] + " and " + response['p2-result'];
      } else {
        p2.classList.add("hidden");
      }
    }
  }

  /**
   * function to end the 'battle' and switched the display back to pokedex.
   * Add hidden classes to necessary elements and removes from some other.
   * Keeps the pokemon on the deck. If player 1 has defeated player 2 then
   * the defeated pokemon is added to the pokedex.
   */
  function endGame() {
    id("flee-btn").classList.add("hidden");

    if (id("p2").querySelector(".health-bar").style.width === "0%") {
      qs("h1").textContent = "You won!";
      let collect = letterConvert(id("p2").querySelector(".name").textContent);
      id(collect).classList.add("found");
    } else {
      qs("h1").textContent = "You lost!";
    }

    let moves = id("p1").querySelector(".moves");
    let moveBtns = moves.querySelectorAll("button");
    for (let i = 0; i < moveBtns.length; i++) {
      moveBtns[i].disabled = true;
    }

    id("endgame").classList.remove("hidden");
    id("endgame").addEventListener("click", reset);
  }

  /**
   * additional function to the endGame function. Mainly helps to
   * remove the endgame button and show the start button, and call
   * the necessary function to maintain the current pokemon for
   * player 1.
   */
  function reset() {
    let pokemon = letterConvert(id("p1").querySelector(".name").textContent);

    switchView();
    id("endgame").classList.add("hidden");
    id("start-btn").classList.remove("hidden");
    fetchPokeInfo(id(pokemon));
  }

  /**
   * Switches the window displays from pokemon battle to player 1's
   * pokedex by toggling 'hidden' classes for different elements.
   * Changes the header text content to better show which page the
   * user is on.
   */
  function switchView() {
    id("pokedex-view").classList.toggle("hidden");
    id("p2").classList.toggle("hidden");
    id("results-container").classList.toggle("hidden");
    qs(".hp-info").classList.toggle("hidden");
    if (id("pokedex-view").classList.contains("hidden")) {
      qs("h1").textContent = "Pokemon Battle!";
    } else {
      qs("h1").textContent = "Your Pokedex";
    }
  }

  /**
   * receives a string to be 'trimmed'. In specific all dots, quotation
   * marks, and spaces are removed and/or replaced with dashes if
   * necessary and returns the edited word.
   * @param {String} word string to be modified
   * @returns {String} modified string
   */
  function letterConvert(word) {
    word = word.replace(/([\s)'"])+/g, '');
    word = word.replace(/([.(])+/g, '-');
    word = word.toLowerCase();

    return word;
  }

  /* ------------------------------ Helper Functions  ------------------------------ */
  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

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
})();