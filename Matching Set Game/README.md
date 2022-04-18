# Homework 2 - Set! - Project Specification
***
<p>
  <img src="https://courses.cs.washington.edu/courses/cse154/21sp/homework/hw2/screenshots/spec-intro-view.png" width="60%" alt="Set! Game board">
</p>

This assignment extends what we've learned in Module 1 (HTML/CSS) and puts into practice what you're learning in Module 2 (JavaScript, DOM, and Animations) to build an interactive webpage! A fully-functional UI (user interface) takes more time to plan and implement than just an HTML/CSS webpage (such as the one you created in HW1). Since this assignment focuses on Module 2 material, we've provided all of the HTML and CSS to get you started.

## Assignment Overview
In this assignment you will use JS to add functionality to a basic webpage. Specifically, you will implement a web-based version of the Set card game, providing features to generate new games for a user and to keep track of how many correct Sets a player has found. You will also implement a basic timer for the user to keep track of how quickly it takes them to solve a given game. You can find a video demonstrating expected behavior for different cases on the [homework
page](https://courses.cs.washington.edu/courses/cse154/21sp/homework/hw2/hw2.mp4) of the course website.


### Rules of Set
This assignment is inspired by the classic SET! Card game. A game consists of a board of cards. Each card has one of three options for 4 different "attributes":

| Attribute | **Options**  | | |
|-------|---------|---------|----------|
| STYLE | solid   | outline | striped  |
| COLOR | green   | purple  | red      |
| SHAPE | diamond | oval    | squiggle |
| COUNT | 1       | 2       | 3        |

The goal of the game is to find as many "Sets" of 3 cards such that for each attribute, all cards share the attribute or no cards share the attribute. For example, the following three cards build a Set because none share style, color, or shape attributes but they all share the count attribute.

<p>
  <img src="https://courses.cs.washington.edu/courses/cse154/21sp/homework/hw2/screenshots/set-example.png" width="50%" alt="Example of something that is a set">
</p>


However, the following three cards do not form a Set since the color attribute does not follow the "all or none" requirement (purple is shared by the first and third card, but not the second).

<p>
  <img src="https://courses.cs.washington.edu/courses/cse154/21sp/homework/hw2/screenshots/not-set-example.png" width="50%" alt="Example of something that is not a Set">
</p>

You will be dynamically generating the board with JavaScript and use event listeners to support user interaction. You will also learn how to implement an increasing/decreasing game timer on this page, as well as how to show/hide feedback to users with a 1 second delay
