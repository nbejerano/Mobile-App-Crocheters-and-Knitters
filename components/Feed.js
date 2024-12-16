import { useState, useCallback } from "react";
import { 
  StyleSheet, 
  FlatList, 
  RefreshControl, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput,
  Dimensions 
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import Theme from "@/assets/theme";
import Loading from "@/components/Loading";
import DatabaseService from '@/database/db';
const windowWidth = Dimensions.get('window').width;

const FILTER_OPTIONS = {
  ALL: 'all',
  COMPLETED: 'completed',
  INCOMPLETE: 'incomplete'
};

export default function Feed() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterType, setFilterType] = useState(FILTER_OPTIONS.INCOMPLETE);
  const router = useRouter();
  const { searchVisible } = useLocalSearchParams();

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const projectsData = await DatabaseService.getAllProjects();
      let filtered = projectsData;
      
      switch (filterType) {
        case FILTER_OPTIONS.COMPLETED:
          filtered = projectsData.filter(project => project.isCompleted);
          break;
        case FILTER_OPTIONS.INCOMPLETE:
          filtered = projectsData.filter(project => !project.isCompleted);
          break;
        default:
          filtered = projectsData;
      }
      
      setProjects(filtered);
      filterProjects(filtered, searchQuery);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
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
        (project.needleSize && project.needleSize.toLowerCase().includes(searchTerm))
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
    }, [filterType])
  );

  const FilterButton = ({ type, label }) => (
    <TouchableOpacity 
      style={[
        styles.filterButton,
        filterType === type && styles.filterButtonActive
      ]}
      onPress={() => setFilterType(type)}
    >
      <Text style={[
        styles.filterButtonText,
        filterType === type && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const handleProjectPress = (projectId) => {
    router.push({
      pathname: "/MainNav/feed/details",
      params: { id: projectId }
    });
  };

  if (isLoading && !isRefreshing) {
    return <Loading />;
  }

  const renderProject = ({ item }) => (
    <View style={styles.projectWrapper}>
      <TouchableOpacity 
        style={styles.projectCard}
        onPress={() => handleProjectPress(item.id)}
      >
        <View style={styles.projectHeader}>
          <MaterialCommunityIcons 
            name="star" 
            size={28} 
            color={Theme.colors.textPrimary}
          />
          <Text style={styles.projectTitle}>{item.projectName}</Text>
        </View>
        
        <View style={styles.projectDetails}>
          {item.needleSize && (
            <View style={styles.detailItem}>
              <MaterialCommunityIcons 
                name="ruler" 
                size={20} 
                color={Theme.colors.textSecondary}
              />
              <Text style={styles.detailText}>Needle: {item.needleSize}</Text>
            </View>
          )}
          
          {item.yarnType && (
            <View style={styles.detailItem}>
              <MaterialCommunityIcons 
                name="basket-outline" 
                size={20} 
                color={Theme.colors.textSecondary}
              />
              <Text style={styles.detailText}>{item.yarnType}</Text>
            </View>
          )}
          
          <View style={styles.detailItem}>
            <MaterialCommunityIcons 
              name="counter" 
              size={20} 
              color={Theme.colors.textSecondary}
            />
            <Text style={styles.detailText}>
              {item.counters?.length || 0} counters
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

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

      <View style={styles.filterContainer}>
        <FilterButton type={FILTER_OPTIONS.ALL} label="All" />
        <FilterButton type={FILTER_OPTIONS.INCOMPLETE} label="In Progress" />
        <FilterButton type={FILTER_OPTIONS.COMPLETED} label="Completed" />
      </View>

      <FlatList
        data={filteredProjects}
        renderItem={renderProject}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.feed,
          filteredProjects.length === 0 && { flex: 1 }
        ]}
        style={styles.listContainer}
        ListEmptyComponent={() => (
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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              setIsRefreshing(true);
              fetchProjects();
            }}
            tintColor={Theme.colors.textPrimary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: 8,
    marginHorizontal: 12,
    marginBottom: 12,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  filterButtonActive: {
    backgroundColor: Theme.colors.iconHighlighted,
  },
  filterButtonText: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: Theme.colors.textPrimary,
  },
  listContainer: {
    flex: 1,
  },
  feed: {
    padding: 10,
    gap: 12,
  },
  projectWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  projectCard: {
    width: windowWidth * 0.95,
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    flex: 1,
  },
  projectDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 16,
    color: Theme.colors.textSecondary,
  },
  noResultsContainer: {
    width: windowWidth * 0.95,
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
