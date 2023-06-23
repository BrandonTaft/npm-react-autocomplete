import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AutoComplete from './lib/AutoComplete';
import testData from './test-data.json';

let myList = [1, 'one', 2, 'two', 3, 'three', 4, 'four', 5, 'five'];
const getProp = (y) => y.map((listItem) => listItem.id);

describe('Initial render', () => {
  it('renders AutoComplete w/ no props', () => {
    render(<AutoComplete />);

    expect(screen.getByRole('searchbox')).toBeInTheDocument();

  });

  it('logs error if list contains obj but is missing getDisplayValue', () => {
    const err = jest.spyOn(console, 'error');

    render(<AutoComplete list={testData} />);

    expect(screen.getByRole('searchbox')).toBeInTheDocument();

    expect(err).toHaveBeenCalledTimes(1);
  });
});

describe('Renders dropdown component', () => {
  it('inserts list into trie', async () => {
    render(<AutoComplete list={myList} showAll={true} />);

    expect(screen.getByRole('searchbox')).toBeInTheDocument();

    fireEvent.focus(screen.getByRole('searchbox'));

    expect(screen.getByTestId('dropDown')).toBeInTheDocument();

    screen.debug();
  });

  it('uses getDisplayValue to filter and display all items in list', async () => {

    render(<AutoComplete list={testData} getDisplayValue={getProp} showAll={true} />);

    fireEvent.focus(screen.getByRole('searchbox'));

    const dropDown = screen.getByTestId('dropDown');
    const items = dropDown.querySelectorAll('.dropdown-item');

    expect(dropDown).toBeInTheDocument();
    expect(items).toHaveLength(59);

  });
});

describe('highlightFirstItem', () => {
  it('first item is highlighted as soon as dropdown opens', async () => {
    render(<AutoComplete list={myList} showAll={true} />);

    expect(screen.getByRole('searchbox')).toBeInTheDocument();

    fireEvent.focus(screen.getByRole('searchbox'));

    expect(screen.getByTestId('dropDown')).toBeInTheDocument();

    const item = screen.getByText('1');

    expect(item.classList[1]).toBe("highlighted-item");

    screen.debug();
  });

  it('no highlight when dropdown first opens', async () => {
    window.HTMLElement.prototype.scrollIntoView = function () { };
    render(<AutoComplete list={myList} showAll={true} highlightFirstItem={false} />);

    expect(screen.getByRole('searchbox')).toBeInTheDocument();

    fireEvent.focus(screen.getByRole('searchbox'));

    expect(screen.getByTestId('dropDown')).toBeInTheDocument();

    const item = screen.getByText('1');

    expect(item.classList[1]).toBeUndefined();

    fireEvent.keyDown(screen.getByRole('searchbox'), { key: "ArrowDown", code: 40 });

    expect(item.classList[1]).toBe("highlighted-item");

    screen.debug();
  });
});

describe('inputProps', () => {
  it('sets inout type to text', () => {
    const inputProps = { type: 'text' };
    render(<AutoComplete inputProps={inputProps} />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();

  });
});

describe('disableOutsideClick', () => {
  it('closes when clicked outside of component', async () => {

    render(<AutoComplete list={myList} showAll={true} open={true} />);

    expect(screen.getByTestId('dropDown')).toBeInTheDocument();

    await waitFor(() => {
      fireEvent.mouseDown(document.body);
    });

    expect(screen.queryByTestId('dropDown')).toBeNull();

    screen.debug();
  });

  it('only closes when open is passed in as false', async () => {

    const { rerender } = render(<AutoComplete list={myList} showAll={true} disableOutsideClick={true} open={true} />);

    expect(screen.getByTestId('dropDown')).toBeInTheDocument();

    await waitFor(() => {
      fireEvent.mouseDown(document.body);
    });

    expect(screen.getByTestId('dropDown')).toBeInTheDocument();

    rerender(<AutoComplete list={myList} showAll={true} disableOutsideClick={true} open={false} />);

    expect(screen.queryByTestId('dropDown')).toBeNull();

    screen.debug();
  });
});

describe('open & onDropDownChange', () => {
  it('forces the dropdown to open by setting open to true', async () => {
    const onDropDownChange = jest.fn()
    const { rerender } = render(<AutoComplete list={myList} showAll={true} open={false} onDropDownChange={onDropDownChange} />);

    expect(screen.queryByTestId('dropDown')).toBeNull();

    rerender(<AutoComplete list={myList} showAll={true} open={true} />);

    expect(screen.getByTestId('dropDown')).toBeInTheDocument();

    expect(onDropDownChange).toHaveBeenCalled();

    screen.debug();
  });

  it('forces the dropdown closed by setting open to false', async () => {
    const onDropDownChange = jest.fn()
    const { rerender } = render(<AutoComplete list={myList} showAll={true} open={false} onDropDownChange={onDropDownChange} />);

    expect(screen.queryByTestId('dropDown')).toBeNull();

    rerender(<AutoComplete list={myList} showAll={true} open={true} />);

    expect(screen.getByTestId('dropDown')).toBeInTheDocument();

    rerender(<AutoComplete list={myList} showAll={true} open={false} />);

    expect(screen.queryByTestId('dropDown')).toBeNull();

    expect(onDropDownChange).toHaveBeenCalled();

    screen.debug();
  });
});

describe('onSelect', () => {
  it('fires the onSelect function with click', async () => {
    const onSelect = jest.fn((item) => console.log(item));
    const logSpy = jest.spyOn(console, 'log');

    render(<AutoComplete list={myList} onSelect={onSelect} />);

    fireEvent.focus(screen.getByRole('searchbox'));

    await waitFor(() => {
      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'o' }
      });
    });

    expect(screen.getByText('one')).toBeInTheDocument();

    await waitFor(() => {
      fireEvent.click(screen.getByText('one'))
    });

    expect(onSelect).toHaveBeenCalled();
    expect(logSpy).toBeCalledWith('one');

  });

  it('fires the onSelect function with Enter', async () => {
    const onSelect = jest.fn((item) => console.log(item));
    const logSpy = jest.spyOn(console, 'log');

    render(<AutoComplete list={myList} onSelect={onSelect} />);

    fireEvent.focus(screen.getByRole('searchbox'));

    await waitFor(() => {
      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: '1' }
      });
    });

    await waitFor(() => {
      fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Enter', code: 'Enter', charCode: 13 });
    });

    expect(onSelect).toHaveBeenCalled();
    expect(logSpy).toBeCalledWith(1);

  });

  it('fires the onSelect function using submit button', async () => {
    const onSelect = jest.fn((item) => console.log(item));
    const logSpy = jest.spyOn(console, 'log');

    const { rerender } = render(<AutoComplete list={myList} onSelect={onSelect} submit={false} controlSubmit={true} />);

    fireEvent.focus(screen.getByRole('searchbox'));

    await waitFor(() => {
      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'f' },
      });
    });

    const item = screen.getByText('five');

    await waitFor(() => {
      expect(item).toBeInTheDocument();
    });

    await waitFor(() => {
      fireEvent.click(item);
    });

    rerender(<AutoComplete list={myList} onSelect={onSelect} submit={true} controlSubmit={true} />);

    expect(onSelect).toHaveBeenCalled();
    expect(logSpy).toBeCalledWith('five');
  });
});

describe('handleNewValue', () => {
  it('fires the handleNewValue function with enter', async () => {
    const onSelect = jest.fn();
    const handleNewValue = jest.fn((newValue) => console.log(newValue));
    const logSpy = jest.spyOn(console, 'log');

    render(<AutoComplete list={myList} onSelect={onSelect} handleNewValue={handleNewValue} />);

    fireEvent.focus(screen.getByRole('searchbox'));

    await waitFor(() => {
      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'a new value' }
      });
    });

    await waitFor(() => {
      fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Enter', code: 'Enter', charCode: 13 });
    });

    expect(handleNewValue).toHaveBeenCalled();
    expect(logSpy).toBeCalledWith('a new value');

  });

  it('fires the handleNewValue function with submit', async () => {
    const onSelect = jest.fn();
    const handleNewValue = jest.fn((newValue) => console.log(newValue));
    const logSpy = jest.spyOn(console, 'log');

    const { rerender } = render(<AutoComplete list={myList} onSelect={onSelect} handleNewValue={handleNewValue} submit={false} controlSubmit={true} />);

    fireEvent.focus(screen.getByRole('searchbox'));

    await waitFor(() => {
      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'a new value' }
      });
    });

    rerender(<AutoComplete list={myList} onSelect={onSelect} handleNewValue={handleNewValue} submit={true} controlSubmit={true} />);

    expect(handleNewValue).toHaveBeenCalled();
    expect(logSpy).toBeCalledWith('a new value');

  });
});

describe('handleHighlight', () => {
  it('fires handleHighlight with mouse', async () => {
    const handleHighlight = jest.fn((highlighted) => console.log(highlighted));
    const logSpy = jest.spyOn(console, 'log');

    render(<AutoComplete list={myList} handleHighlight={handleHighlight} showAll={true} />);

    await waitFor(() => {
      fireEvent.focus(screen.getByRole('searchbox'));
    });

    const item = screen.getByText('1');

    await waitFor(() => {
      expect(item).toBeInTheDocument();
    });

    await waitFor(() => {
      fireEvent.mouseEnter(item);
    });

    expect(handleHighlight).toHaveBeenCalledTimes(1);
    expect(logSpy).toBeCalledWith(1);

  });

  it('fires handleHighlight with arrow down', async () => {
    window.HTMLElement.prototype.scrollIntoView = function () { };
    const handleHighlight = jest.fn((highlighted) => console.log(highlighted));
    const logSpy = jest.spyOn(console, 'log');

    render(<AutoComplete list={myList} handleHighlight={handleHighlight} showAll={true} />);

    expect(screen.getByRole('searchbox')).toBeInTheDocument();

    fireEvent.focus(screen.getByRole('searchbox'));

    await waitFor(() => {
      expect(screen.getByTestId('dropDown')).toBeInTheDocument();
    });

    fireEvent.keyDown(screen.getByRole('searchbox'), { key: "ArrowDown", code: 40 });

    expect(handleHighlight).toHaveBeenCalledTimes(2);
    expect(logSpy).toBeCalledWith(2);

    screen.debug();
  });
});

describe('noMatchMessage & onSelectError', () => {
  it('shows custom message when no matches are found', async () => {
    render(<AutoComplete list={myList} noMatchMessage={"custom message"} />);

    fireEvent.focus(screen.getByRole('searchbox'));

    await waitFor(() => {
      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'an item not listed' }
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId('dropDown')).toBeInTheDocument();
      expect(screen.getByText('custom message')).toBeInTheDocument();
    });

  });

  it('fires onSelectError when handleNewValue is not passed in', async () => {
    const onSelectError = jest.fn(() => console.log("Sorry there was no match"));
    const onSelect = jest.fn();
    const logSpy = jest.spyOn(console, 'log');

    render(<AutoComplete list={myList} onSelect={onSelect} onSelectError={onSelectError} />);

    fireEvent.focus(screen.getByRole('searchbox'));

    await waitFor(() => {
      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'new value' }
      });
    });

    await waitFor(() => {
      fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Enter', code: 'Enter', charCode: 13 });
    });

    expect(onSelectError).toHaveBeenCalledTimes(1);
    expect(logSpy).toBeCalledWith("Sorry there was no match");

  });
});