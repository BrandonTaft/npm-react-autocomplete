import React, { useCallback, useEffect, useState, useRef } from 'react';
import DropDown from './DropDown';
import Input from './Input';
import Trie from "./trie";
import useOnOutsideClick from './useOnOutsideClick';
import isEqual from "lodash.isequal";

export default function AutoComplete({
  list,
  getPropValue,
  showAll = false,
  highlightFirstItem = true,
  inputProps,
  onHighlight,
  onSelect,
  onSelectError,
  handleNewValue,
  disableOutsideClick = false,
  noMatchMessage = true,
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
  const getPropValueRef = useRef(getPropValue);
  const onDropdownChangeRef = useRef(onDropdownChange);
  const submitRef = useRef();
  const trie = useRef();
  const wrapperRef = useRef();

  const onOutsideClick = useCallback(() => { setIsOpen(false) }, [])
  useOnOutsideClick(wrapperRef, onOutsideClick, disableOutsideClick)

  if (!isEqual(list, savedList)) setSavedList(list)

  // Create the `filtered` array with specified words to go into the trie
  // If `list` contains objects - use getPropvalueRef to filter out desired words  
  useEffect(() => {
    let filtered;
      if (savedList.some(value => { return typeof value == "object" })) {
        if (getPropValueRef.current) {
            filtered = (getPropValueRef.current(savedList))
        } 
      } else {
        filtered = [...savedList]
      }
      if (filtered.length) {
        trie.current = new Trie();
        for (let i = 0; i < filtered.length; i++) {
          const item = filtered[i]
          if (item && typeof item == 'number') {
            trie.current.insert(item.toString(), i)
          } else if (item) {
            trie.current.insert(item, i)
          };
        };
      };
  }, [savedList])


  // When dropdown is opened - finds the matching items to be displayed
  // When dropdown is closed - resets the matching items and highlighted index
  useEffect(() => {
    if (isOpen) {
      if (prefix) {
        setMatchingItems(trie.current.find(prefix, noMatchMessage))
      } else {
        if (showAll) {
          setMatchingItems(trie.current.returnAll())
        } 
      }
    } else {
      setMatchingItems([])
      setHighlightedIndex(highlightFirstItem === false ? -1 : 0)
    }
    if (onDropdownChangeRef.current) { onDropdownChangeRef.current(isOpen) }
  }, [isOpen, prefix, highlightFirstItem, showAll, noMatchMessage, savedList])

  // Optionally control logic of dropdown by passing in desired state of isOpen to `open`
  // Invokes function stored in submitRef when submit is updated to `true` and text is present
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
    if (submit) {
      submitRef.current()
    }
  }, [open, submit])


  // If the input value is already a stored value, `onSelect` is invoked
  // If the input value is not a stored word `handleNewValue` is invoked
  submitRef.current = () => {
    let match = trie.current.contains(prefix.toString());
    if (match && onSelect) {
      onSelect(savedList[match.originalIndex])
    } else if (handleNewValue && prefix) {
      handleNewValue(prefix)
    } else if ((!match || !handleNewValue) && onSelectError) {
      onSelectError()
    }
    resetInputValue("")
  }

  const resetInputValue = useCallback((matchingItem) => {
    setIsOpen(false)
    if (!controlSubmit) {
      setPrefix("")
    } else {
      setPrefix(matchingItem)
    }
  }, [controlSubmit])

  const handleHighlight = (index, reset) => {
    if (matchingItems[index]) {
      onHighlight(savedList[matchingItems[index].originalIndex])
    } else {
      onHighlight(savedList[matchingItems[reset].originalIndex])
    }
  }

  const handleKeyDown = (event) => {
    // Down Arrow - sets the next index in the 'dropDownList' as the highlighted index
    // If the highlighted index is the last index it resets the highlighted index back to 0
    if (event.key === 'ArrowDown' && matchingItems.length) {
      event.preventDefault()
      if (!matchingItems[highlightedIndex + 1]) {
        setHighlightedIndex(0)
      } else if (matchingItems[highlightedIndex + 1]) {
        setHighlightedIndex(highlightedIndex + 1)
      }
      if (onHighlight) {
        handleHighlight(highlightedIndex + 1, 0)
      }
    }

    // Up Arrow - Moves highlight up the dropdown by setting highlighted index one index back
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (highlightedIndex === 0) {
        setHighlightedIndex(matchingItems.length - 1)
      } else if (matchingItems[highlightedIndex - 1]) {
        setHighlightedIndex(highlightedIndex - 1)
      }
      if (onHighlight) {
        handleHighlight(highlightedIndex - 1, matchingItems.length - 1)
      }
    }

     //Tab key takes focus off the input and closes the dropdown 
     if (event.key === 'Tab') {
      setIsOpen(false)
    }

    // Enter key - Invokes the onSelect function with the highlighted item's original value
    // If there is not a highlighted item it will pass the input's value into the onSelect function
    if (event.key === 'Enter') {
      if (!controlSubmit) {
        if (onSelect) {
          if (matchingItems[highlightedIndex]) {
            onSelect(savedList[matchingItems[highlightedIndex].originalIndex]);
          } else if (prefix) {
            let match = trie.current.contains(prefix);
            if (!match) {
              if (handleNewValue) {
                handleNewValue(prefix)
              } else if (onSelectError) {
                onSelectError()
              }
            } else {
              onSelect(savedList[match.originalIndex])
            }
          }
          resetInputValue()
          event.target.blur()
        }
       
      } else {
        if (matchingItems[highlightedIndex]) {
          resetInputValue(matchingItems[highlightedIndex].value)
        } else if (prefix) {
          resetInputValue(prefix)
        }
      }
    }
  }

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
          onHighlight={onHighlight}
          resetInputValue={resetInputValue}
          highlightedItemStyle={highlightedItemStyle}
          listItemStyle={listItemStyle}
          dropDownStyle={dropDownStyle}
          submit={submit}
          savedList={savedList}
        />
      }
    </div>
  )
}