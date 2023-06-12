import { fireEvent, userEvent, render, screen, waitFor } from '@testing-library/react';
import AutoComplete from './lib/AutoComplete';
import testData from './test-data.json';

let myList = [1, 'one', 2, 'two', 3, 'three', 4, 'four', 5, 'five'];
const getProp = (y) => y.map((listItem) => listItem.id);
const onSelect = (selectedItem) => {
  console.log("onSELECT")
  console.log(selectedItem)
}
const handleNewValue = (value) => {
          console.log("HANDLE NEW VALUE")
          console.log(value)
          myList.push(value)
        }

describe('AutoComplete', () => {
  it('renders AutoComplete w/ no props', () => {
    render(<AutoComplete />);
    screen.debug();
  });
});

describe('AutoComplete', () => {
  beforeEach(function(){
     jest.spyOn(console, 'error');
  })
  it('logs error if list contains obj but is missing getPropValue', () => {
    render(<AutoComplete list={testData} />);
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});

describe('AutoComplete', () => {
  it('inserts list into trie', async () => {
    render(<AutoComplete list={myList} showAll={true} />);

    const myInput = screen.getByRole('searchbox');
    expect(myInput).toBeInTheDocument(); 
    fireEvent.focus(myInput);

    const dropDown = screen.getByTestId('dropDown');
    await waitFor(() => {
      expect(dropDown).toBeInTheDocument();
    })

    screen.debug();
  });
});

describe('AutoComplete', () => {
  it('forces the dropdown opened', async () => {
    render(<AutoComplete list={myList} showAll={true} open={true} />);

    const dropDown = screen.getByTestId('dropDown');
    await waitFor(() => {
      expect(dropDown).toBeInTheDocument();
    })

    screen.debug();
  });
});

describe('AutoComplete', () => {
  it('fires the onSelect function', async () => {
    //const onSelect = jest.fn();
    render(<AutoComplete list={myList} onSelect={onSelect}/>);

    const myInput = screen.getByRole('searchbox');
    expect(myInput).toBeInTheDocument(); 
    fireEvent.focus(myInput);

    await waitFor(() => {
      fireEvent.change(myInput, {
        target: { value: 'o' },
      });
    })

    const dropDown = screen.getByTestId('dropDown');
    await waitFor(() => {
      expect(dropDown).toBeInTheDocument();
    })

    const item = screen.getByText('one');
    await waitFor(() => {
      expect(item).toBeInTheDocument();
    })

    const logSpy = jest.spyOn(console, 'log');
    await waitFor(() => {
    fireEvent.click(item)
    })

    
   
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('one');
    
    
    //expect(onSelect).toHaveBeenCalled();
    screen.debug();
  });
});

describe('AutoComplete', () => {
  it('fires the handleNewValue function', async () => {
    render(<AutoComplete list={myList} onSelect={onSelect} handleNewValue={handleNewValue}/>);

    const myInput = screen.getByRole('searchbox');
    expect(myInput).toBeInTheDocument(); 
    fireEvent.focus(myInput);

    await waitFor(() => {
      fireEvent.change(myInput, {
        target: { value: 'newValue' },
      });
    })

    const dropDown = screen.getByTestId('dropDown');
    await waitFor(() => {
      expect(dropDown).toBeInTheDocument();
    })

    const logSpy = jest.spyOn(console, 'log');
    await waitFor(() => {
      fireEvent.keyDown(myInput, {key: 'Enter', code: 'Enter', charCode: 13})
    })
    
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('newValue');
    
    screen.debug();
  });
});

describe('AutoComplete', () => {
  it('fires the onSelect function using submit button', async () => {
    const onSelect = jest.fn();
    
    const {rerender} = render(<AutoComplete list={myList} onSelect={onSelect} submit={false} controlSubmit={true}/>);

    const myInput = screen.getByRole('searchbox');
    expect(myInput).toBeInTheDocument(); 
    fireEvent.focus(myInput);

    await waitFor(() => {
      fireEvent.change(myInput, {
        target: { value: 'o' },
      });
    })

    const dropDown = screen.getByTestId('dropDown');
    await waitFor(() => {
      expect(dropDown).toBeInTheDocument();
    })

    const item = screen.getByText('one');
    await waitFor(() => {
      expect(item).toBeInTheDocument();
    })

    //const logSpy = jest.spyOn(console, 'log');
    await waitFor(() => {
    fireEvent.click(item)
    })
    rerender(<AutoComplete list={myList} onSelect={onSelect} submit={true} controlSubmit={true}/>);
    // expect(logSpy).toHaveBeenCalled();
    // expect(logSpy).toHaveBeenCalledWith('one');
    
    
    expect(onSelect).toHaveBeenCalledTimes(1);
    screen.debug();
  });
});


