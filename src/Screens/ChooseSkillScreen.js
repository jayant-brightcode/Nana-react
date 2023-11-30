import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, StatusBar, TextInput, Modal,ScrollView } from "react-native";
import Colors from "../Utils/Color";
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { getToken } from "../Utils/LocalStorage.js";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { Remote } from "../Utils/Remote.js";
import ImagePicker from 'react-native-image-crop-picker';
import { request, PERMISSIONS } from 'react-native-permissions';


// const languages = [
//     { id: 1, name: 'English' },
//     { id: 2, name: 'Spanish' },
//     { id: 3, name: 'French' },
//     { id: 4, name: 'English' },
//     { id: 5, name: 'Spanish' },
//     { id: 6, name: 'French' },
//     { id: 7, name: 'English' },
//     { id: 8, name: 'Spanish' },
//     { id: 9, name: 'French' },
//     { id: 10, name: 'English' },
//     { id: 11, name: 'Spanish' },
//     { id: 13, name: 'French' },
//     { id: 123, name: 'English' },
//     { id: 12, name: 'Spanish' },
//     { id: 33, name: 'French' },
//     // Add more languages as needed
//   ];













const ChooseSkillScreen = () => {

    const navigation = useNavigation()

    const [selectedItem, setSelectedItem] = useState(null);
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(false);

    const [selected_skill, set_selected_skill] = useState([]);
    const [images, setImages] = useState([]);

    const [c_type, set_c_type] = useState('');
    const [isDialogVisible, setDialogVisible] = useState(false);

    const [isDialogVisible2, setDialogVisible2] = useState(false);

    const [category_list, set_category_list] = useState([]);
    const [category_name, set_category_name] = useState('');
    const [selected_category_id, set_selected_category_id] = useState('');

    const [sub_category_list, set_sub_category_list] = useState([]);
    const [sub_category_name, set_sub_category_name] = useState('');
    const [selected_sub_category_id, set_selected_sub_category_id] = useState('');

    const [profession_name, set_profession_name] = useState('');
    const [profession_desc, set_profession_desc] = useState('');
    const [profession_expr, set_profession_expr] = useState('');
    const [profession_photo, set_profession_photo] = useState([]);

    const [get_skill, set_skill] = useState([]);

    // useEffect(() => {
    //     // Check and request permission on component mount
    //     requestPermission();
    // }, []);

    useEffect(() => {
        // Check and request permission on component mount
        getProfile();
    }, []);

    useEffect(() => {
        // Check and request permission on component mount
        get_categories();
    }, []);


    const openDialog = () => {

        setDialogVisible(true);
    };

    const closeDialog = () => {
        setDialogVisible(false);
    };


    const openDialog1 = () => {

      

        
        

        setDialogVisible2(true);
    };

    const closeDialog1 = () => {
        setDialogVisible2(false);
    };


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


                set_category_list(data.category);

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


    const get_sub_category = async (id) => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "get_sub_category"


            const queryParams = {
                category_id: id

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


                set_sub_category_list(data.sub_category);

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



                set_c_type(data.profile_details.customer_type)
            
                if (data.profile_details.category!=null){
                    set_selected_category_id(data.profile_details.category._id)

                }
                if (data.profile_details.category != null) {
                    set_category_name(data.profile_details.category.name)

                }

                if (data.profile_details.profession_name != null) {
                    set_profession_name(data.profile_details.profession_name)

                }

                if (data.profile_details.profession_name != null) {
                    set_profession_name(data.profile_details.profession_name)

                }

                if (data.profile_details.profession_description != null) {
                    set_profession_desc(data.profile_details.profession_description)

                }

                if (data.profile_details.profession_experience != null) {
                    set_profession_expr(data.profile_details.profession_experience)

                }

                if (data.profile_details.customer_type =="employer"){
                
                    if (data.profile_details.sub_category != null) {
                       
                        set_sub_category_name(data.profile_details.sub_category.name)

                    }

                    if (data.profile_details.sub_category != null) {
                        set_selected_sub_category_id(data.profile_details.sub_category._id)

                    }
                }

                //show
                set_profession_photo(data.profile_details.profession_photo)
                set_skill(data.profile_details.skills)
              

                

                
              




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

    const select_category = (item) => {

      set_category_name(item.name)


       //  set_selected_category_name(item.name)
        set_selected_category_id(item._id)

        closeDialog()

        if(c_type=="employer"){
            get_sub_category(item._id);
        }
    


        Toast.show({
            type: 'success',
            text1: `Selected Category: ${item.name}`,
        });


    };

    const select_sub_category = (item) => {

        set_sub_category_name(item.name)


        //  set_selected_category_name(item.name)
        set_selected_sub_category_id(item._id)

        closeDialog1()

    
        Toast.show({
            type: 'success',
            text1: `Selected Category: ${item.name}`,
        });


    };

    const requestPermission = async () => {
        try {
            const permission =
                Platform.OS === 'android'
                    ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
                    : PERMISSIONS.IOS.PHOTO_LIBRARY;

            const result = await request(permission);
            if (result === 'granted') {
                console.log('Permission granted');
            } else {
                console.log('Permission denied');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const pickImages = async () => {
        try {
            const results = await ImagePicker.openPicker({
                multiple: true,
                mediaType: 'photo',
                cropping:true
           
                
            });

            const croppedImages = [];

            for (const image of results) {
              const croppedImage = await ImagePicker.openCropper({
                path: image.path,
                width: 300,
                height: 300,
                // Add any other cropping options as needed
              });
        
              if (croppedImage) {
                croppedImages.push(croppedImage);
              }
            }

            if (!results.cancelled) {
                setImages([...images, ...results.map((image) => ({ uri: image.path }))]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };
    const renderImageItem = ({ item, index }) => (
        <View style={{ margin: 5 }}>
            <Image source={{ uri: item.uri }} style={{ width: 100, height: 100 }} />
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    backgroundColor: 'red',
                    padding: 5,
                    borderRadius: 10,
                }}
                onPress={() => removeImage(index)}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>X</Text>
            </TouchableOpacity>
        </View>

    );

    const renderPreImageItem = ({ item, index }) => (
        <View style={{ margin: 5 }}>
            <Image source={{ uri: Remote.BASE_URL+item.photo }} style={{ width: 100, height: 100 }} />
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    backgroundColor: 'red',
                    padding: 5,
                    borderRadius: 10,
                }}
                onPress={() => delete_profession_photo(item._id)}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>X</Text>
            </TouchableOpacity>
        </View>

    );
    useEffect(() => {
        getLanguages();
    }, []);





    const handleItemPress = (item) => {
        setSelectedItem(item);
        Toast.show({
            type: 'success',
            text1: `Selected Language: ${item.name}`,
        });
        add_skill(item._id)
       // selected_skill.push(item)


    };



    const getLanguages = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
           

            const response = await fetch(Remote.BASE_URL + "skill", {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });

            if (response.ok) {
                const data = await response.json();
              
                setLanguages(data.skill);
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

    const add_skill = async (skill_id) => {



       
       


        try {
         
            const token = await getToken();
            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/add_skill";
            

            const userData = {
                skill_id: skill_id

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
                Toast.show({
                    type: 'success',
                    text1: responsedata.message,
                });
                setLoading(false)
                getProfile()
                


              
            } else {
                // Handle error
                Toast.show({
                    type: 'success',
                    text1: responsedata.error,
                });
                setLoading(false)

            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false)

        }





    };

    const delete_skill = async (skill_id) => {



        try {
            const token = await getToken();
            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/delete_skill";
  

            const userData = {
                skill_id: skill_id

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
                Toast.show({
                    type: 'success',
                    text1: responsedata.message,
                });
                setLoading(false)
                getProfile()




            } else {
                // Handle error
                Toast.show({
                    type: 'success',
                    text1: responsedata.error,
                });
                setLoading(false)

            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false)

        }





    };

    const update_profession = async () => {


        if (!profession_desc.trim()) {
            Toast.show({
                type: 'success',
                text1: `Please enter  description`,
            });
            return;
        }

        if (!profession_name.trim()) {
            Toast.show({
                type: 'success',
                text1: `Please enter profession name`,
            });
            return;
        }

        if (!selected_category_id.trim()) {
            Toast.show({
                type: 'success',
                text1: `Please choose category`,
            });
            return;
        }

        if (!profession_expr.trim()) {
            Toast.show({
                type: 'success',
                text1: `Please enter your experiences`,
            });
            return;
        }

        if(c_type=="employer")
         {

            if (!selected_sub_category_id.trim()) {
                Toast.show({
                    type: 'success',
                    text1: `Please choose sub category`,
                });
                return;
            }

         }









        try {

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/update_profession";



            const formData = new FormData();

          

            // Append each image file to FormData
            images.forEach((image, index) => {
                formData.append('profession_photo', {
                    uri: image.uri,
                    type: 'image/jpeg',
                    name: `image_${index}.jpg`, // You can change the file name as needed
                });
            });

            formData.append('profession_name', profession_name);
            formData.append('profession_desc', profession_desc);
            formData.append('category_id', selected_category_id);
            formData.append('profession_experience', profession_expr);

            if (c_type == "employer")
            {
                formData.append('sub_category_id', selected_sub_category_id);
            }
         
            

            const token = await getToken()

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });


            const responsedata = await response.json();
           


            if (response.ok) {
                // Handle success
                Toast.show({
                    type: 'success',
                    text1: responsedata.message,
                });
                setLoading(false)

                navigation.navigate("ProfileScreen")

                // if(selected_skill.length<1){
                //             Toast.show({
                //                 type: 'success',
                //                 text1: `choose atleast 1 skill`,
                //             });
                //         } else if (selected_skill.length > 5) {
                //                 Toast.show({
                //                     type: 'success',
                //                     text1: `you can select maximum 5 skills`,
                //                 });
                //             }else{
                          
                //             }




            } else {
                // Handle error
                Toast.show({
                    type: 'success',
                    text1: responsedata.error,
                });
                setLoading(false)

            }
        } catch (error) {
            console.error('Error:', error.message);
            setLoading(false)

        }

    }

    const delete_profession_photo = async (id) => {



       
       


        try {
         
            const token = await getToken();
            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/delete_profession_photo";
            

            const userData = {
                photo_id: id

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
                Toast.show({
                    type: 'success',
                    text1: responsedata.message,
                });
                setLoading(false)
                getProfile()
                


              
            } else {
                // Handle error
                Toast.show({
                    type: 'success',
                    text1: responsedata.error,
                });
                setLoading(false)

            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false)

        }





    };



 return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.blue}></StatusBar>
            <View style={styles.content}>
                <Text style={styles.text}>Update your {'\n'}Profession</Text>
                <View style={styles.imageContainer}>
                    <Image source={require('../../assets/images/otp.png')} style={styles.image} />
                </View>
            </View>



          <ScrollView>


            <View>

          

          <View style={{marginStart:10,marginEnd:10,marginTop:10}}>

             <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 10, marginTop: 10 }}>Choose your category</Text>

             <TouchableOpacity onPress={() => {
                 openDialog();
             }}>
                 <Text style={styles.input}>{category_name==''?"Select Category" : category_name}</Text>

             </TouchableOpacity>


            {c_type=="employer" && (
                 <View>



                     <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 10, marginTop: 10 }}>Select Sub category</Text>

                     <TouchableOpacity onPress={() => {
                         openDialog1();
                     }}>
                         <Text style={styles.input}>{sub_category_name == '' ? "Select Sub Category" : sub_category_name}</Text>

                     </TouchableOpacity>   
                     
                      </View>
            )}

        

             <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 10, marginTop: 10 }}>Profession Name</Text>

             <TextInput style={styles.input} placeholder="Enter your profession name" value={profession_name} onChangeText={(text) => set_profession_name(text)} />

             <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 10 }}>Profession Experience</Text>

             <TextInput style={{ backgroundColor: Colors.gray, height: 70, width: '100%', borderRadius: 10, padding: 10, textAlignVertical: 'top' }} placeholder="Profession Experience" value={profession_expr} onChangeText={(text) => set_profession_expr(text)} />
           

             <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 10 }}>Profession Desciption</Text>

             <TextInput style={{ backgroundColor: Colors.gray, height: 70, width: '100%', borderRadius: 10, padding: 10, textAlignVertical: 'top' }} placeholder="Profession Description" value={profession_desc} onChangeText={(text) => set_profession_desc(text)} />
            
             <FlatList
                 data={profession_photo}
                 keyExtractor={(item, index) => index.toString()}
                 renderItem={renderPreImageItem}
                 horizontal
             />

            
             <TouchableOpacity onPress={pickImages}>
                 <View
                     style={{
                         borderColor: Colors.orange,
                         padding: 10,
                         borderWidth: 2,
                         marginTop: 10,
                         borderRadius: 5,
                     }}
                 >
                     <Text style={{ color: Colors.orange }}>Pick Profession Images</Text>
                 </View>
             </TouchableOpacity>
             <FlatList
                 data={images}
                 keyExtractor={(item, index) => index.toString()}
                 renderItem={renderImageItem}
                 horizontal
             />

          </View>
          {c_type == "employee" && (
             <View>


                 <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 15, marginTop: 20, marginStart: 20 }}>Select upto 5 matching skills</Text>

                 {loading && (
                     <View style={styles.loadingContainer}>
                         <ActivityIndicator size="large" color="#0000ff" />
                     </View>
                 )}

                 <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: 10 }}>


                     {get_skill.map((item, index) => (

                         <View style={styles.container2}>
                             <Text style={{fontSize:12}}>{item.name}</Text>

                             <TouchableOpacity style={{marginStart:8}} onPress={() => {


                                 delete_skill(item._id)
                                //  get_skill.splice(index, 1);
                                //  set_selected_skill([...getski]);





                             }}>
                                 <Text>X</Text>
                             </TouchableOpacity>
                         </View>))}
                 </View>

                 <FlatList style={{ marginTop: 20, marginBottom: 100 }}
                     data={languages}
                     numColumns={2} // Set the number of columns you want in your grid
                     keyExtractor={(item) => item._id.toString()}
                     scrollEnabled={false}
                     renderItem={({ item }) => (
                         <TouchableOpacity
                             style={[
                                 styles.itemContainer,
                                 selectedItem === item && styles.selectedItem, // Apply selected style
                             ]}
                             onPress={() => handleItemPress(item)}
                         >
                             <Text style={styles.languageName}>{item.name}</Text>
                         </TouchableOpacity>

                     )}
                 />

             </View>
         )}

         

         

            <View style={{margin:10}}>



                <TouchableOpacity style={styles.button} onPress={() => {



                 update_profession()

                        

               


                }}>
                    <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>Keep going</Text>
                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                    </View>

                </TouchableOpacity>
            </View>
            </View>

            </ScrollView>


         <Modal visible={isDialogVisible} animationType="fade" transparent>
             <View style={styles.modalContainer}>
                 <View style={styles.dialogContainer}>
                     <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Select Category</Text>

                     <FlatList style={{ marginTop: 10, marginBottom: 10, height: 300 }}
                         data={category_list}

                         keyExtractor={(item) => item._id.toString()}
                         renderItem={({ item }) => (
                             <TouchableOpacity
                                 style={{}}
                                 onPress={() => select_category(item)}
                             >
                                 <Text style={{ color: Colors.textcolor, padding: 10 }}>{item.name}</Text>
                             </TouchableOpacity>

                         )}
                     />

                     <TouchableOpacity onPress={() => {
                         closeDialog()
                     }}>
                         <Text>Close</Text>
                     </TouchableOpacity>







                 </View>
             </View>
         </Modal>

          <Modal visible={isDialogVisible2} animationType="fade" transparent>
             <View style={styles.modalContainer}>
                 <View style={styles.dialogContainer}>
                     <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Select Sub category</Text>

                     <FlatList style={{ marginTop: 10, marginBottom: 10, height: 300 }}
                         data={sub_category_list}

                         keyExtractor={(item) => item._id.toString()}
                         renderItem={({ item }) => (
                             <TouchableOpacity
                                 style={{}}
                                 onPress={() => select_sub_category(item)}
                             >
                                 <Text style={{ color: Colors.textcolor, padding: 10 }}>{item.name}</Text>
                             </TouchableOpacity>

                         )}
                     />



                     <TouchableOpacity onPress={() => {
                         closeDialog1()
                     }}>
                         <Text>Close</Text>
                     </TouchableOpacity>







                 </View>
             </View>
         </Modal> 


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white', // Set your desired background color
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center', // Center the text vertically
        backgroundColor: Colors.blue,
    },
    container2: {
        flex:0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        padding:10,
        margin: 4,
        alignSelf:'flex-start'
     
       


    },
    input: {
        width: '100%',
        height: 40,
        backgroundColor: Colors.gray,
        borderRadius: 8,
        marginBottom: 10,
        padding: 10,
        fontSize: 12


    },
    text: {
        color: Colors.white,
        fontSize: 23,
        fontWeight: 'bold',
        marginStart: 30,

    },
    imageContainer: {
        marginTop: 20,
        flex: 1,
        height:'40%',
        marginEnd: 10,
        alignItems: 'flex-end', // Align the image to the right
    },
    image: {
        width: 100,
        height: 80,
    },
    selectedItem: {
        backgroundColor: Colors.blue, // Highlight the selected item
    },
    itemContainer: {
        flex: 1,
        margin: 10,
        padding: 10,
        backgroundColor: 'lightgray',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        height: 50, // Adjust the height of each item
    },
    languageName: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 10,
        width: "100%",
        alignSelf: 'flex-end',

        padding: 20,
    },
    buttonContent: {
        flexDirection: 'row', // Align text and icon horizontally
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: Colors.white,
        fontSize: 16,

        marginRight: 5, // Adjust the spacing between text and icon
    },
    icon: {
        width: 40,
        height: 40,
        // Change the icon color
    },
    button: {
        backgroundColor: Colors.blue,
        padding: 10,
        borderRadius: 5,
        marginTop: 10
    },
    label: {
        marginRight: 8,
   
    },
    closeButton: {
        padding: 8,
    
        backgroundColor: '#bdbdbd',
    },
    closeText: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',

    },
    container2: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        padding: 10,
        margin: 4,
        alignSelf: 'flex-start'




    },
    dialogContainer: {
        width: '90%',
        backgroundColor: 'white',
        padding: 20,
        marginStart: 10,
        marginEnd: 10,
        borderRadius: 10,

    },
});

export default ChooseSkillScreen