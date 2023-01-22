import axios from '../api/axios';
import useAuth from './useAuth';

const LOGOUT_URL = 'auth/logout';

export default function useLogout() {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    try {
      await axios.post(
        LOGOUT_URL, //
        JSON.stringify({}),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      if (!error?.response) {
        console.log('No Server Response');
      } else {
        console.log(`Log out failed: ${error?.message}`);
      }
    }
  };

  return logout;
}
