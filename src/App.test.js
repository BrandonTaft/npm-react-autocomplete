import { render, screen } from '@testing-library/react';
import App from './App';
import AutoComplete from './lib/AutoComplete';


describe('AutoComplete', () => {
  it('renders AutoComplete component', () => {
    render(<AutoComplete />);
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
