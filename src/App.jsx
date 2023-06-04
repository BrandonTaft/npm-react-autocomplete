import { useCallback, useState } from 'react';
import AutoComplete from './lib/AutoComplete';
import testData from './test-data.json'
import "./index.css"


function App() {
  const [submit, setSubmit] = useState(false);
  const [openDropDown, setOpenDropDown] = useState();
  const [newList, setNewList] = useState(testData);

  const toggleDropDown = (() => {
    setOpenDropDown(openDropDown ? false : true)
  })
  
  const toggleSubmit = (() => {
    setSubmit(true)
  })
  const toggleList = (() => {
    setNewList(newList === testData ? a : testData)
  })

  let a = [0, 33, 1, 55, 5, 111, 11, 333, 44]
  
  const x = (y) => {
    var vals = [];
    for (var i = 0; i < y.length; i++) {
      vals.push(y[i]?.name);
    }
    return vals
  }

  const b = (y) => y.map((listItem) => listItem.id)

  return (
    <div className="App">
      <button className='ignore btn' style={{ padding: '10px' }} onClick={toggleDropDown}>OPEN/CLOSE</button>
      <button className='ignore btn' style={{ padding: '10px' }} onClick={toggleSubmit}>SUBMIT</button>
      <button className='ignore btn' style={{ padding: '10px' }} onClick={toggleList}>LIST</button>
      <AutoComplete
        // Array of values to be stored and displayed in the dropdown
        list={newList}

        // Filter the desired property values to display when list contains object
        getPropValue={x}

        // Sets behavior of values shown in dropdown when no text is entered
        //If set to true dropdown will dislpay all values from list if no text is entered
        showAll={true}

        // Sets behavior of highlight when dropdown is opened
        highlightFirstItem={false}

        // Sets custome properties and attributes for inout element
        inputProps={{
          placeholder: "search...",
        }}

        // If passed in - runs on every new highlight
        handleHighlight={(highlightedItem) => {
          console.log(highlightedItem)
        }}

        // Runs when item is clicked, when enter is pressed, or submit = true
        handleSelect={(selectedItem) => {
          console.log("HANDLESELECT")
          console.log(selectedItem)
          setSubmit(false)
        }}

        // If passed in - runs if input value is not a match
        handleNewValue={(value) => {
          console.log("HANDLE NEW VALUE")
          setNewList(prevState => [...prevState, { name: value }])
          setSubmit(false)
        }}

        // Function that runs when handleSelect runs with -
        // no matching item and handleNewValue is not passed in
        handleSelectError={() => {
          setSubmit(false)
          window.alert("TRY AGAIN")
        }}

        // Message shown if no matches found
        // Default - "No matches found"
        // False - no message
        // If a string is passed in - it will be the message shown
        handleNoMatchMessage={"Please try again"}

        // When set to true gives all control to open
        //disableOutsideClick={true}

        // Force drop down to open or close
        open={openDropDown}
        // // Function that if passed in, runs when dropdown opens or closes 
        onDropdownChange={(x) => { setOpenDropDown(x) }}

        // When set to true, handle Select will only fire when submit is true
        //controlSubmit={true}
        // When true - fires handle select
        //submit={submit}

        //// JS Style objects/////
        inputStyle={{
          width: "200px",
          padding: "5px"
        }}
        highlightedItemStyle={{
          backgroundColor: "dodgerBlue",
          color: "blue"
        }}
        wrapperStyle={{ width: 'fit-content' }}
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

      />

    </div>
  );
}

export default App;
