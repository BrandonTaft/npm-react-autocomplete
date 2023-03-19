import AutoComplete from './lib/AutoComplete';
import testData from './test-data.json'
import "./index.css"


function App() {
  return (
    <div className="App">
      <AutoComplete
       //list={testData}
       //list={[1,2,3,5,7,9,11]}
      //  list={[
      //   { name: 'Tom', id: 3233 },
      //   { name: 'Tommy', id: 3445 },
      //   { name: 'Thomas', id: 3663 }
      // ]}
     // list={"test"}
       // getPropValue={(listItem) => listItem.name}
        //disableOutsideClick={true}
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
          backgroundColor: "gray"
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
          console.log(selectedItem)
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
