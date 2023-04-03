import React from 'react';
import { useEffect, useRef, useReducer } from "react";
import scrollIntoView from 'dom-scroll-into-view';
import Wrapper from './Wrapper';
import Trie from "./trie";

export default function AutoComplete(
  {
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
  }
) {

  const cachedList = useRef();
  const filteredItems = useRef()
  const trie = useRef();
  const inputRef = useRef();
  const dropDownRef = useRef();
  const itemsRef = useRef([]);
  const initialState = {
    matchingItems: [],
    highlightedIndex: highlightFirstItem ? 0 : -1,
    open: true
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  const { matchingItems, highlightedIndex, open } = state;

  function reducer(state, action) {
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
            matchingItems: [],
            highlightedIndex: -1
          })
        } else {
          return ({
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
      case "RESET": {
        return ({
          ...state,
          highlightedIndex: action.payload
        })
      }
      default:
        return state;
    }
  };

  useEffect(() => {
    // If list is not already stored in the trie - store original list in cachedList ref
    // If there are no nested objects, create a new array and store it in filterItems ref
    // If there are nested objects, use 'getPropvalue' to extract property values and set them in filterItems ref
    if (JSON.stringify(cachedList.current) !== JSON.stringify(list)) {
      cachedList.current = Array.from(list)
      if (Array.isArray(list)) {
        if (list.some(value => { return typeof value == "object" })) {
          if (!getPropValue) {
            console.error("Missing prop - 'getPropValue' is needed to get an object property value from 'list'")
          } else {
            try {
              filteredItems.current = list.map(getPropValue)
            } catch (error) {
              console.error("Check the getPropValue function : the property value doesn't seem to exist", '\n', error)
            };
          };
        } else {
          filteredItems.current = Array.from(list)
        };
      } else {
        console.error(`Ivalid PropType : The prop 'list' has a value of '${typeof list}' - list must be an array`)
      };
      // Initialize root node and store in the 'trie' ref
      // Then insert each word in filteredItems array into the 'trie'
      trie.current = new Trie();
      if (filteredItems.current) {
        for (let i = 0; i < filteredItems.current.length; i++) {
          const item = filteredItems.current[i]
          if (item && typeof item == 'number') {
            trie.current.insert(item.toString())
          } else if (item) {
            trie.current.insert(item)
          };
        };
      };

    }
    // It the updateIsOpen prop is passed in - 
    // Close dropdown if isOpen is false
    // Open dropdown if isOpen is true
    if (updateIsOpen && !isOpen) {
      dispatch({ type: "CLOSE" });
    } else if (updateIsOpen && isOpen) {
      if ((showAll) || (!showAll && inputRef.current.value)) {
        dispatch({ type: "OPEN", payload: trie.current.find(inputRef.current.value) });
      }
    };

  }, [list, getPropValue, isOpen, updateIsOpen, showAll]);

  const handlePrefix = (e) => {
    const prefix = e.target.value
    if (filteredItems.current && showAll && prefix.length === 0) {
      dispatch({ type: "OPEN", payload: filteredItems.current });
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
      dispatch({ type: "RESET", payload: 0 });
    }
  };

  const handleKeyDown = (e) => {
    // Down Arrow - sets the next index in the 'matchingItemsList' as the highlighted index
    // If the highlighted index is the last index it resets the highlighted index back to 0
    if (e.keyCode === 40) {
      if (!itemsRef.current[highlightedIndex + 1] && itemsRef.current[0]) {
        dispatch({ type: "RESET", payload: 0 });
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
          onSelect(matchingItems[highlightedIndex].toString(), list)
        } catch (error) {
          console.error("You must provide a valid function to the 'onSelect' prop", '\n', error)
        } finally {
          dispatch({ type: "CLOSE" });
          handleUpdateIsOpen(false)
          resetInputValue(matchingItems[highlightedIndex])
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
  const onMouseClick = (matchingItem) => {
    try {
      onSelect(matchingItem.toString(), list)
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
  const sorted = matchingItems.sort(collator.compare)
  const matchingItemsList = sorted.map((matchingItem, index) => {
    if (highlightedIndex + 1 > matchingItems.length) {
      dispatch({ type: "RESET", payload: 0 });
    }
    return (
      matchingItem ?
        <div
          key={index}
          ref={el => itemsRef.current[index] = el}
          id={`suggested-word-${index}`}
          className={"list-item"}
          style={highlightedIndex === index ? { ...highlightedItem, ...filteredItemstyle } : { ...filteredItemstyle }}
          onClick={() => { onMouseClick(matchingItem) }}
          onMouseEnter={() => dispatch({ type: "RESET", payload: index })}
        >
          {matchingItem}
        </div>
        : ""
    )
  })

  return (
    <Wrapper
      disabled={disableOutsideClick}
      display={wrapperDiv}
      wrapperStyle={wrapperStyle}
      className={"wrapper"}
      onOutsideClick={(e) => {
        if (matchingItems.length) {
          dispatch({ type: "CLOSE" });
        }
        handleUpdateIsOpen(false)
      }}>
      <input
        {...inputProps}
        style={inputStyle}
        ref={inputRef}
        type="text"
        onClick={handlePrefix}
        onChange={handlePrefix}
        onKeyDown={handleKeyDown}
        onFocus={handlePrefix}
        autoComplete='off'
      />
      {matchingItemsList.length
        ?
        <div
          className={"dropdown-container"}
          ref={dropDownRef}
          style={dropDownStyle}
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
// If "updateIsOpen" is passed in update it when  dropdown is opened or closed
  function handleUpdateIsOpen(isItOpen) {
    if (updateIsOpen) {
      updateIsOpen(isItOpen)
    }
  }

}
