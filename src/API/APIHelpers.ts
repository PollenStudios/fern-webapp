import { API_BASE_URL } from './APIConstant';

export function getAPIUrl(endpoint: string) {
  return API_BASE_URL + endpoint;
}
