import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AutoComplete from './lib/AutoComplete';
import testData from './test-data.json';

let myList = [1, 'one', 2, 'two', 3, 'three', 4, 'four', 5, 'five'];
const getProp = (y) => y.map((listItem) => listItem.id);


it('renders AutoComplete w/ no props', () => {
  render(<AutoComplete />);
  screen.debug();
});


it('logs error if list contains obj but is missing getPropValue', () => {
  const err = jest.spyOn(console, 'error');
  render(<AutoComplete list={testData} />);
  expect(err).toHaveBeenCalledTimes(1);
});


it('uses getprop to filter all items in list', async () => {

  render(<AutoComplete list={testData} getPropValue={getProp} showAll={true} />);

  expect(screen.getByRole('searchbox')).toBeInTheDocument();
  fireEvent.focus(screen.getByRole('searchbox'));

  const dropDown = screen.getByTestId('dropDown')
  const items = dropDown.querySelectorAll('.dropdown-item')

  expect(dropDown).toBeInTheDocument();
  expect(items).toHaveLength(59)

  screen.debug()
});


it('inserts list into trie', async () => {
  render(<AutoComplete list={myList} showAll={true} />);

  expect(screen.getByRole('searchbox')).toBeInTheDocument();

  fireEvent.focus(screen.getByRole('searchbox'));

  expect(screen.getByTestId('dropDown')).toBeInTheDocument();

  screen.debug()
});



it('forces the dropdown to open', async () => {
  const { rerender } = render(<AutoComplete list={myList} showAll={true} open={false} />);

  expect(screen.queryByTestId('dropDown')).toBeNull();

  rerender(<AutoComplete list={myList} showAll={true} open={true} />);

  expect(screen.getByTestId('dropDown')).toBeInTheDocument();

  screen.debug();
});



it('fires the onSelect function with click', async () => {

  const onSelect = jest.fn();

  render(<AutoComplete list={myList} onSelect={onSelect} />);

  expect(screen.getByRole('searchbox')).toBeInTheDocument();

  fireEvent.focus(screen.getByRole('searchbox'));

  await waitFor(() => {
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'o' },
    });
  })

  expect(screen.getByText('one')).toBeInTheDocument();

  await waitFor(() => {
    fireEvent.click(screen.getByText('one'))
  })

  expect(onSelect).toHaveBeenCalled();

  screen.debug();
});


it('fires the onSelect function with Enter', async () => {

  const onSelect = jest.fn();

  render(<AutoComplete list={myList} onSelect={onSelect} />);

  fireEvent.focus(screen.getByRole('searchbox'));

  await waitFor(() => {
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 't' },
    });
  })

  await waitFor(() => {
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Enter', code: 'Enter', charCode: 13 })
  })

  expect(onSelect).toHaveBeenCalled();

  screen.debug();
});


it('fires the handleNewValue function with enter', async () => {
  const onSelect = jest.fn();
  const handleNewValue = jest.fn();

  render(<AutoComplete list={myList} onSelect={onSelect} handleNewValue={handleNewValue} />);

  fireEvent.focus(screen.getByRole('searchbox'));

  await waitFor(() => {
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'newValue' },
    });
  })
  
  await waitFor(() => {
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Enter', code: 'Enter', charCode: 13 })
  })

  expect(handleNewValue).toHaveBeenCalled();

  screen.debug();
});

it('fires the handleNewValue function with submit', async () => {
  const onSelect = jest.fn();
  const handleNewValue = jest.fn();

  const { rerender } = render(<AutoComplete list={myList} onSelect={onSelect} handleNewValue={handleNewValue} submit={false} controlSubmit={true} />);

  fireEvent.focus(screen.getByRole('searchbox'));

  await waitFor(() => {
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'a new value' },
    });
  })
  
  rerender(<AutoComplete list={myList} onSelect={onSelect} handleNewValue={handleNewValue} submit={true} controlSubmit={true} />);

  expect(handleNewValue).toHaveBeenCalled();
  
  screen.debug();
});


it('fires the onSelect function using submit button', async () => {
  const onSelect = jest.fn();

  const { rerender } = render(<AutoComplete list={myList} onSelect={onSelect} submit={false} controlSubmit={true} />);

  fireEvent.focus(screen.getByRole('searchbox'));

  await waitFor(() => {
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'o' },
    });
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

it('fires onHighlight', async () => {
  const onHighlight = jest.fn();

  render(<AutoComplete list={myList} onHighlight={onHighlight} showAll={true} />);

  await waitFor(() => {
    fireEvent.focus(screen.getByRole('searchbox'));
  });

  const item = screen.getByText('1');
  
  await waitFor(() => {
    expect(item).toBeInTheDocument();
  })
  
  await waitFor(() => {
    fireEvent.mouseEnter(item)
  })

  expect(onHighlight).toHaveBeenCalledTimes(1);

  screen.debug()

});

it('fires onSelectError when handleNewValue is not passed in', async () => {
  const onSelectError = jest.fn();
  const onSelect = jest.fn();

  render(<AutoComplete list={myList} onSelect={onSelect} onSelectError={onSelectError} />);

  fireEvent.focus(screen.getByRole('searchbox'));

  await waitFor(() => {
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'new value' },
    });
  })

  await waitFor(() => {
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Enter', code: 'Enter', charCode: 13 })
  })

  expect(onSelectError).toHaveBeenCalledTimes(1);

  screen.debug();
});

it('shows custom message when no matches are found', async () => {

  render(<AutoComplete list={myList} noMatchMessage={"custom message"} />);

  fireEvent.focus(screen.getByRole('searchbox'));

  await waitFor(() => {
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'no match' },
    });
  })

  await waitFor(() => {
    expect(screen.getByTestId('dropDown')).toBeInTheDocument();
  })

  screen.debug();

  await waitFor(() => {
    expect(screen.getByText('custom message')).toBeInTheDocument();
  })

});




