import cookieKeys from "@/constants/cookieKeys";
import { getCookie } from "cookies-next";

const getBearerAuth = () => {
  return `Bearer ${getCookie(cookieKeys.JWT)}`;
};

export default getBearerAuth;
