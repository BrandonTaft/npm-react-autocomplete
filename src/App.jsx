import AutoComplete from './lib/AutoComplete';
import testData from './test-data.json'


function App() {
  return (
    <div className="App">
      <AutoComplete
        getPropValue={(listItem) => listItem.name}
        //highlightFirstItem={false}
        clearOnSelect={false}
        inputProps={{
          placeholder: "search...",
          maxLength: "5"
        }}
        list={testData}
        inputStyle={{
          width: "200px",
          padding: "5px"
        }}
        listItemStyle={{
          cursor: "pointer",
          padding: "5px"
        }}
        dropDownStyle={{
          backgroundColor: "antiquewhite",
          width: "215px",
          overflowY: "scroll",
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
