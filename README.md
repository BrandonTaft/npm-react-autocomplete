
# React Autocomplete Input Component

```jsx
  import { AutoComplete } from 'react-autocomplete-input-component';

  <AutoComplete
    list={[1, 'one', 2, 'two', 3, 'three']}
    onHighlightChange={(highlightedItem) => {
      console.log(highlightedItem)
    }}
    onSelect={(selectedItem) => {
      console.log(selectedItem)
    }}
    handleNewValue={(inputValue) => {
      console.log(inputValue)
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

### `list: array`
- `array` of the values to be searched for a match to the user input
- `getDisplayValue` is needed if `list` array contains objects 
- can be passed in as an empty array and can always be changed dynamically 

### `getDisplayValue: function` (Optional)
- only needed if `list` contains objects
- `function` used to filter out the property value to be displayed in the dropdown

```jsx
<AutoComplete
    list={[
      { name: 'Tom', id: 3233 },
      { name: 'Tommy', id: 3445 },
      { name: 'Thomas', id: 3663 }
    ]}
    getDisplayValue={(list) => {
      return list.map((listItem) => listItem.name)
    }}
  />
```

### `onHighlightChange: function` (Optional)
- callback function invoked when the `highlighted item` changes
- its only argument is the `highlighted item's` value from the original list
- if the `highlighted item` is a property value from an object, the whole object is passed in

### `onSelect: function` (Optional)
- callback function invoked when an item is selected
- its only argument is the `selected item's` value from the original list
- if the `selected item` is a property value from an object, the whole object is passed in

### `handleNewValue: function` (Optional)
- callback function invoked in place of `onSelect` when there is no matching value for the text input
- the input value is its only Argument
- if it is not passed in, the `onSelect` function will run with the text input being its only argument

### `onSelectError: function` (Optional)
- used if new values are not permitted
- callback function invoked if `onSelect` fires when there is no match for the input value and the `handleNewValue` function is not passed in

### `noMatchMessage: string` (Optional)
- message displayed in the dropdown when there is no match for the current input value
- `default` - will show no message
- if a string is passed in - it will be the message shown

```jsx
<AutoComplete
    onSelectError={() => {
          window.alert("TRY AGAIN")
        }}
    noMatchMessage={"No matches found"}
  />
```

### `open : boolean` (Optional)
- can be used to control the position of the dropdown
- `true` opens the dropdown and `false` closes the dropdown

### `onDropdownChange: function` (Optional)
- callback function invoked whenever dropdown is opened or closed
- its only argument is the current position of the dropdown

```jsx
  const [openDropDown, setOpenDropDown] = useState()

  const toggleDropDown = () => {
    setOpenDropDown(openDropDown ? false : true)
  }

  return(
    <>
      <button className='ignore' onClick={toggleDropDown} />
      <AutoComplete
        onDropdownChange={(isOpen) => {
          setOpenDropDown(isOpen)
        }}
        open={openDropDown}
      />
    </>
  )
```
### `disableOutsideClick : boolean` (Optional)
- `false` (default) the dropdown closes when mouse is clicked outside of the auto-complete wrapper div
- setting to `true` will disable the feature
- to ignore a specific element give the element a `className` of `ignore`

### `inputProps: Object` (Optional)
- Sets HTMLInputElement properties with some exceptions
- autocomplete, onChange, onKeyDown, onFocus cannot be overridden

```jsx
 <AutoComplete
  inputProps={{
    placeholder: "search...",
    onMouseOver: () => {
            setOpenDropDown(true)
          }
  }}
  showAll={true}
  highlightFirstItem={false}
  />
```
### `showAll: boolean` (Optional)
- `false` (default) dropdown doesn't appear until input value matches an item's prefix
- `true` - If the input is focused and empty the dropdown displays all list items

### `highlightFirstItem: boolean` (Optional)
- `true` (default) - automatically highlights first item in dropdown
- `false` - highlight is hidden until arrow key is pressed or hover with mouse

### `submit : boolean` (Optional)
- can be used with `controlSubmit` to only fire `onSelect` or `handleNewValue` when passed in as `true`

### `controlSubmit: boolean` (Optional)
- when set to `true`, `onSelect` and `handleNewValue` will only fire when submit is passed in as `true`

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
        controlSubmit={true}
        submit={submit}
        onSelect={(selectedItem) => {
          console.log(selectedItem)
        }}
        handleNewValue={(inputValue) => {
          console.log(inputValue)
        }}
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
## Tests

Add to the tests: src/AutoComplete.test.js
Run the tests: npm test

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\










