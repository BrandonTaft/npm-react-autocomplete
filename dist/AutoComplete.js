"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = AutoComplete;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.regexp.to-string.js");
var _react = _interopRequireWildcard(require("react"));
var _DropDown = _interopRequireDefault(require("./DropDown"));
var _Input = _interopRequireDefault(require("./Input"));
var _trie = _interopRequireDefault(require("./trie"));
var _useOnOutsideClick = _interopRequireDefault(require("./useOnOutsideClick"));
var _lodash = _interopRequireDefault(require("lodash.isequal"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function AutoComplete(_ref) {
  let {
    list = [],
    getDisplayValue,
    showAll = false,
    highlightFirstItem = true,
    inputProps,
    handleHighlight,
    onSelect = () => {},
    onSelectError,
    handleNewValue,
    disableOutsideClick = false,
    noMatchMessage = false,
    open,
    onDropDownChange,
    submit,
    controlSubmit,
    inputStyle,
    wrapperStyle,
    dropDownStyle,
    listItemStyle,
    highlightedItemStyle = {
      backgroundColor: "dodgerBlue"
    }
  } = _ref;
  const [isOpen, setIsOpen] = (0, _react.useState)(false);
  const [matchingItems, setMatchingItems] = (0, _react.useState)([]);
  const [prefix, setPrefix] = (0, _react.useState)("");
  const [highlightedIndex, setHighlightedIndex] = (0, _react.useState)(highlightFirstItem ? 0 : -1);
  const [savedList, setSavedList] = (0, _react.useState)([]);
  const getDisplayValueRef = (0, _react.useRef)(getDisplayValue);
  const onDropDownChangeRef = (0, _react.useRef)(onDropDownChange);
  const submitRef = (0, _react.useRef)();
  const trie = (0, _react.useRef)();
  const wrapperRef = (0, _react.useRef)();
  const onOutsideClick = (0, _react.useCallback)(() => {
    setIsOpen(false);
  }, []);
  (0, _useOnOutsideClick.default)(wrapperRef, onOutsideClick, disableOutsideClick);
  if (!(0, _lodash.default)(list, savedList)) {
    setSavedList(list);
  }
  ;
  (0, _react.useEffect)(() => {
    let filtered = [];
    if (savedList.some(value => {
      return typeof value == "object";
    })) {
      if (getDisplayValueRef.current) {
        filtered = getDisplayValueRef.current(savedList);
      } else {
        console.error("Missing prop - 'getDisplayValue' is needed to get an object property value from 'list'");
        return;
      }
      ;
    } else {
      filtered = savedList.slice(0);
    }
    ;
    if (filtered.length) {
      trie.current = new _trie.default();
      for (let i = 0; i < filtered.length; i++) {
        const item = filtered[i];
        if (item && typeof item === 'number' || item === 0) {
          trie.current.insert(item.toString(), i);
        } else if (item) {
          trie.current.insert(item, i);
        }
        ;
      }
      ;
    }
    ;
  }, [savedList]);
  (0, _react.useEffect)(() => {
    if (prefix) {
      if (isOpen) {
        setMatchingItems(trie.current.find(prefix, noMatchMessage));
      }
      ;
    } else {
      if (isOpen && showAll) {
        setMatchingItems(trie.current.returnAll());
      }
      ;
      if (!isOpen || !showAll) {
        setMatchingItems([]);
        setHighlightedIndex(highlightFirstItem === false ? -1 : 0);
      }
      ;
    }
    ;
    if (onDropDownChangeRef.current) onDropDownChangeRef.current(isOpen);
  }, [isOpen, prefix, highlightFirstItem, showAll, noMatchMessage, savedList]);
  (0, _react.useEffect)(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
    ;
  }, [open]);
  (0, _react.useEffect)(() => {
    if (submit) {
      submitRef.current();
    }
    ;
  }, [submit]);
  submitRef.current = () => {
    let match = trie.current.contains(prefix.toString());
    if (match) {
      onSelect(savedList[match.originalIndex]);
    } else if (handleNewValue && prefix) {
      handleNewValue(prefix);
    } else if (!match || !handleNewValue) {
      if (onSelectError) {
        onSelectError();
      } else if (onSelect) {
        onSelect(prefix);
      }
    }
    ;
    resetInputValue("");
  };
  if (highlightedIndex > matchingItems.length) {
    setHighlightedIndex(0);
  }
  ;
  const resetInputValue = (0, _react.useCallback)(matchingItem => {
    setIsOpen(false);
    if (!controlSubmit) {
      setPrefix("");
    } else {
      setPrefix(matchingItem);
    }
    ;
  }, [controlSubmit]);
  const handleKeyDown = event => {
    if (event) {
      switch (event.key) {
        case 'ArrowDown':
          if (matchingItems.length) {
            event.preventDefault();
            if (!matchingItems[highlightedIndex + 1]) {
              setHighlightedIndex(0);
            } else if (matchingItems[highlightedIndex + 1]) {
              setHighlightedIndex(highlightedIndex + 1);
            }
            ;
          }
          ;
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (highlightedIndex === 0) {
            setHighlightedIndex(matchingItems.length - 1);
          } else if (matchingItems[highlightedIndex - 1]) {
            setHighlightedIndex(highlightedIndex - 1);
          }
          ;
          break;
        case 'Enter':
          const highlighted = matchingItems[highlightedIndex];
          if (!controlSubmit) {
            if (highlighted && highlighted.originalIndex >= 0) {
              onSelect(savedList[highlighted.originalIndex]);
            } else if (prefix) {
              let match = trie.current.contains(prefix);
              if (!match) {
                if (handleNewValue) {
                  handleNewValue(prefix);
                } else if (onSelectError) {
                  onSelectError();
                } else if (onSelect) {
                  onSelect(prefix);
                }
                ;
              } else {
                onSelect(savedList[match.originalIndex]);
              }
              ;
            }
            ;
            resetInputValue();
            event.target.blur();
          } else {
            if (highlighted && highlighted.originalIndex >= 0) {
              resetInputValue(highlighted.value);
            } else if (prefix) {
              resetInputValue(prefix);
            }
            ;
            event.target.blur();
          }
          ;
          break;
        case 'Tab':
          setIsOpen(false);
          break;
        default:
          break;
      }
      ;
    }
    ;
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "autocomplete-wrapper",
    style: wrapperStyle,
    ref: wrapperRef
  }, /*#__PURE__*/_react.default.createElement(_Input.default, {
    inputStyle: inputStyle,
    prefix: prefix,
    inputProps: inputProps,
    setPrefix: setPrefix,
    handleKeyDown: handleKeyDown,
    setIsOpen: setIsOpen
  }), isOpen && /*#__PURE__*/_react.default.createElement(_DropDown.default, {
    matchingItems: matchingItems,
    highlightedIndex: highlightedIndex,
    setHighlightedIndex: setHighlightedIndex,
    onSelect: onSelect,
    handleHighlight: handleHighlight,
    resetInputValue: resetInputValue,
    highlightedItemStyle: highlightedItemStyle,
    listItemStyle: listItemStyle,
    dropDownStyle: dropDownStyle,
    controlSubmit: controlSubmit,
    submit: submit,
    savedList: savedList
  }));
}
;