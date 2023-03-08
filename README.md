
# React Autocomplete Input Component

```jsx

<AutoComplete
    getPropValue={(listItem) => listItem.name}
    highlightFirstItem={false}
    list={[
        {name: 'Tom', id: 3233},
        {name: 'Tommy', id: 3445},
        {name: 'Thomas', id: 3663}
    ]}
    itemStyle = {{ 
          cursor: "pointer",
          padding: "5px"
        }}
    onSelect={(index, suggestedWord, list) => {
            for(let i = 0 ; i < list.length; i++) {
              if(suggestedWord === list[i].name) {
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
- `Array` of the values to be displayed in the dropdown
- `getPropValue: Function` is needed to display Object Property Values

### `getPropValue: Function` (Optional)
- Only needed if `list` contains objects
- Sets the object property value that will be displayed in dropdown

### `highlightFirstItem: Boolean`
- True (default) - automatically highlights first item in dropdown
- False - Press arrow key or hover with mouse to highlight

### `itemStyle: Object`
- J.S. Style Object Variable

### `onSelect: Function`
- Function that will run when list item is selected
- Has access to the item selected and it's index
