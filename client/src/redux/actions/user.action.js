import * as action from '../actionTypes';
export const addUsers = (users) => ({
  type: action.ADD_USERS,
  payload: users,
});
export const delUser = (user) => ({
  type: action.DEL_USER,
  payload: user,
})
