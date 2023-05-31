import cookieKeys from "@/constants/cookieKeys";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home({ auth }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(auth ? "/home" : "/auth/login");
  });
  return <div />;
}

export const getServerSideProps = (context) => {
  let auth = false;
  const jwt = context.req.cookies?.[cookieKeys.JWT];
  if (jwt) {
    auth = true;
  }

  return {
    props: {
      auth,
    },
  };
};
