
# React Autocomplete Input Component

```jsx

<AutoComplete
    list={[
        {name: 'Tom'},
        {name: 'Dick'},
        {name: 'Harry'}
    ]}
    getPropValue={(listItem) => listItem.name}
    highlightFirstItem={false}
    itemStyle = { itemStyle }
    onSelect={(suggestedWord, index) => {
          console.log(suggestedWord, index)
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
- `Array` of the values to be displayed in the dropdown
- `getPropValue: Function` is needed to display Object Property Values

### `getPropValue: Function` (Optional)
- Only needed if `list` contains objects
- Sets the object property value that will be displayed

### `highlightFirstItem: Boolean`
- True - automatically highlights first item in dropdown
- False - Press down arrow or hover with mouse to highlight

### `itemStyle: Object`
- J.S. Style Object Variable

### `onSelect: Function`
- Function that will run when list item is selected
- Has access to the item selected and it's index
