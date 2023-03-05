import AutoComplete from './lib/AutoComplete';

function App() {
  //let items = [{ a: 'we' }, { a: 'wer' }, { a: 'wert' }]
  let items = ['hey', 'hell', 'hello', 'help', 'helio', 'her', 'herby']
  const onSelect = () => {
    console.log("I RAN")
  }
  return (
    <div className="App">
      <AutoComplete
        //propValue={(item1) => item1.a}
        list={items}
        highlightFirstItem={true}
        onSelect={() => {
          console.log("I RAN")
        }}
      />
    </div>
  );
}

export default App;
