import { useState, useRef } from 'react';
import AutoComplete from './lib/AutoComplete';
import testData from './test-data.json'
import "./index.css"


function App() {
  const [isDropDownOpen, setIsDropDownOpen] = useState()
  const x = useRef()

  const toggleDropDown = () => {
    setIsDropDownOpen(isDropDownOpen ? false : true)
    // x.current ? x.current = false : x.current = true
  }
  return (
    <div className="App">
      <button className='ignore' style={{ padding: '10px' }} onClick={toggleDropDown} />
      <AutoComplete
        //    list={[]}
        //  list={[3, 33, 13, 222,10, 100]}
        //  list={[3, 33, 13, 222,10, 100, '1Jack', 'Jack']}
        //   list={[
        //   {name: 'terry', clubs: {morning: "science", evening: "math"} },
        //   {name: 'torry', clubs: {morning: "farm", evening: "3test"}},
        //   {name: 'tori', clubs: {morning: "social", evening: "test2"}},
        //   {name: 'teri', clubs: {morning: "home", evening: "test"}},
        //   {name: '', clubs: {morning: "sports", evening: "fitness"}}
        // ]}
        list={testData}
        getPropValue={(listItem) => listItem.name}
        showAll={true}
        highlightFirstItem={false}
        clearOnSelect={false}
        inputProps={{
          placeholder: "search...",
    
        }}
        inputStyle={{
          width: "200px",
          padding: "5px"
        }}
        highlightedItem={{
          backgroundColor: "orange"
        }}
        wrapperDiv={"inline"}
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
        //disableOutsideClick={true}
        changeDropDownState={(isOpen) => {
          setIsDropDownOpen(isOpen)
        }}
        openDropDown={isDropDownOpen}
      />
    </div>
  );
}

export default App;
