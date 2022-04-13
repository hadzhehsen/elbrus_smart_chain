import { delUser } from "../actions/user.action"

export const asyncDelUser = (user) => async (dispatch) => {
  await fetch('http://localhost:3001/clearcookie', {
    credentials: 'include'
  })
  dispatch(delUser(user))
}
