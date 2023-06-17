const Input = ({
    inputStyle,
    setPrefix,
    prefix,
    inputProps,
    handleKeyDown,
    setIsOpen
}) => {
    return (
        <input
            className="autocomplete-input"
            style={inputStyle}
            type="search"
            {...inputProps}
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            autoComplete='off'
        />
    )
};

export default Input