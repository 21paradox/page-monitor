import { UPDATE_COMMON } from '../constants';

const initState = {
  lang: navigator.language || 'en',
  user: { nickname: '' },
  userLoggedIn: true,
};

export default (state = initState, action) => {
  if (action.type === UPDATE_COMMON) {
    return {
      ...state,
      ...action.payload,
    };
  }

  return state;
};
