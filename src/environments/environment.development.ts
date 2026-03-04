// dev environment
export const environment = {
  baseURL: 'https://route-posts.routemisr.com/',
  requestTimeout: 3000,
  cacheTTL: 5 * 60 * 1000,
  userToken: 'userToken',
  PASSWORD_PATTERN: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
  PHONE_EG: /^01[0125]\d{8}$/,
};
