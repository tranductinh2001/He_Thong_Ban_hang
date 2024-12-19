import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewListByProductId,clearReviewList } from "../../redux/slices/reviewSlice";
import { useParams } from "react-router-dom";

// Component cho bình luận cá nhân
const CustomComment = ({ author, content, datetime, rating }) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [action, setAction] = useState(null);

  const handleLike = () => {
    setLikes((prev) => (action === "liked" ? prev - 1 : prev + 1));
    setAction(action === "liked" ? null : "liked");
  };

  const handleDislike = () => {
    setDislikes((prev) => (action === "disliked" ? prev - 1 : prev + 1));
    setAction(action === "disliked" ? null : "disliked");
  };

  return (
    <div
      style={{
        border: "1px solid #f0f0f0",
        padding: "16px",
        margin: "8px 0",
        borderRadius: "8px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="https://via.placeholder.com/40" // Placeholder avatar
          alt="avatar"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            marginRight: "8px",
          }}
        />
        <div>
          <div style={{ fontWeight: "bold" }}>{author}</div>
          <div style={{ fontSize: "12px", color: "#888" }}>{datetime}</div>
        </div>
      </div>
      <div style={{ marginTop: "8px" }}>{content}</div>
      <div
        style={{
          marginTop: "8px",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <span
          onClick={handleLike}
          style={{
            cursor: "pointer",
            color: action === "liked" ? "blue" : "inherit",
          }}
        >
          👍 {likes}
        </span>
        <span
          onClick={handleDislike}
          style={{
            cursor: "pointer",
            color: action === "disliked" ? "red" : "inherit",
          }}
        >
          👎 {dislikes}
        </span>
        <div>
          <strong>Rating: </strong>{rating} ⭐
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { reviewList, loading, error } = useSelector((state) => state?.review);

  useEffect(() => {
    dispatch(clearReviewList());
    dispatch(fetchReviewListByProductId(productId));
  }, [dispatch, productId]);

  if (loading) return <p>Đang tải review...</p>;
  if (error) return <p>Lỗi: {error}</p>;
  return (
    <div style={{ padding: "20px", maxWidth: "2000px", margin: "auto" }}>
      {reviewList?.length === 0 ? (
        <p>Chưa có bình luận nào ở đây.</p>
      ) : (
        reviewList?.map((review) => (
          <CustomComment
            key={review.id}
            author={review.name}
            avatar={review.avatar || "https://via.placeholder.com/40"}
            content={review.description}
            datetime={new Date().toLocaleString()}
            rating={review.rating}
          />
        ))
      )}
    </div>
  );
}
