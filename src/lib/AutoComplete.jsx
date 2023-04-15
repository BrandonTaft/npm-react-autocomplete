import React from 'react';
import { useEffect, useState, useRef, useReducer, useCallback } from "react";
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
    listItemStyle,
    highlightedItemStyle = {
      backgroundColor: "gray"
    },
    isOpen,
    updateIsOpen,
    handleHighlightedItem
  }
) {
  const cachedList = useRef();
  const cachedFunction = useRef()
  // const filteredItems = useRef();
  const trie = useRef();
  const inputRef = useRef();
  const dropDownRef = useRef();
  const itemsRef = useRef([]);
  const [filteredItems, setFilteredItems] = useState()
  const [cachedFunc, setCachedFunc] = useState(() => {})
  const initialState = {
    matchingItems: [],
    highlightedIndex: highlightFirstItem ? 0 : -1
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  const { matchingItems, highlightedIndex } = state;

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
      case "UPDATE": {
        return ({
          ...state,
          highlightedIndex: action.payload
        })
      }
      default:
        return state;
    }
  };


  // const getFilteredList = useCallback(() => {
  //   // If list hasn't changed and it doesn't have objects inside - Do nothing
  //   // If it does have objects  and the getPropValue function hasn't changed - Do nothing
  //   // If getPropValue is new or has changed - use it then create new Trie
  //   console.log("CHECKED IF NEW LIST")
  //   if (cachedList.current && JSON.stringify(cachedList.current) === JSON.stringify(list)) {
  //     console.log("CHECKED FOR OBJECTS")
  //     if (list.some(value => { return typeof value == "object" })) {
  //       console.log("CHECKED FOR GETPROPVALUE")
  //       if (getPropValue) {
  //         if (cachedFunction.current && cachedFunction.current.toString() === getPropValue.toString()) {
  //           console.log(" GETPROPVALUE WAS THE SAME - NOTHING ELSE")
  //           return
  //         } else {
  //           try {
  //             console.log("CREATED FILTEREDLIST WITH GETPROPVALUE AND CACHED GETPROPVALUE")
  //             setCachedFunc(list.map(getPropValue))
  //             cachedFunction.current = getPropValue
  //           } catch (error) {
  //             console.error("Check the getPropValue function : the property value doesn't seem to exist", '\n', error)
  //           };
  //           if(list){
  //             cachedList.current = Array.from(list)
  //             }
  //         }
  //       } else if (!getPropValue) {
  //         console.error("Missing prop - 'getPropValue' is needed to get an object property value from 'list'")
  //       }
  //     } else {
  //       console.log("SAME LIST NO OBJECTS")
  //       return
  //     }

  //   } else {
  //     console.log("LISTS WERE DIFFERENT ")
  //     if (Array.isArray(list)) {
  //       console.log("CHECKED FOR OBJECTS")
  //       if (list.some(value => { return typeof value == "object" })) {
  //         console.log("CHECKED FOR GETPROPVALUE")
  //         if (getPropValue) {
  //           console.log("CREATED FILTEREDLIST WITH GETPROPVALUE AND CACHED GETPROPVALUE")
  //           try {
  //             setCachedFunc(list.map(getPropValue))
  //             cachedFunction.current = getPropValue
  //           } catch (error) {
  //             console.error("Check the getPropValue function : the property value doesn't seem to exist", '\n', error)
  //           };
  //         } else if (!getPropValue) {
  //           console.error("Missing prop - 'getPropValue' is needed to get an object property value from 'list'")
  //           return
  //         }
  //       } else {
  //         setFilteredItems(Array.from(list))
  //       }
  //     } else {
  //       console.error(`Ivalid PropType : The prop 'list' has a value of '${typeof list}' - list must be an array`)
  //       return
  //     };
  //     if(list){
  //       cachedList.current = Array.from(list)
  //       }
  //   }
  // }, [getPropValue, list])

  useEffect(() => {
    if (cachedList.current && JSON.stringify(cachedList.current) === JSON.stringify(list)) {
      if (!list.some(value => { return typeof value == "object" })) {
        console.log("same list no objects")
        return
      } else {
        if (getPropValue) {
            if (cachedFunction.current && cachedFunction.current.toString() === getPropValue.toString()) {
              console.log(" GETPROPVALUE WAS THE SAME - NOTHING ELSE")
              return
            } else {
              try {
                console.log("CREATED FILTEREDLIST WITH GETPROPVALUE AND CACHED GETPROPVALUE")
                setCachedFunc(list.map(getPropValue))
                cachedFunction.current = getPropValue
              } catch (error) {
                console.error("Check the getPropValue function : the property value doesn't seem to exist", '\n', error)
              };
            }
        } else if (!getPropValue) {
            console.error("Missing prop - 'getPropValue' is needed to get an object property value from 'list'")
            return
          }
      }
    } else if (Array.isArray(list)) {
      console.log("CHECKED FOR OBJECTS")
      if (list.some(value => { return typeof value == "object" })) {
        console.log("CHECKED FOR GETPROPVALUE")
        if (getPropValue) {
          console.log("CREATED FILTEREDLIST WITH GETPROPVALUE AND CACHED GETPROPVALUE")
          try {
            setCachedFunc(list.map(getPropValue))
            cachedFunction.current = getPropValue
          } catch (error) {
            console.error("Check the getPropValue function : the property value doesn't seem to exist", '\n', error)
          };
        } else if (!getPropValue) {
          console.error("Missing prop - 'getPropValue' is needed to get an object property value from 'list'")
          return
        }
      } else {
        setFilteredItems(Array.from(list))
      }
    } else {
      console.error(`Ivalid PropType : The prop 'list' has a value of '${typeof list}' - list must be an array`)
      return
    };
    if(list){
      cachedList.current = Array.from(list)
      }
  },[list, getPropValue])

useEffect(() => {
 
  
    
  if (cachedList.current.some(value => { return typeof value == "object" })) {
    console.log("get prop value changed")
        try {
          setFilteredItems(cachedFunc)
        } catch (error) {
          console.error("Check the getPropValue function : the property value doesn't seem to exist", '\n', error)
        };
      }
  
}, [cachedFunc])


//Store filteredList in trie
useEffect(()=>{
  console.log("STOREDATA - RAN STOREDATA FUNCTION TO CREATE NEW TRIE")
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
},[filteredItems])


  // useEffect(()=>{
  //   console.log("EF2")
  //   // It the updateIsOpen prop is passed in - 
  //   // Close dropdown if isOpen is false
  //   // Open dropdown if isOpen is true
  //   if (updateIsOpen && !isOpen) {
  //     dispatch({ type: "CLOSE" });
  //   } else if (updateIsOpen && isOpen) {
  //     if(inputRef.current) {inputRef.current.focus()}
  //     if (showAll && !inputRef.current.value) {
  //       dispatch({ type: "OPEN", payload: filteredItems.map((item, index) => ({ value: item, originalIndex: index })) });
  //     } else if (showAll && inputRef.current.value) {
  //       dispatch({ type: "OPEN", payload: trie.current.find(inputRef.current.value) });
  //     } else if (!showAll && inputRef.current.value) {
  //       dispatch({ type: "OPEN", payload: trie.current.find(inputRef.current.value) });
  //     }
  //   };
  //  }, [updateIsOpen, isOpen, showAll])

  useEffect(() => {
    console.log("highliterrrr")
    if (itemsRef.current[highlightedIndex] && handleHighlightedItem) {
      handleHighlightedItem(itemsRef.current[highlightedIndex], list[matchingItems[highlightedIndex].originalIndex])
    }

  }, [handleHighlightedItem, highlightedIndex, matchingItems, list])

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
  // If "updateIsOpen" is passed in update it when  dropdown is opened or closed
  function handleUpdateIsOpen(isItOpen) {
    if (updateIsOpen) {
      updateIsOpen(isItOpen)
    }
  }

}
