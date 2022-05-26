import * as Font from "expo-font";

export default useFonts = async () => {
   await Font.loadAsync({
      "Pacifico" : require("../assets/fonts/Gill-Sans.otf"),
      "PacificoBold": require("../assets/fonts/Gill-Sans-Bold.otf")
      // All other fonts here
    });
};