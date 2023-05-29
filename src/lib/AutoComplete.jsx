import React from 'react';
import { useEffect, useState, useRef } from "react";
import Wrapper from './Wrapper';
import DropDown from './DropDown';
import Trie from "./trie";
import isEqual from "lodash.isequal";

export default function AutoComplete({
  list,
  getPropValue,
  showAll = false,
  descending = false,
  clearOnSubmit = true,
  highlightFirstItem = true,
  forceDropDown,
  onDropdownChange,
  handleHighlight,
  handleSelect,
  clearOnSelect = handleSelect ? true : false,
  handleNewValue,
  submit,
  updateSubmit = () => { },
  handleSubmit,
  disableOutsideClick = false,
  handleNoMatchMessage = true,
  wrapperStyle,
  inputProps,
  inputStyle,
  dropDownStyle,
  listItemStyle,
  highlightedItemStyle = {
    backgroundColor: "dodgerBlue"
  }
}) {
  const [open, setOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [matchingItems, setMatchingItems] = useState([]);
  const [prefix, setPrefix] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(highlightFirstItem ? 0 : -1);
  const [savedList, setSavedList] = useState([]);
  const [savedFunction, setSavedFunction] = useState();
  const getPropValueRef = useRef();
  const onDropdownChangeRef = useRef(onDropdownChange);
  const submitRef = useRef(submit);
  const trie = useRef();
  const inputRef = useRef();


  // If `list` is new - store it in the `savedList` state
  if (!isEqual(list, savedList)) {
    setSavedList(list)
  }

  // If `getPropValue` is new - store it as a string in the `savedFunction` state
  // Store the new `getPropValue` function in the `getPropValueRef`
  if (getPropValue && getPropValue.toString() !== savedFunction) {
    setSavedFunction(getPropValue.toString())
    getPropValueRef.current = getPropValue
  }

  // Create the `filteredItems` array with specified words to go into the trie
  // If `list` contains objects - use getPropvalueRef to map out desired words  
  useEffect(() => {
    try {
      if (savedList.some(value => { return typeof value == "object" })) {
        if (getPropValueRef.current) {
          try {
            setFilteredItems(getPropValueRef.current(savedList))
          } catch (error) {
            console.error("Check the getPropValue function : the property value doesn't seem to exist", '\n', error)
          };
        } else {
          console.error("Missing prop - 'getPropValue' is needed to get an object property value from 'list'")
          return
        }
      } else {
        setFilteredItems(savedList)
      }
    } catch (error) {
      console.error(`Ivalid PropType : The prop 'list' has a value of '${typeof savedList}' - list must be an array`, '\n', error)
      return
    }
  }, [savedList, savedFunction])

  //Insert the `filteredItems` into the trie
  useEffect(() => {
    if (filteredItems.length) {
      trie.current = new Trie();
      for (let i = 0; i < filteredItems.length; i++) {
        const item = filteredItems[i]
        if (item && typeof item == 'number') {
          trie.current.insert(item.toString(), i)
        } else if (item) {
          trie.current.insert(item, i)
        };
      };
    };
  }, [filteredItems])

  // When dropdown is opened - finds the matching items to be displayed
  // When dropdown is closed - resets the matching items and highlighted index
  useEffect(() => {
    if (open) {
      inputRef.current.focus()
      if (inputRef.current.value) {
        setMatchingItems(trie.current.find(prefix, handleNoMatchMessage))
      } else {
        if (showAll) {
          setMatchingItems(
            filteredItems.map((item, index) => ({
              value: item,
              originalIndex: index
            })).filter((item) => {
              return (item.value !== undefined)
            })
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
    if (onDropdownChangeRef.current) { onDropdownChangeRef.current(open) }
  }, [filteredItems, open, prefix, highlightFirstItem, showAll, handleNoMatchMessage])

  // Optionally control logic of dropdown by passing in desired state of open to `forceDropDown`
  useEffect(() => {
    if (forceDropDown !== undefined) {
      setOpen(forceDropDown)
    }
  }, [forceDropDown])

  // When highlightedIndex changes - Invokes `handleHighlight` function with highlighted item's value
  useEffect(() => {
    if (handleHighlight) {
      handleHighlight(list[matchingItems[highlightedIndex].originalIndex])
    }
  }, [handleHighlight, highlightedIndex, matchingItems, list])

  // If the input value is already a stored value, `handleSubmit` is invoked
  // If the input value is not a stored word `handleNewValue` is invoked
  submitRef.current = () => {
    let match = trie.current.contains(inputRef.current.value);
    if (match && handleSubmit) {
      handleSubmit(list[match.originalIndex])
    } else if (handleNewValue && inputRef.current.value) {
      handleNewValue(inputRef.current.value)
    } else if (handleSubmit) {
      handleSubmit(inputRef.current.value)
    }
    resetOnSubmit(inputRef.current.value)
  }

  // Invokes function stored in submitRef when submit is updated to `true` and text is present
  // The function stored in the `submitRef` will set submit back to false
  useEffect(() => {
    if (submit && inputRef.current.value && submitRef.current) {
      submitRef.current()
    }
    if (updateSubmit) {
      updateSubmit(false)
    }
  }, [submit, updateSubmit])

  // Text input onChange sets value to prefix state and opens dropdown
  const handlePrefix = (event) => {
    setPrefix(event.target.value)
    if (event.target.value && !open) {
      setOpen(true)
    }
  };

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
    }
    // Up Arrow - Moves highlight up the dropdown by setting highlighted index one index back
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (matchingItems[highlightedIndex - 1]) {
        setHighlightedIndex(highlightedIndex - 1)
      };
    }
    // Enter key - Invokes the handleSelect function with the highlighted item's original value
    // If there is not a highlighted item it will pass the input's value into the handleSelect function
    // Then closes the dropdown and runs the `resetInputValue` function which uses `clearOnSelect` prop to clear the input or not
    if (event.key === 'Enter') {
      if (handleSubmit && !matchingItems.length && updateSubmit) {
        updateSubmit(true)
        return
      }
      if (list && matchingItems[highlightedIndex]) {
        if (handleSelect) {
          try {
            handleSelect(
              list[matchingItems[highlightedIndex].originalIndex]
            );
          } catch (error) {
            console.error("You must provide a valid function to the handleSelect prop", '\n', error)
          }
        }
        resetInputValue(matchingItems[highlightedIndex].value)
      } else {
        if (inputRef.current.value) {
          let match = trie.current.contains(inputRef.current.value);
          try {
            if (!match) {
              if (handleNewValue) {
                handleNewValue(inputRef.current.value)
              } else if (handleSelect) {
                handleSelect(inputRef.current.value)
              }
            } else if (handleSelect) {
              handleSelect(list[match.originalIndex])
            }
          } catch (error) {
            console.error("MISSING PROP: You must provide a valid function to the handleSelect prop", '\n', error)
          } finally {
            resetInputValue(inputRef.current.value)
          }
        }
      }
    }
    // Tab key takes focus off the input and closes the dropdown 
    if (event.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <Wrapper
      className="autocomplete-wrapper"
      disabled={disableOutsideClick}
      wrapperStyle={wrapperStyle}
      onOutsideClick={() => { setOpen(false) }}>
      <input
        className="autocomplete-input"
        style={inputStyle}
        ref={inputRef}
        type="search"
        {...inputProps}
        onChange={handlePrefix}
        onKeyDown={handleKeyDown}
        onClick={() => setOpen(true)}
        autoComplete='off'
      />
      {open &&
        <DropDown
          matchingItems={matchingItems}
          highlightedIndex={highlightedIndex}
          setHighlightedIndex={setHighlightedIndex}
          handleSelect={handleSelect}
          resetInputValue={resetInputValue}
          highlightedItemStyle={highlightedItemStyle}
          listItemStyle={listItemStyle}
          descending={descending}
          dropDownStyle={dropDownStyle}
          list={list}
        />
      }
    </Wrapper>
  )

  // Sets the value of the input to be what is specified in 'clearOnSelect' prop
  function resetInputValue(matchingItem) {
    console.log("RESETINPUT")
    setOpen(false)
    if (inputRef.current) {
      if (clearOnSelect) {
        inputRef.current.value = "";
      } else {
        if (!matchingItem) {
          inputRef.current.value = ""
        } else {
          inputRef.current.value = matchingItem;
        }
      }
    }
  }

  function resetOnSubmit(matchingItem) {
    console.log("RESETONSUBMIT")
    setOpen(false)
    if (inputRef.current) {
      if (clearOnSubmit) {
        inputRef.current.value = "";
      } else {
        if (!matchingItem) {
          inputRef.current.value = ""
        } else {
          inputRef.current.value = matchingItem;
        }
      }
    }
  }

}