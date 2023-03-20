import { useState } from 'react';
import AutoComplete from './lib/AutoComplete';
import testData from './test-data.json'
import "./index.css"


function App() {
  const [closeMenu, setCloseMenu] = useState()
  
  return (
    <div className="App">
      <button onClick={() => {setCloseMenu(closeMenu ? false : true)}} />
      <AutoComplete
      list={testData}
      getPropValue={(listItem) => listItem.name}
      disableOutsideClick={true}
      closeMenu = {closeMenu}
      showAll={true}
      //highlightFirstItem={false}
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
      />
    </div>
  );
}

export default App;
