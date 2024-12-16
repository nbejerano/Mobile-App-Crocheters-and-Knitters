import { Stack } from "expo-router";
import Theme from "@/assets/theme";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import Foundation from '@expo/vector-icons/Foundation';

const CustomHeaderTitle = ({ title }) => {
  return (
    <View style={styles.headerTitleContainer}>
       <Foundation name="clipboard-notes" size={24} color={Theme.colors.textTertiary}/>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const InfoModal = ({ visible, onClose }) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <TouchableOpacity 
      style={styles.modalOverlay}
      activeOpacity={1} 
      onPress={onClose}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>
          Welcome to the Projects page! Here you can view and manage all your knitting/corchet projects. Use the filters to see all projects, completed ones, or those still in progress. Each project card shows key details like needle size and yarn type. Click the + button to create a new project, or tap any project to see its full details and counters.
        </Text>
        <TouchableOpacity 
          style={styles.modalButton}
          onPress={onClose}
        >
          <Text style={styles.modalButtonText}>Got it!</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </Modal>
);

export default function StackLayout() {
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const router = useRouter();

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    router.setParams({ searchVisible: (!searchVisible).toString() });
  };

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Projects',
            tabBarIcon: ({ size, color }) => 
              <FontAwesome size={size} name="feed" color={color} />,
            headerStyle: {
              backgroundColor: Theme.colors.backgroundPrimary,
            },
            headerTintColor: Theme.colors.textPrimary,
            headerTitleStyle: {
              fontWeight: 'bold',
              textAlign: "center",
            },
            headerTitle: () => <CustomHeaderTitle title="Projects" />,
            headerLeft: () => (
              <TouchableOpacity 
                onPress={() => setInfoModalVisible(true)}
                style={[styles.headerButton, styles.headerButtonLeft]}
              >
                <MaterialCommunityIcons 
                  name="information" 
                  size={24} 
                  color={Theme.colors.textPrimary}
                />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity 
                onPress={toggleSearch}
                style={styles.headerButton}
              >
                <MaterialCommunityIcons 
                  name="magnify" 
                  size={24} 
                  color={Theme.colors.textPrimary}
                />
              </TouchableOpacity>
            ),
          }}
          initialParams={{ searchVisible: 'false' }}
        />
        <Stack.Screen
          name="newproject"
          options={{
            title: 'New Project',
            headerStyle: {
              backgroundColor: Theme.colors.backgroundPrimary,
            },
            headerTintColor: Theme.colors.textPrimary,
            headerTitleStyle: {
              fontWeight: 'bold',
              textAlign: "center",
            },
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="details"
          options={({ navigation, route }) => ({
            title: 'Project Details',
            headerStyle: {
              backgroundColor: Theme.colors.backgroundPrimary,
            },
            headerTintColor: Theme.colors.textPrimary,
            headerTitleStyle: {
              fontWeight: 'bold',
              textAlign: "center",
            },
            headerBackTitle: 'Back',
            headerRight: () => (
              <TouchableOpacity 
                onPress={() => {
                  if (route.params?.onEditPress) {
                    route.params.onEditPress();
                  }
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
            headerShown: !route.params?.isEditing,
          })}
        />
      </Stack>
      <InfoModal 
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    color: Theme.colors.backgroundSecondary,
    gap: 12,
  },
  headerIcon: {
    fontSize: 24,
  },
  headerTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  headerButtonLeft: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalText: {
    color: Theme.colors.textPrimary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: Theme.colors.iconHighlighted,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: Theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});