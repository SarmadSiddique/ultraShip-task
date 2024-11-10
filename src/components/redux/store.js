import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { binStatus } from './binStatus';

// Define the root reducer
const rootReducer = combineReducers({
  binStatus: binStatus.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['binStatus'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: false
    });
  }
});

// Persist the store
persistStore(store);

// Export the store
export { store };

