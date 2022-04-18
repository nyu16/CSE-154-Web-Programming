/**
 * Nicholas Yu
 * CSE154 AD
 * May 29th, 2021
 * Javascript file for displaying all the posts on Yip as
 * well as receiving user responses and behabiors and
 * displaying according information/posts. Utilizes several
 * GET and POST funcions to store client data and display
 * them.
 */
"use strict";

(function() {
  const BASE_URL = "/yipper";

  window.addEventListener("load", init);

  /**
   * function that loads different operations on the window's load
   */
  function init() {
    id("search-term").addEventListener('input', searchBtnUpdate);
    id("search-btn").addEventListener('click', searchYip);
    fetchPosts("/yips");
    id("home-btn").addEventListener('click', resetToHome);
    id("yip-btn").addEventListener("click", newYipPage);
  }

  /**
   * The function that disables the search button if there's nothing
   * or only spaces within the search bar. Checks the requirement
   * through regex.
   * @param {object} val - l
   */
  function searchBtnUpdate(val) {
    let txt = val.target.value;
    if (!txt.replace(/\s/g, '').length) {
      id("search-btn").disabled = true;
    } else {
      id("search-btn").disabled = false;
    }
  }

  /**
   * Function that hides the home page and shows the yip post page for
   * the user. Upon the submit button being clicked, forms the user's
   * input as a data and passes it into the POST function.
   */
  function newYipPage() {
    id("home").classList.add("hidden");
    id("new").classList.remove("hidden");

    qs("form").addEventListener("submit", function(evt) {
      evt.preventDefault();

      let data = new FormData();

      data.append("name", qs("input[name='name']").value);
      data.append("full", qs("input[name='full']").value);

      newYipPost(data);
    });
  }

  /**
   * blah
   * @param {FormData} data - blah
   */
  function newYipPost(data) {
    fetch("/yipper/new", {method: 'POST', body: data})
      .then(statusCheck)
      .then(res => res.json())
      .then(function(res) {
        errorDefault();
        prependNewYip(res);
        setTimeout(function() {
          qs("form").submit();
        }, 2000);
      })
      .catch(errorHandle());
  }

  /**
   * blah
   * @param {JSON} yip - blah
   */
  function prependNewYip(yip) {
    let post = document.createElement("artcile");
    post.classList.add("card");
    post.setAttribute('id', yip.id);

    let img = profImg(yip);
    let div1 = firstDiv(yip);
    let div2 = secondDiv(yip);

    post.appendChild(img);
    post.appendChild(div1);
    post.appendChild(div2);

    qs("input[name='name']").value = "";
    qs("input[name='full']").value = "";

    id("home").prepend(post);
  }

  /**
   * blah
   */
  function searchYip() {
    id("home").classList.remove("hidden");
    id("new").classList.add("hidden");
    id("user").classList.add("hidden");

    let url = "/yips?search=" + id("search-term").value;
    showSearch(url);
  }

  /**
   * search
   * @param {String} url - url
   */
  function showSearch(url) {
    fetch(BASE_URL + url)
      .then(statusCheck)
      .then(res => res.json())
      .then(function(res) {
        errorDefault();
        let posts = id("home").querySelectorAll(".card");

        for (let i = 0; i < posts.length; i++) {
          posts[i].classList.add("hidden");

          for (let x = 0; x < res.yips.length; x++) {
            if (parseInt(posts[i].id) === parseInt(res.yips[x].id)) {
              posts[i].classList.remove("hidden");
            }
          }
        }
      })
      .catch(errorHandle);
  }

  /**
   * blah
   * @param {string} URL - url
   */
  function fetchPosts(URL) {
    fetch(BASE_URL + URL)
      .then(statusCheck)
      .then(res => res.json())
      .then(function(res) {
        errorDefault();
        yipPosts(res.yips);
      })
      .catch(errorHandle());
  }

  /**
   * blah
   * @param {JSON} yips - blah
   */
  function yipPosts(yips) {
    id("home").innerHTML = "";

    for (let i = 0; i < yips.length; i++) {
      let post = document.createElement("artcile");
      post.classList.add("card");
      post.setAttribute('id', yips[i].id);

      let img = profImg(yips[i]);
      let div1 = firstDiv(yips[i]);
      let div2 = secondDiv(yips[i]);

      post.appendChild(img);
      post.appendChild(div1);
      post.appendChild(div2);

      id("home").appendChild(post);
    }
  }

  /**
   * blah
   * @param {JSON} yips - json
   * @return {object} - img
   */
  function profImg(yips) {
    let img = document.createElement("img");
    let src = yips.name.toLowerCase();

    src = src.replace(/\s+/g, "-");

    img.src = "img/" + src + ".png";
    img.alt = src;

    return img;
  }

  /**
   * blah
   * @param {JSON} yips - json
   * @returns {object} - blah
   */
  function firstDiv(yips) {
    let div1 = document.createElement("div");
    let name = document.createElement("p");
    let content = document.createElement("p");

    name.innerText = yips.name;
    name.classList.add("individual");
    name.addEventListener('click', usersYip);
    content.innerText = yips.yip + " #" + yips.hashtag;

    div1.appendChild(name);
    div1.appendChild(content);

    return div1;
  }

  /**
   * blah
   * @param {JSON} yips - json
   * @returns {object} - blah
   */
  function secondDiv(yips) {
    let div2 = document.createElement("div");
    let date = document.createElement("p");
    let heart = document.createElement("div");
    let heartImg = document.createElement("img");
    let heartNum = document.createElement("p");

    date.innerText = (new Date(yips.date)).toLocaleString();
    heartImg.src = "img/heart.png";
    heartNum.innerText = yips.likes;

    heart.appendChild(heartImg);
    heart.appendChild(heartNum);
    heartImg.addEventListener("click", likeUpdate);

    div2.appendChild(date);
    div2.appendChild(heart);
    div2.classList.add("meta");

    return div2;
  }

  /**
   * blah
   */
  function usersYip() {
    id("home").classList.add("hidden");
    id("new").classList.add("hidden");
    id('user').classList.remove("hidden");

    id("search-term").value = "";

    fetch(BASE_URL + "/user/" + this.innerText)
      .then(statusCheck)
      .then(res => res.json())
      .then(function(res) {
        errorDefault();
        usersPost(res);
      })
      .catch(errorHandle());
  }

  /**
   * mhm
   * @param {JSON} res - yea
   */
  function usersPost(res) {
    id("user").innerHTML = "";
    let num = 1;

    let article = document.createElement("article");
    let h2 = document.createElement("h2");
    article.classList.add("single");
    article.appendChild(h2);

    for (let i = 0; i < res.length; i++) {
      let para = document.createElement("p");

      h2.innerText = "Yips shared by " + res[i].name;
      para.innerText = "Yip " + num + ": " + res[i].yip + " #" + res[i].hashtag;

      article.appendChild(para);
      num += 1;
    }
    id("user").appendChild(article);
  }

  /**
   * for sth
   */
  function resetToHome() {
    let hidden = id("home").querySelectorAll(".card");

    for (let i = 0; i < hidden.length; i++) {
      hidden[i].classList.remove("hidden");
    }

    id("home").classList.remove("hidden");
    id("user").classList.add("hidden");
    id("new").classList.add("hidden");
    id("search-term").value = "";

    fetchPosts("/yips");
  }

  /**
   * id
   */
  function likeUpdate() {
    let data = new FormData();
    let parent = this.parentNode.parentNode.parentNode;
    let like = this.parentNode.querySelector("p");

    data.append('id', parent.id);

    fetch(BASE_URL + "/likes", {method: 'POST', body: data})
      .then(statusCheck)
      .then(res => res.text())
      .then(function(res) {
        errorDefault();
        like.innerText = res;
      })
      .catch(errorHandle());
  }

  /**
   * error default
   */
  function errorDefault() {
    id("yipper-data").classList.remove("hidden");
    id("error").classList.add("hidden");

    let nav = qs("nav");
    let buttons = nav.querySelectorAll("button");

    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = false;
    }
  }

  /**
   * errohandle
   */
  function errorHandle() {
    id("yipper-data").classList.add("hidden");
    id("error").classList.remove("hidden");

    let nav = qs("nav");
    let buttons = nav.querySelectorAll("button");

    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
  }

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
   * @param {string} id - element ID
   * @return {object} DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
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