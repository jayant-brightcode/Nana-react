import React, { useState, useEffect,useRef } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, ActivityIndicator,TextInput } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { useRoute } from '@react-navigation/native';
import { getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';





const ChatScreen = () => {


    const route = useRoute();
    const { data } = route.params

    console.log("jayant",data)



    const [get_chat_room, set_chat_room] = useState([])
    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState('');
    const [messages_list, setMessages_list] = useState([]);
    const [get_id,set_id] = useState('');
    const flatListRef = useRef(null);


    useEffect(() => {
        getProfile();
    }, []);
    const handleMessageSend = () => {
        // Handle sending the message
    

       SendMessage()
        // Add your logic to send the message
        // ...

        // Clear the message input after sending
       
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


                set_id(data.profile_details._id)

                setLoading(false)
                get_messages()






            } else {
                console.error('Error:', response.status, response.statusText);
                setLoading(false)
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
        }





    };

    const SendMessage = async () => {

        



        try {

          

          
            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/send_message";


            let rec_id ;

            if(get_id.toString()==data.chat_room_id.created_by._id){
                rec_id = data.chat_room_id.created_with._id
            }else{
                rec_id = data.chat_room_id.created_by._id
            }

            const userData = {
                job_req_id: data.chat_room_id.job_req_id,
                reciever_id: rec_id,
                message:message



            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
                body: JSON.stringify(userData),
            });


            const responsedata = await response.json();

    


            if (response.ok) {
                // Handle success
                // Toast.show({
                //     type: 'success',
                //     text1: responsedata.message,
                // });
                setLoading(false)

                const newMessage = {
                    message:message,
                    reciever_id: rec_id,
                    sender_id:get_id,
                    _id:new Date()
                    
                }
                setMessages_list((messages_list) => [newMessage, ...messages_list]); // Append the new message to the state
                scrollToTop()
                setMessage("")
              




            } else {
                // Handle error
                // Toast.show({
                //     type: 'success',
                //     text1: responsedata.error,
                // });
                setLoading(false)

            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false)

        }





    };


    const scrollToTop = () => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({ index: 0, animated: false });
        }
    };

    const get_messages = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_messages"

            const queryParams = {
                chat_room_id: data.chat_room_id._id,

            };



            // Construct the URL with query parameters
             const urlWithParams = `${apiUrl}?${new URLSearchParams(queryParams)}`;


            const response = await fetch(urlWithParams, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });


        


            if (response.ok) {
                const data = await response.json();
                setMessages_list(data.messages)
                scrollToTop()


               

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

    const renderMessageItem = ({ item }) => {
        // Determine whether the message is from the sender or receiver
        const isSender = item.sender_id === get_id; // Adjust based on your actual data structure

        // Style the message based on the sender/receiver
        const messageStyle = isSender ? styles.senderMessage : styles.receiverMessage;

        return (
            <View style={messageStyle}>
                <Text>{item.message}</Text>
                {/* Add any other message details you want to display */}
            </View>
        );
    };

    return (
        <View style={styles.container}>



            <View style={styles.topbar}>
                <View style={{ flexDirection: 'row', marginTop: 10, padding: 10, alignItems: 'center' }}>
                    <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>
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

            <View style={{marginBottom:'35%'}}>

                <FlatList
                ref={flatListRef}
                
                    data={messages_list}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderMessageItem}
                  
                    
                    inverted
                    
                    // initialNumToRender={messages_list.length} // Render all items initially
                    // maxToRenderPerBatch={messages_list.length} // Render all items in a batch
                />
            </View>


            {/* Message input */}
            <View style={styles.messageContainer}>
                <TextInput
                    style={styles.messageInput}
                    placeholder='Enter message'
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    keyboardType='default'
                    returnKeyType='send' // Set the keyboard return key to 'send'
                    onSubmitEditing={handleMessageSend} // Handle submit event
                />
            </View>


        </View>

    )

}



const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    topbar: {
        backgroundColor: Colors.blue,
        height: 70,

    },
    messageContainer: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        width: '100%', // Takes the full width
    },
    messageInput: {
        flex: 1,
        backgroundColor: '#eee',
        padding: 10,
        borderRadius:10,
        borderColor:Colors.orange,
        borderWidth:1,
        marginRight: 10,
    },
    senderMessage: {
            backgroundColor: 'lightblue',
            alignSelf: 'flex-end',
            padding: 8,
            margin: 5,
            borderRadius: 10,
        },
        receiverMessage: {
            backgroundColor: 'lightgreen',
            alignSelf: 'flex-start',
            padding: 8,
            margin: 5,
            borderRadius: 10,
        },
    senderText: {
        color: 'black', // Adjust text color as needed
    },
    receiverText: {
        color: 'white', // Adjust text color as needed
    },
    flatListContainer: {
        flexGrow: 1,
    },
    




})



export default ChatScreen