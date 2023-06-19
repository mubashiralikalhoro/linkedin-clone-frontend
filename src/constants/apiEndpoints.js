const apiEndPoints = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  USER_ME: "/api/users/me",
  USER: "/api/users",
  LOGIN: "/api/auth/login",
  SIGNUP: "/api/auth/signup",
  POSTS: "/api/posts",
  SKILLS: "/api/skills",
  CONNECTIONS: "/api/connections",
  MESSAGES: "/api/messages",
};

export default apiEndPoints;
