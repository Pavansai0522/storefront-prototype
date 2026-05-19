import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useAdminRoutes } from '../context/AdminConfigContext';

export type UseAuthResult = ReturnType<typeof useAuthContext> & {
  logoutAndNavigate: () => Promise<void>;
};

export function useAuth(): UseAuthResult {
  const navigate = useNavigate();
  const routes = useAdminRoutes();
  const auth = useAuthContext();

  const logoutAndNavigate = async (): Promise<void> => {
    await auth.logout();
    navigate(routes.LOGIN, { replace: true });
  };

  return {
    ...auth,
    logout: logoutAndNavigate,
  };
}
