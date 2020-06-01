import React, { Component } from 'react';
import { StyleSheet, Text, View, Keyboard, TextInput, TouchableWithoutFeedback, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { Ionicons, MaterialIcons, Foundation, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import RadioForm from 'react-native-simple-radio-button';
import Picker from './Picker.js'
import Constants from 'expo-constants';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
    {children}
  </TouchableWithoutFeedback>
);

export default class Form extends Component {

  constructor(props) {
    super(props);
    checkID = true;
    checkEYE = true;
  }

  state = {
    id: '',
    eye: '',
    next: false,
  }

  backFromResult = () => {
    this.setState({
      // id: '',
      // eye: '',
      next: false,
    });
    checkID = true;
    checkEYE = true;
  }

  back = e => {
    e.preventDefault();
    this.props.onPress();
  }

  validate = () => {
    if (this.state.id == '') {
      checkID = false
    } else {
      checkID = true
    }

    if (this.state.eye == '') {
      checkEYE = false
    } else {
      checkEYE = true
    }

    var checkALL = checkID && checkEYE;
    if (checkALL) {
      this.setState({ next: true })
    } else {
      this.setState({ next: false })
    }
  }

  renderError = (type, text) => {
    if (!type) {
      return <Text style={styles.error}>{text}</Text>;
    }
    return null;
  }

  render() {

    if (this.state.next) {
      return(<Picker onPress={this.backFromResult.bind(this)} values ={this.state}></Picker>)
      

    } else {
      return (
        <DismissKeyboard>
          <View style={styles.container}>
            <View style={styles.topBar} >
              <TouchableOpacity style={styles.back} onPress={this.back} >
                <Ionicons name="ios-arrow-back" size={30} color="black" />
                <Text style={[styles.normalText, { marginLeft: 5 }]}>Back</Text>
              </TouchableOpacity>
              <View style={styles.h1}>
                <Text style={styles.header}>NEW PATIENT</Text>
              </View>
              <TouchableOpacity style={[styles.back, { width: 50 }]} >
              </TouchableOpacity>
            </View>

            <View style={styles.formBar}>
              <Text style={styles.subheader}>Patient ID</Text>
              <TextInput
                style={[styles.textinput]}
                placeholder='Patient ID'
                returnKeyType="next"
                maxLength={20}
                onChangeText={(e) => this.setState({ id: e })}
                value={this.state.id}
                autoCorrect={false}
              />
              {this.renderError(checkID, 'Please fill Patient ID')}


              <Text style={[styles.subheader, { marginTop: 40 }]}>EYE SIDE</Text>
              <RadioForm
                radio_props={[
                  { label: 'OS', value: "OS" },
                  { label: 'OD', value: "OD" },
                ]}
                initial={this.state.eye == 'OS' ? 0 : this.state.eye == 'OD' ? 1 : -1}
                formHorizontal={true}
                labelHorizontal={true}
                onPress={(e) => this.setState({ eye: e })}
                style={styles.form}
                buttonSize={15}
                labelStyle={{ fontSize: 16, marginLeft: 10, marginRight: 50 }}
                buttonColor={'#3d1c02'}
                selectedButtonColor={'#3d1c02'}
              // buttonStyle={{ marginHorizontal: 40 }}
              />
              {this.renderError(checkEYE, 'Please fill EYE')}

            </View>

            <View style={styles.buttomBar}>
              <Button
                title="NEXT"
                onPress={this.validate}
                buttonStyle={[styles.nextBtn]}
                type="solid"
                titleStyle={{ color: 'white' }}
              />
            </View>

          </View>
        </DismissKeyboard>
      );
    }
  }
}


const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    flexDirection: 'column',
    flex: 1,
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
  back: {
    // width: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold'
  },
  normalText: {
    fontSize: 16,
    color: 'black',
    // fontWeight: 'bold'
  },
  formBar: {
    flexDirection: 'column',
    marginHorizontal: 25,
    marginVertical: 40,
    justifyContent: 'flex-start',
    flex: 1
    // backgroundColor: 'white'
  },
  textinput: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 5,
    borderRadius: 5,
    height: 50,
    color: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#6a6e78',
  },
  subheader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    marginTop: 10,
  },
  form: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 20
    // paddingRight: 90,
    // paddingLeft: 10
  },
  nextBtn: {
    backgroundColor: '#B6452C',
    borderColor: '#B6452C',
    // marginTop:  200,
    borderRadius: 5,
    height: 50,
    marginVertical: 20
  },
  buttomBar: {
    marginHorizontal: 25,
    marginBottom: 50,
    justifyContent: 'center',

  },
  error: {
    fontSize: 14,
    color: 'red',
    marginTop: 10,
  },
});
