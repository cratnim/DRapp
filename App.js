import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, style, captureButton, AsyncStorage, ScrollView, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons, Foundation, MaterialCommunityIcons, Octicons, AntDesign } from '@expo/vector-icons';
import Photo from './Photo.js'
import Form from './Form.js'
import * as FileSystem from 'expo-file-system';
import ShowResult from './ShowResult'
import Upload from './Upload.js'
import { Button, SearchBar } from 'react-native-elements';
import Dr from './drPage.js'
import Constants from 'expo-constants';
import ModalDropdown from 'react-native-modal-dropdown';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import DropdownMenu from 'react-native-dropdown-menu';
import isIPhoneX from 'react-native-is-iphonex';

const PHOTOS_DIR = FileSystem.documentDirectory + 'photos';

export default class Upcoming extends Component {
    constructor(props) {
        super(props);



    }

    state = {

        goUpload: true,
        goHistory: false,
        allData: [],
        checkNew: true,
        checkOld: true,
        goForm: false,
        photos: [],
        allkey: [],
        goNext: false,
        search: '',
        goShow: false,
        allsearch: [],
        goSearch: false,
        dr: ['ALL SEVERITY'],
    }

    dr = [
        {
            name: 'Severity',
            id: 'Severity',
            problem: [
                { name: 'ALL SEVERITY', id: 'ALL SEVERITY', },
                { name: 'MILD', id: 'MILD', },
                { name: 'MODERATE', id: 'MODERATE', },
                { name: 'SEVERE', id: 'SEVERE', },
                { name: 'PDR', id: 'PDR', },
            ],
        }
    ]

    backFromResult = () => {
        this.setState({
           
            allData: [],
            checkNew: true,
            goForm: false,
            photos: [],
            allkey: [],
            goNext: false,
            search: '',
            goShow: false,
            allsearch: [],
            goSearch: false,
            dr: ['ALL SEVERITY'],

        });
        this.fetchKey()
    }

    componentDidMount = async () => {
        this.fetchKey()
    };



    async clearAll() {
        const photos = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
        photos.map(this.deleteAllPhoto)
        AsyncStorage.clear();
    }

    deleteAllPhoto = async (fileName) => {
        await FileSystem.deleteAsync(`${PHOTOS_DIR}/${fileName}`)
    }

    renderNoData = () =>
        <View style={styles.noData}>
            <Text style={styles.noDataText}>- ไม่มีข้อมูล -</Text>
        </View>

    renderNewPhoto = (key) =>
        
        <Photo
            key={key}
            uri={key}
            values={this.props.values}
            setNext={this.setNext}
        >

        </Photo>

    renderOldPhoto = (key) =>
        <Dr
            key={key}
            uri={key}
            values={this.props.values}
            setNext={this.setShow}


        >
        </Dr>


    fetchKey = async () => {
        const allid = [];
        await AsyncStorage.getAllKeys(async (err, keys) => {
            await AsyncStorage.multiGet(keys, async (err, stores) => {
                stores.map(async (result, i, store) => {
                    // get at each store's key/value so you can work with it
                    let key = store[i][0];
                    console.log(key) 
                    if (key.length == 13) {
                        allid.push(key);
                    }
                });
            });
            allid.sort().reverse();
            this.setState({ allkey: allid });
            this.fetchUri()
            // console.log('allkey in Home    ' + this.state.allkey)
        });

    }

    fetchUri = async () => {

        for (let i = 0; i < this.state.allkey.length; i = i + 1) {
            let item = await AsyncStorage.getItem(this.state.allkey[i])
            let items = JSON.parse(item);
            // console.log(items)
            if (items.upload == false) {
                this.setState({ checkNew: false })
                break;
            }
           
        }

        for (let i = 0; i < this.state.allkey.length; i = i + 1) {
            let item = await AsyncStorage.getItem(this.state.allkey[i])
            let items = JSON.parse(item);
            // console.log(items)
           
            if (items.upload == true) {
                this.setState({ checkOld: false })
                break;
            }

        }




    }


    setNext = (e) => {
        this.setState({ goNext: true, allData: e })
    }

    setShow = (e) => {
        this.setState({ goShow: true, allData: e })
    }


    searching = async (keyword) => {
        const allmatch = [];
        let i = 0
        // console.log('searching')
        while (i < this.state.allkey.length) {
            let item = await AsyncStorage.getItem(this.state.allkey[i]);
            let data = JSON.parse(item);
            // console.log(data)

            if (keyword == '') {
                // console.log('match')
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



    renderMenu() {
        return (
            <View style={styles.menu}>
                <TouchableOpacity style={{ flex: 0.5, padding: 13, alignItems: 'center', borderBottomWidth: this.state.goUpload ? 3 : 0, borderBottomColor: 'orange' }} onPress={() => this.setState({ goUpload: true, goHistory: false, })}>
                    <Text style={[styles.textmenu, { color: this.state.goUpload ? 'orange' : 'black' }, {fontWeight: this.state.goUpload ? 'bold' : 'normal'}]}>UPLOAD LIST</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ flex: 0.5, padding: 13, alignItems: 'center', borderBottomWidth: this.state.goHistory ? 3 : 0, borderBottomColor: 'orange' }} onPress={() => this.setState({ goUpload: false, goHistory: true, })}>
                    <Text style={[styles.textmenu, { color: this.state.goHistory ? 'orange' : 'black' }, {fontWeight: this.state.goUpload ? 'normal' : 'bold'}]}>HISTORY</Text>
                </TouchableOpacity>


            </View>
        );
    }



    render() {
        const { search } = this.state;

        // this.clearAll()  

        if (this.state.goNext) {
            return (
                <Upload allData={this.state.allData} onPress={this.backFromResult.bind(this)}></Upload>
            )
        }

        if (this.state.goShow) {
            return (
                <ShowResult allData={this.state.allData} onPress={this.backFromResult.bind(this)}></ShowResult>
            )
        }

        if (this.state.goForm) {
            return (
                <Form onPress={this.backFromResult.bind(this)}></Form>
            )
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (this.state.goUpload) {
            return (
                <View style={styles.container}>

                    <View style={styles.topBar}>

                        <Text style={styles.textTopbar}>DeepEye</Text>

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


                    {this.renderMenu()}



                    <View style={{ flex: 1, backgroundColor: '#F5F7F4' }}>

                        {search == '' ?
                            <ScrollView style={{paddingTop: 10}}>
                                {this.state.allkey.length > 0 ? this.state.allkey.map(this.renderNewPhoto) : console.log('eiei')}
                                {this.state.checkNew ? this.renderNoData() : console.log('eiei')}
                                
                            </ScrollView>
                            :
                            <ScrollView style={{paddingTop: 10}}>
                                {this.state.allsearch.length == 0 ? this.renderNoData() : this.state.allsearch.map(this.renderNewPhoto)}
                            </ScrollView>
                        }
                    </View>
                </View>
            )

        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        else {
            return (
                <View style={styles.container}>
                    <View style={styles.topBar}>

                        <Text style={styles.textTopbar}>DeepEye</Text>

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

                    {this.renderMenu()}



                    <View style={{ flex: 1, backgroundColor: '#F5F7F4'}}>
                        {search == '' ?
                            <ScrollView style={{paddingTop: 10}}>
                                {this.state.allkey.length > 0 ? this.state.allkey.map(this.renderOldPhoto) : console.log('eiei')}
                                {this.state.checkOld ? this.renderNoData() : console.log('eiei')}
                            </ScrollView>
                            :
                            <ScrollView style={{paddingTop: 10}}>
                                {this.state.allsearch.length == 0 ? this.renderNoData() : this.state.allsearch.map(this.renderOldPhoto)}
                            </ScrollView>
                        }

                    </View>
                </View>
            )
        }
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

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
    header: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold'
    },
    showImage: {
        flex: 1,

    },
    preview: {
        // flex: 0.7,

        height: Dimensions.get('window').height * 0.64,
        width: Dimensions.get('window').width,
    },
    back: {
        // width: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    normalText: {
        fontSize: 16,
        color: 'black',
        // fontWeight: 'bold'
    },
    newoff: {
        color: 'white'
    },
    newon: {
        color: 'orange'
    },
    topBar: {
        flex: 0.11,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: Constants.statusBarHeight,
        borderBottomColor: 'black',
        borderBottomWidth: 0.5,
        paddingBottom: 10,
        paddingRight:20
    },
    textTopbar: {
        marginTop: 10,
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    underscrollTopbar: {
        // backgroundColor: '#f2f2f2',
        marginHorizontal: 20,
        borderColor: 'orange',
        // borderWidth: 0.55,
        // borderRadius: 10,
        // height: isIPhoneX ? 70 : 50,
        justifyContent: 'center',
    },
    menu: {
        flex: 0.11,
        backgroundColor: 'transparent',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        // paddingBottom: 3,
        borderBottomColor: 'grey',
        borderBottomWidth: 0.5,
        // marginBottom: 10,
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
        marginLeft: 25,
        marginRight: 5
    }
});
