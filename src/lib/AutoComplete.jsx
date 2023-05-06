import React from 'react';
import { useEffect, useState, useRef, useReducer } from "react";
import scrollIntoView from 'dom-scroll-into-view';
import Wrapper from './Wrapper';
import Trie from "./trie";

export default function AutoComplete({
  list,
  getPropValue,
  
  showAll = false,
  descending = false,
  
  clearOnSubmit = true,
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
  handleHighlightedItem,
  onSelect,
  clearOnSelect = onSelect ? true : false,
  handleNewValue,
  submit,
  updateSubmit = () => {},
  handleSubmit
}) {
  const getPropValueRef = useRef();
  const updateRef = useRef();
  const submitRef = useRef(submit);
  const matchingItemsRef = useRef([]);
  const trie = useRef();
  const inputRef = useRef();
  const dropDownRef = useRef();
  const itemsRef = useRef([]);
  const [savedList, setSavedList] = useState([]);
  const [savedFunction, setSavedFunction] = useState();
  const initialState = {
    filterItems: [],
    matchingItems: [],
    highlightedIndex: highlightFirstItem ? 0 : -1
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "OPEN": {
        matchingItemsRef.current = action.payload
        return ({
          ...state,
          matchingItems: action.payload,
        })
      }
      case "CLOSE": {
        matchingItemsRef.current = []
        if (highlightFirstItem === false) {
          return ({
            ...state,
            matchingItems: [],
            highlightedIndex: -1
          })
        } else {
          return ({
            ...state,
            matchingItems: [],
            highlightedIndex: 0
          })
        }
      }
      case "DOWN": {
        return ({
          ...state,
          highlightedIndex: state.highlightedIndex + 1
        })
      }
      case "UP": {
        return ({
          ...state,
          highlightedIndex: state.highlightedIndex - 1
        })
      }
      case "UPDATE": {
        return ({
          ...state,
          highlightedIndex: action.payload
        })
      }
      case "FILTER": {
        return ({
          ...state,
          filteredItems: action.payload
        })
      }
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { filteredItems, matchingItems, highlightedIndex } = state;

  // Store `updateIsOpen` in a ref to avoid triggering useEffect that -
  // just checks if it was passed in as a prop
  updateRef.current = updateIsOpen;

  // Shallow check for new `list`
  // If `list` is new - store it in the `savedList` state
  if (JSON.stringify(list) !== JSON.stringify(savedList)) {
    setSavedList(list)
  }

  // If `getPropValue` is new - 
  // Store it as a string in the `savedFunction` state for shallow comparison
  // Then store the `getPropValue` function in the `getPropValueRef` 
  if (getPropValue && getPropValue.toString() !== savedFunction) {
    setSavedFunction(getPropValue.toString())
    getPropValueRef.current = getPropValue
  }

  // When `list` or `getPropValue` function changes - 
  // Create the `filteredItems` array with specified words to go into the trie
  // If `list` contains objects - use getPropvalueRef to map out desired words  
  useEffect(() => {
    if (Array.isArray(savedList)) {
      if (savedList.some(value => { return typeof value == "object" })) {
        if (getPropValueRef.current) {
          try {
            dispatch({ type: "FILTER", payload: savedList.map(getPropValueRef.current) })
          } catch (error) {
            console.error("Check the getPropValue function : the property value doesn't seem to exist", '\n', error)
          };
        } else if (!getPropValueRef.current) {
          console.error("Missing prop - 'getPropValue' is needed to get an object property value from 'list'")
          return
        }
      } else {
        dispatch({ type: "FILTER", payload: savedList })
      }
    } else if (savedList === undefined) {
      return
    } else {
      console.error(`Ivalid PropType : The prop 'list' has a value of '${typeof savedList}' - list must be an array`)
      return
    };
  }, [savedList, savedFunction])

  //Insert the items in `filteredItems` into the trie
  useEffect(() => {
    trie.current = new Trie();
    if (filteredItems) {
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

  // Runs when dropdown is open and the getPropValue function changes
  // Allows user to toggle property values in dropdown while its open
  useEffect(() => {
    if (matchingItemsRef.current.length) {
      dispatch({ type: "OPEN", payload: filteredItems.map((item, index) => ({ value: item, originalIndex: index })) });
    }
  }, [filteredItems])

  // Opens dropdown when isOpen is passed from parent as `true` - close when `false`
  // `handleUpdateIsOpen` function runs when the dropdown is opened/closed by the child -
  // it sends the updated state of `isOpen` back to the parent
  useEffect(() => {
    if (updateRef.current && !isOpen) {
      dispatch({ type: "CLOSE" });
    } else if (updateRef.current && isOpen) {
      if (inputRef.current) { inputRef.current.focus() }
      if (showAll && !inputRef.current.value) {
        if (filteredItems) {
          dispatch({ type: "OPEN", payload: filteredItems.map((item, index) => ({ value: item, originalIndex: index })) });
        }
      } else if (showAll && inputRef.current.value) {
        dispatch({ type: "OPEN", payload: trie.current.find(inputRef.current.value) });
      } else if (!showAll && inputRef.current.value) {
        dispatch({ type: "OPEN", payload: trie.current.find(inputRef.current.value) });
      }
    };
  }, [isOpen, showAll, filteredItems])

  // Runs the function passed in as `handleHighlightedItem` prop
  // Passes in the higlighted element's `HTMLDivElement` & the string or object from the original list
  useEffect(() => {
    if (itemsRef.current[highlightedIndex] && handleHighlightedItem) {
      handleHighlightedItem(itemsRef.current[highlightedIndex], savedList[matchingItems[highlightedIndex].originalIndex])
    }
  }, [handleHighlightedItem, highlightedIndex, matchingItems, savedList])

  // If the input value is already a stored word the `handleSubmit` function runs
  // If the input value is not a stored word the handleNewValue function runs
  submitRef.current = () => {
    let match = trie.current.contains(inputRef.current.value);
    if (match) {
      handleSubmit(list[match.originalIndex], match.originalIndex)
    } else if(handleNewValue) {
      handleNewValue(inputRef.current.value.toString())
    } else {
      handleSubmit(inputRef.current.value.toString())
    }
    resetOnSubmit(inputRef.current.value)
  }

  // When submit is updated to `true` and text is entered into the input
  // The function stored in the `submitRef` will run the set submit back to false
  useEffect(() => {
    if (submit && inputRef.current.value) {
      submitRef.current()
    }
    updateSubmit(false)
  }, [submit, updateSubmit])

  // Handles text input and if `showAll` is true it opens the dropdown when input is focused
  // Runs the trie's `find` method to search for words that match the text input
  const handlePrefix = (e) => {
    const prefix = e.target.value
    if (!highlightFirstItem) {
      dispatch({ type: "UPDATE", payload: -1 });
    }
    if (filteredItems && showAll && prefix.length === 0) {
      dispatch({
        type: "OPEN", payload: filteredItems.map((item, index) => (
          {
            value: item,
            originalIndex: index
          }
        ))
      });
      handleUpdateIsOpen(true)
      return
    }
    if (prefix.length > 0) {
      dispatch({ type: "OPEN", payload: trie.current.find(e.target.value) });
      handleUpdateIsOpen(true)
    } else if (matchingItems.length) {
      dispatch({ type: "CLOSE" });
      handleUpdateIsOpen(false)
    }
    if (highlightedIndex + 1 > matchingItems.length) {
      dispatch({ type: "UPDATE", payload: 0 });
    }
  };

  const handleKeyDown = (e) => {
    // Down Arrow - sets the next index in the 'dropDownList' as the highlighted index
    // `scrollIntoView` scrolls the dropdown to keep highlight visible once it reaches the bottom 
    // If the highlighted index is the last index it resets the highlighted index back to 0
    if (e.keyCode === 40 && matchingItems.length) {
      e.preventDefault()
      if (!itemsRef.current[highlightedIndex + 1]) {
        dispatch({ type: "UPDATE", payload: 0 });
        scrollIntoView(
          itemsRef.current[0],
          dropDownRef.current,
          { onlyScrollIfNeeded: true }
        )
      }
      if (itemsRef.current[highlightedIndex + 1]) {
        dispatch({ type: "DOWN" });
        scrollIntoView(
          itemsRef.current[highlightedIndex + 1],
          dropDownRef.current,
          { onlyScrollIfNeeded: true }
        )
      }
    }

    // Up Arrow - Moves highlight up the dropdown by setting highlighted index one index back
    // `scrollIntoView` scrolls the dropdown to keep highlight visible once it reaches the top 
    if (e.keyCode === 38) {
      e.preventDefault()
      if (itemsRef.current[highlightedIndex - 1]) {
        dispatch({ type: "UP" });
        scrollIntoView(
          itemsRef.current[highlightedIndex - 1],
          dropDownRef.current,
          { onlyScrollIfNeeded: true }
        )
      }
    };

    // Enter key - Executes the `onSelect` function with 3 seperate arguments - 
    // the highlighted item's original `string` or `object`, it's `HTMLelement`, and it's index from the original list
    // If there is not a highlighted item it will pass the input's value into the 'onSelect' function
    // Then closes the dropdown and runs the `resetInputValue` function which uses `clearOnSelect` prop to clear the input or not
    if (e.keyCode === 13) {
      if (list && matchingItems[highlightedIndex]) {
        if (onSelect) {
          try {
            onSelect(
              list[matchingItems[highlightedIndex].originalIndex],
              matchingItems[highlightedIndex].originalIndex,
              itemsRef.current[highlightedIndex]
            )
          } catch (error) {
            console.error("You must provide a valid function to the 'onSelect' prop", '\n', error)
          }
        }
        dispatch({ type: "CLOSE" });
        handleUpdateIsOpen(false)
        resetInputValue(matchingItems[highlightedIndex].value)
      } else {
        if (inputRef.current.value) {
          if(handleSubmit) {
            updateSubmit(true)
          } else {
          let match = trie.current.contains(inputRef.current.value);
          try {
            if (!match) {
              if (handleNewValue) {
                handleNewValue(inputRef.current.value.toString())
              } else {
                onSelect(inputRef.current.value.toString())
              }
            } else {
              onSelect(list[match.originalIndex], match.originalIndex)
            }
          } catch (error) {
            console.error("MISSING PROP: You must provide a valid function to the 'onSelect' prop", '\n', error)
          } finally {
            dispatch({ type: "CLOSE" });
            handleUpdateIsOpen(false)
            resetInputValue(inputRef.current.value)
          }
        }
        }
      }
    }
    // Tab key takes focus off the input and closes the dropdown 
    if (e.keyCode === 9) {
      dispatch({ type: "CLOSE" });
      handleUpdateIsOpen(false)
    }
  }

  // When an item is clicked on - Executes the `onSelect` function with 3 seperate arguments - 
  // the highlighted item's original `string` or `object`, it's `HTMLelement`, and it's index from the original list
  // If there is not a highlighted item it will pass the input's value into the 'onSelect' function
  // Then closes the dropdown and runs the `resetInputValue` function which uses `clearOnSelect` prop to clear the input or not
  const onMouseClick = (index, selectedElement, matchingItem) => {
    if (onSelect) {
      try {
        onSelect(list[index], index, selectedElement)
      } catch (error) {
        console.error("You must provide a valid function to the 'onSelect' prop", '\n', error)
      }
    }
    dispatch({ type: "CLOSE" });
    handleUpdateIsOpen(false)
    resetInputValue(matchingItem);

  }

  // Onscroll function determines the highlighted elements position within the dropdown
  // to keep the highlight inside the dropdown by moving the `highlightedIndex` up or down accordingly
  const scrollMe = () => {
    if (itemsRef.current[highlightedIndex]) {
      let itemHeight = itemsRef.current[highlightedIndex].getBoundingClientRect().height
      let containerTop = Math.round(dropDownRef.current.getBoundingClientRect().top)
      let itemTop = Math.round(itemsRef.current[highlightedIndex].getBoundingClientRect().top)
      let height = Math.round(dropDownRef.current.getBoundingClientRect().height)
      let bottom = containerTop + height
      if (containerTop > itemTop) {
        dispatch({ type: "DOWN" });
        scrollIntoView(
          itemsRef.current[highlightedIndex],
          dropDownRef.current,
          {
            alignWithTop: true,
            onlyScrollIfNeeded: true
          }
        )
      }
      if (bottom < itemTop + (itemHeight / 1.2)) {
        dispatch({ type: "UP" });
        scrollIntoView(
          itemsRef.current[highlightedIndex],
          dropDownRef.current,
          {
            alignWithTop: false,
            onlyScrollIfNeeded: true
          }
        )
      }
    }
  }

  // Creates a new Collator object and uses its compare method to natural sort the array
  var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  const sorted = matchingItems.sort(function (a, b) {
    if (!descending) {
      return collator.compare(a.value, b.value)
    } else {
      return collator.compare(b.value, a.value)
    }
  });

  const dropDownList = sorted.map((matchingItem, index) => {
    if (highlightedIndex + 1 > matchingItems.length) {
      dispatch({ type: "UPDATE", payload: 0 });
    }
    return (
      matchingItem.value !== undefined ?
        <div
          key={matchingItem.originalIndex}
          ref={el => itemsRef.current[index] = el}
          className={highlightedIndex === index ? "dropdown-item highlited-item" : "dropdown-item"}
          style={highlightedIndex === index ? { ...highlightedItemStyle, ...listItemStyle } : { ...listItemStyle }}
          onClick={() => { onMouseClick(matchingItem.originalIndex, itemsRef.current[index], matchingItem.value) }}
          onMouseEnter={() => dispatch({ type: "UPDATE", payload: index })}
        >
          {matchingItem.value}
        </div>
        : null
    )
  })

  return (
    <Wrapper
      className="autocomplete-wrapper"
      disabled={disableOutsideClick}
      display={wrapperDiv}
      wrapperStyle={wrapperStyle}
      onOutsideClick={(e) => {
        if (matchingItems.length) {
          dispatch({ type: "CLOSE" });
        }
        handleUpdateIsOpen(false)
      }}>
      <input
        className="autocomplete-input"
        style={inputStyle}
        ref={inputRef}
        type="search"
        {...inputProps}
        onClick={handlePrefix}
        onChange={handlePrefix}
        onKeyDown={handleKeyDown}
        onFocus={handlePrefix}
        autoComplete='off'
      />
      {dropDownList.length
        ?
        <div
          className="dropdown-container"
          ref={dropDownRef}
          style={dropDownStyle}
          onScroll={scrollMe}
        >
          {dropDownList}
        </div>
        :
        null}
    </Wrapper>
  )

  // Sets the value of the input to be what is specified in 'clearOnSelect' prop
  // When onSelect runs it will clear the input if 'clearOnSelect' is set to true
  // If clearOnSelect is set to false it will set the input value to the word passed in
  function resetInputValue(matchingItem) {
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

  // Sets the value of the input to be what is specified in 'clearOnSubmit' prop
  // When onSelect runs it will clear the input if 'clearOnSubmit' is set to true
  // If clearOnSubmit is set to false it will set the input value to the word passed in
  function resetOnSubmit(matchingItem) {
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

  // Passes the state of `isOpen` back to parent when dropdown is open -
  // or closed from the Autocomplete function ("the child")
  function handleUpdateIsOpen(isItOpen) {
    if (updateIsOpen) {
      updateIsOpen(isItOpen)
    }
  }

}
