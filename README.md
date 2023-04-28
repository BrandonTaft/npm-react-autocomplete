
# React Autocomplete Input Component

```jsx
import { AutoComplete } from 'react-autocomplete-input-component';

<AutoComplete
        getPropValue={(listItem) => listItem.name}
        showAll={true}
        inputProps={{
          placeholder: "search..."
        }}
        list={[
          { name: 'Tom', id: 3233 },
          { name: 'Tommy', id: 3445 },
          { name: 'Thomas', id: 3663 }
        ]}
        highlightedItemStyle={{
          backgroundColor: "dodgerBlue"
        }}
        listItemStyle={{
          cursor: "pointer",
          padding: "5px"
        }}
        dropDownStyle={{
          backgroundColor: "antiquewhite",
          width: "215px"
        }}
        handleHighlightedItem={(highlightedElement, highlightedItem) => {
          highlightedElement.style.color= ("red")
          setPreview(highlightedItem)
        }}
        onSelect={(selectedItem, selectedElement, originalIndex) => {
          console.log(selectedItem)
          console.log(selectedElement)
          console.log(originalIndex)
        }}
      />

```

## Install

### npm

```bash
npm install --save react-autocomplete-input-component
```

## Props

### `list: Array`
- `Array` of the values to be searched for a match to the user input
- Values are first inserted and stored into a trie data structure
- List values that match the user's input will be displayed in the dropdown
- `getPropValue: Function` is needed if `list` array contains objects 

### `getPropValue: Function` (Optional)
- Only needed if `list` contains objects
- Defines a callback function passed to Array.map
- Sets the object property value to be extracted and displayed in dropdown

### `onSelect: Function`
- Function that will run when an item is selected from the dropdown
- The 1st argument is the `selected item` passed in as an `***HTMLDivElement***`
- The 2nd argument is the item string or object from the original `list` prop 
- The 3rd argument is the item's original index from the original `list` prop
- If the selected item is a number it will be returned as a `string`

### `clearOnSelect: Boolean` (Optional)
- `true` (default) the input will clear when an item is selected
- `false` value selected will become the input value
- `onMouseDown` can be used in `inputProps` to clear the input

### `handleNewValue: Function` (Optional)
- Use if you want different logic when there is no matching value for the text input
- Runs when Enter key is pressed with text present but no matches
- If `handleNewValue` is not passed in, `onSelect` will still run with the text input

### `inputProps: Object` (Optional)
- Sets HTML text input attributes with some exceptions
- Type and Autocomplete are unable to be overridden
- Some Event handlers such as onClick can be used
- onClick, onChange, onKeyDown, onFocus cannot be overridden

```jsx
  inputProps={{
    placeholder: "search...",
    onMouseOver: () => {
            setState(true)
          }
  }}
```

### `handleHighlightedItem: Function` (Optional)
- Function that is ran when the `highlighted item` changes
- The 1st argument is the `highlighted item` passed in as an `***HTMLDivElement***`
- The 2nd argument is the item string or object from the original list prop 

```jsx
  const[preview, setPreview] = useState();

return(
<>
  <div>{preview}</div>
  <AutoComplete
    handleHighlightedItem={(highlightedElement, highlightedItem) => {
      highlightedElement.style.color= ("red")
      setPreview(highlightedItem)
    }}
  />
</>
)
```

### `highlightFirstItem: Boolean` (Optional)
- `true` (default) - automatically highlights first item in dropdown
- `false` - Press arrow key or hover with mouse to highlight

### `showAll: Boolean` (Optional)
- `false` (default) dropdown doesn't appear until input value matches an item's prefix
- `true` - If the input is focused and empty the dropdown displays all list items

### `descending: Boolean` (Optional)
- `false` (default) values in dropdown will be in ascending order by default
- `true` - If set to `true` the values will be in descending order 

### `disableOutsideClick : Boolean` (Optional)
- `false` (default) the dropdown closes when mouse is clicked outside of the auto-complete wrapper div
- `true` the dropdown only closes when onSelect fires or tab key is pressed
- `NOTE!!!` to control the dropdown with `updateIsOpen` and keep this enabled,
  the element controlling the event should have a `className` of `ignore`

### `isOpen : Boolean` (Optional)
- This prop is used to set the position of the dropdown in the `AutoComplete` component
- It is only necessary when using `updateIsOpen` to control the dropdown
- `true` is passed in to open the dropdown
- `false` is passed in to close the dropdown

### `updateIsOpen: Function` (Optional)
- Function used to update the parent with the current position of the dropdown
- Runs when dropdown opens by entering text or closes by clicking outside of the element 

```jsx
  const [openDropDown, setOpenDropDown] = useState()

  const toggleDropDown = () => {
    setOpenDropDown(openDropDown ? false : true)
  }

return(
<>
  <button className='ignore' onClick={toggleDropDown} />
  <AutoComplete
    updateIsOpen={(updatedState) => {
      setOpenDropDown(updatedState)
    }}

    isOpen={openDropDown}
  />
</>
)
```

### `wrapperStyle: Object` (Optional)
- J.S. Style Object Variable for the `div` wrapping the whole component
- CSS can also be used with the class name `autocomplete-wrapper`

### `inputStyle: Object` (Optional)
- J.S. Style Object Variable for the `input` element
- CSS can also be used with the class name `autocomplete-input`

### `dropDownStyle: Object` (Optional)
- J.S. Style Object Variable for the dropdown container `div`
- CSS can also be used with the class name `dropdown-container`

### `listItemStyle: Object` (Optional)
- J.S. Style Object Variable for each `item div` in the dropdown
- CSS can also be used with the class name `dropdown-item`

### `highlightedItemStyle: Object` (Optional)
- J.S. Style Object Variable for the `highlighted item`
- CSS can also be used with the class name `highlighted-item`
- Default color is `dodgerBlue`









