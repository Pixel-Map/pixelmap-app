import React, {Component} from "react";
import {
  Image,
  StyleSheet,
  Text,
  Modal,
  TouchableWithoutFeedback,
  View,
  TouchableHighlight,
  Linking
} from "react-native";

const border = require('../resources/border2.png')

export default class TilePicture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colorArray: [],
      showDetailModal: false,
    }
    this.id = props.id
    this.url = props.url
    this.image = props.image
    this.owner = props.owner

  }

  componentDidMount(): void {
    setTimeout(() => this.displayPixels(), 1000)
  }


  displayPixels(): void {
    let colorArray= []
    let tempArray = [];
    for (let i = 0; i < this.image.length; i += 3) {
      let color = '#' + this.image[i] + this.image[i + 1] + this.image[i + 2];
      tempArray.push(color)
      if (((i + 3) % 16 * 3) == 0 && i != 0) {
        colorArray.push(tempArray);
        tempArray = [];
      }
    }

    colorArray.push(tempArray);
    this.setState({colorArray: colorArray})
  }

  openEtherScanURL = () => {
    const url = 'https://etherscan.io/address/' + this.owner
    Linking.openURL(url)
  }

  openURL = () => {
    let url = this.url.trim()
    url = (url.substr(0,4) == 'http') ? url : 'https://' + url
    if (Linking.canOpenURL(url)) {
      Linking.openURL(url)
    } else {
      alert("Sorry, the link cannot be opened.")
    }
  }

  render() {

    let colorArray = this.state.colorArray
    let isReady = colorArray.length > 0
    let picture = []
    let pictureMini = []

    if (isReady) {


      for (let i = 0; i < 16; i++) {
        let row = []
        let rowMini = []

        for (let j = 0; j < 16; j++) {
          row.push(
            <View key={(i * 16 + j).toString()}
                  style={{
                    backgroundColor: colorArray.length > 0 ? colorArray[i][j] : '#fff',
                    width: 16,
                    height: 16
                  }}></View>
          )
          rowMini.push(
            <View key={(i * 16 + j).toString()}
                  style={{
                    backgroundColor: colorArray.length > 0 ? colorArray[i][j] : '#fff',
                    width: 6,
                    height: 6,
                  }}></View>
          )
        }
        picture.push(
          <View key={(i).toString()}
                style={{
                  flex: 1,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  justifyItems: 'space-around'
                }}>
            {row}
          </View>
        )
        pictureMini.push(
          <View key={(i).toString()}
                style={{
                  flex: 1,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  justifyItems: 'space-around'
                }}>
            {rowMini}
          </View>
        )
      }
    }


    return (
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.showDetailModal}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <View style={styles.infoOverlay}>
            <View style={{alignSelf: 'center'}}>
              <View style={styles.infoContent}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flexDirection: 'column', height: 96, margin: 20, width:'30%'}}>
                  {pictureMini}
                  </View>
                  <View style={{flexDirection: 'column', justifyContent:'flex-start', marginTop:20}}>
                    <Text style={styles.infoTitle}>{"PixelMap #"}{this.id}</Text>
                    <View style={{flexDirection: 'row', marginBottom: 20}}>
                      <Text style={styles.infoText}>{"Owner: "}</Text>
                      <TouchableHighlight onPress={() => this.openEtherScanURL()}>
                        <Text style={{
                          color: 'blue',
                          textDecorationLine: 'underline',
                        }}>{(this.owner).substr(0, 6) + "..." + (this.owner).substr(36, 6)}</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 20}}>
                  <TouchableHighlight onPress={() => this.openURL()}>
                    <Text style={{color: 'blue', textDecorationLine: 'underline',}}>{this.url.substr(0,40)}</Text>
                  </TouchableHighlight>
                </View>
                <TouchableHighlight style={styles.searchButton} activeOpacity={0.2} onPress={() => {
                  this.setState({showDetailModal: false})
                }}>
                  <Text>{"OK"}</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
        <TouchableWithoutFeedback onPress={() => {
          this.setState({showDetailModal: true})
        }}>
          <View style={{marginTop: 30}}>
            {picture}
            {isReady && <Image source={border} style={{marginTop: -272, alignSelf: 'center', width: 287, height: 287}}/>}
          </View>
        </TouchableWithoutFeedback>
      </View>

    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 30,
    marginLeft: 20,
    justifyContent: 'space-evenly'
  },
  infoOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  infoContent: {
    marginTop: 300,
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    backgroundColor: '#ddd',
    borderWidth: 5,
    borderColor: 'black',
    width: 350,
    height: 250,
    overflow: 'hidden'
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 20,
  },
  infoText: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  searchButton: {
    marginTop:10,
    borderRadius: 20,
    backgroundColor: '#fff',
    height: 30,
    padding:5,
    width:'30%',
    alignItems:'center',
    justifyContent:'center'
  },
});



