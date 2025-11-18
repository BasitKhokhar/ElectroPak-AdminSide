import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import colors from "../Themes/colors";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const CustomerSupportScreen = () => {
  return (
    <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>
      {/* <Text style={[styles.title, { color: colors.text }]}>
        Customer Support
      </Text> */}

      <Text style={[styles.text, { color: colors.mutedText }]}>
        Get help and support anytime. Whether you have questions, need technical
        assistance, or require urgent help, our team is here for you 24/7. Reach
        out via chat, call, or email—we’re always ready to assist!
      </Text>

      <View style={styles.data}>
        {/* EMAIL SECTION */}
        <LinearGradient
          colors={colors.gradients.blueSky} // soft white → blue sky gradient
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.containergradient}
        >
          <View style={styles.emailbox}>
            <Text style={[styles.headings, { color: colors.text }]}>
              Email:
            </Text>
             <Text style={[styles.headingtext, { color: colors.text }]}>
              1. electropakapp@gmail.com
            </Text>
            <Text style={[styles.headingtext, { color: colors.text }]}>
              2. basit@gmail.com
            </Text>
            <Text style={[styles.headingtext, { color: colors.text }]}>
              3. TalhaMunirapp@gmail.com
            </Text>
          </View>
        </LinearGradient>

        {/* PHONE SECTION */}
        <LinearGradient
          colors={colors.gradients.bluePulse} // soft deep blue gradient
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.containergradient}
        >
          <View style={styles.emailbox}>
            <Text style={[styles.headings, { color: "#fff" }]}>
              Phone No:
            </Text>
            <Text style={[styles.headingtext, { color: "#fff" }]}>
              1. +92 306-0760549
            </Text>
            <Text style={[styles.headingtext, { color: "#fff" }]}>
              2. +92 315-4949862
            </Text>
            <Text style={[styles.headingtext, { color: "#fff" }]}>
              3. +92 306-0760549
            </Text>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  data: {
    display: "flex",
    flexDirection: "column",
    rowGap: 20,
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: "justify",
  },
  headings: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headingtext: {
    fontSize: 16,
    fontWeight: "500",
  },
  containergradient: {
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 12,
  },
  emailbox: {
    display: "flex",
    flexDirection: "column",
    rowGap: 10,
  },
});

export default CustomerSupportScreen;
