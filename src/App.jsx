import { useState } from 'react';
import AutoComplete from './lib/AutoComplete';
import testData from './test-data.json'
import "./index.css"


function App() {
  const [submit, setSubmit] = useState(false);
  
  const [openDropDown, setOpenDropDown] = useState();
  const [filter, setFilter] = useState(false);
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
  const toggleList = (() => {
    setNewList(newList === testData ? a : testData)
  })

  const [newList, setNewList] = useState(testData);

  let a = [0, 33, 1, 55, 5, 111, 11, 333, 44]

  return (
    <div className="App">
      {/* {preview.name ? preview.name : ""} */}
      <button className='ignore btn' style={{ padding: '10px' }} onClick={toggleDropDown}>OPEN/CLOSE</button>
      <button className='ignore btn' style={{ padding: '10px' }} onClick={toggleFilter}>FILTER</button>
      <button className='ignore btn' style={{ padding: '10px' }} onClick={toggleSort}>SORT</button>
      <button className='ignore btn' style={{ padding: '10px' }} onClick={toggleSubmit}>SUBMIT</button>
      <button className='ignore btn' style={{ padding: '10px' }} onClick={toggleList}>LIST</button>
      <AutoComplete
        //list={[0, 33, 1, 55, 5, 111, 11, 333, 44]}
        list={newList}
        //list={testData}
        getPropValue={
          filter === false ?
            (y) => {
             
              var vals = [];
              for (var i = 0; i < y.length; i++) {
                vals.push(y[i]?.name);
              }
              return vals
            }
            :
            (y) => {
              return y.map((listItem) => listItem.id)
            }
        }
        // handleHighlight={(highlightedItem) => {
        //   console.log(highlightedItem)
        // }}
        handleSelect={(selectedItem, selectedElement) => {
          console.log(selectedItem, selectedElement)
        }}
        handleNewValue={(value) => {
          console.log("HANDLE NEW VALUE")
          setNewList(prevState => [...prevState, {name:value}])
        }}
        // handleSubmit={(selectedItem, originalIndex) => {
        //   console.log(selectedItem)
        // }}
        showAll={true}
        descending={sort}
        highlightFirstItem={false}
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
        
        
        clearOnSelect={false}
        //clearOnSubmit={false}
        submit={submit}
        updateSubmit={setSubmit}
        handleNoMatchMessage={"Please try again"}
        
        
        
        
        //disableOutsideClick={true}
        onDropdownChange={(x) => {setOpenDropDown(x)}}
        forceDropDown={openDropDown}
      />

    </div>
  );
}

export default App;
