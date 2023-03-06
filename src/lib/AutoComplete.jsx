import { useState, useEffect, useRef } from "react";
import Trie from "./trie";

export default function AutoComplete({ list, propValue, highlightFirstItem, onSelect, itemStyle }) {
  const [isHighlighted, setIsHighlighted] = useState(0)
  const [suggestedWords, setSuggestedWords] = useState([]);
  const trie = useRef();
  const inputRef = useRef()
  useEffect(() => {

    // Determine value to retrieve from list
    let listItems;
    if (!propValue) {
      listItems = list
    } else {
      listItems = list.map(propValue)
    };

    // If specified, set first item in dropdown to not be auto highlighted
    if (highlightFirstItem === false) {
      setIsHighlighted(-1)
    }

    // Initialize root node and store in ref.current
    trie.current = new Trie();

    // Insert each word into the data trie
    for (let i = 0; i < listItems.length; i++) {
      const item = listItems[i]
      trie.current.insert(item)
    }
  }, [list, propValue]);

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
      inputRef.current.value = suggestedWords[isHighlighted]
      onSelect(suggestedWords[isHighlighted], isHighlighted)
      setSuggestedWords([])
    };
  }

  const onMouseClick = (e,suggestedWord, index) => {
    inputRef.current.value = suggestedWord
    setSuggestedWords([])
    onSelect(suggestedWord, index)
  }

  const suggestedWordList = suggestedWords.map((suggestedWord, index) => {
    if (isHighlighted > suggestedWords.length) {
      setIsHighlighted(0)
    }
    return (
      <div
        key={index}
        id={`suggested-word-${index}`}
        style={{ background: isHighlighted === index ? 'lightgray' : 'none', ...itemStyle }}
        onClick={(e) => { onMouseClick(e,suggestedWord, index) }}
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