import React from 'react';
import { Alert, Image, StyleSheet, View, TouchableOpacity, Text, ScrollView, Dimensions, AsyncStorage } from 'react-native';
import { AntDesign, Ionicons, Entypo, FontAwesome } from '@expo/vector-icons';
import Upload from './Upload.js'
import { Button } from 'react-native-elements';
import Fake from './Fakeloading.js'


const detailSize = 130;


export default class Photo extends React.Component {

    constructor(props) {
        super(props);

    }

    state = {
        allData: this.props.allData,
        goResult:false,

    }

    back = e => {
        this.props.onPress();
    }


    render() {

        if(this.state.goResult)
        {
            return(
            <Fake allData ={this.state.allData}></Fake>
            )
        }
        return (
            <View style={styles.container}>

                <View style={styles.topBar} >
                    <TouchableOpacity style={styles.back} onPress={this.back} >
                        <Ionicons name="ios-arrow-back" size={30} color="black" />
                        <Text style={[styles.normalText, { marginLeft: 5 }]}>Back</Text>
                    </TouchableOpacity>
                    <View style={styles.h1}>
                        <Text style={styles.header}>PATIENT</Text>
                    </View>
                    <TouchableOpacity style={[styles.back, { width: 50 }]} >
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 0.47, }}>
                    <Image
                        source={{ uri: this.state.allData.uri.toString() }}
                        style={styles.preview}
                    />
                </View>


                <View style={styles.textDetail}>
                    <View style={styles.inTextDetail}>
                        <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Patient ID </Text>
                        <Text style={{ fontSize: 17 }}>{this.state.allData.id} </Text>
                    </View>
                    <View style={styles.inTextDetail}>
                        <Text style={{ fontSize: 17, fontWeight: 'bold' }} >EYE SIDE </Text>
                        <Text style={{ fontSize: 17 }}>{this.state.allData.eye} </Text>
                    </View>
                </View>

                <View style={styles.button}>
                    <Button
                        title="UPLOAD"
                        buttonStyle={{height:55,marginTop:30,backgroundColor:'#B6452C'}}
                        onPress={() =>{this.setState({goResult:true})}}
                        // titleStyle={{color: 'w'}}
                    />

                </View>





            </View>

        )


    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        backgroundColor: '#F4F4F5',
        flexDirection: 'column',
        flex: 1,
    },
    button: {
        flex: 0.2,
        marginHorizontal: 10,
    },
    textDetail: {
        flex: 0.19,
    },
    inTextDetail: {
        marginHorizontal: 15,
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingBottom: 20,
        marginTop: 20,
        borderColor: 'black',
        borderBottomWidth: 1,
    },
    preview: {
        // flex: 0.7,

        height: Dimensions.get('window').height * 0.46,
        width: Dimensions.get('window').width,
    },
    topBar: {
        flex: 0.13,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginTop: 20,
        borderBottomColor: 'black',
        borderBottomWidth: 0.5,
        //   paddingBottom: 10,
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