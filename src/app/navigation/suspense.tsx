import React, { Suspense, ComponentType } from 'react';
import { View } from 'react-native';

const fallback = <View/>;
/**
 * Higher-order component that wraps a React component with a React
 * Suspense component. This allows the wrapped component to be lazily
 * loaded, with a fallback rendered while the component is being
 * loaded.
 *
 * @param {ComponentType<P>} Element - The React component to be
 *   wrapped with React Suspense.
 * @returns {ComponentType<P>} - The wrapped React component.
 */
export const Suspensed =
  <P extends object>(Element: ComponentType<P>) =>
    (props: P) => {
      return (
        <Suspense fallback={fallback}>
          <Element {...props} />
        </Suspense>
      );
    };
