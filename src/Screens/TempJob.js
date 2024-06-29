import React, { useState, useEffect,useRef ,useCallback} from 'react'

import { Platform,PermissionsAndroid,RefreshControl,View, Text, StyleSheet, Image, Alert,FlatList, TouchableOpacity, TextInput, ActivityIndicator, Modal, Linking,SafeAreaView } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions

import { getSavedLanguage, getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';
import { Rating, AirbnbRating } from 'react-native-ratings';
import CommentDialog from '../component/MemberShipDialog';
import ViewShot from 'react-native-view-shot';
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs'
import { useRoute } from '@react-navigation/native';
import { writeFile, DownloadDirectoryPath } from 'react-native-fs';
import { useTranslation } from 'react-i18next';

import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import RazorpayCheckout from 'react-native-razorpay'
import {Buffer} from 'buffer'
import axios from 'axios';
import EmptyState from '../component/NoData';


const list = [{id:1,name:"All"},{id:2,name:"Daily Services"},{id:3,name:"Monthly Job"}]




const TempJob = () => {


    const route = useRoute();

    let cred;
    
    if(route!=null){
        cred = route.params
    }
   

    const viewShotRefs = useRef({});
    const [visibleIndex, setVisibleIndex] = useState(null);
  
    const [selectedId, setSelectedId] = useState(1);

    const navigation = useNavigation()
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef(null); // Create a ref for FlatList

    const [get_request, set_request] = useState([])
    const [loading, setLoading] = useState(false);
    const [get_id, set_id] = useState('')
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [isDialogVisible1, setDialogVisible1] = useState(false);
    const [isDialogVisible2, setDialogVisible2] = useState(false);
    const [user_details, set_user_details] = useState({});
    const [user_details2, set_user_details2] = useState({});
    const [userRating, setUserRating] = useState(0);
    const [submit_review_id,set_submit_review_id] = useState('')
    const [review,set_review] = useState('')
    const [job_desc,set_job_desc] = useState('')
    const [is_price_DialogVisible, set_price_DialogVisible] = useState(false);
    const [price,set_price] = useState('')
    const [job_id,set_job_id] = useState('')
    const [profile_details,set_profile_details] = useState(null)


    const [selectedItem, setSelectedItem] = useState(null);
    const [isDialogVisible_member, setDialogVisible_member] = useState(false);

    const [is_details_visible, set_is_details_visible] = useState(false);
    const [cancel_dialog, set_cancel_dialog] = useState(false);


    const [mylat,set_my_lat] = useState('')
    const [mylong,set_my_long] =useState('')

    const [cancel_reason,set_cancel_reason] =useState('')
    const [selected_cancel_item,set_selected_cancel_item] =useState('')

    const [reciept,set_reciept] = useState('')
    const [show_reciept,set_show_reciept] = useState(false)


    const [referal_code, set_referal_code] = useState("");

    const [isDialogVisibleref, setDialogVisibleref] = useState(false);

    const [isDialogVisiblepayment, setDialogVisiblepayment] = useState(false);
    

    const [phone_number, set_phone_number] = useState('');
    const [email_address, set_email_address] = useState('');

    
    const { t, i18n } = useTranslation();

    const changeLanguage = (language) => {
     i18n.changeLanguage(language);
   };



   const fetchLanguage = async () => {
    const lang = await getSavedLanguage();

    switch (lang) {
        case "English":
            changeLanguage("en");
            break;
        case "Hindi":
            changeLanguage("hi");
            break;
        case "Tamil":
            changeLanguage("ta");
            break;
        case "Gujrati":
            changeLanguage("gu");
            break;
        case "Assamese":
            changeLanguage("as");
            break;
        case "Kannada":
            changeLanguage("kn");
            break;
        case "Malayalam":
            changeLanguage("ml");
            break;
        case "Oriya":
            changeLanguage("or");
            break;
        case "Telugu":
            changeLanguage("te");
            break;
        case "Panjabi":
            changeLanguage("pa");
            break;
        case "Bengali":
            changeLanguage("ba");
            break;
        case "Marathi":
            changeLanguage("mr");
            break;
        default:
            // Handle default case, maybe fallback to English
            changeLanguage("en");
            break;
    }
};

    const scrollToItemId = (data,itemId) => {
        // Find the index of the item with matching _id
        const index = data.findIndex(item => item._id.toString() === itemId.toString());
        console.log(index)
    
        // Scroll to the item if the index is valid
        if (flatListRef.current && index !== -1) {
        //     setTimeout(() => {
              flatListRef.current.scrollToIndex({ index, animated: true });
        //       }, 100);
        }
      };

    const CaptureView = async ()=>{
        try {

            const result = await viewShotRef.current.capture();
            console.log(result)
            
            return result
            
        } catch (error) {
            console.log(error)
        }
    }

    const generatePDF = async () => {

        const capturedImage = await CaptureView();

        if (!capturedImage) {
          console.error('Failed to capture view');
          return;
        }
      
        const directory = RNFS.DownloadDirectoryPath;
        const pdfFilePath = `${directory}/myDocument.pdf`;
      
        
          // Convert the captured image to base64
          const imageBase64 = await RNFS.readFile(capturedImage, 'base64');
      
          // Create HTML content with the image
          const htmlContent = `<html><body><img src="data:image/jpeg;base64,${imageBase64}" /></body></html>`;
      
          // Write HTML content to a file
          const htmlFilePath = `${directory}/myDocument.html`;
          await RNFS.writeFile(htmlFilePath, htmlContent, 'utf8');
      
          // Convert HTML file to PDF
          const options = {
            html: `file://${htmlFilePath}`,
            fileName: 'myDocument',
            directory: DownloadDirectoryPath,
          };
      
          const pdf = await RNHTMLtoPDF.convert(options);
      
          console.log('PDF file saved successfully:', pdf.filePath);
      };


    useEffect(() => {
        getProfile();
        fetchLanguage()
    }, []);
    useEffect(() => {
        get_job_request();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        getProfile()
        get_job_request()
       
        setRefreshing(false);
      
        
      };

    const openDialog = () => {
        console.log(user_details)
        setDialogVisible(true);
    };

    const openCancelDialog = () => {
        
        set_cancel_dialog(true);
    };

    const closeCancelDialog = () => {
        
        set_cancel_dialog(false);
    };

    const openDialog1 = () => {
   
        setDialogVisible1(true);
    };

    const handleButtonPress_member = () => {
        // Handle button press action
        closeDialog_member();
        navigation.navigate("ChoosePlanScreen")
     
      };

    const openDialog_member = () => {
        setDialogVisible_member(true);
      };
    
      const closeDialog_member = () => {
        setDialogVisible_member(false);
      };

    const open_price_dialog = () => {
   
        set_price_DialogVisible(true);
    };

    const openDialog2 = (item) => {

        set_job_desc(item.desc)
   
        setDialogVisible2(true);
    };
    const closeDialog = () => {
        setDialogVisible(false);
    };
    const closePriceDialog = () => {
        set_price_DialogVisible(false);
    };
    const closeDialog1 = () => {
        setDialogVisible1(false);
    };
    const closeDialog2 = () => {
        setDialogVisible2(false);
    };

    const handleButtonPress = () => {


        closeDialog();
    };

    const chatHandler = () => {

        console.log("jayant",selectedItem)

        EnterChat(selectedItem._id, selectedItem.to_user_id._id)


        closeDialog();
    };

    const chatHandler2 = () => {

        console.log("jayant",selectedItem)

        EnterChat(selectedItem._id, selectedItem.from_user_id._id)


        closeDialog();
    };

    const handleSetPrice = (id) => {

        accept_job_request(id)
     

    
    };

    const handleButtonPress1 = () => {


        add_review(submit_review_id,job_id)





        closeDialog1();
    };

    const handleRating = (rating) => {
        setUserRating(rating);
    
        // You can also perform any additional actions with the rating value here
      };


    const handleCallNow = () => {

        if(user_details.phone==null){
            openDialer(user_details.alternate_phone)
        }else{
            openDialer(user_details.phone)
        }
        
       
        // You can also perform any additional actions with the rating value here
    };


    const handleCallNow2 = () => {

        if(user_details2.phone==null){
            openDialer(user_details2.alternate_phone)
        }else{
            openDialer(user_details2.phone)
        }
        
       
        // You can also perform any additional actions with the rating value here
    };



    const handleDirection = () => {
       openGoogleMaps()

        // You can also perform any additional actions with the rating value here
    };
    const handleDirection2 = () => {
        openGoogleMaps2()
 
         // You can also perform any additional actions with the rating value here
     };


    const openDialer = (mobile) => {
        console.log(mobile)

        const dialerUrl = Platform.OS === 'android' ? `tel:${mobile}` : `telprompt:${mobile}`;

        Linking.canOpenURL(dialerUrl).then((supported) => {
            if (supported) {
                return Linking.openURL(dialerUrl);
            } else {
                console.error('Phone dialer not supported');
            }
        });
    };

    const openGoogleMaps = () => {
        console.log("kumar",user_details)
        const directionUrl = Platform.select({
            ios: `http://maps.apple.com/?saddr=${mylat},${mylong}&daddr=${user_details.latitude},${user_details.longitude}`,
            android: `https://www.google.com/maps/dir/?api=1&origin=${mylat},${mylong}&destination=${user_details.latitude},${user_details.longitude}`,
        });

        Linking.canOpenURL(directionUrl).then((supported) => {
            if (supported) {
                return Linking.openURL(directionUrl);
            } else {
                console.error('Google Maps not supported');
            }
        });
    };

    const openGoogleMaps2 = () => {
        console.log("kumar",user_details)
        const directionUrl = Platform.select({
            ios: `http://maps.apple.com/?saddr=${mylat},${mylong}&daddr=${user_details2.latitude},${user_details2.longitude}`,
            android: `https://www.google.com/maps/dir/?api=1&origin=${mylat},${mylong}&destination=${user_details2.latitude},${user_details2.longitude}`,
        });

        Linking.canOpenURL(directionUrl).then((supported) => {
            if (supported) {
                return Linking.openURL(directionUrl);
            } else {
                console.error('Google Maps not supported');
            }
        });
    };


    const captureViewSnapshot = useCallback(async () => {
        try {
            setLoading(true)
          if (visibleIndex === null) {
            Alert.alert('Error', 'No item is currently visible');
            setLoading(false)
            return;
          }
    
          const viewShotRef = viewShotRefs.current[visibleIndex];
    
          if (!viewShotRef) {
            Alert.alert('Error', 'Failed to capture snapshot of the currently visible item');
            setLoading(false)
            return;
          }
    
          // Capture snapshot of the view
          const uri = await viewShotRef.capture();
          set_reciept(uri)
          set_show_reciept(true)
          const downloadsPath = RNFetchBlob.fs.dirs.DownloadDir;

          // Convert the snapshot into PDF
          const options = {
            html: `<img src="${uri}" />`,
            fileName: new Date().toString()+"recipet",
            directory: DownloadDirectoryPath,
          };
          const pdf = await RNHTMLtoPDF.convert(options);
          setLoading(false)
          // Alert user about successful conversion
      //  Alert.alert('Success', `PDF saved at: ${pdf.filePath}`);
          
        } catch (error) {
            setLoading(false)
          // Handle errors
          console.error('Error capturing snapshot and converting to PDF:', error);
          Alert.alert('Error', 'Failed to capture snapshot and convert to PDF');
        }
      }, [visibleIndex]);
    
      const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        if (viewableItems.length > 0) {
          setVisibleIndex(viewableItems[0].index);
        } else {
          setVisibleIndex(null);
        }
      }, []);
    
      const requestStoragePermission = async () => {
           if(Platform.OS=='android'){
            try {
                const permissionStatus = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
            
                if (permissionStatus === RESULTS.GRANTED) {
                
                  console.log('Storage permission already granted');
                } else {
                  const newPermissionStatus = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
                  if (newPermissionStatus === RESULTS.GRANTED) {
                    console.log('Storage permission granted');
                    captureViewSnapshot()
                  } else {
                    console.log('Storage permission denied');
                    captureViewSnapshot()
                  }
                }
                  captureViewSnapshot()
              } catch (error) {
                console.error('Error requesting storage permission:', error);
              }
      
              captureViewSnapshot()
           }else{
            captureViewSnapshot()

           }
      };
      

    const renderJobItem = ({ item ,index}) => {

        const skillsString = item.skills.map(skill => skill.name).join(', ');

        console.log(item._id , item.from_user_id)






        return (
            <View>
               
                <ViewShot ref={(ref) => (viewShotRefs.current[index] = ref)} options={{format:'png',quality:1}} >

                

                <View style={{ orderRadius:10,borderWidth:1,borderColor:Colors.orange,marginTop: 13, flexDirection: 'col', marginStart: 10, marginEnd: 10, borderRadius: 10, padding: 10,borderBottomColor:Colors.dark_gray,borderBottomWidth:1 }}>
                    
                    <View style={{ flex: 1, marginTop: 10 }}>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>

                 
                    <Image style={{ width: 50, height: 50,borderRadius:50,borderColor:Colors.orange,borderWidth:2 }} source={{ uri: item.from_user_id._id==get_id.toString() ? Remote.BASE_URL +item.to_user_id.profile : Remote.BASE_URL +item.from_user_id.profile}} />

                    <TouchableOpacity onPress={()=>{
                      requestStoragePermission()
                   }}>

                    <Text  style={{fontWeight:'bold',textDecorationLine:'underline'}}>{t('Download Reciept')}</Text>
                  
                    </TouchableOpacity>
                    </View>
                      
                    <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10,marginBottom:12}}>
                        <Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t('Request Id')}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.order_id}</Text>

                        </View>  

                        {item.from_user_id._id.toString()==get_id.toString() && (
                            <View>

                        <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                        <Text style={{ color: Colors.textcolor,  fontSize: 14 }}>{t('To')}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.to_user_id.name}</Text>


                        </View>  


         


                        <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
                        <Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t('From')}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.from_user_id.name}</Text>

                        </View>      




                                </View>

                        )}

                       {item.to_user_id._id.toString()==get_id.toString() && (
                            <View>



                           <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                            <Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t("From")}</Text>
                            <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.from_user_id.name}</Text>
    
                            </View>    

                            <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
                            <Text style={{ color: Colors.textcolor,  fontSize: 14 }}>{t("To")}</Text>
                            <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.to_user_id.name}</Text>
    
    
                            </View>  
    
    
    
                              
    
    
    
    
                                    </View>

                        )}


                   <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>

                   <Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t('Profession Name')}</Text>
                   <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.to_user_id.profession_name}</Text>

                    </View>


                    <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
                    <Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t('Profession Skill')}</Text>
                    <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{skillsString}</Text>


                        </View>



                        <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
                        <Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t("Job Type")}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.job_pref.name}</Text>


                        </View>


                        <View style={{height:2,backgroundColor:Colors.gray,width:'100%',marginTop:10}}>

                        </View>
   


             


                        <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>

                        <Text style={{ color: Colors.textcolor,  fontSize: 14 }}>{t("Job Request Sent Date")}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{new Date(item.createdAt).toDateString()}</Text>

                            
                        </View>


                        <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
                        <Text style={{ color: Colors.textcolor,  fontSize: 14 }}>{t("Working Date")}</Text>

                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{new Date(item.date).toDateString()}</Text>

                        </View>


                        <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>

                        <Text style={{ color: Colors.textcolor,  fontSize: 14 }}>{t("Work Started Date")}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14}}>{item.joined_date==null ? "Not yet Started" : new Date(item.joined_date).toDateString()}</Text>


                         </View>


                   
                            <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
                            <Text style={{ color: Colors.textcolor, fontSize: 14}}>{t("Work Completed Date")}</Text>
                            <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.quit_date==null ? "Not yet Completed" : new Date(item.quit_date).toDateString() }</Text>


                            </View>
                 


                         <View style={{width:'100%',height:2,backgroundColor:Colors.gray,marginTop:10}}>

                         </View>



                         {item.job_pref.name == "Monthly Job" && (

                            <View>


                              


<View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>

                                                            <Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t('Gross Monthly Salary')}</Text>
                                                            <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>Rs. {item.amount_set}</Text>


                                    </View>



<View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>

<Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t('Convenience Fees')}({item.job_pref.platform_charge}%) Inc. 18% GST</Text>
<Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>Rs. {(item.job_pref.platform_charge / 100 * item.amount_set).toFixed()}</Text>


</View>

<View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>

<Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t('Net Monthly Salary')}</Text>
<Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>Rs. {item.amount_set - (item.job_pref.platform_charge / 100 * item.amount_set).toFixed()}</Text>


</View>

                                    </View>

                                    





                        )}

<View style={{width:'100%',height:2,backgroundColor:Colors.gray,marginTop:10}}>

</View>

                        {Platform.OS=='android' && item.job_pref.name == "Daily Service" && (

                            <View>

<View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
<Text style={{ color: Colors.textcolor,  fontSize: 14 }}>{t("Platform Charge (Inc 18% GST)")}</Text>
<Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>Rs. {(item.job_pref.platform_charge / 100 * item.amount_set).toFixed(2)}</Text>

    </View>

       <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
       <Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t("Profession Service Charge")}</Text>
       <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}> Rs.{item.amount_set}</Text>

        </View>
        <Text style={{ color: Colors.textcolor, fontSize: 14,backgroundColor:Colors.gray,padding:10,marginTop:8,fontSize:12}}>{t("Note - This amount will be paid by employer after work done at employer's place")}</Text>





                            </View>
                        )}




                          {Platform.OS=='android' && item.job_pref.name != "Monthly Job" && (
   <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
   <Text style={{ color: Colors.textcolor,fontSize: 14 }}>{t('Payment Status')}</Text>

   <Text style={{ color: Colors.red, fontWeight: 'bold', fontSize: 14 }}>{item.payment_status}</Text>

      </View>
                          )}
                      

                            <View style={{width:'100%',height:2,backgroundColor:Colors.gray,marginTop:10}}>

                          </View>


                          <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
                          <Text style={{ color: Colors.textcolor,  fontSize: 14 }}>{t('Request Status')}</Text>
                          <Text style={{ color: 'green', fontWeight: 'bold', fontSize: 14 }}>{item.application_status}</Text>


                           </View>


                           {item.application_status=="cancelled by employer"&&(
                            <View style={{width:'100%',justifyContent:'space-between',marginTop:10}}>
                            <Text style={{ color: Colors.textcolor,  fontSize: 14 }}>{t("Cancelation reason")}</Text>
                            <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 12,backgroundColor:Colors.gray,padding:10 ,marginTop:3}}>{item.cancel_reason}</Text>


                                </View>
                           )}

{item.application_status=="cancelled by user"&&(
                            <View style={{width:'100%',justifyContent:'space-between',marginTop:10}}>
                            <Text style={{ color: Colors.textcolor,  fontSize: 14 }}>{t("Cancelation reason")}</Text>
                            <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 12,backgroundColor:Colors.gray,padding:10 ,marginTop:3}}>{item.cancel_reason}</Text>


                                </View>
                           )}

                        


                           <View style={{width:'100%',height:2,backgroundColor:Colors.gray,marginTop:10}}>

                          </View>




                  


                        
                        
                        <View style={{backgroundColor:Colors.gray,padding:10}}>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 12 }}>{t("Job Description")}</Text>
                <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 12 }}>{item.desc}</Text>

                        </View>

                        <View style={{width:'100%',height:2,backgroundColor:Colors.gray,marginTop:10}}>

</View>

                


                {item.from_user_id._id.toString() == get_id.toString()  &&  is_details_visible && (item.application_status=="user joined" || item.application_status=="accepted by user" || item.application_status=="payment done")  &&(

                     <View>


{/* 
                        <View style={{backgroundColor:Colors.gray,marginTop:10,padding:10}}>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 12 }}>User Address</Text>
                       <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 12 }}>{user_details.present_address}</Text>


                      </View> */}
 
            

              <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleCallNow}>
                                <Text style={{ borderWidth:1,borderColor:Colors.orange, padding: 10, color: Colors.orange, borderRadius: 10,borderRadius:10,shadowColor:Colors.black,overflow:'hidden',width:105,textAlign:'center' }}>{t("Call Now")}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={chatHandler}>
                                <Text style={{ borderWidth:1,borderColor:Colors.orange, padding: 10, color: Colors.orange, borderRadius: 10,overflow:'hidden' ,width:105 ,textAlign:'center'}}>{t("Chat")}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={handleDirection}>
                                <Text style={{ borderWidth:1,borderColor:Colors.orange,  padding: 10, color: Colors.orange,borderRadius:10,overflow:'hidden' ,width:105,textAlign:'center'}}>{t("Direction")}</Text>
                            </TouchableOpacity>

                            
                        </View>

                        <View style={{width:'100%',height:2,backgroundColor:Colors.gray,marginTop:10}}>

</View>









                    </View>

                )}

                    {item.to_user_id._id.toString() == get_id.toString()  &&  is_details_visible && item.job_pref.name=="Monthly Job" && (item.application_status=="user joined" || item.application_status=="accepted by user"  )  &&(

                    <View>



                    {/* <View style={{backgroundColor:Colors.gray,marginTop:10,padding:10}}>
                    <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 12 }}>User Address</Text>
                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 12 }}>{user_details2.present_address}</Text>


                    </View> */}



                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleCallNow2}>
                            <Text style={{ borderWidth:1,borderColor:Colors.orange, padding: 10, color: Colors.orange, borderRadius: 10,borderRadius:10,shadowColor:Colors.black,overflow:'hidden',width:105,textAlign:'center' }}>{t("Call Now")}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={chatHandler2}>
                            <Text style={{ borderWidth:1,borderColor:Colors.orange, padding: 10, color: Colors.orange, borderRadius: 10,overflow:'hidden' ,width:105 ,textAlign:'center'}}>{t('Chat')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={handleDirection2}>
                            <Text style={{ borderWidth:1,borderColor:Colors.orange,  padding: 10, color: Colors.orange,borderRadius:10,overflow:'hidden' ,width:105,textAlign:'center'}}>{t("Direction")}</Text>
                        </TouchableOpacity>

                        
                    </View>

                    <View style={{width:'100%',height:2,backgroundColor:Colors.gray,marginTop:10}}>

                    </View>









                    </View>

                    )}





                       {item.to_user_id._id.toString()==get_id.toString() && item.job_pref.name == "Daily Service" && (item.application_status =="payment done"|| item.application_status=="user joined") && (
   <TouchableOpacity onPress={()=>{
    {
        {setSelectedItem(item)}
        {set_is_details_visible(true)}
        { get_employee_details_after_payment(item._id) }

    }
}}>
   <Text style={{borderRadius:10,backgroundColor:Colors.orange,borderWidth:1,borderColor:Colors.orange,padding:8,textAlign:'center',marginTop:10,color:Colors.white,overflow:'hidden'}}>view detail</Text>
</TouchableOpacity>
                       )}

{item.to_user_id._id.toString()==get_id.toString() && item.job_pref.name == "Monthly Job" && (item.application_status =="accepted by user") && (
   <TouchableOpacity onPress={()=>{
    {
        {setSelectedItem(item)}
        {set_is_details_visible(true)}
        { get_employee_details_after_payment(item._id) }

    }
}}>
   <Text style={{borderRadius:10,backgroundColor:Colors.orange,borderWidth:1,borderColor:Colors.orange,padding:8,textAlign:'center',marginTop:10,color:Colors.white,overflow:'hidden'}}>view detail</Text>
</TouchableOpacity>
                       )}
                     


                        <View style={{ flexDirection: 'row' }}>

                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "accepted by user" &&  item.job_pref.name=="Daily Service" &&(

                                <TouchableOpacity style={{width:'100%'}} onPress={() => {

                                    Alert.alert(
                                        'Confirmation',
                                        Platform.OS=='android'?'Are you sure you want to pay platfrom fee?':'Are you sure?',
                                        [
                                          {
                                            text: 'Cancel',
                                            style: 'cancel',
                                          },
                                          {
                                            text: 'Yes',
                                            onPress: () => {
                                              // Handle "Yes" button press
                                              setSelectedItem(item)
                                              setDialogVisibleref(true)

                                              

                                            //  pay_platform_fee(item._id)
                                            },
                                          },
                                        ],
                                        { cancelable: false }
                                      );
                            
                                }


                                }>
                                    {/* <Text style={{fontSize:11,color:Colors.textcolor,marginTop:8}}>Per/day price set - {item.to_user_id.average_price} </Text> */}
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10,borderRadius:10 }}>
                                         {Platform.OS=="android" && (
                                            <Text style={{ textAlign: 'center', backgroundColor: Colors.orange, padding: 10, color: Colors.white, borderRadius: 10 }}>
  Pay Platform fee Rs. {(item.job_pref.platform_charge / 100 * item.amount_set).toFixed(2)}
</Text>
                                         )}

{Platform.OS=="ios" && (
                                        <Text style={{ textAlign:'center',backgroundColor: Colors.orange, padding: 10, color: Colors.white,borderRadius:10}}>Get Details</Text>

                                         )}
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}



                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "accepted by user" && item.job_pref.name == "Monthly Job"  && (

                                <TouchableOpacity style={{width:'48%'}} onPress={() => {

                                    {setSelectedItem(item)}
                                    {set_is_details_visible(true)}
                                    { get_employee_details_after_payment(item._id) }
                                
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ textAlign:'center',backgroundColor: Colors.orange, padding: 10, color: Colors.white,borderRadius:10,overflow:'hidden'}}>view detail</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}    

                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "user joined" && item.job_pref.name == "Monthly Job" && (

                                <TouchableOpacity style={{width:'48%'}} onPress={() => {

                                    { setSelectedItem(item) }
                                     { set_is_details_visible(true)}
                                    { get_employee_details_after_payment(item._id) }
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ textAlign:'center',backgroundColor: Colors.orange, padding: 10, color: Colors.white,borderRadius:10 ,overflow:'hidden'}}>view detail</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}    

                           
                           
                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "accepted by user" && item.job_pref.name == "Monthly Job"  && item.is_joined == false && (

                                <TouchableOpacity style={{width:'48%',marginStart:10}} onPress={() => {
                                    { 
                                    
                                        Alert.alert(
                                            'Confirmation',
                                            'Are you sure you want to start work today?',
                                            [
                                              {
                                                text: 'Cancel',
                                                style: 'cancel',
                                              },
                                              {
                                                text: 'Yes',
                                                onPress: () => {
                                                  // Handle "Yes" button press
                                                  start_work(item._id) 
                                                },
                                              },
                                            ],
                                            { cancelable: false }
                                          );
                                    
                                    
                                    }
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ textAlign:'center',backgroundColor: Colors.navcolor, marginStart: 10, padding: 10, color: Colors.white,borderRadius:10,overflow:'hidden' }}>start work</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}

                            {item.from_user_id._id.toString() == get_id.toString() && item.payment_status == "payment done"  && item.is_quit==false && (

                                <TouchableOpacity style={{width:'48%'}} onPress={() => {
                                     set_is_details_visible(true)
                                     setSelectedItem(item) 
                                     get_employee_details_after_payment(item._id) 
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ textAlign:'center',backgroundColor: Colors.orange, padding: 10, color: Colors.white,borderRadius:10,overflow:'hidden' }}>view details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}

                            {/* {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "employee left the job" && (

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                     setSelectedItem(item) 
                                     get_employee_details_after_payment(item._id) 
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white,borderRadius:10,overflow:'hidden' }}>view details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    {/* </View> */}
                                {/* </TouchableOpacity>)} */}

                            {/* {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "employee removed by employer" && ( */}

                                {/* // <TouchableOpacity style={styles.button1} onPress={() => { */}
                                {/* //      setSelectedItem(item)  */}
                                {/* //      get_employee_details_after_payment(item._id)  */}
                                {/* // } */}


                                {/* // }> */}
                                {/* //     <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}> */}
                                {/* //         <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white,borderRadius:10,overflow:'hidden' }}>view details</Text> */}
                                {/* //         <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                {/* //     </View> */}
                                {/* // </TouchableOpacity> */}
                                {/* //)} */}



                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "payment done" && item.is_joined == false && (

                                <TouchableOpacity style={{width:'48%',marginStart:10}} onPress={() => {
                                    { 

                                        Alert.alert(
                                            'Confirmation',
                                            'Are you sure you want to start work today?',
                                            [
                                              {
                                                text: 'Cancel',
                                                style: 'cancel',
                                              },
                                              {
                                                text: 'Yes',
                                                onPress: () => {
                                                  // Handle "Yes" button press
                                                  start_work(item._id) 
                                                },
                                              },
                                            ],
                                            { cancelable: false }
                                          );
                                    
                                     }
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ textAlign:'center',backgroundColor: Colors.navcolor, marginStart: 10, padding: 10, color: Colors.white ,borderRadius:10,overflow:'hidden'}}>start work</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}

                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "user joined" && item.is_joined == true && item.job_pref.name == "Daily Service"  && (

                                <TouchableOpacity style={{width:'100%'}} onPress={() => {
                                   
                                    Alert.alert(
                                        'Confirmation',
                                        'Are you sure you want to complete today?',
                                        [
                                          {
                                            text: 'Cancel',
                                            style: 'cancel',
                                          },
                                          {
                                            text: 'Yes',
                                            onPress: () => {
                                              // Handle "Yes" button press
                                               complete_work(item._id) 
                                            },
                                          },
                                        ],
                                        { cancelable: false }
                                      );
                                }


                                }>
                                    <View style={{ width: '50%', marginTop: 10,marginStart:10, marginBottom: 10 }}>
                                        <Text style={{ textAlign:'center',backgroundColor: '#68BBE3', padding: 10, color: Colors.white ,borderRadius:10,overflow:'hidden'}}>complete work</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}

                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "user joined" && item.is_joined == true && item.job_pref.name == "Monthly Job" && (

                                <TouchableOpacity style={{width:'48%'}} onPress={() => {
                                    navigation.navigate("MonthlyWorkDetailScreen", { detail: item })
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10,marginStart:10, marginBottom: 10 }}>
                                        <Text style={{ textAlign:'center',backgroundColor: Colors.navcolor, padding: 10, color: Colors.white ,borderRadius:10,overflow:'hidden'}}>view work details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}


                            {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "user joined" && item.is_joined == true && item.job_pref.name == "Monthly Job" && (


                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                       <TouchableOpacity style={{width:'48%'}} onPress={() => {
                                   set_is_details_visible(true)
                                   setSelectedItem(item) 
                                   get_employee_details_after_payment(item._id) 

                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                    <Text style={{ textAlign:'center',backgroundColor: Colors.orange, padding: 10, color: Colors.white ,borderRadius:10,overflow:'hidden'}}>view detail</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>


                                <TouchableOpacity style={{width:'48%',marginStart:10}} onPress={() => {
                                    navigation.navigate("MonthlyWorkDetailScreen", { detail: item })
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                    <Text style={{ textAlign:'center',backgroundColor: Colors.navcolor, padding: 10, color: Colors.white ,borderRadius:10,overflow:'hidden'}}>view work details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>
                                    </View>

                              )}


                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "employee left the job" && item.is_joined == true && item.job_pref.name == "Monthly Job" && (

                                <TouchableOpacity style={{width:'100%'}} onPress={() => {
                                    navigation.navigate("MonthlyWorkDetailScreen", { detail: item })
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                    <Text style={{ backgroundColor: Colors.navcolor, padding: 10, color: Colors.white ,borderRadius:10,overflow:'hidden',textAlign:'center'}}>view work details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}


                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "employee removed by employer" && item.is_joined == true && item.job_pref.name == "Monthly Job" && (

                                <TouchableOpacity style={{width:'100%'}} onPress={() => {
                                    navigation.navigate("MonthlyWorkDetailScreen", { detail: item })
                                }


                                }>
                                    <View style={{ marginTop: 10, marginBottom: 10 }}>
                                    <Text style={{ backgroundColor: Colors.navcolor, padding: 10, color: Colors.white ,borderRadius:10,overflow:'hidden',textAlign:'center'}}>view work details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}

                            {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "employee left the job" && item.is_joined == true && item.job_pref.name == "Monthly Job" && (

                                <TouchableOpacity style={{width:'100%'}} onPress={() => {
                                    navigation.navigate("MonthlyWorkDetailScreen", { detail: item })
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                    <Text style={{ backgroundColor: Colors.navcolor, padding: 10, color: Colors.white ,borderRadius:10,overflow:'hidden',textAlign:'center'}}>view work details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}

                            {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "employee removed by employer" && item.is_joined == true && item.job_pref.name == "Monthly Job" && (

                                <TouchableOpacity style={{width:'100%'}} onPress={() => {
                                    navigation.navigate("MonthlyWorkDetailScreen", { detail: item })
                                }


                                }>
                                    <View style={{ marginTop: 10, marginBottom: 10 }}>
                                    <Text style={{ backgroundColor: Colors.navcolor, padding: 10, color: Colors.white ,borderRadius:10,overflow:'hidden',textAlign:'center'}}>view work details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}

                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "request sent" && (

                                <TouchableOpacity style={{width:'100%'}} onPress={() => {
                                    { 

                                        set_selected_cancel_item(item._id)
                                        openCancelDialog()

                                      
                                        
                                      
                                    
                                    
                                    }
                                }


                                }>
                                    <View style={{ marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.red,textAlign:'center', padding: 10, color: Colors.white,borderRadius:10,overflow:'hidden'}}>Cancel</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}




                            {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "request sent" && (

                                <TouchableOpacity style={{width:'48%'}} onPress={() => {

                                    {
                                        Alert.alert(
                                            'Confirmation',
                                            'Are you sure you want to accept this job request?',
                                            [
                                              {
                                                text: 'Cancel',
                                                style: 'cancel',
                                              },
                                              {
                                                text: 'Yes',
                                                onPress: () => {
                                                  // Handle "Yes" button press
                                                   set_job_id(item._id)  
                                                   handleSetPrice(item._id)
                                    
                                   
                                                 // open_price_dialog()
                                                },
                                              },
                                            ],
                                            { cancelable: false }
                                          );
                                    }

                                   

                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white ,borderRadius:10,textAlign:'center',overflow:'hidden'}}>Accept</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}


                            {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "request sent" && (

                                <TouchableOpacity style={{width:'48%' ,marginStart:10}} onPress={() => {
                                    { 
                                        set_selected_cancel_item(item._id)
                                      openCancelDialog()
                                    }
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.red, padding: 10, color: Colors.white,borderRadius:10,overflow:'hidden',textAlign:'center' }}>Cancel</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}




                        </View>

                        {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "user joined" && item.is_joined == true && item.is_quit == false && item.job_pref.name == "Monthly Job"&& (

                            <TouchableOpacity  onPress={() => {

                                {
                                    Alert.alert(
                                        'Confirmation',
                                        'Are you sure you want to remove employee from job?',
                                        [
                                          {
                                            text: 'Cancel',
                                            style: 'cancel',
                                          },
                                          {
                                            text: 'Yes',
                                            onPress: () => {
                                              // Handle "Yes" button press
                                              remove_or_leave_job(item._id)
                                            },
                                          },
                                        ],
                                        { cancelable: false }
                                      );
                                }
                              
                            }


                            }>
                                <View style={{  marginBottom: 10 }}>
                                    <Text style={{ padding:10,textAlign:'center',backgroundColor:Colors.red,borderRadius:10,overflow:'hidden' ,color:Colors.white}}>Remove from job</Text>
                                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                </View>
                            </TouchableOpacity>)}


                        {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "user joined" && item.is_joined == true && item.is_quit == false && item.job_pref.name == "Monthly Job" && (

                            <TouchableOpacity onPress={() => {

                                {
                                    Alert.alert(
                                        'Confirmation',
                                        'Are you sure you want to quit from job?',
                                        [
                                          {
                                            text: 'Cancel',
                                            style: 'cancel',
                                          },
                                          {
                                            text: 'Yes',
                                            onPress: () => {
                                              // Handle "Yes" button press
                                              remove_or_leave_job(item._id)
                                            },
                                          },
                                        ],
                                        { cancelable: false }
                                      );
                                }
                               
                            }


                            }>
                                <View style={{ width: '100%', marginBottom: 10 }}>
                                    <Text style={{ overflow:'hidden',backgroundColor:Colors.red,borderRadius:10,color:Colors.white, padding: 10, textAlign: 'center' }}>Quit job</Text>
                                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                </View>
                            </TouchableOpacity>)}




                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "employee left the job"   && (

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                    set_submit_review_id(item.to_user_id._id)
                                    set_job_id(item._id)

                                    openDialog1()

                                }


                                }>
                                    <View style={{  marginBottom: 10 }}>
                                    <Text style={{  padding: 10, color: Colors.white,textAlign:'center' ,borderRadius:10,overflow:'hidden',backgroundColor:'#68BBE3'}}>Write a Review</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}


                                {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "employee removed by employer"   && (

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                    set_submit_review_id(item.to_user_id._id)
                                    set_job_id(item._id)
                                    openDialog1()

                                }


                                }>
                                    <View style={{   marginBottom: 10 }}>
                                    <Text style={{  padding: 10, color: Colors.white,textAlign:'center' ,borderRadius:10,overflow:'hidden',backgroundColor:'#68BBE3'}}>Write a Review</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}


                                {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "employee removed by employer"   && (

                                    <TouchableOpacity style={styles.button1} onPress={() => {
                                        set_submit_review_id(item.from_user_id._id)
                                        set_job_id(item._id)
                                        openDialog1()

                                    }


                                    }>
                                        <View style={{   marginBottom: 10 }}>
                                        <Text style={{  padding: 10, color: Colors.white,textAlign:'center' ,borderRadius:10,overflow:'hidden',backgroundColor:'#68BBE3'}}>Write a Review</Text>
                                            {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                        </View>
                                    </TouchableOpacity>)}


                                         {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "employee left the job"   && (

                                            <TouchableOpacity style={styles.button1} onPress={() => {
                                                set_submit_review_id(item.from_user_id._id)
                                                set_job_id(item._id)
                                                openDialog1()

                                            }


                                            }>
                                                <View style={{   marginBottom: 10 }}>
                                                <Text style={{  padding: 10, color: Colors.white,textAlign:'center' ,borderRadius:10,overflow:'hidden',backgroundColor:'#68BBE3'}}>Write a Review</Text>
                                                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                                </View>
                                            </TouchableOpacity>)}


                                            {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "work completed"   && (

                                                    <TouchableOpacity style={styles.button1} onPress={() => {
                                                        set_submit_review_id(item.from_user_id._id)
                                                        set_job_id(item._id)
                                                        openDialog1()

                                                    }


                                                    }>
                                                        <View style={{ marginTop:10, marginBottom: 10 }}>
                                                        <Text style={{  padding: 10, color: Colors.white,textAlign:'center' ,borderRadius:10,overflow:'hidden',backgroundColor:'#68BBE3'}}>Write a Review</Text>
                                                            {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                                        </View>
                                                    </TouchableOpacity>)}


                                                    {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "work completed"   && (

                                                            <TouchableOpacity style={styles.button1} onPress={() => {
                                                                    set_submit_review_id(item.to_user_id._id)
                                                                    set_job_id(item._id)
                                                                    openDialog1()
                                                            }


                                                            }>
                                                                <View style={{ marginBottom: 10,marginTop:10 }}>
                                                                    <Text style={{  padding: 10, color: Colors.white,textAlign:'center' ,borderRadius:10,overflow:'hidden',backgroundColor:'#68BBE3'}}>Write a Review</Text>
                                                                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                                                </View>
                                                            </TouchableOpacity>)}


                        { item.application_status == "work completed" && (

                            <TouchableOpacity style={styles.button1} onPress={() => {

                                if (item.from_user_id._id.toString() == get_id.toString()) {
                                    add_like(item.to_user_id._id,item._id)
                                }

                                if (item.to_user_id._id.toString() == get_id.toString()) {
                                    add_like(item.from_user_id._id,item._id)

                                }


                              
                            }


                            }>
                                <View style={{  marginBottom: 10 }}>
                                    <Text style={{  padding: 10, color: Colors.white, textAlign: 'center',borderRadius:10,overflow:'hidden',backgroundColor:Colors.orange }}>Add Like</Text>
                                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                </View>
                            </TouchableOpacity>)}

                        {item.application_status == "employee left the job" && (

                            <TouchableOpacity style={styles.button1} onPress={() => {

                                if (item.from_user_id._id.toString() == get_id.toString()) {
                                    add_like(item.to_user_id._id,item._id)
                                }

                                if (item.to_user_id._id.toString() == get_id.toString()) {
                                    add_like(item.from_user_id._id,item._id)

                                }
                            }


                            }>
                                <View style={{  marginBottom: 10 }}>
                                <Text style={{  padding: 10, color: Colors.white, textAlign: 'center',borderRadius:10,overflow:'hidden',backgroundColor:'#000000' }}>Add Like</Text>
                                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                </View>
                            </TouchableOpacity>)}


                        {item.application_status == "employee removed by employer" && (

                            <TouchableOpacity style={styles.button1} onPress={() => {


                                if(item.from_user_id._id.toString()==get_id.toString()){
                                      add_like(item.to_user_id._id,item._id)
                                }

                                if (item.to_user_id._id.toString() == get_id.toString()) {
                                    add_like(item.from_user_id._id,item._id)

                                }
                              
                            }


                            }>
                                <View style={{  marginBottom: 10 }}>
                                <Text style={{  padding: 10, color: Colors.white, textAlign: 'center',borderRadius:10,overflow:'hidden',backgroundColor:'#000000' }}>Add Like</Text>
                                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                </View>
                            </TouchableOpacity>)}

                    </View>
                    {/* <TouchableOpacity onPress={()=>{
                        openDialog2(item)
                    }}>


                        <View style={{ flex: 0, justifyContent: 'flex-end', marginRight: 10 }}>
                            <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/next.png')} />
                        </View>
                    </TouchableOpacity> */}

                </View>
                </ViewShot>
            </View>


        )
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

                console.log("ssssssss"+data.profile_details.customer_type)

                set_profile_details(data.profile_details.customer_type)




                set_id(data.profile_details._id)
                set_my_lat(data.profile_details.latitude)
                set_my_long(data.profile_details.longitude)
                set_phone_number(data.profile_details.phone)
                set_email_address(data.profile_details.email)

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



    const get_job_request = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_job_request"







            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();

                console.log(data)

                let newdata = []


                // for (let index = 0; index < data.request.length; index++) {
                //       if(data.request[index].job_pref.name=="Monthly Job"){
                //          newdata.push(data.request[index])
                //       }
                    
                // }


                set_request(data.request);

                if(cred !=null && cred.page=="notification" && cred.id!=null){
                       scrollToItemId(data.request,cred.id)
                }

                setLoading(false)






            } else {
                if(response.status==401){
                    setLoading(false)
                 
                    openDialog_member()
                }
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
        }





    };

    const get_job_request_monthly = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_job_request"







            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();

                console.log(data)

                let newdata = []


                for (let index = 0; index < data.request.length; index++) {
                      if(data.request[index].job_pref.name=="Monthly Job"){
                         newdata.push(data.request[index])
                      }
                    
                }


                set_request(newdata);

                

                setLoading(false)






            } else {
                if(response.status==401){
                    setLoading(false)
                 
                    openDialog_member()
                }
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
        }





    };

    const get_job_request_daily = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_job_request"







            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();

                console.log(data)

                let newdata = []


                for (let index = 0; index < data.request.length; index++) {
                    if(data.request[index].job_pref.name=="Daily Service"){
                       newdata.push(data.request[index])
                    }
                  
              }


              set_request(newdata);




                setLoading(false)






            } else {
                if(response.status==401){
                    setLoading(false)
                 
                    openDialog_member()
                }
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
        }





    };

    const cancel_job_request = async (id) => {



        try {

            const token = await getToken()

            if(cancel_reason==''){
                Toast.show({
                    type: 'success',
                    text1: "Please enter cancelation reason",
                });

                closeCancelDialog()

                return
            }

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/cancel_job_request";

            const userData = {
                job_request_id: id,
                cancel_reason:cancel_reason

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
                    text1: "job request cancelled",
                });
                setLoading(false)
                closeCancelDialog()
              
                get_job_request()



            } else {
                // Handle error
                Toast.show({
                    type: 'success',
                    text1: responsedata.error,
                });
                closeCancelDialog()
                setLoading(false)

            }
        } catch (error) {
            console.error('Error:', error);
            closeCancelDialog()
            setLoading(false)

        }





    };

    const accept_job_request = async (id) => {



        try {


            // if(!price || price==''){
            //     Toast.show({
            //         type: 'success',
            //         text1: 'please select price',
            //     });

            // }
            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/accept_job_request";

            const userData = {
                job_request_id: id,
                
         

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
                closePriceDialog()
           
                get_job_request()



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


    const handlePaymentSuccess = async (razorpay_payment_id) => {
        try {
            const razorpayKeyId = 'rzp_live_YCbbttwTGEwnOk';
            const razorpayKeySecret = 'MjUZUm0CUQDRB0ollk4xBECe';
            const auth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
      
            const razorpayResponse = await axios.get(
              `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
              {
                headers: {
                  Authorization: `Basic ${auth}`
                }
              }
            );
      
            const paymentDetails = razorpayResponse.data;

            pay_platform_fee(selectedItem._id,paymentDetails)
      
           
      
          
          } catch (error) {
            Alert.alert('Error', `Failed to fetch or save payment details: ${error.message}`);
            setDialogVisiblepayment(false)

          }


    }

    const doPayment =  () => {

        console.log(selectedItem)


        try {
            setLoading(true)
            setDialogVisiblepayment(true)

           const p_fee = (selectedItem.job_pref.platform_charge / 100 * selectedItem.amount_set).toFixed(2)

     
            var options = {
                description: 'NANA HELPS',
                image: 'https://i.imgur.com/3g7nmJC.png',
                currency: 'INR',
                key: 'rzp_live_YCbbttwTGEwnOk', // Your api key
                amount: 100 * p_fee,
                name: 'NANA HELPS',
                prefill: {
                  email: email_address,
                  contact: phone_number,
                  name: 'Razorpay Software'
                },
                theme: {color: '#F37254'},
                order_id:Date.now
              }
              RazorpayCheckout.open(options).then((data) => {
                // handle success
              console.log(`Success: ${JSON.stringify(data)}`); // Convert the object to a JSON string

              handlePaymentSuccess(data.razorpay_payment_id)
               




            }).catch((error) => {
                // handle failure
                console.log(`Error: ${error.code} | ${error.description}`);
                setDialogVisiblepayment(false)


              });




           
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
            setDialogVisiblepayment(false)

        }





    };

    const pay_platform_fee = async (id,details) => {



        try {

            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/make_platform_fee_payment";

            const userData = {
                job_request_id: id,
                payment_mode: details.method,
                payment_status: "success",
                transaction_id: details.id,
                payment_id:details.id,
                referal_code:referal_code

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
                get_job_request()
                setDialogVisiblepayment(false)



            } else {
                // Handle error
                Toast.show({
                    type: 'success',
                    text1: responsedata.error,
                });
                setLoading(false)
                setDialogVisiblepayment(false)


            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false)
            setDialogVisiblepayment(false)


        }





    };

    const get_employee_details_after_payment = async (id) => {

        


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_employee_details_after_payment"

            const queryParams = {
                job_request_id: id,

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

                console.log("lllsssss",data.details_employer)




                set_user_details(data.details);
                set_user_details2(data.details_employer);

                setLoading(false)
               // openDialog()





            } else {
                console.error('Errorss:', response.status, response.statusText);
                setLoading(false)
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
        }





    };


    const start_work = async (id) => {



        try {

            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/start_work";

            const userData = {
                job_request_id: id,


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
                get_job_request()



            } else {
                // Handle error
                console.log(responsedata.error)
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

    // const saveImageToDownloads = async (fileUri, fileName) => {
    //     try {
    //         console.log(fileUri,fileName)
    //       const response = await RNFetchBlob.fs.cp(fileUri, `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}.png`);
    //       console.log(response)
    //       Alert.alert("succss","Reciept save to Downloads")
    //       set_show_reciept(false)
    //     } catch (error) {
    //         Alert.alert("Failed","Something went wrong")
    //     }
    //   };

    const saveImageToDownloads = async (fileUri, fileName) => {
        try {
          let directoryPath = '';
      
          // Determine the directory path based on platform
          if (Platform.OS === 'ios') {
            directoryPath = RNFetchBlob.fs.dirs.DocumentDir;
          } else if (Platform.OS === 'android') {
            directoryPath = RNFetchBlob.fs.dirs.DownloadDir;
          }
      
          // Copy the file to the specified directory
          const response = await RNFetchBlob.fs.cp(fileUri, `${directoryPath}/${fileName}.png`);
          
          // Check if the file was successfully copied
        // if (response) {
            Alert.alert('Success', 'Receipt saved to Downloads');
        //   } else {
        //     Alert.alert('Failed', 'Something went wrong while saving the receipt');
        //   }
      
          // Hide the receipt after saving
          set_show_reciept(false);
        } catch (error) {
          console.error('Error saving receipt:', error);
          Alert.alert('Failed', 'Something went wrong while saving the receipt');
        }
      };

    const complete_work = async (id) => {



        try {

            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/complete_work";

            const userData = {
                job_request_id: id,


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
                get_job_request()



            } else {
                // Handle error
                console.log(responsedata.error)
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


    const remove_or_leave_job = async (id) => {



        try {



            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/remove_or_left_job";

            const userData = {
                job_request_id: id,
              

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
                get_job_request()




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

    const add_review = async (id,job_id) => {



        try {



            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/add_rating";

            const userData = {
                to_user_id: id,
                rating:userRating,
                review:review,
                job_request_id:job_id
              

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

    const add_like = async (id,job_id) => {



        try {



            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/add_like";

            const userData = {
                to_user_id: id,
                job_request_id:job_id
            


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

   



    const EnterChat = async (job_req_id, reciever_id) => {



        try {

            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/enter_chat";

            const userData = {
                job_req_id: job_req_id,
                reciever_id: reciever_id,
           


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

              
                 
                setLoading(false)
                const data = {
                    chat_room_id: responsedata.chat_room_id
                }

                navigation.navigate("ChatScreen", { data: data })



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

    const renderItem = ({ item }) => {
        const isSelected = selectedId === item.id;
        return (
          <TouchableOpacity
            style={[
              styles.item,
              { backgroundColor: isSelected ? 'orange' : 'lightgray' },
            ]}
            onPress={() => {
                setSelectedId(item.id)

                if(item.name=="All"){
                    get_job_request()
                }
                if(item.name=="Monthly Job"){
                    get_job_request_monthly()
                }

                if(item.name=="Daily Services"){
                    get_job_request_daily()
                }

     

            }}
          >
            <Text style={{ color: isSelected ? 'white' : 'black',textAlign:'center' ,fontSize:12}}>{item.name}</Text>
          </TouchableOpacity>
        );
      };


    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.orange }}>

        <View style={styles.container}>



            <View style={styles.topbar}>
                <View style={{ flexDirection: 'row', marginTop:Platform.OS=='android' ? 10 :0, padding: 10, alignItems: 'center' }}>
                <TouchableOpacity onPress={()=>{
                        navigation.goBack()
                    }}>
                     <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>


                    </TouchableOpacity>  
                    <View style={{flexDirection:'row',alignItems:'center'}}> 
                    <View style={{ marginStart: 15, flex: 1 }}>

                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20}}>{t("Requests")}</Text>

                    </View>


                   {profile_details !=null && profile_details=="employer" && (
                    <TouchableOpacity onPress={()=>{
                        navigation.navigate("AllAttendaceScreen")
                    }}>
                    <Text style={{ borderRadius:10,borderColor:Colors.white,borderWidth:2,padding:10,color: Colors.white, fontWeight: 'bold', fontSize: 14,marginEnd:20 }}>Manage Attendance</Text>

                    </TouchableOpacity>
                   )}
                   
                    </View>


                </View>

            </View>

            <View style={{height:40,marginTop:10}}>
      <FlatList
        data={list}
        horizontal
        style={{alignSelf:'center'}}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        extraData={selectedId} // To re-render when selectedId changes
      
      />
    </View>


            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}

            <View style={{marginBottom:110}}>

                <FlatList
                    ref={flatListRef}
                    data={get_request}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderJobItem}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                      }

                      onScrollToIndexFailed={info => {
                        const wait = new Promise(resolve => setTimeout(resolve, 500));
                        wait.then(() => {
                          flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                        });
                      }}

                      onViewableItemsChanged={onViewableItemsChanged}

                />
            </View>

            {get_request.length==0 && (
                 <EmptyState
                 title="No Data Found"
                 description="Job request will be display here"
               />
            )}

     
            <Modal visible={isDialogVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.dialogContainer}>
                        <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>User Details</Text>
                        <Text style={{ color: Colors.textcolor, marginBottom: 3, fontWeight: 'light' }}>Name</Text>
                        <Text style={{ color: Colors.orange, marginBottom: 10, fontWeight: 'bold' }}>{user_details.name}</Text>

                        <Text>Address</Text>

                        <Text multiline={true} style={styles.input}>{user_details.present_address}</Text>



                        <View style={{width:'100%'}}>
                            <TouchableOpacity  onPress={handleCallNow}>
                                <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white, borderRadius: 10,borderRadius:10,shadowColor:Colors.black,overflow:'hidden' ,width:120}}>Call Now</Text>
                            </TouchableOpacity>

                            <TouchableOpacity  onPress={chatHandler}>
                                <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white, borderRadius: 10,overflow:'hidden',width:120  }}>Chat</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleDirection}>
                                <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white,borderRadius:10,overflow:'hidden',width:120  }}>Direction</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={closeDialog}>
                            <Text style={{backgroundColor:Colors.red,color:Colors.white,padding:10,borderRadius:10}}>Close</Text>

                            </TouchableOpacity>
                        </View>



                    </View>
                </View>
            </Modal>


            <Modal visible={isDialogVisible1} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.dialogContainer}>
                        <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Add Rating and review</Text>

                    

                        <TextInput style={styles.input} placeholder='Enter your review here' value={review} onChangeText={(text) => set_review(text)}></TextInput>


                        <Text style={{ color: Colors.textcolor,alignSelf:'center' }}>Rating</Text>
                    <AirbnbRating
                        count={5} // Number of rating items
                        reviews={['Terrible', 'Bad', 'Good', 'Great', 'Excellent']} // Optional review text
                        defaultRating={3} // The rating to display (adjust as needed)
                        size={40} // Size of the rating items
                        showRating={true} // Set to false to hide the rating value
                        onFinishRating={handleRating}
                    />


                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleButtonPress1}>
                                <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white }}>submit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={closeDialog1}>
                            <Text style={{backgroundColor:Colors.red,color:Colors.white,padding:10,borderRadius:10}}>Close</Text>

                            </TouchableOpacity>
                        </View>



                    </View>
                </View>
            </Modal>



            <Modal visible={isDialogVisible2} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.dialogContainer}>
                        <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Job description</Text>

                    

                       

                        <Text style={{ color: Colors.textcolor,alignSelf:'center' }}>{job_desc}</Text>
                   


                        <View style={styles.buttonContainer}>
                           

                            <TouchableOpacity style={styles.button} onPress={closeDialog2}>
                            <Text style={{backgroundColor:Colors.red,color:Colors.white,padding:10,borderRadius:10}}>Close</Text>

                            </TouchableOpacity>
                        </View>



                    </View>
                </View>
            </Modal>

            <Modal visible={is_price_DialogVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.dialogContainer}>
                        <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Are you sure ?</Text>

                    

                       

                        {/* <TextInput style={{ color: Colors.textcolor,alignSelf:'center',borderRadius:10 }} placeholder='Enter Price' keyboardType='numeric' value={price} onChangeText={(text) => set_price(text)}></TextInput>
                    */}


                      
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleSetPrice}>
                                <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white,borderRadius:10 }}>Yes</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={closePriceDialog}>
                            <Text style={{backgroundColor:Colors.red,color:Colors.white,padding:10,borderRadius:10}}>Close</Text>

                            </TouchableOpacity>
                        </View>



                    </View>
                </View>
            </Modal>


            <Modal visible={cancel_dialog} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.dialogContainer}>


                        <Text>Enter cancel reason here</Text>

                        <TextInput multiline={true} style={{borderWidth:1,borderColor:Colors.textcolor,padding:10,borderRadius:10,height:80,marginTop:10}} placeholder='reason..'  onChangeText={(text) => set_cancel_reason(text)}  ></TextInput>
                      


                    

                       

                        {/* <TextInput style={{ color: Colors.textcolor,alignSelf:'center',borderRadius:10 }} placeholder='Enter Price' keyboardType='numeric' value={price} onChangeText={(text) => set_price(text)}></TextInput>
                    */}


                      
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={()=>{
                                  Alert.alert(
                                    'Confirmation',
                                    'Are you sure you want to cancel this job request?',
                                    [
                                      {
                                        text: 'Cancel',
                                        style: 'cancel',
                                      },
                                      {
                                        text: 'Yes',
                                        onPress: () => {
                                        
                                            
                                          // Handle "Yes" button press
                                         cancel_job_request(selected_cancel_item) 
                                        },
                                      },
                                    ],
                                    { cancelable: false }
                                  );
                            }}>
                                <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white,borderRadius:10 }}>Cancel Request</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={closeCancelDialog}>
                                <Text style={{backgroundColor:Colors.red,color:Colors.white,padding:10,borderRadius:10}}>Close</Text>
                            </TouchableOpacity>
                        </View>



                    </View>
                </View>
            </Modal>

                  

            <CommentDialog
        isVisible={isDialogVisible_member}
        onClose={closeDialog_member}
        onButtonPress={handleButtonPress_member}
      />



      

     <Modal visible={show_reciept} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.dialogContainer}>


                      

                    <View style={{width:'100%',height:'90%'}}>

                    <Image  style={{width:'100%',height:'100%',resizeMode:'center'}}source={{uri:reciept}} ></Image>

                    </View>

        

                      
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={()=>{
                              saveImageToDownloads(reciept, "Nana_Reciept"+Date.now());

                            }}>
                                <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white,borderRadius:10 }}>Download</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={()=>{
                                set_show_reciept(false)
                            }}>
                                <Text style={{backgroundColor:Colors.red,color:Colors.white,padding:10,borderRadius:10}}>Close</Text>
                            </TouchableOpacity>
                        </View>



                    </View>
                </View>
            </Modal>

 


        </View>

        <Modal visible={isDialogVisibleref} animationType="slide" transparent>
             <View style={styles.modalContainer}>
                 <View style={styles.dialogContainer}>
                     <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Enter Referal Code (IF ANY) </Text>

                     
                     <TextInput style={{borderRadius:10,borderWidth:1,borderColor:Colors.grayview}} placeholder="Enter your referal code "  keyboardType='numeric' value={referal_code} onChangeText={(text) => set_referal_code(text)} />

                    

                       
                        <TouchableOpacity onPress={()=>{

doPayment()
setDialogVisibleref(false)
// make_payment()
                        }}>
                            <Text style={{backgroundColor:Colors.orange,marginTop:5,padding:10,color:Colors.white,textAlign:"center",borderRadius:10}}>CONTINUE</Text>

                        </TouchableOpacity>

                 

                     


                     <TouchableOpacity onPress={() => {
                         setDialogVisibleref(false)
                     }}>
                         <Text style={{marginTop:10,backgroundColor:Colors.red,color:Colors.white,padding:10,borderRadius:10,textAlign:'center'}}>Close</Text>
                     </TouchableOpacity>







                 </View>
             </View>
           </Modal> 

           <Modal visible={isDialogVisiblepayment} animationType="slide" transparent>
             <View style={styles.modalContainer}>
                 <View style={styles.dialogContainer}>

                     <ActivityIndicator/>
                     <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Please wait until payment processing..</Text>

                     

                       
                     
                 





                 </View>
             </View>
           </Modal> 

         
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

    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',

    },
    dialogContainer: {
        width: '90%',
        backgroundColor: 'white',
        padding: 20,
        marginStart: 10,
        marginEnd: 10,
        borderRadius: 10,

    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    input: {
        width: '100%',
        height: 80,
        backgroundColor: Colors.gray,
        borderRadius: 8,
        marginBottom: 10,
        padding: 10,
        marginTop: 10,
        color: Colors.textcolor



    },
    item: {
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
        height:40,
        width:100,
        
      },




})



export default TempJob