
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
          backgroundColor: "gray"
        }}
        listItemStyle={{
          cursor: "pointer",
          padding: "5px"
        }}
        dropDownStyle={{
          backgroundColor: "antiquewhite",
          width: "215px"
        }}
        onSelect={(selectedItem, list) => {
          for (let i = 0; i < list.length; i++) {
            if (selectedItem === list[i].name) {
              console.log(list[i])
            }
          }
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
- Function that will run when list item is selected
- Has access to the item selected and the original list array
- If the selected item is a number it will be returned as a string

### `clearOnSelect: Boolean` (Optional)
- `true` (default) the input will clear when an item is selected
- `false` value selected will become the input value
- `onMouseDown` can be used in `inputProps` to clear the input

### `inputProps: Object`
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

### `showAll: Boolean` (Optional)
- `false` (default) dropdown doesn't appear until input value matches an item's prefix
- `true` - If the input is focused and empty the dropdown displays all list items

### `highlightFirstItem: Boolean` (Optional)
- `true` (default) - automatically highlights first item in dropdown
- `false` - Press arrow key or hover with mouse to highlight

### `handleHighlightedItem: Function` (Optional)
- Function that is ran when the `highlighted item` changes
- The `highlighted item` is passed in as an `***HTMLDivElement***`
- The original `list` array is also passed in as the second argument

```jsx
  const[preview, setPreview] = useState();

return(
<>
  <div>{preview}</div>
  <AutoComplete
    handleHighlightedItem={(highlightedItem, list) => {
    highlightedItem.style.color = "red"
    setPreview(highlightedItem.innerText)
  }}
  />
</>
)
```

### `disableOutsideClick : Boolean` 
- `false` (default) the dropdown closes when mouse is clicked outside of the auto-complete wrapper div
- `true` the dropdown only closes when onSelect fires or tab key is pressed
- `NOTE!!!` to control the dropdown with `updateIsOpen` and keep this enabled,
  the element controlling the event should have a `className` of `ignore`

### `isOpen : Boolean`
- This prop is used to set the position of the dropdown in the `AutoComplete` component
- It is only necessary when using `updateIsOpen` to control the dropdown
- `true` is passed in to open the dropdown
- `false` is passed in to close the dropdown

### `updateIsOpen: Function`
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

### `wrapperStyle: Object`
- J.S. Style Object Variable for the `div` wrapping the whole component
- CSS can also be used with the class name `autocomplete-wrapper`

### `inputStyle: Object`
- J.S. Style Object Variable for the `input` element
- CSS can also be used with the class name `autocomplete-input`

### `dropDownStyle: Object`
- J.S. Style Object Variable for the dropdown container `div`
- CSS can also be used with the class name `dropdown-container`

### `listItemStyle: Object`
- J.S. Style Object Variable for each `item div` in the dropdown
- CSS can also be used with the class name `dropdown-item`

### `highlightedItemStyle: Object`
- J.S. Style Object Variable for the `highlighted item`
- CSS can also be used with the class name `highlighted-item`
- Default color is `grey`









