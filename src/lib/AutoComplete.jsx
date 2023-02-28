import { useState, useEffect, useRef } from "react";
import Trie from "./trie";


export default function AutoComplete({ list }) {
  const [trie, setTrie] = useState();
  const [cached, setCached] = useState(false)
  const [suggestedWords, setSuggestedWords] = useState([]);
  const cursor = useRef(0);

  useEffect(() => {
    setTrie(new Trie())
    setCached(false)
  }, [])

  //If the Node isn't already initialized and once the list prop is loaded
  if (list && !cached && trie) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      trie.insert(item)
    }
    setCached(true)
  }

  const handlePrefix = (e) => {
    cursor.current = 0
    const prefix = e.target.value
    if (prefix.length > 0) {
      setSuggestedWords(trie.find(e.target.value))
    } else {
      setSuggestedWords([])
    }
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 40 && cursor.current < suggestedWords.length - 1) {
      cursor.current++
      document.getElementById(`suggested-word-${cursor.current}`).style.backgroundColor = "blue"
      document.getElementById(`suggested-word-${cursor.current - 1}`).style.backgroundColor = "white"
    }
    if (e.keyCode === 38 && cursor.current > 0) {
      cursor.current--
      document.getElementById(`suggested-word-${cursor.current}`).style.backgroundColor = "blue"
      document.getElementById(`suggested-word-${cursor.current + 1}`).style.backgroundColor = "white"
    }
    if (e.keyCode === 13 && cursor.current >= 0) {
      const selectedItem = document.getElementById(`suggested-word-${cursor.current}`)
      setSuggestedWords([])
      if(selectedItem){
      e.target.value = selectedItem.innerHTML.valueOf()
      }
    }
  }

  const suggestedWordList = suggestedWords.map((suggestedWord, index) => {
    return (
      <li key={index} id={`suggested-word-${index}`}>
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