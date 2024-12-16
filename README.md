# Mobile Application for Knitting and Crochet Projects

## Overview
This mobile application, built using Expo, supports Android and Apple devices. It helps users track knitting and crochet projects, store records of works in progress and completed projects, and update project progress in real-time. Users can also add photos of their projects, which are displayed aesthetically in a gallery view for easy reflection or sharing.

## Key Features
- **User Authentication:** Secure login and registration system with credentials stored using async storage.
- **Project Management:** Track projects, update progress, and toggle completion status.
- **Gallery View:** Display project photos in an organized, visually pleasing format.
- **Customizable Workspace:** Secure user sign-in and personalized project management experience.

## How to Run the Code
1. Download the GitHub repository.
2. Navigate to the project directory:
   ```bash
   cd Mobile-App-Crocheters-and-Knitters
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the application:
   ```bash
   npx expo start
   ```
## App Navigation
### 1. Authentication
- **Functionality:**
  - Sign in or sign up with personal credentials.
  - Toggle between sign-in and sign-up as needed.
- **Technical Details:**
  - Credentials stored using async storage.
  - Valid credentials allow access; invalid entries prompt an error popup.
- **UI Considerations:**
  - Simple, readable, and user-friendly design with large, contrasting buttons.

### 2. General Navigation
- **Tabs:**
  - **Projects Tab:** Manage and track projects.
  - **Gallery Tab:** Display project photos aesthetically.
  - **Profile Tab:** View account info and sign out.

### 3. Profile Tab
- **Functionality:**
  - Displays signed-in email and offers a sign-out option.
- **Technical Details:**
  - User info retrieved from async storage.
  - Sign-out redirects to the login page.
- **UI Considerations:**
  - Prominent sign-out button in a contrasting color for clarity.

### 4. Projects Tab
- **Header Features:**
  - **Info Button:** Displays a usage guide popup.
  - **Search Button:** Toggle a search bar for project search by name, yarn type, or hook size.
- **Project Feed:**
  - Scrollable project cards with summaries.
  - Clicking a card opens its detailed view.
- **Filter Buttons:**
  - Toggle views for all, completed, or incomplete projects.
- **New Project Button:**
  - Opens a form to create new projects.

### 5. Project Details Page
- **Overview:**
  - Display project details in a scrollable view.
  - Toggle project completion.
- **Updating Counters:**
  - Update progress counters with real-time changes.
- **Editing Projects:**
  - Edit or delete project details using the pencil icon.
  - Upload photos with a built-in picture picker.

### 6. New Project Page
- **Functionality:**
  - Fully customize projects with optional details.
  - Add unlimited counters for detailed tracking.

### 7. Gallery Tab
- **Overview:**
  - View project photos in an aesthetically pleasing feed.
  - Click an image to see project details and manage the project.
- **Header:**
  - Includes search and information buttons similar to the Projects tab.

## UI Considerations
- Cohesive and visually pleasing color scheme.
- Consistent header design for a unified appearance.
- Non-default background color throughout.
- Text wrapping ensures readability within text boxes.
