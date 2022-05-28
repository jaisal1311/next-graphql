import React from "react";
import { useRouter } from "next/router";

const Color = () => {
  const router = useRouter();
  const color = router.query.color;
  return <div>Colors</div>;
};

export default Color;
