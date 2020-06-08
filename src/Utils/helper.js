import { AUTH_USER_TOKEN_KEY } from './constants';
import jwtDecode from 'jwt-decode';

/**
 * helper method to validate  user token
 *
 * @param {*} token
 * @returns {boolean}
 */
export const validateToken = (): boolean => {
	const token = localStorage.getItem(AUTH_USER_TOKEN_KEY);
  if (!token) {
    return false;
  }
  try {
    const decodedJwt: any = jwtDecode(token);
    return decodedJwt.exp >= Date.now() / 1000;
  } catch (e) {
    return false;
  }
};
