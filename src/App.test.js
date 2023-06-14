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

  const err = jest.spyOn(console, 'error');
  it('logs error if list contains obj but is missing getPropValue', () => {
    render(<AutoComplete list={testData} />);
    expect(err).toHaveBeenCalledTimes(1);
  });

  it('uses getprop to filter all items in list', async () => {
    render(<AutoComplete list={testData} getPropValue={getProp} showAll={true} />);

    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    fireEvent.focus(screen.getByRole('searchbox'));

    const dropDown = screen.getByTestId('dropDown')
    await waitFor(() => {
      expect(dropDown).toBeInTheDocument();
    })

    const items = dropDown.querySelectorAll('.dropdown-item')
    expect(items).toHaveLength(59)
    screen.debug()
  });


  it('inserts list into trie', async () => {
    render(<AutoComplete list={myList} showAll={true} />);

    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    fireEvent.focus(screen.getByRole('searchbox'));

    await waitFor(() => {
      expect(screen.getByTestId('dropDown')).toBeInTheDocument();
    })

    screen.debug()
  });



  it('forces the dropdown to open', async () => {
    const { rerender } = render(<AutoComplete list={myList} showAll={true} open={false} />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('dropDown')).toBeNull();
    })

    rerender(<AutoComplete list={myList} showAll={true} open={true} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('dropDown')).toBeInTheDocument();
    })

    screen.debug();
  });



  it('fires the onSelect function with click', async () => {
    render(<AutoComplete list={myList} onSelect={onSelect} />);

    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    fireEvent.focus(screen.getByRole('searchbox'));

    await waitFor(() => {
      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'o' },
      });
    })

    
    await waitFor(() => {
      expect(screen.getByTestId('dropDown')).toBeInTheDocument();
    })

    
    await waitFor(() => {
      expect(screen.getByText('one')).toBeInTheDocument();
    })

    const logSpy = jest.spyOn(console, 'log');
    await waitFor(() => {
      fireEvent.click(screen.getByText('one'))
    })

    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('one');

    screen.debug();
  });



  it('fires the onSelect function with Enter', async () => {
    render(<AutoComplete list={myList} onSelect={onSelect} />);

    
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    fireEvent.focus(screen.getByRole('searchbox'));

    await waitFor(() => {
      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 't' },
      });
    })

    const logSpy = jest.spyOn(console, 'log');
    await waitFor(() => {
      fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Enter', code: 'Enter', charCode: 13 })
    })

    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('three');

    screen.debug();
  });


  it('fires the handleNewValue function', async () => {
    render(<AutoComplete list={myList} onSelect={onSelect} handleNewValue={handleNewValue} />);

    
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    fireEvent.focus(screen.getByRole('searchbox'));

    await waitFor(() => {
      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'newValue' },
      });
    })

    
    await waitFor(() => {
      expect(screen.getByTestId('dropDown')).toBeInTheDocument();
    })

    const logSpy = jest.spyOn(console, 'log');
    await waitFor(() => {
      fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Enter', code: 'Enter', charCode: 13 })
    })

    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('newValue');

    screen.debug();
  });

  it('fires the handleNewValue function with Enter', async () => {
    render(<AutoComplete list={myList} onSelect={onSelect} handleNewValue={handleNewValue} />);

    
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    fireEvent.focus(screen.getByRole('searchbox'));

    await waitFor(() => {
      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'ten' },
      });
    })

    const logSpy = jest.spyOn(console, 'log');
    await waitFor(() => {
      fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Enter', code: 'Enter', charCode: 13 })
    })

    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('ten');
    expect(logSpy).toHaveBeenCalledWith("HANDLE NEW VALUE")

    screen.debug();
  });

  it('fires the onSelect function using submit button', async () => {
    const onSelect = jest.fn();

    const { rerender } = render(<AutoComplete list={myList} onSelect={onSelect} submit={false} controlSubmit={true} />);

    
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    fireEvent.focus(screen.getByRole('searchbox'));

    await waitFor(() => {
      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'o' },
      });
    })

    
    await waitFor(() => {
      expect(screen.getByTestId('dropDown')).toBeInTheDocument();
    })

    const item = screen.getByText('one');
    await waitFor(() => {
      expect(item).toBeInTheDocument();
    })

    await waitFor(() => {
      fireEvent.click(item)
    })

    rerender(<AutoComplete list={myList} onSelect={onSelect} submit={true} controlSubmit={true} />);

    expect(onSelect).toHaveBeenCalledTimes(1);
    screen.debug();
  });
});


