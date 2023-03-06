
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
    onSelect={() => {
          console.log("I RAN")
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

### `onSelect: Function` (Optional)
- Function that will run when list item is selected
