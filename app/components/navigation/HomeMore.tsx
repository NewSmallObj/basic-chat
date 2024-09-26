import {Appbar, Button, Divider, Menu, PaperProvider} from "react-native-paper";
import {Platform, Text, View} from "react-native";
import {Fragment, useEffect, useState} from "react";
import {ThemedView} from "@/components/ThemedView";
import tw from "twrnc"


export default function HomeMore(){
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    useEffect(()=>{
        openMenu()
    },[])

    return (
        <View style={tw`absolute right-0 z-50`}>
            <PaperProvider>
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={{x:0,y:0}}>
                    <Menu.Item onPress={() => {}} title="Item 1" />
                    <Menu.Item onPress={() => {}} title="Item 2" />
                    <Divider />
                    <Menu.Item onPress={() => {}} title="Item 3" />
                </Menu>
            </PaperProvider>
        </View>
    )
}
