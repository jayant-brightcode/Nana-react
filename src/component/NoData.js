import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const EmptyState = ({  title, description }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/no_data.png')} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
  },
});

export default EmptyState;
