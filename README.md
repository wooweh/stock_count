# 📦 Stock Count

Stock Count is a web application that allows small businesses to empower their stock take team with collaborative realtime stock counting tools and analysis.

The idea was inspired by the need to provide a simple, effective tool to my wife to enforce a strong control in the most important component of her small business; stock.

Feel free to use the code, or to contribute to this repo.

## 📋 Application Overview

The application has the following features:
- **User Authentication**: Users can sign up, login, and sign out.
- **User Profile Management**: Users can create, update, and delete their profile.
- **Organisation Profile Management**: Users can create, update, and delete an org profile.
- **Organisation Team Management**: Org admin users can create, update, and delete team members, as well as assign member roles.
- **Inventory Management**: Org admin users can upload, create, update, and delete inventory items.
- **Stock Counting**: Org admin users can setup a solo, dual or team count, with ability to record usable, damaged and obselete item counts.
- **Stock Analysis**: Org admin can access and view org stock count history and export stock count data in CSV format.

## 🏗️ Architecture Overview
The application utilises a three-layer architecture with features organised in feature-slices.

### 📚 Components and utilities
The application is structured with a feature-based approach, with components and utilities classified into:
- **Global**: Components and utilities used across multiple features.
- **Feature**: Components and utilities that belong to a specific feature or sub feature context.

### 🔄 State Management
- **Redux with Redux Toolkit**: Used to manage application state. 
- **Zustand**: Manages state specific to feature UI presentation, delinked from application state.

### 🔀 Data Flow
The data flow follows the unidirectional pattern commonly associated with Redux applications:
1. **Action Dispatch**: Actions are dispatched to Redux slices.
2. **Reducer Processing**: Reducers update the state based on the dispatched actions.
3. **Middleware**: Middleware (listeners) handle asynchronous operations, often interacting with Firebase Realtime DB.
4. **Component Update**: Components connected to Redux re-render based on the new state. state is memoized.

### 🔥 Backend Integration
The application integrates with Firebase for backend services:
- **Firebase Realtime DB Web**: Stores application data.
- **Firebase Authentication Web**: Manages user authentication and authorization.
- **Firebase Hosting**: Domain and hosting configuration.

### 🗄️ Database Structure

- `database:`
  - `test:`
    - Same as main, used in dev mode.
  - `main:`
    - `count:`
      - `orgUuid:` `countData` - count deleted when complete/cancelled
    - `history:`
      - `orgUuid:`
        - `countUuid:` `countHistoryData`
    - `invites:`
      - `inviteUuid:` `orgUuid` - invite deleted upon accept/deny
    - `orgs:`
      - `orgUuid:` `orgData`
    - `stock:`
      - `orgUuid:` `stockData`
    - `users:`
      - `userUuid:` `userData`

### 🧪 Testing
Testing is conducted at 2 levels:
- **Unit Testing**: Implemented with Vitest for utility functions.
- **UI Testing**: Conducted with Playwright for end-to-end user interface testing.

### 🗂️ File Structure
Notable aspects of the file structure:
```
src/
  app/ 
    store.ts - Redux store configuration.
    hooks.ts - Custom Redux hooks for dispatch and selector.
  common/ 
    theme.ts - Global theme hook.
    utils.ts - Global utility functions.
  components/ - Global components used across multiple features.
  features/
    feature/
      feature.tsx - Main UI component for feature.
      subFeature.tsx - Sub feature UI component.
      featureSlice.ts - Redux slice for feature.
      featureSlice.spec.ts - Unit testing for reducer functions.
      featureSliceSelectors.ts - Redux selectors for feature.
      featureSliceEffects.ts - Middleware listeners triggered by redux reducers.
      featureSliceUtils.ts - Business logic functions.
      featureSliceRemote/Auth.ts - DB and Auth API wrapper functions.
      featureUtils.ts - Utility functions for UI presentation.
      featureUtils.spec.ts - Unit tests for feature utility functions.
  remote/ - Firebase configuration and DB paths.
tests/
  - Playwright UI tests for end-to-end scenarios.
```

## 🏁 Getting Started
You will need to set up a new Firebase project to get credentials to make use of the hosting, authentication and database SDKs.

To set up and run the Stock Counting Application, follow these steps:

1. **Clone the Repository**: `git clone https://github.com/wooweh/stock_count`
2. **Install Dependencies**: `npm install`
3. **Start the Development Server**: `npm run dev`
4. **Open the App**: Visit `http://localhost:5173/` in your browser.
5. **Run unit tests**: `npm run test`
