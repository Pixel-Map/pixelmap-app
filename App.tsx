import React, {useState} from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Linking, Keyboard, ActivityIndicator, FlatList
} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import TilePicture from "./components/TilePicture";

const background = require('./resources/background.png')
const logo = require('./resources/logo.png')
const tileData = require('./resources/test-data.json');

export default class App extends React.Component {

  state = {
    tilePictureMap: new Map(),
    loading: true,
    inSequenceOrder: true,
    textInput: ''
  }

  myRef = React.createRef()

  componentDidMount(): void {
    this.loadPixelMap()
  }

  loadPixelMap = async () => {
    let url = 'https://api.pixelmap.io/tiledata'
    fetch(url,
        {method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Content-Encoding':'gzip'
          }})
        .then((response) => response.json())
        .then(async (tileData) => {
          let tilePictureMap = new Map()

          await tileData.forEach((tile) => {
            if (tile.image.length == 768) {
              tilePictureMap.set(tile.id, tile)
            }
          })

          this.setState({tilePictureMap: tilePictureMap})
          setTimeout(() => this.setState({loading: false}), 2000)
        })
        .catch(async (err) => {
          alert(err)
          //Test Data
          /*let tilePictureMap = new Map()

            await tileData.forEach((tile) => {
              if (tile.image.length == 768) {
                tilePictureMap.set(tile.id, tile)
              }
            })

            this.setState({tilePictureMap: tilePictureMap})
            setTimeout(() => this.setState({loading: false}), 2000)*/
        })

  }

  getItemLayout = (data, index) => (

    { length: 500, offset: 298 * index, index }
  )

  render() {
    let tilePictureMap = this.state.tilePictureMap.size == 0 ? new Map() : this.state.tilePictureMap
    let platform = (Platform.OS === 'android') ? 'android' : 'ios'
    let {textInput, loading, inSequenceOrder} = this.state
    const tileData = inSequenceOrder ? Array.from(tilePictureMap.values()) : shuffle(Array.from(tilePictureMap.values()))

    const renderItem = ({item}) => {
      return (
        <TilePicture key={item.id} id={item.id} url={item.url} image={item.image} owner={item.owner}/>
      );
    };

    return (
      <SafeAreaProvider>
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.container}>
            {platform == 'ios' &&
            <ImageBackground source={background} style={{position: 'absolute', width: '100%', height: '120%'}}>
            </ImageBackground>}
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginTop:5}}>
              <View style={{width:'30%', alignItems:'center'}}>
                <TouchableHighlight activeOpacity={0.2} onPress={() => Linking.openURL("https://www.pixelmap.io")}>
                  <Image source={logo} style={{width:50, height:50, borderRadius: 10}}/>
                </TouchableHighlight>
              </View>
              <View style={{width:'30%', alignItems:'center'}}>
                <TouchableHighlight activeOpacity={0.2} onPress={() => Linking.openURL("https://www.pixelmap.io")}>
                  <Text style={{color:'white', fontSize:20, fontWeight:'bold'}}>{"Pixel Map"}</Text>
                </TouchableHighlight>
              </View>
              <View style={{width:'30%', alignItems:'center'}}>
                <TouchableHighlight activeOpacity={0.2} onPress={() => Linking.openURL("https://twitter.com/PixelMapNFT")}>
                  <Text style={{color:'white', fontSize:20, fontWeight:'bold'}}>{"Twitter"}</Text>
                </TouchableHighlight>
              </View>

            </View>
            <View style={styles.search}>
              <Text style={styles.searchText}>{"Enter a tile number:"}</Text>
              <TextInput style={styles.searchInput} keyboardType={'numeric'} placeholder={'0'} value={textInput}
                         onChangeText={(number) => {this.setState({textInput: number})}}></TextInput>
              <TouchableHighlight style={styles.searchButton} activeOpacity={0.2} onPress={() => {
                Keyboard.dismiss()
                this.myRef.scrollToIndex({index: tileData.findIndex((tile) => tile.id == parseInt(textInput))})
              }}>
                <Text style={styles.buttonText}>{"GO"}</Text>
              </TouchableHighlight>
            </View>
            <View style={styles.buttons}>
              <TouchableHighlight style={styles.simpleButton} activeOpacity={0.2} onPress={() => {
                this.setState({newestOrder: false, randomOrder: false, inSequenceOrder: true, loading: true},
                  () => this.setState({loading: false}))
              }}>
                <Text style={styles.buttonText}>{"In sequence"}</Text>
              </TouchableHighlight>
              <TouchableHighlight style={styles.simpleButton} activeOpacity={0.2} onPress={() => {
                this.setState({newestOrder: false, randomOrder: true, inSequenceOrder: false, loading: true},
                  () => this.setState({loading: false}))
              }}>
                <Text style={styles.buttonText}>{"Random"}</Text>
              </TouchableHighlight>
            </View>
            <ActivityIndicator size={'large'} animating={loading} color={'white'} style={{marginTop:140}}/>
            <FlatList style={{marginTop: -140}} ref={(ref) => { this.myRef = ref; }}
              data={tileData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              getItemLayout={this.getItemLayout}
              initialNumToRender={50}
              maxToRenderPerBatch={50}
              updateCellsBatchingPeriod={50}
              stickySectionHeadersEnabled={false}
            />

          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  search: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'space-evenly'
  },
  searchText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  searchInput: {
    paddingLeft:'2%',
    width: '20%',
    height: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingTop: 0,
    paddingBottom: 0
  },
  searchButton: {
    borderRadius: 20,
    backgroundColor: '#fff',
    height: 30,
    padding:2,
    width:'10%',
    alignItems:'center',
    justifyContent:'center'
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 20,
    justifyContent: 'space-evenly'
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold'
  },
  simpleButton: {
    borderRadius: 20,
    backgroundColor: '#fff',
    height: 30,
    width:'30%',
    padding:2,
    alignItems:'center',
    justifyContent:'center'
  }
});


function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
