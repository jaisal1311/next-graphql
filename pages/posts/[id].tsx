import { useRouter } from "next/router";
import React from "react";

const SinglePostById = () => {
  const router = useRouter();
  const id = router.query.id;
  return <div>Number {id}</div>;
};

export default SinglePostById;
