import { useState, useEffect, useRef } from "react";
import Trie from "./trie";


export default function AutoComplete({ list, propValue, highlightFirstItem, onSelect }) {
  const [trie, setTrie] = useState();
  const [isCached, setIsCached] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(Number(highlightFirstItem - 1))
  const [suggestedWords, setSuggestedWords] = useState([]);
  
  useEffect(() => {
    setTrie(new Trie())
    setIsCached(false)
  }, [])

  // Getting and Setting list items
  let listItems;
  if (!propValue) {
    listItems = list
  } else {
    listItems = list.map(propValue)
  };

  //If the Node isn't already initialized and the list prop is loaded
  if (listItems && !isCached && trie) {
    for (let i = 0; i < listItems.length; i++) {
      const item = listItems[i]
      trie.insert(item)
    }
    setIsCached(true)
  }

  const handlePrefix = (e) => {
    const prefix = e.target.value
    if (prefix.length > 0) {
      setSuggestedWords(trie.find(e.target.value))
    } else {
      setSuggestedWords([])
    }
    
  }

  const handleKeyDown = (e) => { 
    if (e.keyCode === 40 ) {
      e.preventDefault()
      if(isHighlighted < suggestedWords.length - 1) {
     setIsHighlighted( isHighlighted + 1 )
      }
    };
    if (e.keyCode === 38 ) {
      e.preventDefault()
      if(isHighlighted > 0) {
     setIsHighlighted( isHighlighted - 1 )
      }
    };
    if (e.keyCode === 13 ) {
      e.target.value = suggestedWords[isHighlighted]
      onSelect()
    };
  }

  const suggestedWordList = suggestedWords.map((suggestedWord, index) => {
    if(isHighlighted > suggestedWords.length) {
      setIsHighlighted(0)
    }
    return (
      <div key={index} id={`suggested-word-${index}`} style={{ background: isHighlighted === index ? 'lightgray' : 'white' }}>
        {suggestedWord}
      </div>
    )
  })


  return (
    <>
      <input
        type="text"
        name="search"
        placeholder="Search..."
        onChange={handlePrefix}
        onKeyDown={handleKeyDown}
        autoComplete='off'
      />
      <div className="search-list" >
        {suggestedWordList}
      </div>
    </>
  )
}