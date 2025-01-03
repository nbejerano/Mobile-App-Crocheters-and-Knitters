// import { useState } from "react";
// import {
//   Text,
//   Alert,
//   StyleSheet,
//   View,
//   TextInput,
//   TouchableOpacity,
// } from "react-native";
// import { StatusBar } from "expo-status-bar";
// import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import Theme from "@/assets/theme";

// export default function Login({ onLogin }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const signInWithEmail = async () => {
//     setLoading(true);
//     try {
//       // For demo purposes, using a simple validation
//       // In a real app, you'd want more secure authentication
//       if (email && password) {
//         // Store user session
//         await AsyncStorage.setItem('userEmail', email);
//         await AsyncStorage.setItem('isLoggedIn', 'true');
        
//         // Call the onLogin callback to update app state
//         if (onLogin) {
//           onLogin();
//         }
//       } else {
//         Alert.alert("Error", "Please enter both email and password");
//       }
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to sign in");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isSignInDisabled = loading || email.length === 0 || password.length === 0;

//   return (
//     <View style={styles.container}>
//       <StatusBar style="light" />
//       <View style={styles.splash}>
//         <MaterialCommunityIcons
//           size={64}
//           name="bee-flower"
//           color={Theme.colors.iconHighlighted}
//         />
//         <Text style={styles.splashText}>Buzz</Text>
//       </View>
//       <TextInput
//         onChangeText={(text) => setEmail(text)}
//         value={email}
//         placeholder="email@address.com"
//         placeholderTextColor={Theme.colors.textSecondary}
//         autoCapitalize={"none"}
//         style={styles.input}
//       />
//       <TextInput
//         onChangeText={(text) => setPassword(text)}
//         value={password}
//         placeholder="Password"
//         placeholderTextColor={Theme.colors.textSecondary}
//         secureTextEntry={true}
//         autoCapitalize={"none"}
//         style={styles.input}
//       />
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           onPress={() => signInWithEmail()}
//           disabled={isSignInDisabled}
//         >
//           <Text
//             style={[
//               styles.button,
//               isSignInDisabled ? styles.buttonDisabled : undefined,
//             ]}
//           >
//             Sign in
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingTop: 60,
//     padding: 12,
//     backgroundColor: Theme.colors.backgroundPrimary,
//     flex: 1,
//   },
//   splash: {
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   splashText: {
//     fontWeight: "bold",
//     color: Theme.colors.textPrimary,
//     fontSize: 60,
//   },
//   buttonContainer: {
//     marginTop: 12,
//     flexDirection: "row",
//     justifyContent: "space-around",
//   },
//   verticallySpaced: {
//     marginVertical: 4,
//     alignSelf: "stretch",
//   },
//   mt20: {
//     marginTop: 20,
//   },
//   input: {
//     color: Theme.colors.textPrimary,
//     backgroundColor: Theme.colors.backgroundSecondary,
//     width: "100%",
//     padding: 16,
//   },
//   button: {
//     color: Theme.colors.textHighlighted,
//     fontSize: 18,
//     fontWeight: 18,
//     padding: 8,
//   },
//   buttonDisabled: {
//     color: Theme.colors.textSecondary,
//   },
// });
