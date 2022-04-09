import * as action from '../actionTypes';
export const addUsers = (users) => ({
  type: action.ADD_USERS,
  payload: users,
});
