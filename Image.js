import { Modal } from 'react-native';
import { Alert, Image, StyleSheet, View, TouchableOpacity, Text, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { Ionicons, MaterialIcons, Entypo, FontAwesome } from '@expo/vector-icons';
import React from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';
import moment from 'moment';
import isIPhoneX from 'react-native-is-iphonex';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        img = [];
    }



    back = () => {
        this.props.onPress();
    }

    _renderHeader(index) {
        return (
            <View style={[styles.headerContainer, {backgroundColor: img[index].props.headers == 'NORMAL' ? 'green' : 'red'}]}>
                <Text style={styles.header}>{img[index].props.headers}</Text>
            </View>
        );
    }



    render() {
        const { images, result } = this.props;
        var i;

        img.push({
            url: images,
            props: {
                headers:
                    `${result}`,

            }
        })


        return (
            <View style={styles.container}>
                <Modal visible={true} transparent={true}>
                    <ImageViewer imageUrls={img} renderHeader={(currentIndex) => this._renderHeader(currentIndex)}
                    >
                    </ImageViewer>
                    <TouchableOpacity style={styles.backBtn} onPress={this.back} >
                        <MaterialIcons name="arrow-back" size={35} color="white" />
                    </TouchableOpacity>

                </Modal>
            </View>


        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flexDirection: 'column',
        flex: 1,
    },
    header: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        elevation: 1,
        fontWeight: 'bold',
    },
    backBtn: {
        position: 'absolute',
        // bottom: 0,
        // right: 0,
        left: 20,
        top: isIPhoneX ? 40 : 30,
    },
    headerContainer: {
        zIndex: 999,
        position: 'absolute',
        // left: Dimensions.get('window').width / 3,
        top: isIPhoneX ? 80 : 70,
        width: Dimensions.get('window').width ,
        height: 50,
        justifyContent: 'center',
    },
});