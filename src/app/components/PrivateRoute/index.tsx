import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: any) => {
  const isLoggedIn = localStorage.getItem('accessToken') ? true : false;
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};
export default PrivateRoute;
