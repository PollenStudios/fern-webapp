export const initialStateWalletBalance = {
  balance: '',
  loading: false,
  error: null,
};

export const reducerWalletBalance = (state = initialStateWalletBalance, action: any) => {
  switch (action.type) {
    case 'success':
      return { ...state, loading: false, balance: action.payload };
    case 'loading':
      return { ...state, loading: true };
    case 'error':
      return { ...state, loading: false, error: action.payload };
    default:
      return { ...state };
  }
};

export const initialStateAccount = {
  account: '',
  loading: false,
  error: null,
};

export const reducerAccount = (state = initialStateAccount, action: any) => {
  switch (action.type) {
    case 'success':
      return { ...state, loading: false, account: action.payload };
    case 'loading':
      return { ...state, loading: true };
    case 'error':
      return { ...state, loading: false, error: action.payload };
    default:
      return { ...state };
  }
};
export const initialStateHasProfile = {
  hasProfile: false,
  loading: false,
  error: null,
};

export const reducerHasProfile = (state = initialStateHasProfile, action: any) => {
  switch (action.type) {
    case 'success':
      return { ...state, loading: false, hasProfile: action.payload };
    case 'loading':
      return { ...state, loading: true };
    case 'error':
      return { ...state, loading: false, error: action.payload };
    default:
      return { ...state };
  }
};
export const initialStateUserSigNonce = {
  userSigNonce: '',
  loading: false,
  error: null,
};

export const reducerUserSigNonce = (state = initialStateUserSigNonce, action: any) => {
  switch (action.type) {
    case 'success':
      return { ...state, loading: false, userSigNonce: action.payload };
    case 'loading':
      return { ...state, loading: true };
    case 'error':
      return { ...state, loading: false, error: action.payload };
    default:
      return { ...state };
  }
};
export const initialStateCurrentProfile = {
  currentProfile: null,
  loading: false,
  error: null,
};

export const reducerCurrentProfile = (state = initialStateCurrentProfile, action: any) => {
  switch (action.type) {
    case 'success':
      return { ...state, loading: false, currentProfile: action.payload };
    case 'loading':
      return { ...state, loading: true };
    case 'error':
      return { ...state, loading: false, error: action.payload };
    default:
      return { ...state };
  }
};

export const initialStateIsLoggedIn = {
  isLoggedIn: false,
  loading: false,
  error: null,
};

export const reducerIsLoggedIn = (state = initialStateIsLoggedIn, action: any) => {
  switch (action.type) {
    case 'success':
      return { ...state, loading: false, isLoggedIn: action.payload };
    case 'loading':
      return { ...state, loading: true };
    case 'error':
      return { ...state, loading: false, error: action.payload };
    default:
      return { ...state };
  }
};
