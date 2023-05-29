import { useEffect, useRef } from "react";

const DropDown = ({
    matchingItems,
    highlightedIndex,
    setHighlightedIndex,
    handleSelect,
    resetInputValue,
    highlightedItemStyle,
    dropDownStyle,
    listItemStyle,
    descending,
    list
}) => {

    const dropDownRef = useRef();

    useEffect(() => {
        if (dropDownRef.current) {
            const highlighted = dropDownRef.current.querySelector(".highlighted-item")
            if (highlighted) {
                highlighted.scrollIntoView({ block: "nearest" })
            }
        }
    }, [highlightedIndex])

    const handleClick = (matchingItem) => {
        if (handleSelect) {
            try {
                handleSelect(list[matchingItem.originalIndex])
            } catch (error) {
                console.error("You must provide a valid function to the handleSelect prop", '\n', error)
            }
        }
        resetInputValue(matchingItem.value);
    }

    // Creates a new Collator object and uses its compare method to natural sort the array
    var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    const sorted = matchingItems.sort((a, b) => {
        if (!descending) {
            return collator.compare(a.value, b.value)
        } else {
            return collator.compare(b.value, a.value)
        }
    });

    return (
        <>
            <div
                className="dropdown-container"
                ref={dropDownRef}
                style={dropDownStyle}
            >
                {sorted.map((matchingItem, index) => (
                    <div
                        key={matchingItem.originalIndex}
                        className={highlightedIndex === index ? "dropdown-item highlighted-item" : "dropdown-item"}
                        style={highlightedIndex === index ? { ...highlightedItemStyle, ...listItemStyle } : { ...listItemStyle }}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        onClick={() => { handleClick(matchingItem) }}
                    >
                        {matchingItem.value}
                    </div>
                )
                )}
            </div>
        </>
    )
}

export default DropDown