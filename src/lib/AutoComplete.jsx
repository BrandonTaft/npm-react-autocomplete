import { useState, useEffect, useRef } from "react";
import Trie from "./trie";

export default function AutoComplete({ list, getPropValue, highlightFirstItem, onSelect, itemStyle }) {
  const [isHighlighted, setIsHighlighted] = useState(0)
  const [suggestedWords, setSuggestedWords] = useState([]);
  const trie = useRef();
  const inputRef = useRef()
  useEffect(() => {
    if (!list) { console.warn("You must provide an array to the list prop") }
    if (!onSelect) { console.warn("You must provide a function to the onSelect prop") }
    // Determine value to retrieve from list
    let listItems;
    if (!getPropValue) {
      listItems = list
    } else {
      try{ 
        listItems = list.map(getPropValue)
        if(listItems[0] == null) {
          throw("Check the getPropValue function - the property value doesn't seem to exist")
        }
      } catch(error) {
        throw("Check the getPropValue function - the property value doesn't seem to exist")
      }
    };

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
  }, [list, getPropValue]);

  const handlePrefix = (e) => {
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
        inputRef.current.value = suggestedWords[isHighlighted]
        try {
          onSelect(isHighlighted, suggestedWords[isHighlighted], list)
        } catch (error) {
          throw ("You must provide a function to the onSelect prop")
        } finally {
          setSuggestedWords([])
        }
      } else {
        try {
          onSelect(-1, inputRef.current.value)
        } catch (error) {
          throw ("You must provide a function to the onSelect prop")
        } finally {
          inputRef.current.value = ""
        }
      }
    };
    // if (e.keyCode === 8) {
    //   if (isHighlighted > suggestedWords.length) {
    //     setIsHighlighted(suggestedWords.length)
    //   }
    // };
  }

  const onMouseClick = (index, suggestedWord) => {
    inputRef.current.value = suggestedWord
    setSuggestedWords([])
    try {
      onSelect(index, suggestedWord, list)
    } catch (error) {
      throw ("You must provide a function to the onSelect prop")
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
        style={{ background: isHighlighted === index ? 'lightgray' : 'none', ...itemStyle }}
        onClick={(e) => { onMouseClick(index, suggestedWord) }}
        onMouseEnter={() => setIsHighlighted(index)}
      >
        {suggestedWord}
      </div>
    )
  })


  return (
    <>
      <input
        ref={inputRef}
        type="text"
        name="search"
        placeholder="Search..."
        onChange={handlePrefix}
        onKeyDown={handleKeyDown}
        autoComplete='off'
      />
      {!suggestedWordList ? null : suggestedWordList}
    </>
  )
}