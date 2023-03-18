import { useState, useEffect, useRef } from "react";
import scrollIntoView from 'dom-scroll-into-view';
import OutsideClickHandler from 'react-outside-click-handler';
import Trie from "./trie";

export default function AutoComplete(
  { 
    list,
    getPropValue,
    onSelect,
    highlightedItem,
    showAll = false,
    clearOnSelect = true,
    highlightFirstItem = true,
    disableOutsideClick = false,
    wrapperDiv = 'block',
    inputProps,
    inputStyle,
    dropDownStyle,
    listItemStyle
  }
) {
  const [isHighlighted, setIsHighlighted] = useState(0)
  const [suggestedWords, setSuggestedWords] = useState([]);
  const [listItems, setListItems] = useState([])
  const trie = useRef();
  const inputRef = useRef();
  const dropDownRef = useRef();
  const itemsRef = useRef([]);

  useEffect(() => {
    let listItems;
    try {
      if (list) {
        if (list.some(value => { return typeof value == "object" })) {
          if (!getPropValue) {
            console.warn("getPropValue is needed to get property value")
            listItems = list
          } else if (list) {
            listItems = list.map(getPropValue)
            if (listItems[0] == null) {
              listItems = list
              console.warn("Check the getPropValue function - the property value doesn't seem to exist")
            }
          } else {
            console.warn("List prop is missing!")
          }
        } else {
          listItems = list
        }
      } else {
        list = []
      }
      setListItems(listItems)
    } catch (error) {
      throw Object.assign(
        new Error("Check the list prop - list must be an array"),
        { error: Error }
      );
    }

    // If specified, set first item in dropdown to not be auto highlighted
    if (highlightFirstItem === false) {
      setIsHighlighted(-1)
    }

    // Initialize root node and store in ref.current
    trie.current = new Trie();

    // Insert each word into the data trie
    if (listItems) {
      for (let i = 0; i < listItems.length; i++) {
        const item = listItems[i]
        if (item)
          trie.current.insert(item)
      }
    }
  }, [list, getPropValue, highlightFirstItem, dropDownRef]);

  const handlePrefix = (e) => {
    if (!list) console.warn("You must pass a valid array to the list prop")
    const prefix = e.target.value
    if (showAll && prefix.length === 0) {
      setSuggestedWords(listItems.sort())
      return
    }
    if (prefix.length > 0) {
      setSuggestedWords(trie.current.find(e.target.value))
    } else {
      setSuggestedWords([])
      if (highlightFirstItem === false) {
        setIsHighlighted(-1)
      } else {
        setIsHighlighted(0)
      }
    }
    if (isHighlighted + 1 > suggestedWords.length) {
      setIsHighlighted(0)
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 40) {
      if (isHighlighted === suggestedWords.length - 1) {
        setIsHighlighted(0)
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
    if (e.keyCode === 13) {
      if (list && suggestedWords[isHighlighted]) {
        try {
          onSelect(suggestedWords[isHighlighted], list)
          if(showAll) {
            if (highlightFirstItem === false) {
              setIsHighlighted(-1)
            } else {
              setIsHighlighted(0)
            }
          }
          if (clearOnSelect) {
            inputRef.current.value = ""
          } else {
            inputRef.current.value = suggestedWords[isHighlighted]
          }
        } catch (error) {
          throw Object.assign(
            new Error("You must provide a function to the onSelect prop"),
            { error: Error }
          );
        } finally {
          setSuggestedWords([])
          if (clearOnSelect) {
            inputRef.current.value = ""
          } else {
            if (!suggestedWords[isHighlighted]) {
              inputRef.current.value = ""
            } else {
              inputRef.current.value = suggestedWords[isHighlighted]
            }
          }
        }
      } else {
        try {
          if(inputRef.current.value){
          onSelect(inputRef.current.value, list)
          }
        } catch (error) {
          throw Object.assign(
            new Error("You must provide a function to the onSelect prop", error),
            { error: Error }
          );
        } finally {
          if (clearOnSelect) inputRef.current.value = ""
        }
      };
    }
  }

  const onMouseClick = (suggestedWord) => {
    setSuggestedWords([])
    try {
      onSelect(suggestedWord, list)
      if(showAll) {
        if (highlightFirstItem === false) {
          setIsHighlighted(-1)
        } else {
          setIsHighlighted(0)
        }
      }
      if (clearOnSelect) {
        inputRef.current.value = ""
      } else {
        inputRef.current.value = suggestedWord
      }
    } catch (error) {
      throw Object.assign(
        new Error("You must provide a function to the onSelect prop"),
        { error: Error }
      );
    } finally {
      if (clearOnSelect) {
        inputRef.current.value = ""
      } else {
        inputRef.current.value = suggestedWord
      }
    }
  }

  const suggestedWordList = suggestedWords.map((suggestedWord, index) => {
    if (isHighlighted + 1 > suggestedWords.length) {
      setIsHighlighted(0)
    }
    if (suggestedWord)
      return (
        <div
          key={index}
          ref={el => itemsRef.current[index] = el}
          id={`suggested-word-${index}`}
          style={isHighlighted === index ? { ...highlightedItem, ...listItemStyle } : { ...listItemStyle }}
          onClick={() => { onMouseClick(suggestedWord) }}
          onMouseEnter={() => setIsHighlighted(index)}
        >
          {suggestedWord}
        </div>
      )
  })


const testRef = useRef()
console.log(testRef)
  return (
    <OutsideClickHandler
      display={wrapperDiv ? wrapperDiv : 'block'}
      disabled={disableOutsideClick}
      ref={testRef}
      onOutsideClick={() => {
        setSuggestedWords([])
      }}
    >
      <input
        {...inputProps}
        style={inputStyle}
        ref={inputRef}
        type="text"
        onMouseDown={handlePrefix}
        onChange={handlePrefix}
        onKeyDown={handleKeyDown}
        onFocus={handlePrefix}
        autoComplete='off'
      />
      {suggestedWordList.length ?
        <div
          ref={dropDownRef}
          style={dropDownStyle}
        >
          {suggestedWordList}
        </div>
        :
        null}
    </OutsideClickHandler>
  )
}