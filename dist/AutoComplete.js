"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const _default = AutoComplete;
export { _default as default };
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.object.assign.js";
import { useState, useRef, useEffect, createElement } from "react";
var _domScrollIntoView = _interopRequireDefault(require("dom-scroll-into-view"));
var _reactOutsideClickHandler = _interopRequireDefault(require("react-outside-click-handler"));
var _trie = _interopRequireDefault(require("./trie"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function AutoComplete(_ref) {
  let {
    list,
    getPropValue,
    onSelect,
    showAll = false,
    clearOnSelect = true,
    highlightFirstItem = true,
    disableOutsideClick = false,
    wrapperDiv = 'block',
    inputProps,
    inputStyle,
    dropDownStyle,
    listItemStyle,
    highlightedItem = {
      backgroundColor: "gray"
    },
    isOpen,
    updateIsOpen
  } = _ref;
  const [isHighlighted, setIsHighlighted] = (0, useState)(0);
  const [suggestedWords, setSuggestedWords] = (0, useState)([]);
  const [listItems, setListItems] = (0, useState)();
  const trie = (0, useRef)();
  const cacheRef = (0, useRef)();
  const inputRef = (0, useRef)();
  const dropDownRef = (0, useRef)();
  const itemsRef = (0, useRef)([]);
  (0, useEffect)(() => {
    // If list is not already stored in the trie - check for nested objects
    // If there are no nested objects, create a new array called items with the values in the list array
    // If there are nested objects, use 'getPropvalue' to extract property values and set them in items array
    if (JSON.stringify(cacheRef.current) !== JSON.stringify(list)) {
      let items;
      if (Array.isArray(list)) {
        if (list.some(value => {
          return typeof value == "object";
        })) {
          if (!getPropValue) {
            console.error("Missing prop - 'getPropValue' is needed to get an object property value from 'list'");
          } else {
            try {
              items = list.map(getPropValue);
            } catch (error) {
              console.error("Check the getPropValue function : the property value doesn't seem to exist", '\n', error);
            }
          }
        } else {
          items = list;
        }
        ;
      } else {
        console.error("Ivalid PropType : The prop 'list' has a value of '".concat(typeof list, "' - list must be an array"));
      }
      ;

      // Initialize root node and store in the trie ref
      // Then Insert each word in items array into the trie ref
      // Then store original list in cacheRef to use to detect list prop changes
      trie.current = new _trie.default();
      if (items) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item && typeof item == 'number') {
            trie.current.insert(item.toString());
          } else if (item) {
            trie.current.insert(item);
          }
        }
      }
      ;
      cacheRef.current = list;
      setListItems(items);
    }

    // If specified, set first item in dropdown to not be auto highlighted
    if (highlightFirstItem === false) {
      setIsHighlighted(-1);
    }

    // It the updateIsOpen prop is passed in - 
    // Close dropdown if isOpen is false
    // Open dropdown if isOpen is true
    if (updateIsOpen && isOpen === false) {
      setSuggestedWords([]);
    }
    if (updateIsOpen && isOpen === true) {
      if (showAll === true && !inputRef.current.value) {
        setSuggestedWords(listItems);
      } else {
        setSuggestedWords(trie.current.find(inputRef.current.value));
      }
    }
  }, [list, getPropValue, highlightFirstItem, listItems, isOpen, updateIsOpen, showAll]);
  const handlePrefix = e => {
    const prefix = e.target.value;
    if (listItems && showAll && prefix.length === 0) {
      setSuggestedWords(listItems);
      if (updateIsOpen) {
        updateIsOpen(true);
      }
      return;
    }
    if (prefix.length > 0) {
      setSuggestedWords(trie.current.find(e.target.value));
      if (updateIsOpen) {
        updateIsOpen(true);
      }
    } else {
      closeDropDown();
    }
    if (isHighlighted + 1 > suggestedWords.length) {
      setIsHighlighted(0);
    }
  };
  const handleKeyDown = e => {
    if (e.keyCode === 40) {
      if (!itemsRef.current[isHighlighted + 1] && itemsRef.current[0]) {
        setIsHighlighted(0);
        (0, _domScrollIntoView.default)(itemsRef.current[0], dropDownRef.current, {
          onlyScrollIfNeeded: true
        });
      }
      e.preventDefault();
      if (itemsRef.current[isHighlighted + 1] !== null) {
        setIsHighlighted(isHighlighted + 1);
        (0, _domScrollIntoView.default)(itemsRef.current[isHighlighted + 1], dropDownRef.current, {
          onlyScrollIfNeeded: true
        });
      }
    }
    if (e.keyCode === 38) {
      e.preventDefault();
      if (itemsRef.current[isHighlighted - 1]) {
        setIsHighlighted(isHighlighted - 1);
        (0, _domScrollIntoView.default)(itemsRef.current[isHighlighted - 1], dropDownRef.current, {
          onlyScrollIfNeeded: true
        });
      }
    }
    ;
    if (e.keyCode === 13) {
      if (list && suggestedWords[isHighlighted]) {
        try {
          onSelect(suggestedWords[isHighlighted].toString(), list);
        } catch (error) {
          console.error("You must provide a valid function to the 'onSelect' prop", '\n', error);
        } finally {
          if (showAll) {
            resetHighlight();
          }
          setSuggestedWords([]);
          resetInputValue(suggestedWords[isHighlighted]);
          if (updateIsOpen) {
            updateIsOpen(false);
          }
        }
      } else {
        if (inputRef.current.value) {
          try {
            onSelect(inputRef.current.value.toString(), list);
          } catch (error) {
            console.error("You must provide a valid function to the 'onSelect' prop", '\n', error);
          }
          resetInputValue(inputRef.current.value);
          setSuggestedWords([]);
          if (updateIsOpen) {
            updateIsOpen(false);
          }
        }
      }
    }
    if (e.keyCode === 9) {
      closeDropDown();
    }
  };
  const onMouseClick = suggestedWord => {
    try {
      onSelect(suggestedWord.toString(), list);
    } catch (error) {
      console.error("You must provide a valid function to the 'onSelect' prop", '\n', error);
    } finally {
      if (showAll) {
        resetHighlight();
      }
      setSuggestedWords([]);
      resetInputValue(suggestedWord);
      if (updateIsOpen) {
        updateIsOpen(false);
      }
    }
  };
  var collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base'
  });
  const sorted = suggestedWords.sort(collator.compare);
  const suggestedWordList = sorted.map((suggestedWord, index) => {
    if (isHighlighted + 1 > suggestedWords.length) {
      setIsHighlighted(0);
    }
    return suggestedWord ? /*#__PURE__*/createElement("div", {
      key: index,
      ref: el => itemsRef.current[index] = el,
      id: "suggested-word-".concat(index),
      className: "list-item",
      style: isHighlighted === index ? _objectSpread(_objectSpread({}, highlightedItem), listItemStyle) : _objectSpread({}, listItemStyle),
      onClick: () => {
        onMouseClick(suggestedWord);
      },
      onMouseEnter: () => setIsHighlighted(index)
    }, suggestedWord) : "";
  });
  return /*#__PURE__*/createElement(_reactOutsideClickHandler.default, {
    display: wrapperDiv ? wrapperDiv : 'block',
    disabled: disableOutsideClick,
    onOutsideClick: e => {
      setSuggestedWords([]);
      resetHighlight();
      if (updateIsOpen && e.target.className !== 'ignore') {
        updateIsOpen(false);
      }
    }
  }, /*#__PURE__*/createElement("input", _extends({}, inputProps, {
    style: inputStyle,
    ref: inputRef,
    type: "text",
    onClick: handlePrefix,
    onChange: handlePrefix,
    onKeyDown: handleKeyDown,
    onFocus: handlePrefix,
    autoComplete: "off"
  })), suggestedWordList.length ? /*#__PURE__*/createElement("div", {
    className: "dropdown-container",
    ref: dropDownRef,
    style: dropDownStyle
  }, suggestedWordList) : null);

  // Sets the value of the input to be what is specified in 'clearOnSelect' prop
  // When onSelect runs it will clear the input if 'clearOnSelect' is set to true
  // If clearOnSelect is set to false it will set the input value to the word passed in
  function resetInputValue(suggestedWord) {
    if (clearOnSelect) {
      inputRef.current.value = "";
    } else {
      if (!suggestedWord) {
        inputRef.current.value = "";
      } else {
        inputRef.current.value = suggestedWord;
      }
    }
  }

  // Resets the highlighted index to what is specified by 'highlightFirstItem' prop
  function resetHighlight() {
    if (highlightFirstItem === false) {
      setIsHighlighted(-1);
    } else {
      setIsHighlighted(0);
    }
  }

  // Closes Dropdown by setting suggestedWords to empty array
  // Resets highlighted index to what is specified by 'highlightFirstItem' prop 
  // If 'updateIsOpen' was passed in it updates parent state to false 
  function closeDropDown() {
    setSuggestedWords([]);
    resetHighlight();
    if (updateIsOpen) {
      updateIsOpen(false);
    }
  }
}