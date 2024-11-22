import React from 'react';
import { render } from '@testing-library/react-native';
import Loader from '../index';

describe('Loader Component', () => {
  test('matches snapshot with default props', () => {
    const { toJSON } = render(<Loader />);
    expect(toJSON()).toMatchSnapshot();
  });
});
