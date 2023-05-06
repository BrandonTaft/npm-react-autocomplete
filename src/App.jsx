import { useState } from 'react';
import AutoComplete from './lib/AutoComplete';
import testData from './test-data.json'
import "./index.css"


function App() {
  const [submit, setSubmit] = useState(false);
  const [preview, setPreview] = useState("")
  const [openDropDown, setOpenDropDown] = useState();
  const [filter, setFilter] = useState(true);
  const [sort, setSort] = useState(false);
  const toggleDropDown = (() => {
    setOpenDropDown(openDropDown ? false : true)
  })
  const toggleFilter = (() => {
    setFilter(filter => !filter)
  })
  const toggleSort = (() => {
    setSort(sort => !sort)
  })
  const toggleSubmit = (() => {
    setSubmit(true)
  })

  const [newList, setNewList] = useState(testData);


  return (
    <div className="App">
      {/* {preview.name ? preview.name : ""} */}
      <button className='ignore btn' style={{ padding: '10px' }} onClick={toggleDropDown}>OPEN/CLOSE</button>
      <button className='ignore btn' style={{ padding: '10px' }} onClick={toggleFilter}>FILTER</button>
      <button className='ignore btn' style={{ padding: '10px' }} onClick={toggleSort}>SORT</button>
      <button className='ignore btn' style={{ padding: '10px' }} onClick={toggleSubmit}>SUBMIT</button>
      <AutoComplete
        //list={[0, 33, 1, 55, 5, 111, 11, 333, 44]}
        list={newList}
        //list={testData}
        getPropValue={
          filter === false ? (listName) => listName.id : (listName) => listName.name
        }
        showAll={true}
        descending={sort}
        //highlightFirstItem={false}
        inputProps={{
          placeholder: "search...",
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
        // handleHighlightedItem={(highlightedElement, highlightedItem) => {
        //   highlightedElement.style.color = ("red")
        //   setPreview(highlightedItem)
        // }}
        onSelect={(selectedItem, originalIndex, selectedElement) => {
          setPreview(selectedItem)
          console.log("ONSELECT")
          console.log(selectedElement)
          console.log(selectedItem, originalIndex)
        }}
        clearOnSelect={false}

        handleNewValue={(value) => {
          console.log("HANDLE NEW VALUE")
          console.log('noMatch', value)
          setNewList(prevState => [...prevState, {name:value}])
          setPreview(value)
        }}
        submit={submit}
        //clearOnSubmit={false}
        updateSubmit={setSubmit}
        handleSubmit={(selectedItem, originalIndex) => {
          console.log("HANDLE SUBMIT")
          setPreview(selectedItem)
          console.log(selectedItem)
        }}
        disableOutsideClick={true}
        updateIsOpen={(updatedState) => {
          setOpenDropDown(updatedState)
        }}
        isOpen={openDropDown}
      />

    </div>
  );
}

export default App;
