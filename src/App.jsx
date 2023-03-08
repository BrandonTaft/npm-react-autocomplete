import AutoComplete from './lib/AutoComplete';

function App() {
  let items = [{ name: 'we', id:2 }, { name: 'wer', id:3 }, { name: 'wert', id:4 }]
  //let items = ['hey', 'hell', 'hello', 'help', 'helio', 'her', 'herby']
  
  return (
    <div className="App">
      <AutoComplete
    getPropValue={(listItem) => listItem.name}
    highlightFirstItem={false}
    list={[
        {name: 'Tom', id: 3233},
        {name: 'Tommy', id: 3445},
        {name: 'Thomas', id: 3663}
    ]}
    itemStyle = {{ 
          cursor: "pointer",
          padding: "5px"
        }}
    onSelect={(index, suggestedWord, list) => {
            for(let i = 0 ; i < list.length; i++) {
              if(suggestedWord === list[i].name) {
                console.log(list[i])
              }
            } 
          }}
/>
    </div>
  );
}

export default App;
