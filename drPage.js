import React from 'react';
import { Alert, Image, StyleSheet, View, TouchableOpacity, Text, ScrollView, Dimensions, AsyncStorage } from 'react-native';
import { Ionicons, Entypo, FontAwesome } from '@expo/vector-icons';



const detailSize = 130;


export default class Photo extends React.Component {

    constructor(props) {
        super(props);
        uri = this.props.uri
        status = '';
    }

    state = {
        uriPhoto: [],
        allData: [],
    }

    fetchUri = async () => {

        let item = await AsyncStorage.getItem(uri)
        let items = JSON.parse(item);

        if (items.drResult == 'NO DR' && items.amdResult == 'NO AMD' && items.otherResult == 'NEGATIVE') {
            status = 'NORMAL'
        } else {
            status = "ABNORMAL"
        }

        this.setState({ allData: items })
    }

    render() {

        if (this.state.allData.length == 0) {
            this.fetchUri()
        }

        if (this.state.allData.upload) {
            return (
                <TouchableOpacity
                    onPress={() => { this.props.setNext(this.state.allData) }}
                    style={styles.card}
                    activeOpacity={1}
                >
                     <Image
                            source={{ uri: this.state.allData.uri }}
                            style={styles.preview}
                            resizeMode="cover"
                        />
                    <Text style={styles.showtext}>PATIENT ID: {this.state.allData.id}</Text>
                    <Text style={styles.title}>EYE SIDE: {this.state.allData.eye}</Text>

                    <View style={[styles.status , { backgroundColor: (status == 'NORMAL') ? 'green' : 'red'}]}>
                        <Text style={styles.showtext2}>{status} </Text>
                    </View>
                </TouchableOpacity>
            )



        }



        else {
            return (

               null

            )

        }

    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 10,
        elevation: 2,
        margin: 5,
        marginBottom: 20,
        // padding: 5,
    },
    showtext: {
        marginTop: 10,
        marginHorizontal: 10,
        fontSize: 20,
        fontWeight: 'bold'
    },
    showtext2: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold'
    },
    title: {
        marginTop: 5,
        marginBottom: 10,
        marginHorizontal: 10,
        fontSize: 16,
    },
    preview: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: Dimensions.get('window').height * 0.46,
        width: Dimensions.get('window').width - 10,
    },
    status: {
        height: 60, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
});