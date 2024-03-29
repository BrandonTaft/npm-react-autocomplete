"use strict";

require("core-js/modules/es.array.push.js");
require("core-js/modules/es.weak-map.js");
require("core-js/modules/web.dom-collections.iterator.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.error.cause.js");
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const DropDown = _ref => {
  let {
    matchingItems,
    highlightedIndex,
    setHighlightedIndex,
    onSelect,
    handleHighlight,
    resetInputValue,
    highlightedItemStyle,
    dropDownStyle,
    listItemStyle,
    controlSubmit,
    savedList
  } = _ref;
  const dropDownRef = (0, _react.useRef)();
  const itemRef = (0, _react.useRef)([]);
  if (handleHighlight && matchingItems[0] && highlightedIndex >= 0) {
    if (matchingItems[highlightedIndex].originalIndex >= 0) {
      handleHighlight(savedList[matchingItems[highlightedIndex].originalIndex]);
    }
  }
  if (itemRef.current[highlightedIndex]) {
    itemRef.current[highlightedIndex].scrollIntoView({
      block: "nearest"
    });
  }
  const handleClick = matchingItem => {
    if (!controlSubmit) {
      onSelect(savedList[matchingItem.originalIndex]);
    }
    ;
    resetInputValue(matchingItem.value);
  };
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    "data-testid": "dropDown",
    className: "dropdown-container",
    style: dropDownStyle,
    ref: dropDownRef
  }, matchingItems.map((matchingItem, index) => /*#__PURE__*/_react.default.createElement("div", {
    key: matchingItem.originalIndex,
    ref: e => itemRef.current[index] = e,
    className: highlightedIndex === index ? "dropdown-item highlighted-item" : "dropdown-item",
    style: highlightedIndex === index ? _objectSpread(_objectSpread({}, highlightedItemStyle), listItemStyle) : _objectSpread({}, listItemStyle),
    onMouseEnter: () => setHighlightedIndex(index),
    onClick: () => {
      if (matchingItem.originalIndex >= 0) {
        handleClick(matchingItem);
      }
    }
  }, matchingItem.value))));
};
var _default = DropDown;
exports.default = _default;