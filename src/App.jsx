import { useState } from 'react';
import AutoComplete from './lib/AutoComplete';
import testData from './test-data.json'
import "./index.css"


function App() {
  const [preview, setPreview] = useState("")
  const [openDropDown, setOpenDropDown] = useState();
  const [filter, setFilter] = useState(true)
  const toggleDropDown = (() => {
    setOpenDropDown(openDropDown ? false : true)
  })
  const toggleFilter = (() => {
    setFilter(filter => !filter)
  })

  return (
    <div className="App">
      {preview.name}
      <button className='ignore' style={{ padding: '10px' }} onClick={toggleDropDown} />
      <button className='ignore' style={{ padding: '10px' }} onClick={toggleFilter} />
      <AutoComplete
        //  list={[0, 33, 1, 55, 5, 111, 11, 333, 44]}
        //list={['very', 'apple', 'every', 'tom', 'fort', 'but', 'put', 'putty']}
        list={testData}
        getPropValue={
          filter === false ? (listName) => listName.id : (listName) => listName.name
        }
        showAll={true}
        //highlightFirstItem={false}
        clearOnSelect={false}
        inputProps={{
          placeholder: "search...",
          onMouseOver: () => {
            setOpenDropDown(true)
          }
        }}
        inputStyle={{
          width: "200px",
          padding: "5px"
        }}
        highlightedItemStyle={{
          backgroundColor: "dodgerBlue",
          color: "blue"
        }}
        wrapperDiv={"inline"}
        wrapperStyle={{ width: '100px' }}
        listItemStyle={{
          cursor: "pointer",
          padding: "5px"
        }}
        dropDownStyle={{
          backgroundColor: "antiquewhite",
          width: "215px",
          overflowY: "auto",
          maxHeight: "300px"
        }}
        onSelect={(selectedElement, selectedItem, originalIndex) => {
          setPreview(selectedItem)
          console.log(selectedElement)
          console.log(selectedItem, originalIndex)
        }}
        // handleHighlightedItem={(highlightedElement, highlightedItem) => {
        //   highlightedElement.style.color = ("red")
        //   setPreview(highlightedItem)
        // }}
        //disableOutsideClick={true}
        updateIsOpen={(updatedState) => {
          setOpenDropDown(updatedState)
        }}
        isOpen={openDropDown}
      />

    </div>
  );
}

export default App;
