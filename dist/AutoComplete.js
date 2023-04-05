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
    filteredItemstyle,
    highlightedItem = {
      backgroundColor: "gray"
    },
    isOpen,
    updateIsOpen
  } = _ref;
  const cachedList = (0, _react.useRef)();
  const filteredItems = (0, _react.useRef)();
  const trie = (0, _react.useRef)();
  const inputRef = (0, _react.useRef)();
  const dropDownRef = (0, _react.useRef)();
  const itemsRef = (0, _react.useRef)([]);
  const initialState = {
    matchingItems: [],
    highlightedIndex: highlightFirstItem ? 0 : -1,
    open: true
  };
  const [state, dispatch] = (0, _react.useReducer)(reducer, initialState);
  const {
    matchingItems,
    highlightedIndex
  } = state;
  function reducer(state, action) {
    switch (action.type) {
      case "OPEN":
        {
          return _objectSpread(_objectSpread({}, state), {}, {
            matchingItems: action.payload
          });
        }
      case "CLOSE":
        {
          if (highlightFirstItem === false) {
            return {
              matchingItems: [],
              highlightedIndex: -1
            };
          } else {
            return {
              matchingItems: [],
              highlightedIndex: 0
            };
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
      case "RESET":
        {
          return _objectSpread(_objectSpread({}, state), {}, {
            highlightedIndex: action.payload
          });
        }
      default:
        return state;
    }
  }
  ;
  (0, _react.useEffect)(() => {
    // If list is not already stored in the trie - store original list in cachedList ref
    // If there are no nested objects, create a new array and store it in filterItems ref
    // If there are nested objects, use 'getPropvalue' to extract property values and set them in filterItems ref
    if (JSON.stringify(cachedList.current) !== JSON.stringify(list)) {
      cachedList.current = Array.from(list);
      if (Array.isArray(list)) {
        if (list.some(value => {
          return typeof value == "object";
        })) {
          if (!getPropValue) {
            console.error("Missing prop - 'getPropValue' is needed to get an object property value from 'list'");
          } else {
            try {
              filteredItems.current = list.map(getPropValue);
            } catch (error) {
              console.error("Check the getPropValue function : the property value doesn't seem to exist", '\n', error);
            }
            ;
          }
          ;
        } else {
          filteredItems.current = Array.from(list);
        }
        ;
      } else {
        console.error("Ivalid PropType : The prop 'list' has a value of '".concat(typeof list, "' - list must be an array"));
      }
      ;
      // Initialize root node and store in the 'trie' ref
      // Then insert each word in filteredItems array into the 'trie'
      trie.current = new _trie.default();
      if (filteredItems.current) {
        for (let i = 0; i < filteredItems.current.length; i++) {
          const item = filteredItems.current[i];
          if (item && typeof item == 'number') {
            trie.current.insert(item.toString());
          } else if (item) {
            trie.current.insert(item);
          }
          ;
        }
        ;
      }
      ;
    }
    // It the updateIsOpen prop is passed in - 
    // Close dropdown if isOpen is false
    // Open dropdown if isOpen is true
    if (updateIsOpen && !isOpen) {
      dispatch({
        type: "CLOSE"
      });
    } else if (updateIsOpen && isOpen) {
      if (showAll || !showAll && inputRef.current.value) {
        dispatch({
          type: "OPEN",
          payload: trie.current.find(inputRef.current.value)
        });
      }
    }
    ;
  }, [list, getPropValue, isOpen, updateIsOpen, showAll]);
  const handlePrefix = e => {
    const prefix = e.target.value;
    if (filteredItems.current && showAll && prefix.length === 0) {
      dispatch({
        type: "OPEN",
        payload: filteredItems.current
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
        type: "RESET",
        payload: 0
      });
    }
  };
  const handleKeyDown = e => {
    // Down Arrow - sets the next index in the 'matchingItemsList' as the highlighted index
    // If the highlighted index is the last index it resets the highlighted index back to 0
    if (e.keyCode === 40) {
      if (!itemsRef.current[highlightedIndex + 1] && itemsRef.current[0]) {
        dispatch({
          type: "RESET",
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

    //Up Arrow - sets the highlighted index as the one before the current index
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

    // Enter key - Passes highlighted item in to the 'onselect' function and closes the dropdown
    // If there is not a highlighted item it will pass the inputs value into the 'onSelect' function
    if (e.keyCode === 13) {
      if (list && matchingItems[highlightedIndex]) {
        try {
          onSelect(matchingItems[highlightedIndex].toString(), list);
        } catch (error) {
          console.error("You must provide a valid function to the 'onSelect' prop", '\n', error);
        } finally {
          dispatch({
            type: "CLOSE"
          });
          handleUpdateIsOpen(false);
          resetInputValue(matchingItems[highlightedIndex]);
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
    // Tab key closes the dropdown 
    if (e.keyCode === 9) {
      dispatch({
        type: "CLOSE"
      });
      handleUpdateIsOpen(false);
    }
  };

  // Runs the function passed in to the onSelect prop and then closes the dropdown
  const onMouseClick = matchingItem => {
    try {
      onSelect(matchingItem.toString(), list);
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

  // Creates a new Collator object and uses its compare method to sort alphanumeric arrays
  var collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base'
  });
  const sorted = matchingItems.sort(collator.compare);
  const matchingItemsList = sorted.map((matchingItem, index) => {
    if (highlightedIndex + 1 > matchingItems.length) {
      dispatch({
        type: "RESET",
        payload: 0
      });
    }
    return matchingItem ? /*#__PURE__*/_react.default.createElement("div", {
      key: index,
      ref: el => itemsRef.current[index] = el,
      id: "suggested-word-".concat(index),
      className: "list-item",
      style: highlightedIndex === index ? _objectSpread(_objectSpread({}, highlightedItem), filteredItemstyle) : _objectSpread({}, filteredItemstyle),
      onClick: () => {
        onMouseClick(matchingItem);
      },
      onMouseEnter: () => dispatch({
        type: "RESET",
        payload: index
      })
    }, matchingItem) : "";
  });
  return /*#__PURE__*/_react.default.createElement(_Wrapper.default, {
    disabled: disableOutsideClick,
    display: wrapperDiv,
    wrapperStyle: wrapperStyle,
    className: "wrapper",
    onOutsideClick: e => {
      if (matchingItems.length) {
        dispatch({
          type: "CLOSE"
        });
      }
      handleUpdateIsOpen(false);
    }
  }, /*#__PURE__*/_react.default.createElement("input", _extends({}, inputProps, {
    style: inputStyle,
    ref: inputRef,
    type: "text",
    onClick: handlePrefix,
    onChange: handlePrefix,
    onKeyDown: handleKeyDown,
    onFocus: handlePrefix,
    autoComplete: "off"
  })), matchingItemsList.length ? /*#__PURE__*/_react.default.createElement("div", {
    className: "dropdown-container",
    ref: dropDownRef,
    style: dropDownStyle
  }, matchingItemsList) : null);

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
  // If "updateIsOpen" is passed in update it when  dropdown is opened or closed
  function handleUpdateIsOpen(isItOpen) {
    if (updateIsOpen) {
      updateIsOpen(isItOpen);
    }
  }
}