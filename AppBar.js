import {AppBar as MyAppBar} from '@react-native-material/core';
import { Image } from 'react-native';

const AppBar = () =>{
    return <MyAppBar 
    title = "Gingivitis Detected"
    centerTitle = {true}
    color='white'
    style={{padding: 5}}
    leading={
        <Image source={require("../images/SGlogo.png")} style={{width: 40, height: 40, padding: 5}}></Image>
    }

    
    >
    </MyAppBar>
}

export default AppBar;