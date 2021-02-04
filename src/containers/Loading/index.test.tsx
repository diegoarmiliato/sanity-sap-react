import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from './';

test('renders Loading Form', () => {
  render(<Loading/>);
  const linkElement = screen.getByText(/Validate/i);
  expect(linkElement).toBeInTheDocument();
});
