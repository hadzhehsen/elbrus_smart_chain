import initState from '../initState';
const usersReducer = (state = initState().users, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'ADD_USERS':
      return [...state, payload];
    case 'DEL_USER':
      return state.filter((el) => el !== payload)
    default:
      return state;
  }
};

export default usersReducer;
