import React from "react";
import { View, StyleSheet, Image } from "react-native";
import * as Animatable from "react-native-animatable";
import colors from "../Themes/colors";
import splashImage from "../../assets/logo.png"; // <-- place your image in assets folder

const SplashScreen1 = () => {
  return (
    <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>
      <Animatable.Image
        animation="zoomIn"
        duration={1500}
        source={splashImage}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 15,
    resizeMode: "contain",
  },
});

export default SplashScreen1;
