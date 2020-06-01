import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons';



import Result from './Result.js'

var FormData = require('form-data');



export default class Fakeloading extends Component {

  constructor(props) {
    super(props);
    aiID = {};
  }

  state = {
    loading: true,
    allData: this.props.allData,
    User: this.props.User,
    response: {},
    // aiID: {}
  }

  uploadImage = async (uri, id, eye) => {
    console.log('uploadImage')
   
    const apiURL = 'https://api.cils.space/dramd/v1/predict?apikey=4lcDEOJzjPqQ1kaAQo1KNKRiCi1I0wFM'

    const form = new FormData();

    form.append('image', {
      uri: uri,
      type: 'image/jpg',
      name: this.state.allData.idkey + '.jpg',
    });

    form.append('patient_id', id);
    form.append('eye', eye);

    // upload image to api
    fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: form
    })
      .then(response => response.json())
      .then((responseJson) => {
        console.log('Upload success');
        aiID = responseJson;
        console.log('responseJson.result')
        console.log(responseJson.result)
        const x = responseJson.result
        this.timerId = setInterval(() => this.checkAiResult(x.id), 5000);
      })
      .catch(error => console.log(error))
  }

  checkAiResult = (id) => {
    console.log('checkAiResult')
    // console.log(this.state.aiID.result.id)
    const apiURL = 'https://api.cils.space/dramd/v1/result/' + id + '?apikey=4lcDEOJzjPqQ1kaAQo1KNKRiCi1I0wFM'

    fetch(apiURL, {
      method: "GET",
    })
      .then(response => response.json())
      .then((responseJson) => {
        console.log('result')
        console.log(responseJson)
        const x = responseJson.result
        if (x.status == 'done') {
          clearInterval(this.timerId);
          this.setState({ response: responseJson, loading: false})
        }
        
      })
      .catch(error => console.log(error))
  }

  setloading = () => {
    this.setState({ loading: false })
  }

  async componentDidMount() {
    // upload img to api
    await this.uploadImage(this.state.allData.uri, this.state.allData.id, this.state.allData.eye)

    // if (aiID.result !== undefined) {
    //   const x = aiID.result
    //   this.timerId = setInterval(() => this.checkAiResult(x.id), 5000);
    // }
  }

  render() {
    console.log('this.state.response')
    console.log(this.state.response)


    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="white" margin={20} />
          <Text style={styles.loading}> Uploading... </Text>
        </View>
      )
    } else {
      return (
        // <View></View>
        <Result result={this.state.response.result} allData={this.state.allData}></Result>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    top: Dimensions.get('window').height * 0.25,
    left: Dimensions.get('window').width * 0.1,
    height: Dimensions.get('window').height * 0.5,
    width: Dimensions.get('window').width * 0.8,
    borderRadius: 5,
  },
  textComplete: {
    color: '#2699FB',
    fontSize: 16,
  },
  okButton: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 24,
    backgroundColor: '#2699FB',
    borderRadius: 5,
    width: 144,
    height: 42,
  },
  okText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  loading: {
    color: 'white',
    fontSize: 20,
  }
});      