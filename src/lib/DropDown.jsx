import React, { useRef } from "react";

const DropDown = ({
    matchingItems,
    highlightedIndex,
    setHighlightedIndex,
    onSelect,
    handleHighlight,
    resetInputValue,
    highlightedItemStyle,
    dropDownStyle,
    listItemStyle,
    controlSubmit,
    savedList
}) => {

    const dropDownRef = useRef();
    const itemRef = useRef([])

    if (handleHighlight && matchingItems[0] && highlightedIndex >= 0 ) {
        if (matchingItems[highlightedIndex].originalIndex >= 0) {
        handleHighlight(savedList[matchingItems[highlightedIndex].originalIndex])
        }
    }
    if(itemRef.current[highlightedIndex] ) {
        itemRef.current[highlightedIndex].scrollIntoView({ block: "nearest" })
        }

    const handleClick = (matchingItem) => {
        if (!controlSubmit) {
            onSelect(savedList[matchingItem.originalIndex])
        };
        resetInputValue(matchingItem.value);
    };


    return (
        <>
            <div
                data-testid="dropDown"
                className="dropdown-container"
                style={dropDownStyle}
                ref={dropDownRef}
            >
                {matchingItems.map((matchingItem, index) => (
                    <div
                        key={matchingItem.originalIndex}
                        ref = {e => itemRef.current[index] = e}
                        className={highlightedIndex === index ? "dropdown-item highlighted-item" : "dropdown-item"}
                        style={highlightedIndex === index ? { ...highlightedItemStyle, ...listItemStyle } : { ...listItemStyle }}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        onClick={() => { if (matchingItem.originalIndex >= 0) { handleClick(matchingItem) } }}
                    >
                        {matchingItem.value}
                    </div>
                )
                )}
            </div>
        </>
    )
};

export default DropDown