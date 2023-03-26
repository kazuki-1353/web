export default (state = {}, action) => {
  if (action.type) {
    return {
      ...state,
      [action.type]: action.payload,
    };
  } else {
    return state;
  }
};
