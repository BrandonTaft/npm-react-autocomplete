import { useState, useEffect, useRef } from "react";
import Trie from "./trie";

export default function AutoComplete({ list, clearOnSelect, inputProps, getPropValue, highlightFirstItem, onSelect, listItemStyle, inputStyle, dropDownStyle }) {
  const [isHighlighted, setIsHighlighted] = useState(0)
  const [suggestedWords, setSuggestedWords] = useState([]);
  const trie = useRef();
  const inputRef = useRef();
  const dropDownRef = useRef();

  useEffect(() => {
    let listItems;
    try {
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
    if (list) {
      for (let i = 0; i < listItems.length; i++) {
        const item = listItems[i]
        trie.current.insert(item)
      }
    }

    
    document.addEventListener("mousedown", onClickOff);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", onClickOff);
    };
  }, [list, getPropValue, highlightFirstItem, dropDownRef]);

  const onClickOff = (e) => {
    if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
      setSuggestedWords([])
    }
  };

  const handlePrefix = (e) => {
    if (!list) console.warn("You must pass an array to the list prop")
    const prefix = e.target.value
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
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 40) {
      e.preventDefault()
      if (isHighlighted < suggestedWords.length - 1) {
        setIsHighlighted(isHighlighted + 1)
      }
    };
    if (e.keyCode === 38) {
      e.preventDefault()
      if (isHighlighted > 0) {
        setIsHighlighted(isHighlighted - 1)
      }
    };
    if (e.keyCode === 13) {
      if (list) {
        try {
          onSelect(suggestedWords[isHighlighted], list)
          if (clearOnSelect == null) {
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
        }
      } else {
        try {
          onSelect(inputRef.current.value)
        } catch (error) {
          throw Object.assign(
            new Error("You must provide a function to the onSelect prop"),
            { error: Error }
          );
        } finally {
          if (clearOnSelect == null) inputRef.current.value = ""
        }
      };
    }
  }

  const onMouseClick = (suggestedWord) => {
    setSuggestedWords([])
    try {
      onSelect(suggestedWord, list)
      if (clearOnSelect == null) {
        inputRef.current.value = ""
      } else {
        inputRef.current.value = suggestedWord
      }
    } catch (error) {
      throw Object.assign(
        new Error("You must provide a function to the onSelect prop"),
        { error: Error }
      );
    }
  }

  

  const suggestedWordList = suggestedWords.map((suggestedWord, index) => {
    if (isHighlighted + 1 > suggestedWords.length) {
      setIsHighlighted(0)
    }
    return (
      <div
        key={index}
        id={`suggested-word-${index}`}
        style={{ background: isHighlighted === index ? 'lightgray' : 'none', ...listItemStyle }}
        onClick={() => { onMouseClick(suggestedWord) }}
        onMouseEnter={() => setIsHighlighted(index)}
      >
        {suggestedWord}
      </div>
    )
  })


  return (
    <>
      <input
        {...inputProps}
        style={inputStyle}
        ref={inputRef}
        type="text"
        onClick={handlePrefix}
        onChange={handlePrefix}
        onKeyDown={handleKeyDown}
        autoComplete='off'
      />
      <div 
      ref={dropDownRef} 
      style={dropDownStyle}
      >
        {!suggestedWordList ? null : suggestedWordList}
      </div>
    </>
  )
}