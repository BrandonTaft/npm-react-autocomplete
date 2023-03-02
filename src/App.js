import AutoComplete from './lib/AutoComplete';

function App() {
  //let items=[{a:'we'},{a:'wer'},{a:'wert'}]
  let items = ['hey', 'hell', 'hello', 'help', 'helio']
  return (
    <div className="App">
      <AutoComplete 
      // getObjectValue={(item)=> item.a}
      list={items}
      />
    </div>
  );
}

export default App;
