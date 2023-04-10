"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.array.unshift.js");
require("core-js/modules/es.array.sort.js");
class TrieNode {
  constructor(letter, originalIndex) {
    this.letter = letter;
    this.previousLetter = null;
    this.nextLetters = {};
    this.end = false;
    this.originalIndex = originalIndex;
    this.getWord = function () {
      let output = [];
      let node = this;
      while (node !== null) {
        output.unshift(node.letter);
        node = node.previousLetter;
      }
      const originalObject = {
        value: output.join(''),
        originalIndex: this.originalIndex
      };
      return originalObject;
    };
  }
}
class Trie {
  constructor() {
    this.root = new TrieNode(null);
    // inserts a word into the trie.
    this.insert = function (word, originalIndex) {
      // start at the root
      let node = this.root;
      // for every character in the word
      for (let i = 0; i < word.length; i++) {
        // check to see if character exists in nextLetters.
        if (!node.nextLetters[word[i]]) {
          // if it doesn't exist, then create new node.
          node.nextLetters[word[i]] = new TrieNode(word[i]);
          // also assign the previousLetter to the child node.
          node.nextLetters[word[i]].previousLetter = node;
        }
        // move to the next depth in the trie.
        node = node.nextLetters[word[i]];
        // check to see if we are on the last character.
        if (i === word.length - 1) {
          //Store the index from the original array
          node.originalIndex = originalIndex;
          // if so, set the end flag to true.
          node.end = true;
        }
      }
    };

    // returns every word with given prefix
    this.find = function (value) {
      let prefix = value.toLowerCase();
      let node = this.root;
      let output = [];
      // for every character in the prefix
      for (let i = 0; i < prefix.length; i++) {
        // make sure prefix has any possible words available
        if (node.nextLetters[prefix[i]]) {
          node = node.nextLetters[prefix[i]];
        } else if (node.nextLetters[prefix[i].toUpperCase()]) {
          node = node.nextLetters[prefix[i].toUpperCase()];
        } else {
          // if there are none then return it.
          return output;
        }
      }
      // find all words in the node that match
      findAllWords(node, output);
      return output.sort();
    };

    // find all words in the given node.
    const findAllWords = (node, arr) => {
      // base case, if node is at a word, push to output
      if (node.end) {
        arr.unshift(node.getWord());
      }
      // iterate through nextLetters, and find all possible matches with that prefix
      for (let child in node.nextLetters) {
        findAllWords(node.nextLetters[child], arr);
      }
    };

    // check if word is contained in trie.
    this.contains = function (word) {
      let node = this.root;
      // for every character in the word
      for (let i = 0; i < word.length; i++) {
        // check to see if character node exists in nextLetters.
        if (node.nextLetters[word[i]]) {
          // if it exists, proceed to the next depth of the trie.
          node = node.nextLetters[word[i]];
        } else {
          // doesn't exist, return false since it's not present.
          return false;
        }
      }
      // return true if word is at node end
      return node.end;
    };

    // removes the given word
    this.remove = function (word) {
      let root = this.root;
      if (!word) return;
      // recursively finds and removes a word
      const removeWord = (node, word) => {
        // check if current node contains the word
        if (node.end && node.getWord() === word) {
          // check and see if node has nextLetters
          let hasNextLetters = Object.letters(node.nextLetters).length > 0;
          // if has nextLetters just un-flag the end node that marks end of a word.
          // so it doesn't remove words that contain/include supplied word
          if (hasNextLetters) {
            node.end = false;
          } else {
            // remove word by getting previousLetter and setting nextLetters to empty dictionary
            node.previousLetter.nextLetters = {};
          }
          return true;
        }
        // recursively remove word from all nextLetters
        for (let letter in node.nextLetters) {
          removeWord(node.nextLetters[letter], word);
        }
        return false;
      };
      // call remove word on root node
      removeWord(root, word);
    };
  }
}
exports.default = Trie;