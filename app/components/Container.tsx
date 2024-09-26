import {ThemedView} from "./ThemedView";
import type {PropsWithChildren} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {type ViewProps} from 'react-native';
import tw from "twrnc"

type ContainerProps = PropsWithChildren<{}> & ViewProps;

export default function Container({children,style}: ContainerProps) {
    const insets = useSafeAreaInsets();
    return (
        <ThemedView style={[{paddingTop: insets.top, flex: 1},tw`bg-slate-50`, style]}>
            {children}
        </ThemedView>
    )
}
