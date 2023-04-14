import { useState } from 'react';
import AutoComplete from './lib/AutoComplete';
import testData from './test-data.json'
import "./index.css"


function App() {
  const [preview, setPreview] = useState("")
  const [openDropDown, setOpenDropDown] = useState();
  const toggleDropDown = (() => {
    setOpenDropDown(openDropDown ? false : true)
  })

  return (
    <div className="App">
      {/* {preview.name} */}
      <button className='ignore' style={{ padding: '10px' }} onClick={toggleDropDown} />
      <AutoComplete
        //list={[0, 33, 1, 55, 5, 111, 11, 333, 44]}
        list={testData}
        //list={['very', 'apple', 'every', 'tom', 'fort', 'but', 'put', 'putty']}
       getPropValue={(listName) => listName.id}
        showAll={true}
        //highlightFirstItem={false}
        clearOnSelect={false}
        inputProps={{
          placeholder: "search...",
          // onMouseOver: () => {
          //   setOpenDropDown(true)
          // }
        }}
        // inputStyle={{
        //   width: "200px",
        //   padding: "5px"
        // }}
        // highlightedItemStyle={{
        //   backgroundColor: "dodgerBlue",
        //   color: "blue"
        // }}
        // wrapperDiv={"inline"}
        // wrapperStyle={{ width: '100px' }}
        // listItemStyle={{
        //   cursor: "pointer",
        //   padding: "5px"
        // }}
        // dropDownStyle={{
        //   backgroundColor: "antiquewhite",
        //   width: "215px",
        //   overflowY: "auto",
        //   maxHeight: "300px"
        // }}
        onSelect={(selectedElement, selectedItem, originalIndex) => {
          setPreview(selectedItem)
          console.log(selectedElement)
          console.log(selectedItem, originalIndex)
        }}
        handleHighlightedItem={(highlightedElement, highlightedItem) => {
          highlightedElement.style.color = ("red")
          setPreview(highlightedItem)
        }}
      //disableOutsideClick={true}
      // updateIsOpen={(updatedState) => {
      //   setOpenDropDown(updatedState)
      // }}
      isOpen={openDropDown}
      />

    </div>
  );
}

export default App;
