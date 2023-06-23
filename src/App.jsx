import { useState } from 'react';
import AutoComplete from './lib/AutoComplete';
import testData from './test-data.json'


function App() {
  const [submit, setSubmit] = useState(false);
  const [openDropDown, setOpenDropDown] = useState();
  const [newList, setNewList] = useState(testData);
  const myList = [0, 1, 'one', 2, 'two', 3, 'three', 4, 'four', 5, 'five']
  const toggleDropDown = (() => {
    setOpenDropDown(openDropDown ? false : true)
  })
  const toggleSubmit = (() => {
    setSubmit(true)
  })
  const toggleList = (() => {
    setNewList(newList === testData ? myList : testData)
  })

  return (
    <div className="App">
      <button className='ignore btn' style={{ padding: '10px' }} onClick={toggleDropDown}>OPEN/CLOSE</button>
      <button className='ignore btn' style={{ padding: '10px' }} onClick={toggleSubmit}>SUBMIT</button>
      <button className='ignore btn' style={{ padding: '10px' }} onClick={toggleList}>LIST</button>
      <AutoComplete
        // Array of values to be stored and displayed in the dropdown
        list={testData}

        // Filter the desired property values to display when list contains object
        getDisplayValue={(list) => list.map((item) => item.name)}

        // If passed in - runs on every new highlight
        handleHighlight={(highlightedItem) => {
          console.log(highlightedItem)
        }}

        // Runs when item is clicked, when enter is pressed, or submit = true
        onSelect={(selectedItem) => {
          console.log("onSELECT")
          console.log(typeof selectedItem)
          setSubmit(false)
        }}

        // runs if input value is not a match
        // handleNewValue={(value) => {
        //   console.log("HANDLE NEW VALUE")
        //   myList.push(value)
        //   console.log(myList)
        //   setNewList(prevState => [...prevState, { name: value }])
        //   setSubmit(false)
        // }}

        // Function that runs when onSelect runs with -
        // no matching item and handleNewValue is not passed in
        onSelectError={() => {
          setSubmit(false)
          window.alert("TRY AGAIN")
        }}

        // Message shown if no matches found
        // Default - "No matches found"
        // False - no message
        // If a string is passed in - it will be the message shown
        noMatchMessage={"No matches found"}

        // Force drop down to open or close
        open={openDropDown}
        // Function that if passed in, runs when dropdown opens or closes 
        onDropDownChange={(x) => { setOpenDropDown(x) }}

        // When set to true gives all control to open
        // disableOutsideClick={true}

        // // Sets custome properties and attributes for inout element
        // inputProps={{
        //   placeholder: "search...",
        //   onMouseOver: () => setOpenDropDown(true)
        // }}

        // Sets behavior of values shown in dropdown when no text is entered
        //If set to true dropdown will dislpay all values from list if no text is entered
        //showAll={true}

        // Sets behavior of highlight when dropdown is opened
        //highlightFirstItem={false}

        // When set to true, handle Select will only fire when submit is true
        controlSubmit={true}
        // When true - fires handle select
        submit={submit}

      wrapperStyle={{ width: 'fit-content' }}
      inputStyle={{
        width: "200px",
        padding: "5px"
      }}
      dropDownStyle={{
        backgroundColor: "antiquewhite",
        width: "215px",
        overflowY: "auto",
        maxHeight: "300px"
      }}
      highlightedItemStyle={{
        backgroundColor: "dodgerBlue",
        color: "blue"
      }}
      listItemStyle={{
        cursor: "pointer",
        padding: "5px"
      }}

      />
    </div>
  )
}

export default App;
