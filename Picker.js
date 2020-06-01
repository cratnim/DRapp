import * as React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, style, captureButton, AsyncStorage, ScrollView, Dimensions } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import Appa from './App.js';
import * as FileSystem from 'expo-file-system';

export default class Picker extends React.Component {

  constructor(props) {
    super(props);
    temp = Date.now().toString();
    path = '';
  }

  state = {
    image: null,
    goSave: false,
    goHome: false,
  };

  async componentDidMount() {
    this.getPermissionAsync();

    FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'photos').catch(e => {
      console.log(e, 'Directory exists');
    });
  }

  savePhoto = async () => {
    await FileSystem.copyAsync({
      from: this.state.image,
      to: `${FileSystem.documentDirectory}photos/${temp}.jpg`
    });


    path = `${FileSystem.documentDirectory}photos/${temp}.jpg`;
    this.saveData()


  }


  saveData = async () => {
    try {
      let x = {
        uri: path,
        eye: this.props.values.eye,
        id: this.props.values.id,
        idkey: temp,
        upload: false,
      }
      await AsyncStorage.setItem(temp, JSON.stringify(x))
      this.setState({ goHome: true })
    }

    catch (error) {
      console.log(error)
    }

  }

  render() {



    if (this.state.goHome) {

      return (

        <Appa values={this.props.values}></Appa>
      )

    }

    if (this.state.goSave) {
      this.savePhoto()
    }


    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.back} onPress={this.props.onPress} >
            <Ionicons name="ios-arrow-back" size={30} color="black" />
            <Text style={[styles.normalText, { marginLeft: 5 }]}>Back</Text>
          </TouchableOpacity>
          <View style={styles.h1}>
            <Text style={styles.header}>ADD IMAGE</Text>
          </View>
          <TouchableOpacity style={[styles.back, { width: 50 }]} >
          </TouchableOpacity>
        </View>

        <View style={styles.pickArea}>
          <TouchableOpacity onPress={this._snapImage} style={styles.pickButton} activeOpacity={0.5}>
            <FontAwesome name="camera" size={30}></FontAwesome>
            <Text style={styles.pickText}>Take fundus image{'\n'}from portable fundus camera</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._pickImage} style={styles.pickButton} activeOpacity={0.5}>
            <MaterialIcons name="photo-library" size={35}></MaterialIcons>
            <Text style={styles.pickText}>Choose fundus image{'\n'}from camera roll</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Button
            title="Choose fundus image from camera roll"
            onPress={this._pickImage}
          />
          {this.state.image &&
            <Image source={{ uri: this.state.image }} style={{ width: 200, height: 200 }} />}

        </View>


        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Button
            title="Take fundus image from portable fundus camera"
            onPress={this._snapImage}
          />
          {this.state.image &&
            <Image source={{ uri: this.state.image }} style={{ width: 200, height: 200 }} />}
        </View> */}
      </View>
    );
  }


  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }

    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
      }
    }
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [16, 9],
      quality: 1
    });

    // console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri, goSave: true });
    }
  };

  _snapImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [16, 9],
      quality: 1
    });

    // console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri, goSave: true });
    }
  };



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  normalText: {
    fontSize: 16,
    color: 'black',
    // fontWeight: 'bold'
  },
  searchBar: {
    backgroundColor: '#F5F7F4',
  },
  searchBaroff: {
    backgroundColor: 'transparent',
  },
  searchBar2: {
    backgroundColor: '#e4e5e7',
  },
  showImage: {
    flex: 1,
  },
  preview: {
    height: Dimensions.get('window').height * 0.64,
    width: Dimensions.get('window').width,
  },
  newoff: {
    color: 'white'
  },
  newon: {
    color: 'orange'
  },
  topBar: {
    flex: 0.18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: Constants.statusBarHeight,
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
    paddingBottom: 10,
  },
  textTopbar: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  back: {
    // width: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginHorizontal: 15,
  },
  underscrollTopbar: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    flex: 0.02,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'flex-end',
    fontWeight: 'bold',
  },
  menu: {
    flex: 0.1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 2,

  },
  textmenu: {
    marginTop: 10,
    fontSize: 17,

  },
  underscrollmenu: {
    flex: 0.02,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  showPhoto: {

  },
  noDataText: {
    fontSize: 18,
    // fontWeight : 'bold',
    alignItems: 'center'
  },
  noData: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  pickArea: {
    flex: 1.5,
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
  },
  pickButton: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    borderColor: '#B6452C',
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 15,
    margin: 20,
    elevation: 2,
    backgroundColor: 'white',
  },
  pickText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingLeft: 20
  },
  header: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold'
  },
});
