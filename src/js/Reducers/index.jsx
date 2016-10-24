import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import todos from './Todo';

export default combineReducers({
  routing,
  todos
});
