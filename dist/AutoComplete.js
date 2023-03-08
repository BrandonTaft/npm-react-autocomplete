"use strict";

require("core-js/modules/es.symbol.description.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = AutoComplete;
require("core-js/modules/web.dom-collections.iterator.js");
var _react = require("react");
var _trie = _interopRequireDefault(require("./trie"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function AutoComplete(_ref) {
  let {
    list,
    getPropValue,
    highlightFirstItem,
    onSelect,
    itemStyle
  } = _ref;
  const [isHighlighted, setIsHighlighted] = (0, _react.useState)(0);
  const [suggestedWords, setSuggestedWords] = (0, _react.useState)([]);
  const trie = (0, _react.useRef)();
  const inputRef = (0, _react.useRef)();
  (0, _react.useEffect)(() => {
    if (!list) {
      console.warn("You must provide an array to the list prop");
    }
    if (!onSelect) {
      console.warn("You must provide a function to the onSelect prop");
    }
    // Determine value to retrieve from list
    let listItems;
    if (!getPropValue) {
      listItems = list;
    } else {
      try {
        listItems = list.map(getPropValue);
        if (listItems[0] == null) {
          throw "Check the getPropValue function - the property value doesn't seem to exist";
        }
      } catch (error) {
        throw "Check the getPropValue function - the property value doesn't seem to exist";
      }
    }
    ;

    // If specified, set first item in dropdown to not be auto highlighted
    if (highlightFirstItem === false) {
      setIsHighlighted(-1);
    }

    // Initialize root node and store in ref.current
    trie.current = new _trie.default();

    // Insert each word into the data trie
    if (list) {
      for (let i = 0; i < listItems.length; i++) {
        const item = listItems[i];
        trie.current.insert(item);
      }
    }
  }, [list, getPropValue]);
  const handlePrefix = e => {
    const prefix = e.target.value;
    if (prefix.length > 0) {
      setSuggestedWords(trie.current.find(e.target.value));
    } else {
      setSuggestedWords([]);
      if (highlightFirstItem === false) {
        setIsHighlighted(-1);
      } else {
        setIsHighlighted(0);
      }
    }
  };
  const handleKeyDown = e => {
    if (e.keyCode === 40) {
      e.preventDefault();
      if (isHighlighted < suggestedWords.length - 1) {
        setIsHighlighted(isHighlighted + 1);
      }
    }
    ;
    if (e.keyCode === 38) {
      e.preventDefault();
      if (isHighlighted > 0) {
        setIsHighlighted(isHighlighted - 1);
      }
    }
    ;
    if (e.keyCode === 13) {
      if (list) {
        inputRef.current.value = suggestedWords[isHighlighted];
        try {
          onSelect(isHighlighted, suggestedWords[isHighlighted], list);
        } catch (error) {
          throw "You must provide a function to the onSelect prop";
        } finally {
          setSuggestedWords([]);
        }
      } else {
        try {
          onSelect(-1, inputRef.current.value);
        } catch (error) {
          throw "You must provide a function to the onSelect prop";
        } finally {
          inputRef.current.value = "";
        }
      }
    }
    ;
    // if (e.keyCode === 8) {
    //   if (isHighlighted > suggestedWords.length) {
    //     setIsHighlighted(suggestedWords.length)
    //   }
    // };
  };

  const onMouseClick = (index, suggestedWord) => {
    inputRef.current.value = suggestedWord;
    setSuggestedWords([]);
    try {
      onSelect(index, suggestedWord, list);
    } catch (error) {
      throw "You must provide a function to the onSelect prop";
    }
  };
  const suggestedWordList = suggestedWords.map((suggestedWord, index) => {
    if (isHighlighted + 1 > suggestedWords.length) {
      setIsHighlighted(0);
    }
    return /*#__PURE__*/React.createElement("div", {
      key: index,
      id: "suggested-word-".concat(index),
      style: _objectSpread({
        background: isHighlighted === index ? 'lightgray' : 'none'
      }, itemStyle),
      onClick: e => {
        onMouseClick(index, suggestedWord);
      },
      onMouseEnter: () => setIsHighlighted(index)
    }, suggestedWord);
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    type: "text",
    name: "search",
    placeholder: "Search...",
    onChange: handlePrefix,
    onKeyDown: handleKeyDown,
    autoComplete: "off"
  }), !suggestedWordList ? null : suggestedWordList);
}