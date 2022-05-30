import type { NextPage } from "next";
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect, useState } from "react";
import { counterVar, postItemsVar } from "../cache";
import { useMutation } from "@apollo/react-hooks";
import { ADD_POST, UPDATE_POSTS } from "./api/mutations";
import { GET_COUNTER, GET_POSTS } from "./api/queries";
import { useRouter } from "next/router";

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
  const router = useRouter();

  const postItems = useReactiveVar(postItemsVar);

  const counter = useReactiveVar(counterVar);

  const [title, setTitle] = useState<string>("");

  const { loading, error, data } = useQuery(GET_POSTS, {
    variables: { limit: 5 },
  });
  useEffect(() => {
    console.log("I am here", data);
    if (data?.posts.data) {
      postItemsVar(data.posts.data);
    }
  }, [data]);

  const [addPost, { data: addData, loading: addLoading, error: addError }] =
    useMutation(ADD_POST, {
      onCompleted: (addData) => {
        console.log(addData);
        const { id, title } = addData.createPost;
        let newPosts = [...postItems];
        newPosts.unshift({ id, title });
        postItemsVar([...newPosts]);
      },
      onError: (addError) => {
        console.log(addError);
      },
      refetchQueries: [GET_POSTS],
    });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  return (
    <>
      {/* For adding a post */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        onClick={() =>
          addPost({
            variables: {
              input: {
                title,
                body: "Some interesting content.",
              },
            },
          })
        }
      >
        Add
      </button>
      <br />

      {/* For using fields as slices */}
      <button
        onClick={() => {
          router.push({ pathname: "/posts" });
        }}
      >
        Push
      </button>
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

      {/* For using post map */}

      {postItems.map((post: { id: string; title: string }) => (
        <Todo key={post.id} title={post.title} id={post.id} />
      ))}
    </>
  );
};

export default Home;
