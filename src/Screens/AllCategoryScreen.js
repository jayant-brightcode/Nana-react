import React, { useState,useEffect } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput, ScrollView, TouchableWithoutFeedback, TouchableHighlight,ActivityIndicator} from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { Remote } from '../Utils/Remote';
import { getToken } from '../Utils/LocalStorage';

const categoryList = [
    { id: 1, name: 'IT Computer', Image: require('../../assets/images/it.png') },
    { id: 2, name: 'Design', Image: require('../../assets/images/design.png') },
    { id: 3, name: 'Marketing', Image: require('../../assets/images/market.png') },
    { id: 4, name: 'Telecaller', Image: require('../../assets/images/tele.png') },
    { id: 5, name: 'IT Computer', Image: require('../../assets/images/it.png') },
    { id: 6, name: 'Design', Image: require('../../assets/images/design.png') },
    { id: 7, name: 'Marketing', Image: require('../../assets/images/market.png') },
    { id: 8, name: 'Telecaller', Image: require('../../assets/images/tele.png') },
    { id: 9, name: 'IT Computer', Image: require('../../assets/images/it.png') },
    { id: 10, name: 'Design', Image: require('../../assets/images/design.png') },
    { id: 11, name: 'Marketing', Image: require('../../assets/images/market.png') },
    { id: 12, name: 'Telecaller', Image: require('../../assets/images/tele.png') },
    { id: 13, name: 'IT Computer', Image: require('../../assets/images/it.png') },
    { id: 14, name: 'Design', Image: require('../../assets/images/design.png') },
    { id: 15, name: 'Marketing', Image: require('../../assets/images/market.png') },
    { id: 16, name: 'Telecaller', Image: require('../../assets/images/tele.png') },
    { id: 17, name: 'IT Computer', Image: require('../../assets/images/it.png') },
    { id: 18, name: 'Design', Image: require('../../assets/images/design.png') },
    { id: 19, name: 'Marketing', Image: require('../../assets/images/market.png') },
    { id: 20, name: 'Telecaller', Image: require('../../assets/images/tele.png') },

]



const AllCategoryScreen = ()=>{


    const navigation = useNavigation()

    const [get_category,set_category] = useState([])
    const [loading, setLoading] = useState(false);


    useEffect(() => {
       get_categories();
    }, []);

    const renderCategoryList = ({ item }) => (
        <TouchableOpacity onPress={() => {

            navigation.navigate("JobsScreen", { category: item })
            
        }}>

            <View style={[styles.cat_item]}>
                <Image
                    source={{ uri: Remote.BASE_URL + item.image }}
                    style={{ width: 50, height: 50 }}
                />
                <Text style={styles.cat_item_font}>{item.name}</Text>
            </View>
        </TouchableOpacity>


    );

    const get_categories = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "get_category"

         


            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();


                set_category(data.category);

                setLoading(false)






            } else {
                console.error('Error:', response.status, response.statusText);
                setLoading(false)
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
        }





    };












    return(
        <View style={styles.container}>



            <View style={styles.topbar}>
                <View style={{ flexDirection: 'row', marginTop: 10, padding: 10, alignItems: 'center' }}>
                    <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>
                    <View style={{ marginStart: 15, flex: 1 }}>
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>Categories</Text>

                    </View>


                </View>

            </View>


            <View style={{flex:1,alignItems:'center'}}>


                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                )}

                <FlatList

                    data={get_category}
                    numColumns={3}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderCategoryList}
                />
            </View>

        </View>
    )



}


const styles = StyleSheet.create({

    container:{
        flex:1
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
        fontSize: 13,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    topbar: {
        backgroundColor: Colors.blue,
        height: 70,

    },

})


export default AllCategoryScreen