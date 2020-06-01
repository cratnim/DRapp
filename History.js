import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, style, captureButton, AsyncStorage, ScrollView, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons, Foundation, MaterialCommunityIcons, Octicons, AntDesign } from '@expo/vector-icons';
import Photo from './Photo.js'
import Form from './Form.js'
import * as FileSystem from 'expo-file-system';
import ShowResult from './ShowResult'
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
    goAmd: false,
    goDr: true,
    goNormal: false,
    goOthers: false,
    goForm: false,
    photos: [],
    allkey: [],
    goNext: false,
    search: '',
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
      dr: '',
      goForm: false,
      photos: [],
      allkey: [],
      goNext: false,
      search: '',
      allsearch: [],
      goSearch: false,

    });
    this.fetchKey()
  }

  componentDidMount = async () => {
    this.fetchKey()
  };

  back = () => {
    this.props.onPressToHome()
    // console.log('back to menu')
  }

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
      history={true}>

    </Photo>

  renderOldPhoto = (key) =>
    <Dr
      key={key}
      uri={key}
      values={this.props.values}
      setNext={this.setNext}
      resultDr={this.state.goDr}
      resultAmd={this.state.goAmd}
      resultNormal={this.state.goNormal}
      resultOthers={this.state.goOthers}
    >
    </Dr>


  fetchKey = async () => {
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



  renderMenu() {
    return (
      <View style={styles.menu}>
        <TouchableOpacity style={{ padding: 13, alignItems: 'center', borderBottomWidth: this.state.goDr ? 3 : 0, borderBottomColor: 'orange' }} onPress={() => this.setState({ goAmd: false, goDr: true, goNormal: false, goOthers: false, })}>
          <Text style={[styles.textmenu, { color: this.state.goDr ? 'orange' : 'black' }]}>DR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ padding: 13, alignItems: 'center', borderBottomWidth: this.state.goAmd ? 3 : 0, borderBottomColor: 'orange' }} onPress={() => this.setState({ goAmd: true, goDr: false, goNormal: false, goOthers: false, })}>
          <Text style={[styles.textmenu, { color: this.state.goAmd ? 'orange' : 'black' }]}>AMD</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ padding: 13, alignItems: 'center', borderBottomWidth: this.state.goNormal ? 3 : 0, borderBottomColor: 'orange' }} onPress={() => this.setState({ goAmd: false, goDr: false, goNormal: true, goOthers: false, })}>
          <Text style={[styles.textmenu, { color: this.state.goNormal ? 'orange' : 'black' }]}>Normal</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ padding: 13, alignItems: 'center', borderBottomWidth: this.state.goOthers ? 3 : 0, borderBottomColor: 'orange' }} onPress={() => this.setState({ goAmd: false, goDr: false, goNormal: false, goOthers: true, })}>
          <Text style={[styles.textmenu, { color: this.state.goOthers ? 'orange' : 'black' }]}>Others</Text>
        </TouchableOpacity>
      </View>
    );
  }



  render() {
    const { search } = this.state;

    // this.clearAll()  

    if (this.state.goNext) {
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
    if (this.state.goDr) {
      return (
        <View style={styles.container}>
          <View style={styles.topBar} >
            <TouchableOpacity style={styles.back} onPress={this.back} >
              <Ionicons name="ios-arrow-back" size={30} color="black" />
              <Text style={[styles.normalText, { marginLeft: 5 }]}>Back</Text>
            </TouchableOpacity>
            <View style={styles.h1}>
              <Text style={styles.header}>HISTORY</Text>
            </View>
            <TouchableOpacity style={[styles.back, { width: 50 }]} >
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


          <View style={styles.underscrollTopbar}>
            <SectionedMultiSelect
              items={this.dr}
              uniqueKey="id"
              selectText="Choose severity..."
              subKey="problem"
              showDropDowns={true}
              readOnlyHeadings={true}
              onSelectedItemsChange={(e) => { this.setState({ dr: e }) }}
              selectedItems={this.state.dr}
              expandDropDowns={true}
              searchPlaceholderText="Search"
              single={true}
              colors={{ subText: 'black' }}
              styles={{container : {
                backgroundColor: 'white',
              },
              selectToggle : {
                // backgroundColor: '#e2e2e2',
                backgroundColor: '#f2f2f2',
                paddingVertical: 10,
                paddingHorizontal: 5,
                marginBottom: 5,
              },
              selectToggleText: {
                fontWeight: 'bold'
              }
            }}
            />
          </View>

          <View style={{ flex: 1, }}>

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

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    else {
      return (
        <View style={styles.container}>
          <View style={styles.topBar} >
            <TouchableOpacity style={styles.back} onPress={this.back} >
              <Ionicons name="ios-arrow-back" size={30} color="black" />
              <Text style={[styles.normalText, { marginLeft: 5 }]}>Back</Text>
            </TouchableOpacity>
            <View style={styles.h1}>
              <Text style={styles.header}>HISTORY</Text>
            </View>
            <TouchableOpacity style={[styles.back, { width: 50 }]} >
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



          <View style={{ flex: 1, }}>
            {search == '' ?
              <ScrollView>
                {this.state.allkey.length > 0 ? this.state.allkey.map(this.renderOldPhoto) : this.renderNoData()}
              </ScrollView>
              :
              <ScrollView>
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
  },
  textTopbar: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 20,
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
    marginBottom: 10,
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
