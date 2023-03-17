import AutoComplete from './lib/AutoComplete';
import testData from './test-data.json'
import "./index.css"


function App() {
  return (
    <div className="App">
      <AutoComplete
        getPropValue={(listItem) => listItem.name}
        showAll={true}
        highlightFirstItem={false}
        clearOnSelect={false}
        inputProps={{
          placeholder: "search...",
        }}
        list={testData}
        inputStyle={{
          width: "200px",
          padding: "5px"
        }}
        highlightedItem={{
          backgroundColor: "gray"
        }}
        wrapperDiv={"block"}
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
