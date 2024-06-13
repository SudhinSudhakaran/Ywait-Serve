import DeviceInfo from "react-native-device-info";

const isTablet = DeviceInfo.isTablet();

const initialState ={
    isTablet,
}

const tabletReducer =(state=initialState,action)=>{
    return state;
};

export default tabletReducer;