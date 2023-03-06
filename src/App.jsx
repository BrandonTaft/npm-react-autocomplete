import AutoComplete from './lib/AutoComplete';

function App() {
  //let items = [{ a: 'we' }, { a: 'wer' }, { a: 'wert' }]
  let items = ['hey', 'hell', 'hello', 'help', 'helio', 'her', 'herby']
  
  return (
    <div className="App">
      <AutoComplete
        //getPropValue={(item1) => item1.a}
        list={items}
        //highlightFirstItem={false}
        onSelect={(suggestedWord, index) => {
          console.log(suggestedWord, index)
        }}
        itemStyle = { { 
          cursor: "pointer",
          padding: "5px"
        } }
      />
    </div>
  );
}

export default App;
