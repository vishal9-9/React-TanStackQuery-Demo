import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Post = [
  { title: "Post1", id: 1 },
  { title: "Post2", id: 2 },
];

function wait(duration) {
  // const condition = Math.random() < 0.1;
  if (true) {
    return new Promise((resolve) => setTimeout(resolve, duration));
  }
  return setTimeout(Promise.reject("Error"), duration);
}

function App() {
  const queryClient = useQueryClient();

  const queryData = useQuery({
    queryKey: ["posts"], // unique key for every query
    queryFn: () =>
      wait(1000).then((obj) => {
        console.log(obj);
        return [...Post];
      }), // if the promise is rejected it retries some no. of times and then update the error
    enabled: true, // condition to call api if condition is true then only querfn will learn
    // refetchInterval: 1000 * 60,
    staleTime: 1000 * 60,
  });

  const updatePost = useMutation({
    mutationFn: (title) => {
      return wait(1000).then(() =>
        Post.push({ id: crypto.randomUUID(), title })
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  if (queryData.isLoading) return <h1>Loading...</h1>;
  if (queryData.isError) {
    return <h1>Error has Occurred</h1>;
  }

  return (
    <>
      {queryData.data.map((item) => (
        <h1 key={item?.id}>{item?.title}</h1>
      ))}
      <button
        disabled={updatePost.isPending}
        onClick={() => updatePost.mutate("Post3")}
      >
        Add Post
      </button>
    </>
  );
}

export default App;
