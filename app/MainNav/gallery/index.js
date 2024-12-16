import { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Animated,
  Dimensions,
  searchVisible
} from 'react-native';
import { useFocusEffect, useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Theme from '@/assets/theme';
import DatabaseService from '@/database/db';
import Loading from '@/components/Loading';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width / 2 - 24; // 2 images per row with padding

export default function Gallery() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { searchVisible } = useLocalSearchParams();

  const fetchProjects = async () => {
    try {
      const projectsData = await DatabaseService.getAllProjects();
      const projectsWithImages = projectsData.filter(project => project.imageUri);
      setProjects(projectsWithImages);
      filterProjects(projectsWithImages, searchQuery);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProjects = (projectsList, query) => {
    if (!query.trim()) {
      setFilteredProjects(projectsList);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const filtered = projectsList.filter(project => {
      return (
        project.projectName.toLowerCase().includes(searchTerm) ||
        (project.yarnType && project.yarnType.toLowerCase().includes(searchTerm)) ||
        (project.needleSize && project.needleSize.toLowerCase().includes(searchTerm)) ||
        (project.additionalNotes && project.additionalNotes.toLowerCase().includes(searchTerm))
      );
    });
    setFilteredProjects(filtered);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    filterProjects(projects, text);
  };

  useFocusEffect(
    useCallback(() => {
      fetchProjects();
    }, [])
  );

  const handleProjectPress = (projectId) => {
    router.push({
      pathname: "/MainNav/gallery/details",
      params: { id: projectId }
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {searchVisible === 'true' && (
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons 
            name="magnify" 
            size={20} 
            color={Theme.colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search projects..."
            placeholderTextColor={Theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus={true}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => handleSearch('')}
              style={styles.clearButton}
            >
              <MaterialCommunityIcons 
                name="close-circle" 
                size={20} 
                color={Theme.colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
      <ScrollView 
        contentContainerStyle={[
          styles.galleryContainer,
          filteredProjects.length === 0 && { flex: 1 }
        ]}
      >
        {(searchQuery ? filteredProjects : projects).length > 0 ? (
          (searchQuery ? filteredProjects : projects).map((project) => (
            <TouchableOpacity
              key={project.id}
              style={styles.imageContainer}
              onPress={() => handleProjectPress(project.id)}
            >
              <Image 
                source={{ uri: project.imageUri }} 
                style={styles.image}
              />
              <View style={styles.overlay}>
                <Text style={styles.projectName} numberOfLines={2}>
                  {project.projectName}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <MaterialCommunityIcons 
              name="file-search-outline" 
              size={48} 
              color={Theme.colors.textSecondary}
              style={styles.noResultsIcon}
            />
            <Text style={styles.noResultsText}>
              {searchQuery.trim() 
                ? "No projects matched your search"
                : "No matching projects have been created yet"}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  galleryContainer: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
  },
  projectName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.backgroundSecondary,
    margin: 12,
    marginBottom: 6,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: Theme.colors.textPrimary,
    fontSize: 16,
    paddingVertical: 12,
  },
  clearButton: {
    padding: 4,
  },
  noResultsContainer: {
    width: width * 0.95,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 12,
  },
  noResultsText: {
    fontSize: 16,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  }
});
