import React from 'react';
import { Alert, Image, StyleSheet, View, TouchableOpacity, Text, ScrollView, Dimensions, AsyncStorage } from 'react-native';
import { AntDesign, Ionicons, Entypo, FontAwesome } from '@expo/vector-icons';
import Upload from './Upload.js'
import { Button } from 'react-native-elements';
import Fake from './Fakeloading.js'
import Appa from './App.js'
import ShowImage from './Image.js';


const detailSize = 130;


export default class Photo extends React.Component {

    constructor(props) {
        super(props);
        result = this.props.result.result.dr.class;
        amdResult = this.props.result.result.amd.class;
        otherResult = this.props.result.result.other.class;
        status = '';
        // result = 'NO DR';
        // amdResult = 'NO AMD';
        // otherResult = 'NEGATIVE';
    }

    state = {
        allData: this.props.allData,
        goSave: false,
        touch: false,
    }

    back = e => {
        this.props.onPress();
    }

    backFromResult = () => {
        this.setState({
            allData: this.props.allData,
            goSave: false,
            touch: false,
        });
    }

    saveResult = async () => {
        let x = {
            drResult: result,
            amdResult: amdResult,
            otherResult: otherResult,
            upload: true,
        }
        await AsyncStorage.mergeItem(this.state.allData.idkey, JSON.stringify(x))
        this.setState({ goSave: true })
    }


    render() {

        if (this.state.goSave) {
            return (
                <Appa></Appa>
            )
        }

        var resultColor = ''
        switch (result) {
            case 'NO DR': resultColor = 'green'; break;
            case 'MILD': resultColor = '#fbc243'; break;
            case 'MODERATE': resultColor = '#e49623'; break;
            case 'SEVERE': resultColor = '#f44336'; break;
            case 'PDR': resultColor = '#442211'; break;
            default: resultColor = 'black'; break;
        }

        var amdResultColor = ''
        switch (amdResult) {
            case 'WET': amdResultColor = '#f44336'; break;
            case 'DRY': amdResultColor = '#fbc243'; break;
            case 'NO AMD': amdResultColor = 'green'; break;
            default: amdResultColor = 'black'; break;
        }

        var otherResultColor = ''
        switch (otherResult) {
            case 'NEGATIVE': otherResultColor = 'green'; break;
            case 'POSITIVE': otherResultColor = '#f44336'; break;
            default: otherResultColor = 'black'; break;
        }

        if (result == 'NO DR' && amdResult == 'NO AMD' && otherResult == 'NEGATIVE') {
            status = 'NORMAL'
        } else {
            status = "ABNORMAL"
        }

        if (this.state.touch) {
            return (
                <ShowImage images={this.state.allData.uri} result={status} onPress={this.backFromResult.bind(this)}></ShowImage>
            );
        }

        return (
            <View style={styles.container}>

                <View style={styles.topBar} >
                    <TouchableOpacity style={styles.back} onPress={this.back} disabled={true}>
                        <Ionicons name="ios-arrow-back" size={30} color="transparent" />
                        <Text style={[styles.normalText, { color: 'transparent' }, { marginLeft: 5 }]}>ssss</Text>
                    </TouchableOpacity>
                    <View style={styles.h1}>
                        <Text style={styles.header}>RESULT</Text>
                    </View>
                    <TouchableOpacity style={[styles.back, { width: 50 }]} >
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <ScrollView>
                        <TouchableOpacity
                            style={{ flex: 0.47, }}
                            onPress={() => { this.setState({ touch: true }) }}
                            activeOpacity={1}
                        >
                            {/* <View style={{ flex: 0.47, }}> */}
                                <Image
                                    source={{ uri: this.state.allData.uri.toString() }}
                                    style={styles.preview}
                                />
                            {/* </View> */}
                        </TouchableOpacity>

                        <View style={[styles.status, { backgroundColor: (status == 'NORMAL') ? 'green' : 'red' }]}>
                            <Text style={styles.showtext2}>{status} </Text>
                        </View>

                        <View style={styles.textDetail}>
                            <View style={styles.inTextDetail}>

                                <Text style={{ fontSize: 17 }}>PATIENT ID </Text>


                                <Text style={{ fontSize: 17 }}>{this.state.allData.id} </Text>

                            </View>

                            <View style={styles.inTextDetail}>
                                <Text style={{ fontSize: 17 }} >EYE SIDE</Text>

                                <Text style={{ fontSize: 17 }}>{this.state.allData.eye} </Text>
                            </View>
                            <View style={styles.inText}>
                                <View style={styles.inTextDetail2}>

                                    <Text style={{ fontSize: 17 }} >DR </Text>
                                    <Text style={{ fontSize: 17, color: resultColor, fontWeight: 'bold' }}>{result} </Text>
                                </View>
                                <View style={styles.inTextDetail2}>

                                    <Text style={{ fontSize: 17 }} >AMD </Text>
                                    <Text style={{ fontSize: 17, color: amdResultColor, fontWeight: 'bold' }}>{amdResult} </Text>
                                </View>
                                <View style={styles.inTextDetail2}>

                                    <Text style={{ fontSize: 17 }} >OTHERS </Text>
                                    <Text style={{ fontSize: 17, color: otherResultColor, fontWeight: 'bold' }}>{otherResult} </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.button}>

                            <Button
                                title="BACK TO HOME"
                                buttonStyle={styles.nextBtn}
                                onPress={() => { this.saveResult(); this.setState({ goSave: true }) }}
                            />

                        </View>
                    </ScrollView>
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
        flex: 0.1,
        marginBottom: 50,
        marginHorizontal: 20,
        marginVertical: 10,
    },
    nextBtn: {
        backgroundColor: '#B6452C',
        borderColor: '#B6452C',
        // marginTop:  200,
        borderRadius: 5,
        height: 65,
        marginVertical: 20
    },
    textDetail: {
        flex: 0.19,

    },
    inText: {
        marginHorizontal: 15,
        // justifyContent: 'space-between',
        // flexDirection: 'row',
        // paddingBottom: 20,
        marginTop: 20,
        borderColor: 'black',
        borderBottomWidth: 1,
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
    inTextDetail2: {
        // marginHorizontal: 15,
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingBottom: 10,
        // marginTop: 20,
        // borderColor: 'black',
        // borderBottomWidth: 1,
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
    status: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        // borderBottomLeftRadius: 10,
        // borderBottomRightRadius: 10,
    },
    showtext2: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold'
    },
});