import { useState, useEffect } from "react";
import {
  StyleSheet,
  Styles,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import Theme from "@/assets/theme";
import Loading from "@/components/Loading";
import DatabaseService from '@/database/db';
export default function Details() {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  useEffect(() => {
    if (project) {
      setEditedProject({ ...project });
    }
  }, [project]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => {
            setIsEditing(true);
            navigation.setParams({ isEditing: true });
          }}
          style={styles.headerButton}
        >
          <MaterialCommunityIcons 
            name="pencil" 
            size={24} 
            color={Theme.colors.textPrimary}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const fetchProjectDetails = async () => {
    try {
      const projects = await DatabaseService.getAllProjects();
      const projectDetails = projects.find(p => p.id.toString() === id.toString());
      if (projectDetails) {
        setProject(projectDetails);
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCancel = () => {
    setEditedProject({ ...project });
    setIsEditing(false);
    navigation.setParams({ isEditing: false });
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const validCounters = editedProject.counters.filter(counter => 
        counter.name.trim() !== '' || 
        counter.rows.trim() !== '' || 
        counter.stitches.trim() !== '' || 
        counter.notes.trim() !== ''
      );
      
      const updatedProject = {
        ...editedProject,
        counters: validCounters
      };

      await DatabaseService.updateProject(project.id, updatedProject);
      setProject(updatedProject);
      setIsEditing(false);
      navigation.setParams({ isEditing: false });
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Project",
      "Are you sure you want to delete this project? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await DatabaseService.deleteProject(project.id);
              router.back();
            } catch (error) {
              console.error('Error deleting project:', error);
            }
          }
        }
      ]
    );
  };
  const addCounter = () => {
    setEditedProject({
      ...editedProject,
      counters: [
        ...editedProject.counters,
        { name: '', rows: '', stitches: '', notes: '', completedStitches: 0, completedRows: 0 }
      ]
    });
  };

  const removeCounter = (index) => {
    const updatedCounters = editedProject.counters.filter((_, i) => i !== index);
    setEditedProject({ ...editedProject, counters: updatedCounters });
  };

  const updateCounter = (index, field, value) => {
    const updatedCounters = [...editedProject.counters];
    updatedCounters[index] = { ...updatedCounters[index], [field]: value };
    setEditedProject({ ...editedProject, counters: updatedCounters });
  };

  const updateCompletedStitches = async (counterIndex, increment) => {
    if (!project) return;

    const updatedCounters = [...project.counters];
    const counter = updatedCounters[counterIndex];
    const maxStitches = parseInt(counter.stitches) || 0;
    
    let newValue;
    if (increment > 0) {
      // Going up: if at max, loop to 0
      newValue = counter.completedStitches >= maxStitches ? 0 : counter.completedStitches + 1;
    } else {
      // Going down: if at 0, loop to max
      newValue = counter.completedStitches <= 0 ? maxStitches : counter.completedStitches - 1;
    }
    
    counter.completedStitches = newValue;
    const updatedProject = { ...project, counters: updatedCounters };
    setProject(updatedProject);

    try {
      await DatabaseService.updateProject(project.id, { counters: updatedCounters });
    } catch (error) {
      console.error('Error updating completed stitches:', error);
    }
  };
  const updateCompletedRows = async (counterIndex, increment) => {
    if (!project) return;

    const updatedCounters = [...project.counters];
    const counter = updatedCounters[counterIndex];
    const maxRows = parseInt(counter.rows) || 0;
    
    let newValue;
    if (increment > 0) {
      // Going up: if at max, loop to 0
      newValue = counter.completedRows >= maxRows ? 0 : counter.completedRows + 1;
    } else {
      // Going down: if at 0, loop to max
      newValue = counter.completedRows <= 0 ? maxRows : counter.completedRows - 1;
    }
    
    counter.completedRows = newValue;
    const updatedProject = { ...project, counters: updatedCounters };
    setProject(updatedProject);

    try {
      await DatabaseService.updateProject(project.id, { counters: updatedCounters });
    } catch (error) {
      console.error('Error updating completed rows:', error);
    }
  };

  const toggleComplete = async () => {
    if (!project) return;

    const updatedProject = { 
      ...project, 
      isCompleted: !project.isCompleted 
    };
    
    try {
      await DatabaseService.updateProject(project.id, { isCompleted: !project.isCompleted });
      setProject(updatedProject);
    } catch (error) {
      console.error('Error updating project completion status:', error);
    }
  };
  if (isLoading) {
    return <Loading />;
  }

  if (!project) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Project not found</Text>
      </View>
    );
  }

  if (isEditing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={handleCancel} 
            style={[styles.headerButton, styles.headerButtonLeft]}
          >
            <Text style={styles.headerButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleSave} 
            style={[styles.headerButton, styles.headerButtonRight]}
          >
            <Text style={styles.headerButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.container}>
          <TouchableOpacity 
            style={styles.imageContainer} 
            onPress={async () => {
              try {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [4, 3],
                  quality: 1,
                });

                if (!result.canceled) {
                  setEditedProject(prev => ({
                    ...prev,
                    imageUri: result.assets[0].uri
                  }));
                }
              } catch (error) {
                console.error("Error picking image:", error);
              }
            }}
          >
            {editedProject.imageUri ? (
              <Image 
                source={{ uri: editedProject.imageUri }} 
                style={styles.image} 
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <MaterialCommunityIcons 
                  name="camera-plus" 
                  size={40} 
                  color={Theme.colors.textSecondary} 
                />
              </View>
            )}
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={editedProject.projectName}
            onChangeText={(text) => setEditedProject({ ...editedProject, projectName: text })}
            placeholder="Project Name"
            placeholderTextColor={Theme.colors.textSecondary}
          />

          <TextInput
            style={styles.input}
            value={editedProject.needleSize}
            onChangeText={(text) => setEditedProject({ ...editedProject, needleSize: text })}
            placeholder="Needle Size"
            placeholderTextColor={Theme.colors.textSecondary}
          />

          <TextInput
            style={styles.input}
            value={editedProject.yarnType}
            onChangeText={(text) => setEditedProject({ ...editedProject, yarnType: text })}
            placeholder="Yarn Type"
            placeholderTextColor={Theme.colors.textSecondary}
          />

          <TextInput
            style={styles.input}
            value={editedProject.linkToPattern}
            onChangeText={(text) => setEditedProject({ ...editedProject, linkToPattern: text })}
            placeholder="Link to Pattern"
            placeholderTextColor={Theme.colors.textSecondary}
          />

          <TextInput
            style={[styles.input, styles.notesInput]}
            value={editedProject.additionalNotes}
            onChangeText={(text) => setEditedProject({ ...editedProject, additionalNotes: text })}
            placeholder="Additional Notes"
            placeholderTextColor={Theme.colors.textSecondary}
            multiline
          />
          <View style={styles.countersSection}>
            <View style={styles.countersSectionHeader}>
              <Text style={styles.sectionTitle}>Counters</Text>
              <TouchableOpacity 
                onPress={addCounter}
                style={styles.addButton}
              >
                <MaterialCommunityIcons 
                  name="plus-circle" 
                  size={24} 
                  color={Theme.colors.textPrimary}
                />
              </TouchableOpacity>
            </View>
            {editedProject.counters.map((counter, index) => (
              <View key={index} style={styles.counterEditCard}>
                <View style={styles.counterHeader}>
                  <Text style={styles.counterIndex}>Counter {index + 1}</Text>
                  <TouchableOpacity 
                    onPress={() => removeCounter(index)}
                    style={styles.removeButton}
                  >
                    <MaterialCommunityIcons 
                      name="close-circle" 
                      size={24} 
                      color={Theme.colors.iconHighlighted}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.inputLabel}>Counter Name:</Text>
                <TextInput
                  style={styles.input}
                  value={counter.name}
                  onChangeText={(text) => updateCounter(index, 'name', text)}
                  placeholder="Counter Name"
                  placeholderTextColor={Theme.colors.textSecondary}
                />
                <Text style={styles.inputLabel}>Number of Rows:</Text>
                <TextInput
                  style={styles.input}
                  value={counter.rows}
                  onChangeText={(text) => updateCounter(index, 'rows', text)}
                  placeholder="Total Rows"
                  keyboardType="numeric"
                  placeholderTextColor={Theme.colors.textSecondary}
                />

                <Text style={styles.inputLabel}>Number of Stitches per Row:</Text>
                <TextInput
                  style={styles.input}
                  value={counter.stitches}
                  onChangeText={(text) => updateCounter(index, 'stitches', text)}
                  placeholder="Total Stitches"
                  keyboardType="numeric"
                  placeholderTextColor={Theme.colors.textSecondary}
                />

                <Text style={styles.inputLabel}>Counter Notes:</Text>
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  value={counter.notes}
                  onChangeText={(text) => updateCounter(index, 'notes', text)}
                  placeholder="Notes"
                  multiline
                  placeholderTextColor={Theme.colors.textSecondary}
                />
              </View>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Text style={styles.deleteButtonText}>Delete Project</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  } else {
    return (
      <ScrollView style={styles.container}>
        {project.imageUri && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: project.imageUri }} 
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}

        <View style={styles.detailsContainer}>
          <Text style={styles.projectName}>{project.projectName}</Text>
          
          <TouchableOpacity 
            style={[
              styles.completeButton, 
              project.isCompleted && styles.completeButtonActive
            ]}
            onPress={toggleComplete}
          >
            <MaterialCommunityIcons 
              name={project.isCompleted ? "check-circle" : "check-circle-outline"} 
              size={24} 
              color={Theme.colors.textPrimary}
            />
            <Text style={styles.completeButtonText}>
              {project.isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
            </Text>
          </TouchableOpacity>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons 
              name="ruler" 
              size={24} 
              color={Theme.colors.textSecondary}
            />
            <Text style={styles.detailText}>
              Needle Size: {project.needleSize || 'Not specified'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialCommunityIcons 
              name="basket-outline" 
              size={24} 
              color={Theme.colors.textSecondary}
            />
            <Text style={styles.detailText}>
              Yarn Type: {project.yarnType || 'Not specified'}
            </Text>
          </View>

          {project.linkToPattern && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons 
                name="link" 
                size={24} 
                color={Theme.colors.textSecondary}
                style={{ marginTop: 3 }}
              />
              <Text style={[styles.detailText, { flex: 1 }]} numberOfLines={0}>
                Pattern Link: {project.linkToPattern}
              </Text>
            </View>
          )}

          {project.additionalNotes && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons 
                name="note-text" 
                size={24} 
                color={Theme.colors.textSecondary}
              />
              <Text style={styles.detailText}>
                Notes: {project.additionalNotes}
              </Text>
            </View>
          )}
          {project.counters && project.counters.length > 0 && (
            <View style={styles.countersSection}>
              <Text style={styles.sectionTitle}>Counters</Text>
              {project.counters
                .filter(counter => parseInt(counter.rows) > 0 || parseInt(counter.stitches) > 0)
                .map((counter, index) => (
                  <View key={index} style={styles.counterCard}>
                    <Text style={styles.counterName}>{counter.name}</Text>
                    <View style={styles.counterDetails}>
                      {parseInt(counter.rows) > 0 && (
                        <View style={styles.counterRow}>
                          <Text style={styles.counterLabel}>Rows:</Text>
                          <TouchableOpacity 
                            onPress={() => updateCompletedRows(index, -1)}
                            style={styles.buttonContainer}
                          >
                            <MaterialCommunityIcons 
                              name="minus-circle" 
                              size={36} 
                              color={Theme.colors.textSecondary}
                            />
                          </TouchableOpacity>
                          <Text style={styles.counterValue}>
                            {counter.completedRows} / {counter.rows}
                          </Text>
                          <TouchableOpacity 
                            onPress={() => updateCompletedRows(index, 1)}
                            style={styles.buttonContainer}
                          >
                            <MaterialCommunityIcons 
                              name="plus-circle" 
                              size={36} 
                              color={Theme.colors.textSecondary}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                      {parseInt(counter.stitches) > 0 && (
                        <View style={styles.counterRow}>
                          <Text style={styles.counterLabel}>Stitches:</Text>
                          <TouchableOpacity 
                            onPress={() => updateCompletedStitches(index, -1)}
                            style={styles.buttonContainer}
                          >
                            <MaterialCommunityIcons 
                              name="minus-circle" 
                              size={36} 
                              color={Theme.colors.textSecondary}
                            />
                          </TouchableOpacity>
                          <Text style={styles.counterValue}>
                            {counter.completedStitches} / {counter.stitches}
                          </Text>
                          <TouchableOpacity 
                            onPress={() => updateCompletedStitches(index, 1)}
                            style={styles.buttonContainer}
                          >
                            <MaterialCommunityIcons 
                              name="plus-circle" 
                              size={36} 
                              color={Theme.colors.textSecondary}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                      {counter.notes && (
                        <Text style={styles.notes}>Notes: {counter.notes}</Text>
                      )}
                    </View>
                  </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.backgroundSecondary,
  },
  headerButton: {
    padding: 8,
  },
  headerButtonLeft: {
    marginRight: 'auto',
  },
  headerButtonRight: {
    marginLeft: 'auto',
  },
  headerButtonText: {
    color: Theme.colors.textPrimary,
    fontSize: 16,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 16,
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
  },
  detailsContainer: {
    padding: 16,
  },
  projectName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: 8,
    marginBottom: 12,
    minHeight: 48,
  },
  detailText: {
    fontSize: 16,
    color: Theme.colors.textPrimary,
    flex: 1,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  input: {
    backgroundColor: Theme.colors.backgroundSecondary,
    color: Theme.colors.textPrimary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  countersSection: {
    marginTop: 24,
  },
  countersSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
  },
  counterCard: {
    backgroundColor: Theme.colors.backgroundSecondary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  counterEditCard: {
    backgroundColor: Theme.colors.backgroundSecondary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  counterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  counterIndex: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
  },
  counterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    marginBottom: 8,
  },
  counterDetails: {
    gap: 12,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  counterLabel: {
    color: Theme.colors.textPrimary,
    fontSize: 16,
    width: 80,
  },
  counterValue: {
    color: Theme.colors.textPrimary,
    fontSize: 16,
    width: 80,
    textAlign: 'center',
  },
  notes: {
    fontSize: 16,
    color: Theme.colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
    flexWrap: 'wrap',
  },
  inputLabel: {
    color: Theme.colors.textPrimary,
    marginBottom: 4,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.backgroundSecondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  completeButtonActive: {
    backgroundColor: Theme.colors.iconHighlighted,
  },
  completeButtonText: {
    color: Theme.colors.textPrimary,
    fontSize: 16,
  },
  errorText: {
    color: Theme.colors.textPrimary,
    fontSize: 16,
    textAlign: 'center',
  },
});