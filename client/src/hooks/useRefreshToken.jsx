import axios from '../api/axios';
import useAuth from './useAuth';

const REFRESH_URL = '/auth/refresh';

export default function useRefreshToken() {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.get(REFRESH_URL);
      setAuth((prev) => {
        return {
          ...prev,
          username: response.data.username,
          accessToken: response.data.accessToken,
        };
      });

      return response.data.accessToken;
    } catch (error) {}
  };

  return refresh;
}
