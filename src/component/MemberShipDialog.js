import React from 'react';
import { View, Text, Image, Modal, TouchableOpacity } from 'react-native';
import Colors from '../Utils/Color';

const CommentDialog = ({ isVisible, onClose, onButtonPress }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 8, width: '80%' }}>
          <Image source={require('../../assets/images/premium.png')} style={{ width: 100, height: 100, marginBottom: 10,alignSelf:'center' }} />
          <Text style={{ fontSize: 14, marginBottom: 10,textAlign:'center',marginTop:10 }}>Purchase Membership Plan to take advantage of this feature</Text>
          <TouchableOpacity onPress={onButtonPress} style={{ backgroundColor: Colors.orange, padding: 10, borderRadius: 5, alignItems: 'center' }}>
            <Text style={{ color: 'white',backgroundColor:Colors.orange }}>Buy Now</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 10 }}>
            <Text style={{ color: Colors.textcolor, textAlign: 'center' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CommentDialog;