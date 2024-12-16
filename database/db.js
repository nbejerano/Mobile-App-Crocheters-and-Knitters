import AsyncStorage from '@react-native-async-storage/async-storage';

const PROJECTS_KEY = '@projects';
const USERS_KEY = '@users';

const DatabaseService = {
  init: async () => {
    try {
      // Check if we have any data, if not initialize with empty array
      const projects = await AsyncStorage.getItem(PROJECTS_KEY);
      if (!projects) {
        await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify([]));
      }
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  },

  createProject: async (project) => {
    try {
      const projectsJson = await AsyncStorage.getItem(PROJECTS_KEY);
      const projects = JSON.parse(projectsJson || '[]');
      
      // Get the current user's ID
      const userEmail = await AsyncStorage.getItem('userEmail');
      const usersJson = await AsyncStorage.getItem('@users');
      const users = JSON.parse(usersJson || '[]');
      const currentUser = users.find(u => u.email === userEmail);
      
      const newProject = {
        id: Date.now(),
        userId: currentUser?.id,
        projectName: project.projectName,
        yarnType: project.yarnType,
        needleSize: project.needleSize,
        additionalNotes: project.additionalNotes || '',
        linkToPattern: project.linkToPattern || '',
        isCompleted: false,
        imageUri: project.imageUri || null,
        counters: project.counters.map(counter => ({
          ...counter,
          completedStitches: 0,
          completedRows: 0
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      projects.push(newProject);
      await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
      return newProject.id;
    } catch (error) {
      console.error('Error in createProject:', error);
      throw error;
    }
  },

  getAllProjects: async () => {
    try {
      const projectsJson = await AsyncStorage.getItem(PROJECTS_KEY);
      const projects = JSON.parse(projectsJson || '[]');
      
      // Get the current user's ID
      const userEmail = await AsyncStorage.getItem('userEmail');
      const usersJson = await AsyncStorage.getItem('@users');
      const users = JSON.parse(usersJson || '[]');
      const currentUser = users.find(u => u.email === userEmail);
      
      // Filter projects by current user
      const userProjects = projects.filter(project => project.userId === currentUser?.id);
      
      const updatedProjects = userProjects.map(project => ({
        ...project,
        additionalNotes: project.additionalNotes || '',
        linkToPattern: project.linkToPattern || '',
        isCompleted: project.isCompleted || false,
        imageUri: project.imageUri || null,
        counters: (project.counters || []).map(counter => ({
          ...counter,
          completedStitches: counter.completedStitches || 0,
          completedRows: counter.completedRows || 0
        }))
      }));

      if (JSON.stringify(userProjects) !== JSON.stringify(updatedProjects)) {
        await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
      }

      return updatedProjects;
    } catch (error) {
      console.error('Error in getAllProjects:', error);
      throw error;
    }
  },

  updateProject: async (projectId, updates) => {
    try {
      const projectsJson = await AsyncStorage.getItem(PROJECTS_KEY);
      const projects = JSON.parse(projectsJson || '[]');
      
      const updatedProjects = projects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
        return project;
      });

      await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
    } catch (error) {
      console.error('Error in updateProject:', error);
      throw error;
    }
  },

  deleteProject: async (projectId) => {
    try {
      const projectsJson = await AsyncStorage.getItem(PROJECTS_KEY);
      const projects = JSON.parse(projectsJson || '[]');
      
      const updatedProjects = projects.filter(project => project.id !== projectId);
      await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
    } catch (error) {
      console.error('Error in deleteProject:', error);
      throw error;
    }
  },

  // Helper method to clear all data (useful for testing)
  clearDatabase: async () => {
    try {
      await AsyncStorage.removeItem(PROJECTS_KEY);
      console.log('Database cleared successfully');
    } catch (error) {
      console.error('Error clearing database:', error);
      throw error;
    }
  },

  getProjectsByStatus: async (isComplete) => {
    try {
      const projectsJson = await AsyncStorage.getItem(PROJECTS_KEY);
      const projects = JSON.parse(projectsJson || '[]');
      
      // Get the current user's ID
      const userEmail = await AsyncStorage.getItem('userEmail');
      const usersJson = await AsyncStorage.getItem('@users');
      const users = JSON.parse(usersJson || '[]');
      const currentUser = users.find(u => u.email === userEmail);
      
      // Filter projects based on completion status and user ID
      return projects.filter(project => 
        project.isCompleted === isComplete && 
        project.userId === currentUser?.id
      );
    } catch (error) {
      console.error('Error getting projects by status:', error);
      throw error;
    }
  },

  updateProjectImage: async (projectId, imageUri) => {
    try {
      const projectsJson = await AsyncStorage.getItem(PROJECTS_KEY);
      const projects = JSON.parse(projectsJson || '[]');
      
      const updatedProjects = projects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            imageUri,
            updatedAt: new Date().toISOString()
          };
        }
        return project;
      });

      await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
    } catch (error) {
      console.error('Error in updateProjectImage:', error);
      throw error;
    }
  },

  authenticateUser: async (email, password) => {
    try {
      const usersJson = await AsyncStorage.getItem('@users');
      const users = JSON.parse(usersJson || '[]');
      
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        return { error: 'Invalid credentials' };
      }
      
      // Store the email for profile display
      await AsyncStorage.setItem('userEmail', email);
      
      return { userId: user.id };
    } catch (error) {
      console.error('Error in authenticateUser:', error);
      return { error: 'Authentication failed' };
    }
  },

  createUser: async (email, password) => {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users = JSON.parse(usersJson || '[]');
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return { error: 'User already exists' };
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        password
      };
      
      users.push(newUser);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // Store the email for profile display
      await AsyncStorage.setItem('userEmail', email);
      
      return { userId: newUser.id };
    } catch (error) {
      console.error('Error in createUser:', error);
      return { error: 'Failed to create user' };
    }
  }
};

export default DatabaseService;