import React, { useCallback, useRef } from 'react';
import { styles } from './styles';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: false, // Reanimated runs in strict mode by default
});

export interface BottomSheetModalProps {
  snapPoints?: string[];
  children: React.ReactNode;
  onClose: () => void;
  enablePanDownToClose?: boolean;
  pressBehavior?: 'none' | 'close' | 'close-all';
}

/**
 * A reusable component for rendering a bottom sheet modal.
 *
 * The component takes three props: `snapPoints`, `children`, and `onClose`.
 * `snapPoints` is an array of strings that represents the snap points for the bottom sheet.
 * For example, `['25%','50%','75%']` represents 25%, 50%, and 75% of the screen height.
 * The default value is `['25%','50%','75%']`.
 *
 * `children` is a React node that is rendered inside the bottom sheet.
 *
 * `onClose` is a function that is called when the bottom sheet is closed.
 *
 * The component renders a `BottomSheet` component from `@gorhom/bottom-sheet`.
 * The component also renders a `BottomSheetBackdrop` component from `@gorhom/bottom-sheet`
 * that is used to render the backdrop (i.e. the darkened area outside the bottom sheet).
 * The backdrop is rendered with an opacity of 0.7, which can be adjusted by setting the `opacity` property.
 *
 * The component also renders a `BottomSheetView` component from `@gorhom/bottom-sheet`
 * that is used to render the content of the bottom sheet.
 *
 * The component has been configured to use `react-native-reanimated` in a non-strict mode,
 * which means that Reanimated will not throw an error if there is a layout animation in progress.
 */
export default function BottomSheetModal({ snapPoints = ['25%', '50%', '75%'], children, onClose, enablePanDownToClose = true, pressBehavior = 'close' }: Readonly<BottomSheetModalProps>) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const renderBackdrop = useCallback((props:any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}  // Backdrop disappears when the bottom sheet is fully hidden
      appearsOnIndex={0}  // Backdrop appears when the bottom sheet opens
      opacity={0.7}       // Adjust this value to control the darkness (0 is fully transparent, 1 is fully opaque)
      pressBehavior={pressBehavior}
    />
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enableDynamicSizing={false}
      onClose={() => onClose()}
      enablePanDownToClose={enablePanDownToClose}
      style={styles.container}
    >
      <BottomSheetScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {children}
      </BottomSheetScrollView>
    </BottomSheet>
  );

}
