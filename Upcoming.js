import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, style, captureButton, AsyncStorage, ScrollView, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons, Foundation, MaterialCommunityIcons, Octicons, AntDesign } from '@expo/vector-icons';
import Photo from './Photo.js'
import Form from './Form.js'
import * as FileSystem from 'expo-file-system';
import Upload from './Upload.js'
import { Button, SearchBar } from 'react-native-elements';
import Dr from './drPage.js'
import Constants from 'expo-constants';


const PHOTOS_DIR = FileSystem.documentDirectory + 'photos';

export default class Upcoming extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        goForm: false,
        photos: [],
        allkey: [],
        goNext: false,
        search: '',
        allsearch: [],
        goSearch: false,

    }

    backFromResult = () => {
        this.setState({
            goForm: false,
            photos: [],
            allkey: [],
            goNext: false,
            search: '',
            allsearch: [],
            goSearch: false,

        });
        this.fetchData()
    }

    componentDidMount = async () => {
        this.fetchData()
    };

    fetchData = async () => {
        const allid = [];
        await AsyncStorage.getAllKeys(async (err, keys) => {
            await AsyncStorage.multiGet(keys, async (err, stores) => {
                stores.map(async (result, i, store) => {
                    // get at each store's key/value so you can work with it
                    let key = store[i][0];

                    if (key.length == 13) {
                        allid.push(key);
                    }
                });
            });

            this.setState({ allkey: allid });
            console.log('allkey in Home    ' + this.state.allkey)
        });
    }

    back = () => {
        this.props.onPressToHome()
    }

    async clearAll() {
        const photos = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
        photos.map(this.deleteAllPhoto)
        AsyncStorage.clear();
    }

    deleteAllPhoto = async (fileName) => {
        await FileSystem.deleteAsync(`${PHOTOS_DIR}/${fileName}`)
    }

    renderNewPhoto = (key) =>
        <Photo
            key={key}
            uri={key}
            values={this.props.values}
            setNext={this.setNext}
            upcoming={true}
        >
        </Photo>

    setNext = (e) => {
        this.setState({ goNext: true, allData: e })
    }

    searching = async (keyword) => {
        const allmatch = [];
        let i = 0
        console.log('searching')
        while (i < this.state.allkey.length) {
            let item = await AsyncStorage.getItem(this.state.allkey[i]);
            let data = JSON.parse(item);
            // console.log(data)

            if (keyword == '') {
                console.log('match')
                allmatch.push(this.state.allkey[i]);
            } else {
                // search by id
                if (data.id.includes(keyword)) {
                    allmatch.push(this.state.allkey[i]);
                }
            }

            i = i + 1
        }
        this.setState({ allsearch: allmatch });
        // console.log(this.state.upId)
    }

    updateSearch = search => {
        // console.log(search)
        this.setState({ search });
        this.searching(search)
    };

    renderNoData = () =>
        <View style={styles.noData}>
            <Text style={styles.noDataText}>- ไม่มีข้อมูล -</Text>
        </View>

    render() {
        const { search } = this.state;


        // this.clearAll()  

        if (this.state.goNext) {
            return (
                <Upload allData={this.state.allData} onPress={this.backFromResult.bind(this)}></Upload>
            )
        }

        if (this.state.goForm) {
            return (
                <Form onPress={this.backFromResult.bind(this)}></Form>
            )
        }


        return (
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <TouchableOpacity style={styles.backBtn} onPress={this.back} >
                        <Ionicons name="ios-arrow-back" size={30} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.textTopbar}>UPLOAD LIST</Text>

                    <TouchableOpacity style={styles.textTopbar} >
                        <Text ></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.textTopbar} >
                        <Text ></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.textTopbar} >
                        <Text ></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.textTopbar} >
                        <Text ></Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.textTopbar} onPress={() => { this.setState({ goForm: true }) }}>
                        <AntDesign name="pluscircleo" size={25} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.textTopbar} onPress={() => { this.setState({ goSearch: !this.state.goSearch }) }}>
                        <AntDesign name="search1" size={25} />
                    </TouchableOpacity>
                </View>

                {this.state.goSearch ?
                    <SearchBar
                        lightTheme={true}
                        placeholder="Search by Patient ID"
                        onChangeText={this.updateSearch}
                        value={search}
                        containerStyle={styles.searchBar}
                        inputContainerStyle={styles.searchBar2}
                    />
                    : null}

                <View style={{ flex: 1 }}>
                    {search == '' ?
                        <ScrollView>
                            {this.state.allkey.length > 0 ? this.state.allkey.map(this.renderNewPhoto) : this.renderNoData()}
                        </ScrollView>
                        :
                        <ScrollView>
                            {this.state.allsearch.length == 0 ? this.renderNoData() : this.state.allsearch.map(this.renderNewPhoto)}
                        </ScrollView>
                    }
                </View>
            </View>
        )


    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    scroll:{
        // backgroundColor: 'red',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
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
        // flex: 0.7,
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
        flex: 0.1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        // paddingBottom: 10,
        borderBottomWidth: 1,
        marginTop: Constants.statusBarHeight + 10,
    },
    textTopbar: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 20,
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
        paddingBottom: 5,
        borderBottomColor: 'grey',
        borderBottomWidth: 0.5,

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
    backBtn: {
        marginLeft: 20
    }
});
