import AutoComplete from './lib/AutoComplete';

function App() {
  //let items = [{ a: 'we' }, { a: 'wer' }, { a: 'wert' }]
  let items = ['hey', 'hell', 'hello', 'help', 'helio', 'her', 'herby']
  return (
    <div className="App">
      <AutoComplete
        //propValue={(item1) => item1.a}
        list={items}
        highlightFirstItem={true}
      />
    </div>
  );
}

export default App;
