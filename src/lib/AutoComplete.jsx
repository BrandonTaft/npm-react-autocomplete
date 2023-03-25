import { useState, useEffect, useRef } from "react";
import scrollIntoView from 'dom-scroll-into-view';
import OutsideClickHandler from 'react-outside-click-handler';
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
    isOpen = true,
    wrapperDiv = 'block',
    inputProps,
    inputStyle,
    dropDownStyle,
    listItemStyle,
    highlightedItem = {
      backgroundColor: "gray"
    },
    openDropDown,
    changeDropDownState
  }
) {

  const [isHighlighted, setIsHighlighted] = useState(0);
  const [suggestedWords, setSuggestedWords] = useState([]);
  const [listItems, setListItems] = useState();
  const trie = useRef();
  const cacheRef = useRef()
  const inputRef = useRef();
  const dropDownRef = useRef();
  const itemsRef = useRef([]);

  useEffect(() => {
    let listItems;
    if (Array.isArray(list)) {
      if (list.some(value => { return typeof value == "object" })) {
        if (!getPropValue) {
          console.error("Missing prop - 'getPropValue' is needed to get an object property value from 'list'")
        } else {
          try {
            listItems = list.map(getPropValue)
          } catch (error) {
            console.error("Check the getPropValue function : the property value doesn't seem to exist", '\n', error)
          }
        }
      } else {
        listItems = list
      };
    } else {
      console.error(`Ivalid PropType : The prop 'list' has a value of '${typeof list}' - list must be an array`)
    };

    // If specified, set first item in dropdown to not be auto highlighted
    if (highlightFirstItem === false) {
      setIsHighlighted(-1)
    }

    // Initialize root node and store in ref.current
    trie.current = new Trie();

    // Insert each word into the data trie

    if (listItems && list !== cacheRef.current) {
      cacheRef.current = list;
      for (let i = 0; i < listItems.length; i++) {
        const item = listItems[i]
        if (item && typeof item == 'number') {
          trie.current.insert(item.toString())
        } else if (item) {
          trie.current.insert(item)
        }
      }
    };

    setListItems(listItems)

    if (changeDropDownState && openDropDown === false) {
      setSuggestedWords([])
    }

    if (changeDropDownState && openDropDown === true) {
      if (showAll === true && !inputRef.current.value) {
        setSuggestedWords(listItems)
      } else {
        setSuggestedWords(trie.current.find(inputRef.current.value))
      }
    }
  }, [list, getPropValue, highlightFirstItem, openDropDown, changeDropDownState, showAll]);

  const handlePrefix = (e) => {
    const prefix = e.target.value
    if (listItems && showAll && prefix.length === 0) {
      setSuggestedWords(listItems)
      if (changeDropDownState) {
        changeDropDownState(true)
      }
      return
    }
    if (prefix.length > 0) {
      setSuggestedWords(trie.current.find(e.target.value))
      if (changeDropDownState) {
        changeDropDownState(true)
      }
    } else {
      clearMenu()
      // setSuggestedWords([])
      // resetHighlight()
      // if (changeDropDownState) {
      //   changeDropDownState(false)
      // }
    }
    if (isHighlighted + 1 > suggestedWords.length) {
      setIsHighlighted(0)
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 40) {
      if (!itemsRef.current[isHighlighted + 1] && itemsRef.current[0]) {
        console.log("RRR")
        setIsHighlighted(0)
        scrollIntoView(
          itemsRef.current[0],
          dropDownRef.current,
          { onlyScrollIfNeeded: true }
        )
      }
      e.preventDefault()
      if (itemsRef.current[isHighlighted + 1] !== null) {
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
          onSelect(suggestedWords[isHighlighted].toString(), list)
        } catch (error) {
          console.error("You must provide a valid function to the 'onSelect' prop", '\n', error)
        } finally {
          if (showAll) {
            resetHighlight()
          }
          setSuggestedWords([])
          resetInputValue(suggestedWords[isHighlighted])
          if (changeDropDownState) {
            changeDropDownState(false)
          }
        }
      } else {
        if (inputRef.current.value) {
          try {
            onSelect(inputRef.current.value.toString(), list)
          } catch (error) {
            console.error("You must provide a valid function to the 'onSelect' prop", '\n', error)
          }
          resetInputValue(inputRef.current.value)
          setSuggestedWords([])
          if (changeDropDownState) {
            changeDropDownState(false)
          }
        }
      }
    }
    if (e.keyCode === 9) {
      // setSuggestedWords([])
      // resetHighlight()
      // if (changeDropDownState) {
      //   changeDropDownState(false)
      // }
      clearMenu()
    }
  }

  const onMouseClick = (suggestedWord) => {
    try {
      onSelect(suggestedWord.toString(), list)
    } catch (error) {
      console.error("You must provide a valid function to the 'onSelect' prop", '\n', error)
    } finally {
      if (showAll) {
        resetHighlight()
      }
      setSuggestedWords([])
      resetInputValue(suggestedWord);
      if (changeDropDownState) {
        changeDropDownState(false)
      }
    }
  }

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
    <OutsideClickHandler
      display={wrapperDiv ? wrapperDiv : 'block'}
      disabled={disableOutsideClick}
      onOutsideClick={(e) => {
        setSuggestedWords([])
        resetHighlight()
        if (changeDropDownState && e.target.className !== 'ignore') {
          changeDropDownState(false)
        }
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
      {suggestedWordList.length && isOpen ?
        <div
          className={"dropdown-container"}
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

  function clearMenu() {
    setSuggestedWords([])
    resetHighlight()
    if (changeDropDownState) {
      changeDropDownState(false)
    }
  }

}