import type { NextPage } from "next";
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect, useState } from "react";
import { counterVar, postItemsVar } from "../cache";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_POSTS } from "./api/mutations";
import { GET_POSTS } from "./api/queries";

const Todo: React.FC<{ title: string; id: string }> = ({ title, id }) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [addTodo, { loading, error }] = useMutation(UPDATE_POSTS, {
    onCompleted: (data) => {
      setIsEdit(false);
      console.log("Data from mutation", data);
      let newArray = [...postItemsVar()];

      let index = newArray.findIndex((item) => item.id === id);

      newArray[index] = { ...postItemsVar()[index], title: tempTitle };
      console.log({ newArray });
      postItemsVar(newArray);
    },
    onError: (error) => {
      console.error("Error creating a post", error);
      setIsEdit(false);
    },
  });

  const [tempTitle, setTempTitle] = useState<string>(title);
  return (
    <>
      {isEdit ? (
        <input
          type="text"
          value={tempTitle}
          onChange={(e) => setTempTitle(e.target.value)}
        />
      ) : (
        <div>{title}</div>
      )}
      <button onClick={() => setIsEdit(!isEdit)}>Toggle</button>
      {isEdit && (
        <button
          onClick={() => {
            console.log("update clicked");
            addTodo({ variables: { id, input: { body: tempTitle } } });
          }}
        >
          Update
        </button>
      )}
    </>
  );
};

const Home: NextPage = () => {
  const postItems = useReactiveVar(postItemsVar);

  const counter = useReactiveVar(counterVar);

  const { loading, error, data } = useQuery(GET_POSTS, {
    variables: { limit: 5 },
  });
  useEffect(() => {
    console.log("I am here", data);
    if (data?.posts.data) {
      postItemsVar(data.posts.data);
    }
  }, [data]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  return (
    <>
      {/* For using post map */}

      {/* {postItems.map((post: { id: string; title: string }) => (
        <Todo key={post.id} title={post.title} id={post.id} />
      ))} */}

      {/* For using fields as slices */}
      <button
        onClick={() =>
          counterVar({ ...counterVar(), value: counter.value + 1 })
        }
      >
        Increment
      </button>
      <button
        onClick={() =>
          counterVar({ ...counterVar(), value: counter.value - 1 })
        }
      >
        Decrement
      </button>
      {counter.value}
    </>
  );
};

export default Home;
