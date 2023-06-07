import { forwardRef } from "react"

const Input = forwardRef(({
    inputStyle,
    prefix,
    inputProps,
    handlePrefix,
    handleKeyDown,
    setIsOpen
}, ref) => {
    return (
        <input
            className="autocomplete-input"
            style={inputStyle}
            ref={ref}
            type="search"
            value={prefix}
            {...inputProps}
            onChange={handlePrefix}
            onKeyDown={handleKeyDown}
            onClick={() => setIsOpen(true)}
            autoComplete='off'
        />
    )
})

export default Input