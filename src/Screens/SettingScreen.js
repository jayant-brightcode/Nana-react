import React, { useState, useEffect } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput, ScrollView, TouchableWithoutFeedback, TouchableHighlight, ActivityIndicator } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { Remote } from '../Utils/Remote';
import { getToken } from '../Utils/LocalStorage';





const SettingScreen = () => {


    const navigation = useNavigation()




















    return (
        <View style={styles.container}>



            <View style={styles.topbar}>
                <View style={{ flexDirection: 'row', marginTop: 10, padding: 10, alignItems: 'center' }}>
                    <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>
                    <View style={{ marginStart: 15, flex: 1 }}>
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>Settings</Text>

                    </View>


                </View>

            </View>


            <View style={{ flex: 1 ,marginTop:'10%'}}>


                <TouchableOpacity  onPress={()=>{

                    const data  = {
                        screen:"setting"
                    }
                    navigation.navigate("MyPurchasedPromotionScreen",{page:data})

                }}>


                    <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 10 }}>Promotions</Text>
                    <View style={{ backgroundColor: Colors.dark_gray, height: 2 }}></View>

                </TouchableOpacity>



            </View>

        </View>
    )



}


const styles = StyleSheet.create({

    container: {
        flex: 1
    },
    cat_item: {
        flexDirection: 'coloumn',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 10,
        margin: 10,
        width: 100,
        marginTop: 10,
        height: 100,
        backgroundColor: Colors.grayview,
        alignItems: 'center'

    },
    cat_item_font: {
        fontSize: 12,
        textAlign: 'center',


    },
    topbar: {
        backgroundColor: Colors.blue,
        height: 70,

    },

})


export default SettingScreen