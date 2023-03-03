import { useState, useEffect, useRef } from "react";
import Trie from "./trie";


export default function AutoComplete({ list, propValue }) {
  const [trie, setTrie] = useState();
  const [cached, setCached] = useState(false)
  const [suggestedWords, setSuggestedWords] = useState([]);
  const cursor = useRef(0);

  useEffect(() => {
    setTrie(new Trie())
    setCached(false)
  }, [])

  let listItems;
  if (!propValue) {
    listItems = list
  } else {
    listItems = list.map(propValue)
  };
  //If the Node isn't already initialized and once the list prop is loaded
  if (listItems && !cached && trie) {
    for (let i = 0; i < listItems.length; i++) {
      const item = listItems[i]
      trie.insert(item)
    }
    setCached(true)
  }

  const handlePrefix = (e) => {
    if(e.target.value === null) {
       cursor.current = 0
    }
    console.log(cursor.current)
    const prefix = e.target.value
    if (prefix.length > 0) {
      setSuggestedWords(trie.find(e.target.value))
    } else {
      setSuggestedWords([])
    }
  }
  
  const handleKeyDown = (e) => {
    if (e.keyCode === 40 && cursor.current < suggestedWords.length - 1) {
      e.preventDefault()
      cursor.current++
      document.getElementById(`suggested-word-${cursor.current}`).style.backgroundColor = "blue"
      document.getElementById(`suggested-word-${cursor.current - 1}`).style.backgroundColor = "white"
    }
    if (e.keyCode === 38 && cursor.current > 0) {
      e.preventDefault()
      cursor.current--
      document.getElementById(`suggested-word-${cursor.current}`).style.backgroundColor = "blue"
      document.getElementById(`suggested-word-${cursor.current + 1}`).style.backgroundColor = "white"
    }
    if (e.keyCode === 13 && cursor.current >= 0) {
      e.preventDefault()
      const selectedItem = document.getElementById(`suggested-word-${cursor.current}`)
      setSuggestedWords([])
      if (selectedItem) {
        e.target.value = selectedItem.innerHTML.valueOf()
      }
    }
  }

  const suggestedWordList = suggestedWords.map((suggestedWord, index) => {
    return (
      <li key={index} id={`suggested-word-${index}`} style={cursor.current === index ? { backgroundColor: 'blue' } : {backgroundColor: 'none'}}>
        {suggestedWord}
      </li>
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
      <div className="search-list">
        {suggestedWordList}
      </div>
    </>
  )
}