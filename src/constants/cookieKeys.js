const cookieKeys = {
  JWT: "_jwt",
};

const cookieConfig = {
  MAX_AGE: 60 * 60 * 24 * 30 * 6, // 6 months
};

export { cookieConfig };
export default cookieKeys;
