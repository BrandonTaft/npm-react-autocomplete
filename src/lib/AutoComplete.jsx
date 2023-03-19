import { useState, useEffect, useRef } from "react";
import scrollIntoView from 'dom-scroll-into-view';
import OutsideClickHandler from 'react-outside-click-handler';
import Trie from "./trie";

export default function AutoComplete(
  {
    list = [],
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
  const [listItems, setListItems] = useState()
  const trie = useRef();
  const inputRef = useRef();
  const dropDownRef = useRef();
  const itemsRef = useRef([]);

  useEffect(() => {
    let listItems;
    try {
      if(list.length){
      if (list.some(value => { return typeof value == "object" })) {
        if (!getPropValue) {
          console.error("getPropValue is needed to get property value")
        } else if (list) {
          listItems = list.map(getPropValue)
          if (listItems[0] == null) {
            console.error("Check the getPropValue function - the property value doesn't seem to exist")
          } 
        };
      } else {
       listItems = list
      };
    }
    } catch (error) {
      console.log(error)
      console.error("Check the list prop - list must be an array")
    };

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
    setListItems(listItems)
  }, [list, getPropValue, highlightFirstItem, dropDownRef]);

  const handlePrefix = (e) => {
    // if (!list) console.warn("You must pass a valid array to the list prop")
    const prefix = e.target.value
    if (listItems && showAll && prefix.length === 0) {
      setSuggestedWords(listItems.sort())
      return
    }
    if (prefix.length > 0) {
      setSuggestedWords(trie.current.find(e.target.value))
    } else {
      setSuggestedWords([])
      resetHighlight()
    }
    if (isHighlighted + 1 > suggestedWords.length) {
      setIsHighlighted(0)
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 40) {
      if (!itemsRef.current[isHighlighted + 1]) {
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
          if (showAll) {
            resetHighlight()
          }
          resetInputValue(suggestedWords[isHighlighted]);
        } catch (error) {
          throw Object.assign(
            new Error("You must provide a function to the onSelect prop"),
            { error: Error }
          );
        } finally {
          setSuggestedWords([])
          resetInputValue(suggestedWords[isHighlighted])
        }
      } else {
        try {
          if (inputRef.current.value) {
            onSelect(inputRef.current.value, list)
            resetInputValue(inputRef.current.value)
            setSuggestedWords([])
          }
        } catch (error) {
          throw Object.assign(
            new Error("You must provide a function to the onSelect prop", error),
            { error: Error }
          );
        }
      };
    }
    if (e.keyCode === 9) {
      resetHighlight()
      setSuggestedWords([])
    }
  }

  const onMouseClick = (suggestedWord) => {
    setSuggestedWords([])
    try {
      onSelect(suggestedWord, list)
      if (showAll) {
        resetHighlight()
      }
      resetInputValue(suggestedWord);
    } catch (error) {
      throw Object.assign(
        new Error("You must provide a function to the onSelect prop"),
        { error: Error }
      );
    } finally {
      resetInputValue(suggestedWord);
    }
  }

  const suggestedWordList = suggestedWords.map((suggestedWord, index) => {
    if (isHighlighted + 1 > suggestedWords.length) {
      setIsHighlighted(0)
    }
    return (
      suggestedWord ?
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
        : ""
    )
  })

  return (
    <OutsideClickHandler
      display={wrapperDiv ? wrapperDiv : 'block'}
      disabled={disableOutsideClick}
      onOutsideClick={() => {
        setSuggestedWords([])
        resetHighlight()
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

  function resetHighlight() {
    if (highlightFirstItem === false) {
      setIsHighlighted(-1);
    } else {
      setIsHighlighted(0);
    }
  }
}