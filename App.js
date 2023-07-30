import {View, Text, Pressable, Image, FlatList, Button} from "react-native"
import { launchImageLibrary } from "react-native-image-picker";
import React from "react"
import AppBar from "./components/AppBar"


const App = () => {

  const [photo, setPhoto] = React.useState(null);
  const [imageBase64, setimageBase64] = React.useState(null);
  const [restext, setrestext] = React.useState(null);

  const handleChoosePhoto = async () => {
    console.log("Choose photo call")
    await launchImageLibrary({noData: true, includeBase64: true}, (response) =>{
      if(response.didCancel){ {/* use for check input if it image? */}
        console.log("Cancelled")
      } else {
        setPhoto(response.assets[0])
      }
    })
  }

  const handleDetected = async () => {
    fetch("http://10.0.2.2:5000/detect", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        b64: photo.base64,
        fileName: photo.fileName.split('-').pop()
      })
    })
    .then((response) => response.json())
    .then((response) => {
      console.log("Success")
      const base64Lenght = response.message.length
      const finalbase64 = response.message.substring(2, base64Lenght-1)
      setrestext(response.res)
      setimageBase64(finalbase64)
    })
    .catch((error) => {
      console.log("Error, Call again!", error);
      handleDetected()
    })
  }

  const renderImage = () => {
    if (!photo) {
      return <Text style={{backgroundColor: "#ffffff", padding: 15, borderRadius: 20}}>No Image</Text>
    } else {
      if (imageBase64 != null) {
        return <Image source={{uri: "data:image/png;base64," + imageBase64}} style={{width: 400, height: 250,  borderRadius: 20}}></Image>
      } else {
        return <Image source={{uri: photo.uri}} style={{width: 400, height: 250,  borderRadius: 20}}></Image>
      }
    }
  }

  const renderText = () => {
    if (restext != null) {
      const res = new Array()
      for (var i = 0; i < restext.length; i++){
        const conf = String(restext[i].confidence)
        console.log(conf * 100)

        const per = String(conf * 100)

        // res[i] = restext[i].name + " " + conf.substring(0,4)
        res[i] = restext[i].name + " " + per.substring(0,4) + "%"
      }
      return <FlatList style={{flexGrow: 0}}
        data={res}
        renderItem={({item}) => <Text style={{paddingTop: 5, fontSize: 18, color: "#000000", fontWeight: "bold"}}>{item}</Text> }
      />
    }
  }

  const renderButton = () => {
    if(!photo){
      console.log("Hidden Detected")
      return <View style={{height: "100%", width: "30%",backgroundColor: "#D1F2FF"}}></View>
    } else { return <Pressable style={{backgroundColor: "#D1F2FF", borderRadius: 5, alignItems: "center", height: "100%", width: "30%", justifyContent: "center", paddingHorizontal: 50}} onPress={handleDetected}>
    <Image source={require("./images/detecting.png")} style={{width: 50, height: 50}}></Image>
  </Pressable>
    }
  }

  return <View style={{width: "100%", height: "100%", backgroundColor: "steelblue"}}>

    <AppBar></AppBar>

    <View style={{flex: 3, backgroundColor: "#E9E9E9",alignItems: "center", justifyContent: "center"}}>
      {renderImage()}
      {renderText()}
    </View>

    <View style={{flex: .3, backgroundColor: "#ffffff", alignItems: "flex-end", flexDirection: 'row'}}>
      <Pressable style={{backgroundColor: "#FFEFD1", borderRadius: 5, alignItems: "center", height: "100%", width: "70%", justifyContent: "center", paddingHorizontal: 50}} onPress={handleChoosePhoto}>
        <Text style={{color: "#000000", fontWeight: "600"}}>Select Image</Text>
      </Pressable>
      {renderButton()}
    </View>

  </View>
}

export default App;

