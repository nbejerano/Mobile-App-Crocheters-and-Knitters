import { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Theme from "@/assets/theme";
import DatabaseService from "@/database/db";

export default function NewProject() {
  const [projectName, setProjectName] = useState("");
  const [yarnType, setYarnType] = useState("");
  const [needleSize, setNeedleSize] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [linkToPattern, setLinkToPattern] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [counters, setCounters] = useState([]);
  const [imageUri, setImageUri] = useState(null);

  const navigation = useNavigation();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const addCounter = () => {
    setCounters((prev) => [
      ...prev,
      { name: "", rows: "", stitches: "", notes: "" },
    ]);
  };

  const updateCounter = (index, key, value) => {
    const updatedCounters = counters.map((counter, i) =>
      i === index ? { ...counter, [key]: value } : counter
    );
    setCounters(updatedCounters);
  };

  const submitProject = async () => {
    setIsLoading(true);
    try {
      const validCounters = counters.filter(counter => 
        counter.name.trim() !== '' || 
        counter.rows.trim() !== '' || 
        counter.stitches.trim() !== '' || 
        counter.notes.trim() !== ''
      );

      const newProject = {
        projectName,
        yarnType,
        needleSize,
        additionalNotes,
        linkToPattern,
        imageUri,
        counters: validCounters
      };

      await DatabaseService.createProject(newProject);
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Submit"
          onPress={submitProject}
          color={
            projectName.length > 0
              ? Theme.colors.textHighlighted
              : Theme.colors.textTertiary
          }
          disabled={isLoading || projectName.length === 0}
        />
      ),
      headerLeft: () => (
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          color={Theme.colors.textPrimary}
        />
      ),
    });
  }, [projectName, yarnType, needleSize, additionalNotes, linkToPattern, counters, isLoading, navigation]);

  const submitDisabled = isLoading || projectName.length === 0;

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
    >
      <TouchableOpacity 
        style={styles.imageContainer} 
        onPress={pickImage}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialCommunityIcons name="camera-plus" size={40} color={Theme.colors.textSecondary} />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Project Name:</Text>
        <TextInput
          style={styles.input}
          value={projectName}
          onChangeText={setProjectName}
          placeholder={"Enter project name"}
          placeholderTextColor={Theme.colors.textTertiary}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Yarn Type:</Text>
        <TextInput
          style={styles.input}
          value={yarnType}
          onChangeText={setYarnType}
          placeholder={"Enter yarn type"}
          placeholderTextColor={Theme.colors.textTertiary}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Needle Size:</Text>
        <TextInput
          style={styles.input}
          value={needleSize}
          onChangeText={setNeedleSize}
          placeholder={"Enter needle size"}
          placeholderTextColor={Theme.colors.textTertiary}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Additional Notes:</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={additionalNotes}
          onChangeText={setAdditionalNotes}
          placeholder={"Enter additional notes"}
          placeholderTextColor={Theme.colors.textTertiary}
          multiline
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Link to Pattern:</Text>
        <TextInput
          style={styles.input}
          value={linkToPattern}
          onChangeText={setLinkToPattern}
          placeholder={"Enter link to pattern"}
          placeholderTextColor={Theme.colors.textTertiary}
        />
      </View>

      <Button title="Add Counter" onPress={addCounter} color={Theme.colors.textHighlighted} />

      {counters.map((counter, index) => (
        <View key={index} style={styles.counterContainer}>
          <Text style={styles.counterLabel}>Counter {index + 1}:</Text>
          <TextInput
            style={styles.input}
            value={counter.name}
            onChangeText={(value) => updateCounter(index, "name", value)}
            placeholder={"Name of Section"}
            placeholderTextColor={Theme.colors.textTertiary}
          />
          <TextInput
            style={styles.input}
            value={counter.rows}
            onChangeText={(value) => updateCounter(index, "rows", value)}
            placeholder={"Number of Rows"}
            placeholderTextColor={Theme.colors.textTertiary}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={counter.stitches}
            onChangeText={(value) => updateCounter(index, "stitches", value)}
            placeholder={"Number of Stitches per Row (optional)"}
            placeholderTextColor={Theme.colors.textTertiary}
          />
          <TextInput
            style={styles.input}
            value={counter.notes}
            onChangeText={(value) => updateCounter(index, "notes", value)}
            placeholder={"Additional Notes (optional)"}
            placeholderTextColor={Theme.colors.textTertiary}
            multiline
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    padding: 16,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    color: Theme.colors.textPrimary,
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    color: Theme.colors.textPrimary,
    backgroundColor: Theme.colors.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  counterContainer: {
    width: "100%",
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.2)'
  },
  counterLabel: {
    color: Theme.colors.textHighlighted,
    fontSize: 16,
    marginBottom: 8,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Theme.colors.textSecondary,
    borderStyle: 'dashed',
  },
});
