import React from 'react';
import { render, screen } from '@testing-library/react';
import ValidateForm from './';

test('renders Validate Form', () => {
  render(<ValidateForm/>);
  const linkElement = screen.getByText(/Validate/i);
  expect(linkElement).toBeInTheDocument();
});
