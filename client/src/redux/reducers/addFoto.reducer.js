import initState from '../initState';
const photoReducer = (state = initState().fotos, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'ADD_FOTOS':
      return payload;
    default:
      return state;
  }
};

export default photoReducer;
