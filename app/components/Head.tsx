import {ThemedView} from "./ThemedView";
import type {PropsWithChildren} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {type ViewProps} from 'react-native';
import tw from "twrnc"

type ContainerProps = PropsWithChildren<{}> & ViewProps;

export default function Head({children,style}: ContainerProps) {
    const insets = useSafeAreaInsets();
    return (
        <ThemedView style={[{paddingTop: insets.top + 10,paddingBottom: 10},tw`bg-white`, style]}>
            {children}
        </ThemedView>
    )
}
