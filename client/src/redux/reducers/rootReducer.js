import { combineReducers } from 'redux';
import photoReducer from './addFoto.reducer';
import usersReducer from './users.reducer';

const rootReducer = combineReducers({
  fotos: photoReducer,
  users: usersReducer,
});

export default rootReducer;
