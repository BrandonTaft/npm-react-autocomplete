import React from 'react';
import { useEffect, useState, useRef, useReducer } from "react";
import scrollIntoView from 'dom-scroll-into-view';
import Wrapper from './Wrapper';
import Trie from "./trie";

export default function AutoComplete({
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
}) {
  const getPropValueRef = useRef();
  const updateRef = useRef();
  const trie = useRef();
  const inputRef = useRef();
  const dropDownRef = useRef();
  const itemsRef = useRef([]);
  const [savedList, setSavedList] = useState([]);
  const [savedFunction, setSavedFunction] = useState()
  const initialState = {
    filterItems: [],
    matchingItems: [],
    highlightedIndex: highlightFirstItem ? 0 : -1
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "OPEN": {
        return ({
          ...state,
          matchingItems: action.payload,
        })
      }
      case "CLOSE": {
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
  updateRef.current = updateIsOpen;

  // Shallow check for new `list`
  // If `list` is new - store it in the `savedList` state
  if (JSON.stringify(list) !== JSON.stringify(savedList)) {
    setSavedList(list)
  }

  // If `getPropValue` is new - 
  // Store it as a string in the `savedFunction` state for shallow comparison
  // Then store the `getPropValue` function in the `getPropValueRef` 
  if (getPropValue.toString() !== savedFunction) {
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
    } else {
      console.error(`Ivalid PropType : The prop 'list' has a value of '${typeof savedList}' - list must be an array`)
      return
    };
  }, [savedList, savedFunction])

  //Insert the words in `filteredItems` into the trie
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

  // Opens dropdown when isOpen is passed from parent as `true` - close when `false`
  // `handleUpdateIsOpen` is a function that runs when the dropdown is opened or closed by the child
  // it sends the updated state of `isOpen` back to the parent
  useEffect(() => {
    if (updateRef.current && !isOpen) {
      dispatch({ type: "CLOSE" });
    } else if (updateRef.current && isOpen) {
      if (inputRef.current) { inputRef.current.focus() }
      if (showAll && !inputRef.current.value) {
        dispatch({ type: "OPEN", payload: filteredItems.map((item, index) => ({ value: item, originalIndex: index })) });
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

  // Handles text input and if `showAll` is true it opens the dropdown when input is in focus
  // Runs the trie's find method to search for words that match the text input
  const handlePrefix = (e) => {
    const prefix = e.target.value
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

  // Handles keypresses when input is in focus
  const handleKeyDown = (e) => {
    // Down Arrow - sets the next index in the 'matchingItemsList' as the highlighted index
    // If the highlighted index is the last index it resets the highlighted index back to 0
    if (e.keyCode === 40) {
      if (!itemsRef.current[highlightedIndex + 1] && itemsRef.current[0] !== undefined) {
        dispatch({ type: "UPDATE", payload: 0 });
        scrollIntoView(
          itemsRef.current[0],
          dropDownRef.current,
          { onlyScrollIfNeeded: true }
        )
      }
      e.preventDefault()
      if (itemsRef.current[highlightedIndex + 1]) {
        dispatch({ type: "DOWN" });
        scrollIntoView(
          itemsRef.current[highlightedIndex + 1],
          dropDownRef.current,
          { onlyScrollIfNeeded: true }
        )
      }
    }

    //Up Arrow - sets the highlighted index as the one before the current index
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

    // Enter key - Passes highlighted item in to the 'onselect' function and closes the dropdown
    // If there is not a highlighted item it will pass the inputs value into the 'onSelect' function
    if (e.keyCode === 13) {
      if (list && matchingItems[highlightedIndex]) {
        try {
          onSelect(
            list[matchingItems[highlightedIndex].originalIndex],
            itemsRef.current[highlightedIndex],
            matchingItems[highlightedIndex].originalIndex
          )
        } catch (error) {
          console.error("You must provide a valid function to the 'onSelect' prop", '\n', error)
        } finally {
          dispatch({ type: "CLOSE" });
          handleUpdateIsOpen(false)
          resetInputValue(matchingItems[highlightedIndex].value)
        }
      } else {
        if (inputRef.current.value) {
          try {
            onSelect(inputRef.current.value.toString(), list)
          } catch (error) {
            console.error("You must provide a valid function to the 'onSelect' prop", '\n', error)
          } finally {
            dispatch({ type: "CLOSE" });
            handleUpdateIsOpen(false)
            resetInputValue(inputRef.current.value)
          }
        }
      }
    }
    // Tab key closes the dropdown 
    if (e.keyCode === 9) {
      dispatch({ type: "CLOSE" });
      handleUpdateIsOpen(false)
    }
  }

  // Runs the function passed in to the onSelect prop and then closes the dropdown
  const onMouseClick = (index, selectedElement, matchingItem) => {
    try {
      onSelect(list[index], selectedElement, index)
    } catch (error) {
      console.error("You must provide a valid function to the 'onSelect' prop", '\n', error)
    } finally {
      dispatch({ type: "CLOSE" });
      handleUpdateIsOpen(false)
      resetInputValue(matchingItem);

    }
  }

  // Creates a new Collator object and uses its compare method to sort alphanumeric arrays
  var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  const sorted = matchingItems.sort(function (a, b) {
    return collator.compare(a.value, b.value)
  });

  const matchingItemsList = sorted.map((matchingItem, index) => {
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

  // Onscroll function used to keep highlight inside the dropdown
  const scrollMe = () => {
    if (itemsRef.current) {
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
      {matchingItemsList.length
        ?
        <div
          className="dropdown-container"
          ref={dropDownRef}
          style={dropDownStyle}
          onScroll={scrollMe}
        >
          {matchingItemsList}
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

  // Passes the state of `isOpen` back to parent when dropdown is open -
  // or closed from the Autocomplete function ("the child")
  function handleUpdateIsOpen(isItOpen) {
    if (updateIsOpen) {
      updateIsOpen(isItOpen)
    }
  }

}
