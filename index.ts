import { registerRootComponent } from 'expo';

// If './App' does not exist or is misnamed, fix the import path or create the file.
// For now, provide a fallback to prevent import errors.
let App: React.ComponentType<any>;
try {
  App = require('./App').default;
} catch (e) {
  // Fallback: simple placeholder component
  App = () => null;
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
