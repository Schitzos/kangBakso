import React from 'react';
import { render } from '@testing-library/react-native';
import TextView from '../index';

describe('TextView Component', () => {
  test('matches snapshot with default props', () => {
    const { toJSON } = render(<TextView>asd</TextView>);
    expect(toJSON()).toMatchSnapshot();
  });
});
