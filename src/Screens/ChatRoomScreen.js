import React, { useState, useEffect } from 'react'

import {RefreshControl, View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { useRoute } from '@react-navigation/native';
import { getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';
import CommentDialog from '../component/MemberShipDialog';
import EmptyState from '../component/NoData';




const ChatRoomScreen = () => {


    const navigation = useNavigation()
    const [get_chat_room, set_chat_room] = useState([])
    const [loading, setLoading] = useState(false);
    const [user_id, set_user_id] = useState('');


    const [isDialogVisible, setDialogVisible] = useState(false);

    useEffect(() => {
        getProfile();
    }, []);
    const openDialog = () => {
        setDialogVisible(true);
      };
    
      const closeDialog = () => {
        setDialogVisible(false);
      };
    useEffect(() => {
        load_chat_room();
    }, []);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true)
        load_chat_room()
        setRefreshing(false);
        
      };

    const handleButtonPress = () => {
        // Handle button press action
        closeDialog();
        navigation.navigate("ChoosePlanScreen")
     
      };


      

      const getProfile = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_profile"



            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();


                set_user_id(data.profile_details._id)
            
                

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
    const renderJobItem = ({ item }) => {

    




        return (
            <TouchableOpacity onPress={() => {

                const data = {
                    chat_room_id:item
                }

                navigation.navigate("ChatScreen",{data:data})

            }}>

                <View style={{ marginTop: 13, flexDirection: 'row', alignItems: 'center', marginStart: 10, marginEnd: 10, backgroundColor: Colors.grayview, borderRadius: 10 }}>
                    <View
                        style={{
                            width: 50,
                            height: 80,
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                            backgroundColor: item.grayview,
                            alignItems: 'center',
                            marginStart: 8,
                            justifyContent: 'center', // Center the content vertically
                        }}
                    >
                          {user_id==item.created_with._id && (
                        <Image style={{ width: 50, height: 50, borderRadius: 50 }} source={{ uri: Remote.BASE_URL + item.created_by.profile }} />

                          )}

                    {user_id==item.created_by._id && (
                        <Image style={{ width: 50, height: 50, borderRadius: 50 }} source={{ uri: Remote.BASE_URL + item.created_with.profile }} />

                          )}
                    </View>
                    <View style={{ flex: 1, marginLeft: 14, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>


                        {user_id==item.created_with._id && (
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 16 }}>{item.created_by.name}</Text>

                        )}

                        {user_id!=item.created_with._id && (
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 16 }}>{item.created_with.name}</Text>

                        )}

                        <Text style={{ color: Colors.orange, fontWeight: 'medium', fontSize: 12 }}>{item.last_message==null ? "Reply":item.last_message.message}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 9,marginTop:7 }}>{new Date(item.createdAt).toDateString()}</Text>

                        {/* {item.last_message.message} */}

                    </View>
                   
                </View>
            </TouchableOpacity>


        )
    };





    const load_chat_room = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_chat_room"

            // const queryParams = {
            //     category_id: category._id,

            // };



            // Construct the URL with query parameters
           // const urlWithParams = `${apiUrl}?${new URLSearchParams(queryParams)}`;


            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();


                set_chat_room(data.chat_room);

                setLoading(false)






            } else {
                if(response.status==401){
                    setLoading(false)
                    openDialog()
                }
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
        }





    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.orange }}>

        <View style={styles.container}>



            <View style={styles.topbar}>
                <View style={{ flexDirection: 'row', marginTop: Platform.OS=="android"?10:0, padding: 10, alignItems: 'center' }}>
                <TouchableOpacity onPress={()=>{
                    navigation.goBack()
                }}>
                    <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image> 

                    </TouchableOpacity>
                    <View style={{ marginStart: 15, flex: 1 }}>
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>Chats</Text>

                    </View>


                </View>

            </View>


            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}

            <View>

                <FlatList

                    data={get_chat_room}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderJobItem}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            </View>

            <CommentDialog
        isVisible={isDialogVisible}
        onClose={closeDialog}
        onButtonPress={handleButtonPress}
      />


         {get_chat_room.length==0 && (
                 <EmptyState
                 title="No Data Found"
                 description="All Chatrooms will be display here"
               />
            )}

        </View>

        </SafeAreaView>

    )

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:Colors.white
    },
    topbar: {
        backgroundColor: Colors.blue,
        height: 70,

    }




})



export default ChatRoomScreen