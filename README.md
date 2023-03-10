
# React Autocomplete Input Component

```jsx
import { AutoComplete } from 'react-autocomplete-input-component';

<AutoComplete
        getPropValue={(listItem) => listItem.name}
        highlightFirstItem={false}
        clearOnSelect={false}
        inputProps={{
          placeholder: "search..."
        }}
        list={[
          { name: 'Tom', id: 3233 },
          { name: 'Tommy', id: 3445 },
          { name: 'Thomas', id: 3663 }
        ]}
        inputStyle={{
          width: "200px",
          padding: "5px"
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
- Values are first inserted and stored into a Trie
- values that contain the text entered will be displayed in the dropdown
- `getPropValue: Function` is needed to display Object Property Values

### `getPropValue: Function` (Optional)
- Only needed if `list` contains objects
- Sets the object property value that will be displayed in dropdown

### `highlightFirstItem: Boolean` (Optional)
- True (default) - automatically highlights first item in dropdown
- False - Press arrow key or hover with mouse to highlight

### `clearOnSelect: Boolean` (Optional)
- True (default) the input will clear when an item is selected
- False value selected will become the input value

### `inputProps: Object`
- Sets HTML text input attributes with some exceptions
- Type and Autocomplete are unable to be overridden

### `inputStyle: Object`
- J.S. Style Object Variable for input

### `listItemStyle: Object`
- J.S. Style Object Variable for each item dropdown

### `dropDownStyle: Object`
- J.S. Style Object Variable for dropdown

### `onSelect: Function`
- Function that will run when list item is selected
- Has access to the item selected and the original list array
