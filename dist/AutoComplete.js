"use strict";

require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.object.assign.js");
require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = AutoComplete;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.json.stringify.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.array.sort.js");
var _react = _interopRequireWildcard(require("react"));
var _domScrollIntoView = _interopRequireDefault(require("dom-scroll-into-view"));
var _Wrapper = _interopRequireDefault(require("./Wrapper"));
var _trie = _interopRequireDefault(require("./trie"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
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
    wrapperStyle,
    inputProps,
    inputStyle,
    dropDownStyle,
    listItemStyle,
    highlightedItemStyle = {
      backgroundColor: "dodgerBlue"
    },
    isOpen,
    updateIsOpen,
    handleHighlightedItem
  } = _ref;
  const getPropValueRef = (0, _react.useRef)();
  const updateRef = (0, _react.useRef)();
  const matchingItemsRef = (0, _react.useRef)([]);
  const trie = (0, _react.useRef)();
  const inputRef = (0, _react.useRef)();
  const dropDownRef = (0, _react.useRef)();
  const itemsRef = (0, _react.useRef)([]);
  const [savedList, setSavedList] = (0, _react.useState)([]);
  const [savedFunction, setSavedFunction] = (0, _react.useState)();
  const initialState = {
    filterItems: [],
    matchingItems: [],
    highlightedIndex: highlightFirstItem ? 0 : -1
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case "OPEN":
        {
          matchingItemsRef.current = action.payload;
          return _objectSpread(_objectSpread({}, state), {}, {
            matchingItems: action.payload
          });
        }
      case "CLOSE":
        {
          matchingItemsRef.current = [];
          if (highlightFirstItem === false) {
            return _objectSpread(_objectSpread({}, state), {}, {
              matchingItems: [],
              highlightedIndex: -1
            });
          } else {
            return _objectSpread(_objectSpread({}, state), {}, {
              matchingItems: [],
              highlightedIndex: 0
            });
          }
        }
      case "DOWN":
        {
          return _objectSpread(_objectSpread({}, state), {}, {
            highlightedIndex: state.highlightedIndex + 1
          });
        }
      case "UP":
        {
          return _objectSpread(_objectSpread({}, state), {}, {
            highlightedIndex: state.highlightedIndex - 1
          });
        }
      case "UPDATE":
        {
          return _objectSpread(_objectSpread({}, state), {}, {
            highlightedIndex: action.payload
          });
        }
      case "FILTER":
        {
          return _objectSpread(_objectSpread({}, state), {}, {
            filteredItems: action.payload
          });
        }
      default:
        return state;
    }
  };
  const [state, dispatch] = (0, _react.useReducer)(reducer, initialState);
  const {
    filteredItems,
    matchingItems,
    highlightedIndex
  } = state;

  // Store `updateIsOpen` in a ref to avoid triggering useEffect that -
  // just checks if it was passed in as a prop
  updateRef.current = updateIsOpen;

  // Shallow check for new `list`
  // If `list` is new - store it in the `savedList` state
  if (JSON.stringify(list) !== JSON.stringify(savedList)) {
    setSavedList(list);
  }

  // If `getPropValue` is new - 
  // Store it as a string in the `savedFunction` state for shallow comparison
  // Then store the `getPropValue` function in the `getPropValueRef` 
  if (getPropValue && getPropValue.toString() !== savedFunction) {
    setSavedFunction(getPropValue.toString());
    getPropValueRef.current = getPropValue;
  }

  // When `list` or `getPropValue` function changes - 
  // Create the `filteredItems` array with specified words to go into the trie
  // If `list` contains objects - use getPropvalueRef to map out desired words  
  (0, _react.useEffect)(() => {
    if (Array.isArray(savedList)) {
      if (savedList.some(value => {
        return typeof value == "object";
      })) {
        if (getPropValueRef.current) {
          try {
            dispatch({
              type: "FILTER",
              payload: savedList.map(getPropValueRef.current)
            });
          } catch (error) {
            console.error("Check the getPropValue function : the property value doesn't seem to exist", '\n', error);
          }
          ;
        } else if (!getPropValueRef.current) {
          console.error("Missing prop - 'getPropValue' is needed to get an object property value from 'list'");
          return;
        }
      } else {
        dispatch({
          type: "FILTER",
          payload: savedList
        });
      }
    } else if (savedList === undefined) {
      return;
    } else {
      console.error("Ivalid PropType : The prop 'list' has a value of '".concat(typeof savedList, "' - list must be an array"));
      return;
    }
    ;
  }, [savedList, savedFunction]);

  //Insert the items in `filteredItems` into the trie
  (0, _react.useEffect)(() => {
    trie.current = new _trie.default();
    if (filteredItems) {
      for (let i = 0; i < filteredItems.length; i++) {
        const item = filteredItems[i];
        if (item && typeof item == 'number') {
          trie.current.insert(item.toString(), i);
        } else if (item) {
          trie.current.insert(item, i);
        }
        ;
      }
      ;
    }
    ;
  }, [filteredItems]);

  // Runs when dropdown is open and the getPropValue function changes
  // Allows user to toggle property values in dropdown while its open
  (0, _react.useEffect)(() => {
    if (matchingItemsRef.current.length) {
      dispatch({
        type: "OPEN",
        payload: filteredItems.map((item, index) => ({
          value: item,
          originalIndex: index
        }))
      });
    }
  }, [filteredItems]);

  // Opens dropdown when isOpen is passed from parent as `true` - close when `false`
  // `handleUpdateIsOpen` function runs when the dropdown is opened/closed by the child -
  // it sends the updated state of `isOpen` back to the parent
  (0, _react.useEffect)(() => {
    if (updateRef.current && !isOpen) {
      dispatch({
        type: "CLOSE"
      });
    } else if (updateRef.current && isOpen) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      if (showAll && !inputRef.current.value) {
        if (filteredItems) {
          dispatch({
            type: "OPEN",
            payload: filteredItems.map((item, index) => ({
              value: item,
              originalIndex: index
            }))
          });
        }
      } else if (showAll && inputRef.current.value) {
        dispatch({
          type: "OPEN",
          payload: trie.current.find(inputRef.current.value)
        });
      } else if (!showAll && inputRef.current.value) {
        dispatch({
          type: "OPEN",
          payload: trie.current.find(inputRef.current.value)
        });
      }
    }
    ;
  }, [isOpen, showAll, filteredItems]);

  // Runs the function passed in as `handleHighlightedItem` prop
  // Passes in the higlighted element's `HTMLDivElement` & the string or object from the original list
  (0, _react.useEffect)(() => {
    if (itemsRef.current[highlightedIndex] && handleHighlightedItem) {
      handleHighlightedItem(itemsRef.current[highlightedIndex], savedList[matchingItems[highlightedIndex].originalIndex]);
    }
  }, [handleHighlightedItem, highlightedIndex, matchingItems, savedList]);

  // Handles text input and if `showAll` is true it opens the dropdown when input is focused
  // Runs the trie's `find` method to search for words that match the text input
  const handlePrefix = e => {
    const prefix = e.target.value;
    if (filteredItems && showAll && prefix.length === 0) {
      dispatch({
        type: "OPEN",
        payload: filteredItems.map((item, index) => ({
          value: item,
          originalIndex: index
        }))
      });
      handleUpdateIsOpen(true);
      return;
    }
    if (prefix.length > 0) {
      dispatch({
        type: "OPEN",
        payload: trie.current.find(e.target.value)
      });
      handleUpdateIsOpen(true);
    } else if (matchingItems.length) {
      dispatch({
        type: "CLOSE"
      });
      handleUpdateIsOpen(false);
    }
    if (highlightedIndex + 1 > matchingItems.length) {
      dispatch({
        type: "UPDATE",
        payload: 0
      });
    }
  };
  const handleKeyDown = e => {
    // Down Arrow - sets the next index in the 'dropDownList' as the highlighted index
    // `scrollIntoView` scrolls the dropdown to keep highlight visible once it reaches the bottom 
    // If the highlighted index is the last index it resets the highlighted index back to 0
    if (e.keyCode === 40) {
      if (!itemsRef.current[highlightedIndex + 1] && itemsRef.current[0] !== undefined) {
        dispatch({
          type: "UPDATE",
          payload: 0
        });
        (0, _domScrollIntoView.default)(itemsRef.current[0], dropDownRef.current, {
          onlyScrollIfNeeded: true
        });
      }
      e.preventDefault();
      if (itemsRef.current[highlightedIndex + 1]) {
        dispatch({
          type: "DOWN"
        });
        (0, _domScrollIntoView.default)(itemsRef.current[highlightedIndex + 1], dropDownRef.current, {
          onlyScrollIfNeeded: true
        });
      }
    }

    // Up Arrow - Moves highlight up the dropdown by setting highlighted index one index back
    // `scrollIntoView` scrolls the dropdown to keep highlight visible once it reaches the top 
    if (e.keyCode === 38) {
      e.preventDefault();
      if (itemsRef.current[highlightedIndex - 1]) {
        dispatch({
          type: "UP"
        });
        (0, _domScrollIntoView.default)(itemsRef.current[highlightedIndex - 1], dropDownRef.current, {
          onlyScrollIfNeeded: true
        });
      }
    }
    ;

    // Enter key - Executes the `onSelect` function with 3 seperate arguments - 
    // the highlighted item's original `string` or `object`, it's `HTMLelement`, and it's index from the original list
    // If there is not a highlighted item it will pass the input's value into the 'onSelect' function
    // Then closes the dropdown and runs the `resetInputValue` function which uses `clearOnSelect` prop to clear the input or not
    if (e.keyCode === 13) {
      if (list && matchingItems[highlightedIndex]) {
        try {
          onSelect(list[matchingItems[highlightedIndex].originalIndex], itemsRef.current[highlightedIndex], matchingItems[highlightedIndex].originalIndex);
        } catch (error) {
          console.error("You must provide a valid function to the 'onSelect' prop", '\n', error);
        } finally {
          dispatch({
            type: "CLOSE"
          });
          handleUpdateIsOpen(false);
          resetInputValue(matchingItems[highlightedIndex].value);
        }
      } else {
        if (inputRef.current.value) {
          try {
            onSelect(inputRef.current.value.toString(), list);
          } catch (error) {
            console.error("You must provide a valid function to the 'onSelect' prop", '\n', error);
          } finally {
            dispatch({
              type: "CLOSE"
            });
            handleUpdateIsOpen(false);
            resetInputValue(inputRef.current.value);
          }
        }
      }
    }
    // Tab key takes focus off the input and closes the dropdown 
    if (e.keyCode === 9) {
      dispatch({
        type: "CLOSE"
      });
      handleUpdateIsOpen(false);
    }
  };

  // When an item is clicked on - Executes the `onSelect` function with 3 seperate arguments - 
  // the highlighted item's original `string` or `object`, it's `HTMLelement`, and it's index from the original list
  // If there is not a highlighted item it will pass the input's value into the 'onSelect' function
  // Then closes the dropdown and runs the `resetInputValue` function which uses `clearOnSelect` prop to clear the input or not
  const onMouseClick = (index, selectedElement, matchingItem) => {
    try {
      onSelect(list[index], selectedElement, index);
    } catch (error) {
      console.error("You must provide a valid function to the 'onSelect' prop", '\n', error);
    } finally {
      dispatch({
        type: "CLOSE"
      });
      handleUpdateIsOpen(false);
      resetInputValue(matchingItem);
    }
  };

  // Onscroll function determines the highlighted elements position within the dropdown
  // to keep the highlight inside the dropdown by moving the `highlightedIndex` up or down accordingly
  const scrollMe = () => {
    if (itemsRef.current) {
      let itemHeight = itemsRef.current[highlightedIndex].getBoundingClientRect().height;
      let containerTop = Math.round(dropDownRef.current.getBoundingClientRect().top);
      let itemTop = Math.round(itemsRef.current[highlightedIndex].getBoundingClientRect().top);
      let height = Math.round(dropDownRef.current.getBoundingClientRect().height);
      let bottom = containerTop + height;
      if (containerTop > itemTop) {
        dispatch({
          type: "DOWN"
        });
        (0, _domScrollIntoView.default)(itemsRef.current[highlightedIndex], dropDownRef.current, {
          alignWithTop: true,
          onlyScrollIfNeeded: true
        });
      }
      if (bottom < itemTop + itemHeight / 1.2) {
        dispatch({
          type: "UP"
        });
        (0, _domScrollIntoView.default)(itemsRef.current[highlightedIndex], dropDownRef.current, {
          alignWithTop: false,
          onlyScrollIfNeeded: true
        });
      }
    }
  };

  // Creates a new Collator object and uses its compare method to natural sort the array
  var collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base'
  });
  const sorted = matchingItems.sort(function (a, b) {
    return collator.compare(a.value, b.value);
  });
  const dropDownList = sorted.map((matchingItem, index) => {
    if (highlightedIndex + 1 > matchingItems.length) {
      dispatch({
        type: "UPDATE",
        payload: 0
      });
    }
    return matchingItem.value !== undefined ? /*#__PURE__*/_react.default.createElement("div", {
      key: matchingItem.originalIndex,
      ref: el => itemsRef.current[index] = el,
      className: highlightedIndex === index ? "dropdown-item highlited-item" : "dropdown-item",
      style: highlightedIndex === index ? _objectSpread(_objectSpread({}, highlightedItemStyle), listItemStyle) : _objectSpread({}, listItemStyle),
      onClick: () => {
        onMouseClick(matchingItem.originalIndex, itemsRef.current[index], matchingItem.value);
      },
      onMouseEnter: () => dispatch({
        type: "UPDATE",
        payload: index
      })
    }, matchingItem.value) : null;
  });
  return /*#__PURE__*/_react.default.createElement(_Wrapper.default, {
    className: "autocomplete-wrapper",
    disabled: disableOutsideClick,
    display: wrapperDiv,
    wrapperStyle: wrapperStyle,
    onOutsideClick: e => {
      if (matchingItems.length) {
        dispatch({
          type: "CLOSE"
        });
      }
      handleUpdateIsOpen(false);
    }
  }, /*#__PURE__*/_react.default.createElement("input", _extends({
    className: "autocomplete-input",
    style: inputStyle,
    ref: inputRef,
    type: "search"
  }, inputProps, {
    onClick: handlePrefix,
    onChange: handlePrefix,
    onKeyDown: handleKeyDown,
    onFocus: handlePrefix,
    autoComplete: "off"
  })), dropDownList.length ? /*#__PURE__*/_react.default.createElement("div", {
    className: "dropdown-container",
    ref: dropDownRef,
    style: dropDownStyle,
    onScroll: scrollMe
  }, dropDownList) : null);

  // Sets the value of the input to be what is specified in 'clearOnSelect' prop
  // When onSelect runs it will clear the input if 'clearOnSelect' is set to true
  // If clearOnSelect is set to false it will set the input value to the word passed in
  function resetInputValue(matchingItem) {
    if (clearOnSelect) {
      inputRef.current.value = "";
    } else {
      if (!matchingItem) {
        inputRef.current.value = "";
      } else {
        inputRef.current.value = matchingItem;
      }
    }
  }

  // Passes the state of `isOpen` back to parent when dropdown is open -
  // or closed from the Autocomplete function ("the child")
  function handleUpdateIsOpen(isItOpen) {
    if (updateIsOpen) {
      updateIsOpen(isItOpen);
    }
  }
}