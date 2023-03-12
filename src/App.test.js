import { render, screen } from '@testing-library/react';
import App from './App';
import AutoComplete from './lib/AutoComplete';
import testData from './test-data.json'


describe('AutoComplete', () => {
  it('renders AutoComplete component', () => {
    render(<AutoComplete  />);
    screen.debug();
  });
});

describe('AutoComplete', () => {
  it('inserts list to trie', () => {
    render(<AutoComplete list={testData} getPropValue={(listItem) => listItem.name} />);
    screen.debug();
  });
});

describe('true is truthy and false is falsy', () => {
  it('true is truthy', () => {
    expect(true).toBe(true);
  });

  it('false is falsy', () => {
    expect(false).toBe(false);
  });
});
