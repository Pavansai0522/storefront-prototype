import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export type UseAuthResult = ReturnType<typeof useAuthContext> & {
  logoutAndNavigate: () => Promise<void>;
};

export function useAuth(): UseAuthResult {
  const navigate = useNavigate();
  const auth = useAuthContext();

  const logoutAndNavigate = async (): Promise<void> => {
    await auth.logout();
    navigate('/', { replace: true });
  };

  return {
    ...auth,
    logout: logoutAndNavigate,
  };
}
