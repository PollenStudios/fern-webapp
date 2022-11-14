const clearStorage = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('lenster.store');
  localStorage.removeItem('transaction.store');
  localStorage.removeItem('backendToken');
};
export default clearStorage;
