
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
    handleHighlightedItem={(highlightedElement, highlightedItem) => {      highlightedElement.style.color= ("red")
      setPreview(highlightedItem)
    }}
    onSelect={(selectedItem, originalIndex, selectedElement) => {
      console.log(selectedItem)
    }}
    handleNewValue={(value) => {
      console.log(value)
    }}
  />
```

## Demo
[Check out more examples](https://brandontaft.github.io/autocomplete-demo)

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

### `handleHighlightedItem: Function` (Optional)
- Function that runs when the `highlighted item` changes
- The 1st argument is the `highlighted item` passed in as an `***HTMLDivElement***`
- The 2nd argument is the item or object from the original list prop 

```jsx
  const[preview, setPreview] = useState();

  return(
    <>
      <div>{preview}</div>
      <AutoComplete
        handleHighlightedItem={(element, item) => {
          element.style.color= ("red")
          setPreview(item)
        }}
      />
    </>
  )
```

### `onSelect: Function`
- Function that will run when an item is selected from the dropdown, or if there is not a matching item and a `handleNewValue` function is not passed in
- If `handleNewValue` is passed in, it will always run if the input value is not in the `list`
- The 1st argument is the value or object from the original `list` prop 
- The 2nd argument is the item's original index from the original `list` prop
- The 3rd argument is the `selected item` passed in as an `***HTMLDivElement***`, but only if it is highlighted
- If there is a matching item but it is not highlighted, only the first 2 arguments are used
- If there is not a matching item, only the text input value is passed in
- If the selected item is a number it will be returned as a `string`

### `clearOnSelect: Boolean` (Optional)
- `true` (default) the input will clear when an item is selected
- `false` value selected will become the input value
- `onMouseDown` can be used in `inputProps` to clear the input

### `handleNewValue: Function` (Optional)
- Runs when there is no matching value for the text input
- If it is not passed in, the `onSelect` function will run
- The input value is its only Argument

```jsx
  const [newList, setNewList] = useState(testData);

  return(
    <>
      <AutoComplete
        list={newList}
        handleNewValue={(value) => {
          setNewList(prevState => [...prevState, {name:value}])
      }}
      />
    </>
  )
```

### `submit : Boolean` (Optional)
- Only used if you want to use a `SUBMIT` button
- Each time it is updated to `true` the `handleSubmit` function runs
- Should be used with `updateSubmit` to update the state in the parent back to `false`

### `updateSubmit: Function` (Optional)
- Pass in the set function for your state used in the `submit` prop and it sets the state back to `false` after the `handleSubmit` function runs

### `handleSubmit: Function` (Optional)
- Function that runs when the `submit` prop is updated to `true`
- The 1st argument is the original string or object of the value selected
- The 2nd argument is the item's original index from the original `list` prop
- If there is not a matching item and `handleNewValue` is not passed in, only the text input value is passed in as an argument
- If `handleNewValue` is passed in, it will always run if the input value is not in the `list`

### `clearOnSubmit: Boolean` (Optional)
- `true` (default) the input will clear when an item is selected
- `false` value selected will become the input value
- `onMouseDown` can be used in `inputProps` to clear the input

```jsx
  const [submit, setSubmit] = useState(false);

  const toggleSubmit = (() => {
    setSubmit(true)
  })

  return(
    <>
      <button className='ignore' onClick={toggleSubmit}>
        SUBMIT
      </button>
      <AutoComplete
        submit={submit}
        updateSubmit={setSubmit}
        handleSubmit={(selectedItem, originalIndex) => {
          console.log(selectedItem)
        }}
      />
    </>
  )
```

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

### `inputProps: Object` (Optional)
- Sets HTML text input attributes with some exceptions
- Type and Autocomplete are unable to be overridden
- Some Event handlers can be used
- onClick, onChange, onKeyDown, onFocus cannot be overridden

```jsx
  inputProps={{
    placeholder: "search...",
    onMouseOver: () => {
            setState(true)
          }
  }}
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

```jsx  
  <AutoComplete
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
  />
```








