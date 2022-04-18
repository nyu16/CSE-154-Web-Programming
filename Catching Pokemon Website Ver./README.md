# Homework 3 - Pokedex - Project Specification

## Overview
This assignment is about using **AJAX** to fetch data in text and JSON format and process it
using DOM manipulation. You will only be writing JavaScript in this assignment - HTML and CSS are
provided!

<p>
  <img src="http://courses.cs.washington.edu/courses/cse154/21sp/homework/hw3/screenshots/overview-img.png" width="60%" alt="Pokedex main view">
</p>

In addition to this README.md, you will be able to find the video demonstrated the expected behavior of this assignment [here](https://courses.cs.washington.edu/courses/cse154/21sp/homework/hw3/homework3.mp4).

### Background Information
In this assignment, you will implement views for a Pokedex and two Pokemon cards. *(Note: You will not need
to know anything about the Pokemon game throughout this assignment, although we hope you enjoy
having a more fun twist to your homework!)* A Pokedex is an encyclopedia (or album) of different Pokemon
species, representing each Pokemon as a small "sprite" image. In this assignment, a **Pokedex** entry (referenced
by the sprite image) will link directly to a **Pokemon card**, which is a card of information for a single Pokemon
species, containing a larger image of the Pokemon, its type and weakness information, its set of moves, health
point data, and a short description.

Each Pokemon has one of 18 types (fire, water, grass, normal, electric, fighting, psychic, fairy, dark, bug, steel,
ice, ghost, poison, flying, rock, ground, and dragon) and one weakness type (also from this set of 18 types).
Again, you don’t need to know about the strength/weakness of different types - this information will be provided
to you as needed.

Here, we will simplify things by assuming that each Pokemon has no more than 4 moves (some have fewer, but
all Pokemon have at least one move). In addition, we assume that the complete Pokedex has 151 Pokemon
(more have been added over the game’s history, but these comprise the original set of Pokemon species).
