import { useReactiveVar } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";
import { counterVar } from "../../cache";

const Posts = () => {
  const router = useRouter();
  const counter = useReactiveVar(counterVar);
  return (
    <>
      <div>FirstPost</div>
      {counter.value}
      <button onClick={() => router.back()}> Hello</button>
    </>
  );
};

export default Posts;
