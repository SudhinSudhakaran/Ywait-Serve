import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {Colors, Images} from '../../constants';
const ImageFileComponent = props => {
  const [imageError, setImageError] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => props.imageFullscreenButtonAction(props.item)}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
      }}>
      {imageError ? (
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: Colors.PRIMARY_COLOR,
          }}
          source={Images.IMAGE_PLACEHOLDER}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <FastImage
          style={{
            width: 50,
            height: 50,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: Colors.PRIMARY_COLOR,
          }}
          source={{
            uri: props.item,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
          onError={() => setImageError(true)}
        />
      )}
    </TouchableOpacity>
  );
};

export default ImageFileComponent;

const styles = StyleSheet.create({});
