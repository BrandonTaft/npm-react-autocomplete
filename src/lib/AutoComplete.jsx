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
  handleHighlight,
  handleSelect,
  handleSelectError,
  handleNewValue,
  disableOutsideClick = false,
  handleNoMatchMessage = true,
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
  const inputRef = useRef();
  const wrapperRef = useRef();

  const onOutsideClick = useCallback(() => { setIsOpen(false) }, [])
  useOnOutsideClick(wrapperRef, onOutsideClick, disableOutsideClick)

  useEffect(() => {
    // If `list` is new - store it in the `savedList` state
    if (!isEqual(list, savedList)) {
      setSavedList(list)
    }
  }, [list, savedList])

  // Create the `filtered` array with specified words to go into the trie
  // If `list` contains objects - use getPropvalueRef to map out desired words  
  useEffect(() => {
    let filtered;
    try {
      if (savedList.some(value => { return typeof value == "object" })) {
        if (getPropValueRef.current) {
          try {
            filtered = (getPropValueRef.current(savedList))
          } catch (error) {
            console.error("Check the getPropValue function : the property value doesn't seem to exist", '\n', error)
          };
        } else {
          console.error("Missing prop - 'getPropValue' is needed to get an object property value from 'list'")
          return
        }
      } else {
        filtered = [...savedList]
      }
    } catch (error) {
      console.error(`Ivalid PropType : The prop 'list' has a value of '${typeof savedList}' - list must be an array`, '\n', error)
      return
    } finally {
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
    }
  }, [savedList])


  // When dropdown is opened - finds the matching items to be displayed
  // When dropdown is closed - resets the matching items and highlighted index
  useEffect(() => {
    if (isOpen) {
      inputRef.current.focus()
      if (prefix) {
        setMatchingItems(trie.current.find(prefix, handleNoMatchMessage))
      } else {
        if (showAll) {
          setMatchingItems(
            trie.current.returnAll()
          )
        } else {
          setMatchingItems([])
        }
      }
    } else {
      inputRef.current.blur()
      setMatchingItems([])
      setHighlightedIndex(highlightFirstItem === false ? -1 : 0)
    }
    if (onDropdownChangeRef.current) { onDropdownChangeRef.current(isOpen) }
  }, [isOpen, prefix, highlightFirstItem, showAll, handleNoMatchMessage, savedList])

  // Optionally control logic of dropdown by passing in desired state of isOpen to `open`
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  // If the input value is already a stored value, `handleSelect` is invoked
  // If the input value is not a stored word `handleNewValue` is invoked
  submitRef.current = () => {
    let match = trie.current.contains(prefix.toString());
    if (match && handleSelect) {
      handleSelect(savedList[match.originalIndex])
      resetInputValue("")
    } else if (handleNewValue && prefix) {
      handleNewValue(prefix)
      resetInputValue("")
    } else if ((!match || !handleNewValue) && handleSelectError) {
      handleSelectError()
    }
  }

  // Invokes function stored in submitRef when submit is updated to `true` and text is present
  useEffect(() => {
    if (submit && inputRef.current.value) {
      submitRef.current()
    }
  }, [submit])

  const resetInputValue = useCallback((matchingItem) => {
    setIsOpen(false)
    if (!controlSubmit) {
      setPrefix("")
    } else {
      setPrefix(matchingItem)
    }
  }, [controlSubmit])

  // Text input onChange sets value to prefix state and opens dropdown
  const handlePrefix = (event) => {
    setPrefix(event.target.value)
    if (event.target.value && !isOpen) {
      setIsOpen(true)
    }
  };

  const onHandleHighlight = (index, reset) => {
    if (matchingItems[index]) {
      handleHighlight(savedList[matchingItems[index].originalIndex])
    } else {
      handleHighlight(savedList[matchingItems[reset].originalIndex])
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
      if (handleHighlight) {
        onHandleHighlight(highlightedIndex + 1, 0)
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
      if (handleHighlight) {
        onHandleHighlight(highlightedIndex - 1, matchingItems.length - 1)
      }
    }
    
    // Enter key - Invokes the handleSelect function with the highlighted item's original value
    // If there is not a highlighted item it will pass the input's value into the handleSelect function
    if (event.key === 'Enter') {
      if (!controlSubmit) {
        if (matchingItems[highlightedIndex]) {
          if (handleSelect) {
            try {
              handleSelect(
                savedList[matchingItems[highlightedIndex].originalIndex]
              );
            } catch (error) {
              console.error("You must provide a valid function to the handleSelect prop", '\n', error)
            }
          }
          resetInputValue(matchingItems[highlightedIndex].value)
        } else {
          if (prefix) {
            let match = trie.current.contains(prefix);
            try {
              if (!match) {
                if (handleNewValue) {
                  handleNewValue(prefix)
                  resetInputValue(prefix)
                } else if (handleSelectError) {
                  handleSelectError()
                }
              } else if (handleSelect) {
                handleSelect(savedList[match.originalIndex])
                resetInputValue(prefix)
              }
            } catch (error) {
              console.error("MISSING PROP: You must provide a valid function to the handleSelect prop", '\n', error)
            }
          }
        }
      } else {
        if (matchingItems[highlightedIndex]) {
          resetInputValue(matchingItems[highlightedIndex].value)
        } else if (prefix) {
          resetInputValue(prefix)
        }
      }
    }
    // Tab key takes focus off the input and closes the dropdown 
    if (event.key === 'Tab') {
      setIsOpen(false)
    }
  }

  return (
    <div
      className="autocomplete-wrapper"
      style={wrapperStyle}
      ref={wrapperRef}
    >
      <Input
        ref={inputRef}
        inputStyle={inputStyle}
        prefix={prefix}
        inputProps={inputProps}
        handlePrefix={handlePrefix}
        handleKeyDown={handleKeyDown}
        setIsOpen={setIsOpen}
      />
      {isOpen &&
        <DropDown
          matchingItems={matchingItems}
          highlightedIndex={highlightedIndex}
          setHighlightedIndex={setHighlightedIndex}
          handleSelect={handleSelect}
          handleHighlight={handleHighlight}
          resetInputValue={resetInputValue}
          highlightedItemStyle={highlightedItemStyle}
          listItemStyle={listItemStyle}
          dropDownStyle={dropDownStyle}
          controlSubmit={controlSubmit}
          savedList={savedList}
        />
      }
    </div>
  )
}