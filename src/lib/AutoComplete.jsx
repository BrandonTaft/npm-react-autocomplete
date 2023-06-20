import React, { useCallback, useEffect, useState, useRef } from 'react';
import DropDown from './DropDown';
import Input from './Input';
import Trie from "./trie";
import useOnOutsideClick from './useOnOutsideClick';
import isEqual from "lodash.isequal";

export default function AutoComplete({
  list = [],
  getDisplayValue,
  showAll = false,
  highlightFirstItem = true,
  inputProps,
  handleHighlight,
  onSelect = () => { },
  onSelectError,
  handleNewValue,
  disableOutsideClick = false,
  noMatchMessage = false,
  open,
  onDropdownChange,
  submit,
  controlSubmit,
  inputStyle,
  wrapperStyle,
  dropDownStyle,
  listItemStyle,
  highlightedItemStyle = {
    backgroundColor: "dodgerBlue"
  }
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [matchingItems, setMatchingItems] = useState([]);
  const [prefix, setPrefix] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(highlightFirstItem ? 0 : -1);
  const [savedList, setSavedList] = useState([]);
  const getDisplayValueRef = useRef(getDisplayValue);
  const onDropdownChangeRef = useRef(onDropdownChange);
  const submitRef = useRef();
  const trie = useRef();
  const wrapperRef = useRef();

  const onOutsideClick = useCallback(() => {
    setIsOpen(false)
  }, []);

  useOnOutsideClick(wrapperRef, onOutsideClick, disableOutsideClick);

  if (!isEqual(list, savedList)) {
    setSavedList(list)
  };

  useEffect(() => {
    let filtered = [];
    if (savedList.some(value => { return typeof value == "object" })) {
      if (getDisplayValueRef.current) {
        filtered = (getDisplayValueRef.current(savedList));
      } else {
        console.error("Missing prop - 'getDisplayValue' is needed to get an object property value from 'list'")
        return
      };
    } else {
      filtered = savedList.slice(0)
    };
    if (filtered.length) {
      trie.current = new Trie();
      for (let i = 0; i < filtered.length; i++) {
        const item = filtered[i];
        if (item && typeof item == 'number') {
          trie.current.insert(item.toString(), i);
        } else if (item) {
          trie.current.insert(item, i);
        };
      };
    };
  }, [savedList]);

  useEffect(() => {
    if (prefix) {
      if (isOpen) {
        setMatchingItems(trie.current.find(prefix, noMatchMessage))
      };
    } else {
      if (isOpen && showAll) {
        setMatchingItems(trie.current.returnAll())
      };
      if (!isOpen || !showAll) {
        setMatchingItems([])
        setHighlightedIndex(highlightFirstItem === false ? -1 : 0)
      };
    };
    if (onDropdownChangeRef.current) onDropdownChangeRef.current(isOpen)
  }, [isOpen, prefix, highlightFirstItem, showAll, noMatchMessage, savedList])

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    };
    if (submit) {
      submitRef.current()
    };
  }, [open, submit]);

  submitRef.current = () => {
    let match = trie.current.contains(prefix.toString());
    if (match) {
      onSelect(savedList[match.originalIndex])
    } else if (handleNewValue && prefix) {
      console.log(prefix)
      handleNewValue(prefix)
    } else if ((!match || !handleNewValue) && onSelectError) {
      onSelectError()
    };
    resetInputValue("")
  };

  if (highlightedIndex > matchingItems.length) {
    setHighlightedIndex(0)
  };

  const resetInputValue = useCallback((matchingItem) => {
    setIsOpen(false)
    if (!controlSubmit) {
      setPrefix("")
    } else {
      setPrefix(matchingItem)
    };
  }, [controlSubmit]);

  const onHighlightChange = (index, reset) => {
    if (matchingItems[index]) {
      handleHighlight(savedList[matchingItems[index].originalIndex])
    } else {
      handleHighlight(savedList[matchingItems[reset].originalIndex])
    };
  };

  const handleKeyDown = (event) => {
    if (event) {
      switch (event.key) {
        case 'ArrowDown':
          if (matchingItems.length) {
            event.preventDefault()
            if (!matchingItems[highlightedIndex + 1]) {
              setHighlightedIndex(0)
            } else if (matchingItems[highlightedIndex + 1]) {
              setHighlightedIndex(highlightedIndex + 1)
            };
            if (handleHighlight && matchingItems[0].originalIndex >= 0) {
              onHighlightChange(highlightedIndex + 1, 0)
            };
          };
          break;
        case 'ArrowUp':
          event.preventDefault()
          if (highlightedIndex === 0) {
            setHighlightedIndex(matchingItems.length - 1)
          } else if (matchingItems[highlightedIndex - 1]) {
            setHighlightedIndex(highlightedIndex - 1)
          };
          if (handleHighlight && matchingItems[0].originalIndex >= 0) {
            onHighlightChange(highlightedIndex - 1, matchingItems.length - 1)
          };
          break;
        case 'Enter':
          const highlighted = matchingItems[highlightedIndex]
          if (!controlSubmit) {
            if (highlighted && highlighted.originalIndex >= 0) {
              onSelect(savedList[highlighted.originalIndex]);
            } else if (prefix) {
              let match = trie.current.contains(prefix);
              if (!match) {
                if (handleNewValue) {
                  handleNewValue(prefix)
                } else if (onSelectError) {
                  onSelectError()
                };
              } else {
                onSelect(savedList[match.originalIndex])
              };
            };
            resetInputValue()
            event.target.blur()
          } else {
            if (highlighted && highlighted.originalIndex >= 0) {
              resetInputValue(highlighted.value)
            } else if (prefix) {
              resetInputValue(prefix)
            };
            event.target.blur()
          };
          break;
        case 'Tab':
          setIsOpen(false)
          break;
        default:
          break;
      };
    };
  };

  return (
    <div
      className="autocomplete-wrapper"
      style={wrapperStyle}
      ref={wrapperRef}
    >
      <Input
        inputStyle={inputStyle}
        prefix={prefix}
        inputProps={inputProps}
        setPrefix={setPrefix}
        handleKeyDown={handleKeyDown}
        setIsOpen={setIsOpen}
      />
      {isOpen &&
        <DropDown
          matchingItems={matchingItems}
          highlightedIndex={highlightedIndex}
          setHighlightedIndex={setHighlightedIndex}
          onSelect={onSelect}
          handleHighlight={handleHighlight}
          resetInputValue={resetInputValue}
          highlightedItemStyle={highlightedItemStyle}
          listItemStyle={listItemStyle}
          dropDownStyle={dropDownStyle}
          controlSubmit={controlSubmit}
          submit={submit}
          savedList={savedList}
        />
      }
    </div>
  )
};