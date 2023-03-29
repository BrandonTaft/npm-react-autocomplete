import React from 'react';
import { useState, useEffect, useRef } from "react";
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
    highlightedItem = {
      backgroundColor: "gray"
    },
    isOpen,
    updateIsOpen
  }
) {
  const [isHighlighted, setIsHighlighted] = useState(0);
  const [suggestedWords, setSuggestedWords] = useState([]);
  const [listItems, setListItems] = useState();
  const trie = useRef();
  const cacheRef = useRef();
  const inputRef = useRef();
  const dropDownRef = useRef();
  const itemsRef = useRef([]);

  useEffect(() => {

    // If list is not already stored in the trie - check for nested objects
    // If there are no nested objects, create a new array called items with the values in the list array
    // If there are nested objects, use 'getPropvalue' to extract property values and set them in items array
    if (JSON.stringify(cacheRef.current) !== JSON.stringify(list)) {
      let items;
      if (Array.isArray(list)) {
        if (list.some(value => { return typeof value == "object" })) {
          if (!getPropValue) {
            console.error("Missing prop - 'getPropValue' is needed to get an object property value from 'list'")
          } else {
            try {
              items = list.map(getPropValue)
            } catch (error) {
              console.error("Check the getPropValue function : the property value doesn't seem to exist", '\n', error)
            }
          }
        } else {
          cacheRef.current = list
          items = list
        };
      } else {
        console.error(`Ivalid PropType : The prop 'list' has a value of '${typeof list}' - list must be an array`)
      };

      // Initialize root node and store in the 'trie' ref
      // Then Insert each word in items array into the 'trie' ref
      // Then store original list in cacheRef to use to detect 'list' prop changes
      trie.current = new Trie();
      if (items) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          if (item && typeof item == 'number') {
            trie.current.insert(item.toString())
          } else if (item) {
            trie.current.insert(item)
          }
        }
      };

      setListItems(items)
    }

    // If specified, set first item in dropdown to not be auto highlighted
    if (highlightFirstItem === false) {
      setIsHighlighted(-1)
    }

    // It the updateIsOpen prop is passed in - 
    // Close dropdown if isOpen is false
    // Open dropdown if isOpen is true
    if (updateIsOpen && isOpen === false) {
      setSuggestedWords([])
    }
    if (updateIsOpen && isOpen === true) {
      if (showAll === true && !inputRef.current.value) {
        setSuggestedWords(listItems)
      } else {
        setSuggestedWords(trie.current.find(inputRef.current.value))
      }
    }
    cacheRef.current = list
  }, [list, getPropValue, highlightFirstItem, listItems, isOpen, updateIsOpen, showAll]);


  const handlePrefix = (e) => {
    const prefix = e.target.value
    if (listItems && showAll && prefix.length === 0) {
      openDropDown(listItems)
      return
    }
    if (prefix.length > 0) {
      openDropDown(trie.current.find(e.target.value))
    } else {
      closeDropDown()
    }
    if (isHighlighted + 1 > suggestedWords.length) {
      setIsHighlighted(0)
    }
  };

  const handleKeyDown = (e) => {
    // Down Arrow - sets the next index in the 'suggestedWordsList' as the highlighted index
    // If the highlighted index is the last index it resets the highlighted index back to 0
    if (e.keyCode === 40) {
      if (!itemsRef.current[isHighlighted + 1] && itemsRef.current[0]) {
        setIsHighlighted(0)
        scrollIntoView(
          itemsRef.current[0],
          dropDownRef.current,
          { onlyScrollIfNeeded: true }
        )
      }
      e.preventDefault()
      if (itemsRef.current[isHighlighted + 1]) {
        setIsHighlighted(isHighlighted + 1)
        scrollIntoView(
          itemsRef.current[isHighlighted + 1],
          dropDownRef.current,
          { onlyScrollIfNeeded: true }
        )
      }
    }

    //Up Arrow - sets the highlighted index as the one before the current index
    if (e.keyCode === 38) {
      e.preventDefault()
      if (itemsRef.current[isHighlighted - 1]) {
        setIsHighlighted(isHighlighted - 1)
        scrollIntoView(
          itemsRef.current[isHighlighted - 1],
          dropDownRef.current,
          { onlyScrollIfNeeded: true }
        )
      }
    };

    // Enter key - Passes highlighted item in to the 'onselect' function and closes the dropdown
    // If there is not a highlighted item it will pass the inputs value into the 'onSelect' function
    if (e.keyCode === 13) {
      if (list && suggestedWords[isHighlighted]) {
        try {
          onSelect(suggestedWords[isHighlighted].toString(), list)
        } catch (error) {
          console.error("You must provide a valid function to the 'onSelect' prop", '\n', error)
        } finally {
          closeDropDown()
          resetInputValue(suggestedWords[isHighlighted])
        }
      } else {
        if (inputRef.current.value) {
          try {
            onSelect(inputRef.current.value.toString(), list)
          } catch (error) {
            console.error("You must provide a valid function to the 'onSelect' prop", '\n', error)
          } finally {
            closeDropDown()
            resetInputValue(inputRef.current.value)
          }
        }
      }
    }
    // Tab key closes the dropdown 
    if (e.keyCode === 9) {
      closeDropDown()
    }
  }

  // Runs the function passed in to the onSelect prop and then closes the dropdown
  const onMouseClick = (suggestedWord) => {
    try {
      onSelect(suggestedWord.toString(), list)
    } catch (error) {
      console.error("You must provide a valid function to the 'onSelect' prop", '\n', error)
    } finally {
      closeDropDown()
      resetInputValue(suggestedWord);

    }
  }

  // Creates a new Collator object and uses its compare method to sort alphanumeric arrays
  var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  const sorted = suggestedWords.sort(collator.compare)
  const suggestedWordList = sorted.map((suggestedWord, index) => {
    if (isHighlighted + 1 > suggestedWords.length) {
      setIsHighlighted(0)
    }
    return (
      suggestedWord ?
        <div
          key={index}
          ref={el => itemsRef.current[index] = el}
          id={`suggested-word-${index}`}
          className={"list-item"}
          style={isHighlighted === index ? { ...highlightedItem, ...listItemStyle } : { ...listItemStyle }}
          onClick={() => { onMouseClick(suggestedWord) }}
          onMouseEnter={() => setIsHighlighted(index)}
        >
          {suggestedWord}
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
        closeDropDown()
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
      {suggestedWordList.length
        ?
        <div
          className={"dropdown-container"}
          ref={dropDownRef}
          style={dropDownStyle}
        >
          {suggestedWordList}
        </div>
        :
        null}
    </Wrapper>
  )

  // Sets the value of the input to be what is specified in 'clearOnSelect' prop
  // When onSelect runs it will clear the input if 'clearOnSelect' is set to true
  // If clearOnSelect is set to false it will set the input value to the word passed in
  function resetInputValue(suggestedWord) {
    if (clearOnSelect) {
      inputRef.current.value = "";
    } else {
      if (!suggestedWord) {
        inputRef.current.value = ""
      } else {
        inputRef.current.value = suggestedWord;
      }
    }
  }

  // Resets the highlighted index to what is specified by 'highlightFirstItem' prop
  function resetHighlight() {
    if (highlightFirstItem === false) {
      setIsHighlighted(-1);
    } else {
      setIsHighlighted(0);
    }
  }

  // Opens Dropdown by setting suggestedWords state with words passed in
  // If 'updateIsOpen' prop was set it will update to true 
  function openDropDown(words) {
    setSuggestedWords(words)
    if (updateIsOpen) {
      updateIsOpen(true)
    }
  }

  // Closes Dropdown by setting suggestedWords to empty array
  // Resets highlighted index to what is specified by 'highlightFirstItem' prop 
  // If 'updateIsOpen' prop was set, it will update to false 
  function closeDropDown() {
    setSuggestedWords([])
    resetHighlight()
    if (updateIsOpen) {
      updateIsOpen(false)
    }
  }

}