import { forwardRef } from "react";

const DropDown = forwardRef(function ({
    matchingItems,
    highlightedIndex,
    setHighlightedIndex,
    handleSelect,
    handleHighlight,
    resetInputValue,
    highlightedItemStyle,
    dropDownStyle,
    listItemStyle,
    controlSubmit,
    savedList
}, ref) {

    const handleClick = (matchingItem) => {
        if (!controlSubmit) {
            try {
                handleSelect(savedList[matchingItem.originalIndex])
            } catch (error) {
                console.error("You must provide a valid function to the handleSelect prop", '\n', error)
            }
        }
        resetInputValue(matchingItem.value);
    }

    const onHighlight = (index) => {
        setHighlightedIndex(index)
        if (handleHighlight) {
            handleHighlight(savedList[matchingItems[index].originalIndex])
        }
    }

    const setRef = (el, index) => {
        if (ref.current.length !== matchingItems.length) {
            ref.current.length = matchingItems.length
        }
        ref.current[index] = el
    }

    // Creates a new Collator object and uses its compare method to natural sort the array
    var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    const sorted = matchingItems.sort((a, b) => collator.compare(a.value, b.value));

    return (
        <>
            <div
                className="dropdown-container"
                style={dropDownStyle}
            >
                {sorted.map((matchingItem, index) => (
                    <div
                        key={matchingItem.originalIndex}
                        ref={el => setRef(el, index)}
                        className={highlightedIndex === index ? "dropdown-item highlighted-item" : "dropdown-item"}
                        style={highlightedIndex === index ? { ...highlightedItemStyle, ...listItemStyle } : { ...listItemStyle }}
                        onMouseEnter={() => onHighlight(index)}
                        onClick={() => { if (matchingItem.originalIndex > 0) { handleClick(matchingItem) } }}
                    >
                        {matchingItem.value}
                    </div>
                )
                )}
            </div>
        </>
    )
})

export default DropDown