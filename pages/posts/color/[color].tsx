import { useRouter } from 'next/router';
import React from 'react'

const SingleColor = () => {
    const router = useRouter();
    const color = router.query.color;
    console.log(router.query.params)
    return <div>{color}</div>;
}

export default SingleColor