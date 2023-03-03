
# React Autocomplete Input Component

```jsx

<AutoComplete
    propValue={(listItem) => listItem.name}
    list={[
        {name: 'Tom'},
        {name: 'Dick'},
        {name: 'Harry'}
    ]}
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
