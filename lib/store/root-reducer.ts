import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from '../features/auth/authSlice';
// import { templatesReducer } from '../features/email-templates/editorTemplatesSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  // templates: templatesReducer,
});
