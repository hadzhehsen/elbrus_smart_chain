import initState from '../initState';
const photoReducer = (state = initState().users, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'ADD_USERS':
      return [...state, payload];
    default:
      return state;
  }
};

export default photoReducer;
