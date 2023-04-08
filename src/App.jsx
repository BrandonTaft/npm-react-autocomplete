import { useState } from 'react';
import AutoComplete from './lib/AutoComplete';
import testData from './test-data.json'
import "./index.css"


function App() {
  const [tooltTip, setToolTip] = useState();
  const[preview, setPreview] = useState();
  const [openDropDown, setOpenDropDown] = useState();
  const toggleDropDown = (() => {
    setOpenDropDown(openDropDown ? false : true)
  })

  return (
    <div className="App">
      <div>
        {preview}
      </div>
      <button className='ignore' style={{ padding: '10px' }} onClick={toggleDropDown} />
      <AutoComplete
        list={[0, 33, 1, 55, 5, 111, 11, 333, 44]}
        //list={testData}
        getPropValue={(listName) => listName.name}
        showAll={true}
        highlightFirstItem={false}
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
          backgroundColor: "orange",
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
        onSelect={(selectedItem, list) => {
          console.log(typeof selectedItem)
          for (let i = 0; i < list.length; i++) {
            if (selectedItem === list[i].name) {
              console.log(list[i])
            }
          }
        }}


        handleHighlightedItem={(highlightedItem, list) => {
          highlightedItem.classList.add("red")
          setPreview(highlightedItem.innerText)
        }}
      //disableOutsideClick={true}
      // updateIsOpen={(updatedState) => {
      //   setOpenDropDown(updatedState)
      // }}
      // isOpen={openDropDown}
      />

    </div>
  );
}

export default App;
