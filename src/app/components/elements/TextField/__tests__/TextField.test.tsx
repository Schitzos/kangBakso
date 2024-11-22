import React from 'react';
import { render } from '@testing-library/react-native';
import TextField from '../index';

describe('TextField Component', () => {
  test('matches snapshot with default props', () => {
    const { toJSON } = render(<TextField />);
    expect(toJSON()).toMatchSnapshot();
  });
});
