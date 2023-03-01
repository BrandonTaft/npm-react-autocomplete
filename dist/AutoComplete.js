"use strict";
import { createElement, Fragment } from "react";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const _default = AutoComplete;
export { _default as default };
import "core-js/modules/web.dom-collections.iterator.js";
import { useState, useRef, useEffect } from "react";
var _trie = _interopRequireDefault(require("./trie"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function AutoComplete(_ref) {
  let {
    list
  } = _ref;
  const [trie, setTrie] = (0, useState)();
  const [cached, setCached] = (0, useState)(false);
  const [suggestedWords, setSuggestedWords] = (0, useState)([]);
  const cursor = (0, useRef)(0);
  (0, useEffect)(() => {
    setTrie(new _trie.default());
    setCached(false);
  }, []);

  //If the Node isn't already initialized and once the list prop is loaded
  if (list && !cached && trie) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      trie.insert(item);
    }
    setCached(true);
  }
  const handlePrefix = e => {
    cursor.current = 0;
    const prefix = e.target.value;
    if (prefix.length > 0) {
      setSuggestedWords(trie.find(e.target.value));
    } else {
      setSuggestedWords([]);
    }
  };
  const handleKeyDown = e => {
    if (e.keyCode === 40 && cursor.current < suggestedWords.length - 1) {
      cursor.current++;
      document.getElementById("suggested-word-".concat(cursor.current)).style.backgroundColor = "blue";
      document.getElementById("suggested-word-".concat(cursor.current - 1)).style.backgroundColor = "white";
    }
    if (e.keyCode === 38 && cursor.current > 0) {
      cursor.current--;
      document.getElementById("suggested-word-".concat(cursor.current)).style.backgroundColor = "blue";
      document.getElementById("suggested-word-".concat(cursor.current + 1)).style.backgroundColor = "white";
    }
    if (e.keyCode === 13 && cursor.current >= 0) {
      const selectedItem = document.getElementById("suggested-word-".concat(cursor.current));
      setSuggestedWords([]);
      if (selectedItem) {
        e.target.value = selectedItem.innerHTML.valueOf();
      }
    }
  };
  const suggestedWordList = suggestedWords.map((suggestedWord, index) => {
    return /*#__PURE__*/createElement("li", {
      key: index,
      id: "suggested-word-".concat(index)
    }, suggestedWord);
  });
  return /*#__PURE__*/createElement(Fragment, null, /*#__PURE__*/createElement("input", {
    type: "text",
    name: "search",
    placeholder: "Search...",
    onChange: handlePrefix,
    onKeyDown: handleKeyDown,
    autoComplete: "off"
  }), /*#__PURE__*/createElement("div", {
    className: "search-list"
  }, suggestedWordList));
}