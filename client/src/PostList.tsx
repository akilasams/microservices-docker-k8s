import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

interface Comment {
  id: string;
  content: string;
  status: string;
}

interface Post {
  id: string;
  title: string;
  comments: Array<Comment>;
}

interface Posts {
  [id: string]: Post;
}

const PostList = () => {
  const [posts, setPosts] = useState<Posts>({});

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://posts.com/posts");
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderedPosts = Object.values(posts).map((post) => {
    return (
      <div
        className="card"
        style={{ width: "30%", marginBottom: "20px" }}
        key={post.id}
      >
        <div className="card-body">
          <h3>{post.title}</h3>
          <CommentList comments={post.comments} />
          <CommentCreate postId={post.id} />
        </div>
      </div>
    );
  });

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {renderedPosts}
    </div>
  );
};

export default PostList;
