import {combineReducers} from 'redux';
import photoReducer from './addFoto.reducer';


const rootReducer = combineReducers({
  fotos: photoReducer,

})

export default rootReducer
