const {VUE_APP_API_PROTOCOL, VUE_APP_API_HOST, VUE_APP_API_KEY} = process.env;
const BASE_URL = `${VUE_APP_API_PROTOCOL}://${VUE_APP_API_HOST}`;

const getQueryString = (queryParams: Object) => Object.entries(queryParams).reduce((result, [key, value]) => (result ? `${result}&${key}=${value}` : `${key}=${value}`), '');

const createUrl = (url: string, queryString: string) => {
  return `${BASE_URL}${url}?${queryString}&appid=${VUE_APP_API_KEY}`;
};

export const httpRequest = async (pathName: string, method = 'get', body = {}, queryParams = {}) => {
  const queryString = getQueryString(queryParams);
  const url = createUrl(pathName, queryString);
  try {
    return await (
      await fetch(url, {
        method,
      })
    ).json();
  } catch (e) {
    console.log(e);
  }
};
