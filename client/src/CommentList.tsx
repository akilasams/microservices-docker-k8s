interface Comment {
  id: string;
  content: string;
  status: string;
}

const CommentList = ({ comments }: { comments: Array<Comment> }) => {
  const renderedComments = comments.map((comment) => {
    const { status, content } = comment;

    const renderCommentContent = () => {
      let displayContent =
        status === "approved"
          ? content
          : status === "pending"
          ? "This comment is awaiting moderation"
          : status === "rejected"
          ? "This comment has been rejected"
          : "";

      if (status === "approved") return displayContent;
      else return <i>{displayContent}</i>;
    };

    return <li key={comment.id}>{renderCommentContent()}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
