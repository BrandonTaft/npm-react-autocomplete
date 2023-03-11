import AutoComplete from './lib/AutoComplete';

function App() {
  return (
    <div className="App">
      <AutoComplete
        getPropValue={(listItem) => listItem.name}
        highlightFirstItem={false}
        clearOnSelect={false}
        inputProps={{
          placeholder: "search..."
        }}
        // list={[
        //   { name: 'Tom', id: 3233 },
        //   { name: 'Tommy', id: 3445 },
        //   { name: 'Thomas', id: 3663 }
        // ]}
        //list={['tom', 'tommy', 'tomas','tommmy', 'tory']}
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
          width: "215px"
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
