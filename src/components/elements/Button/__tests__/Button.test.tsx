import React from 'react';
import { render } from '@testing-library/react-native';
import Button from '../index';

describe('Button Component', () => {
  test('matches snapshot with default props', () => {
    const { toJSON } = render(<Button label="Test" onPress={() => null}/>);
    expect(toJSON()).toMatchSnapshot();
  });
});
