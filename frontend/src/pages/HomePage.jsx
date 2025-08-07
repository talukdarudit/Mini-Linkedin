import React, { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { Plus, User, Calendar, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

const HomePage = () => {
  const { authUser } = useAuthStore();
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/post/getallposts");
      setPostData(res.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!newPostContent.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }

    try {
      setIsCreatingPost(true);
      const res = await axiosInstance.post("/post/createpost", {
        postContent: newPostContent.trim(),
      });

      // Add the new post to the beginning of the posts array
      setPostData([res.data, ...postData]);
      setNewPostContent("");
      setShowCreatePost(false);
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error.message);
      toast.error("Failed to create post");
    } finally {
      setIsCreatingPost(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading && postData.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-base-100">
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-base-100">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Home</h1>
          <p className="text-zinc-400 mt-1">What's happening today?</p>
        </div>

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="card bg-base-200 shadow-xl mb-6">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h3 className="card-title text-lg">Create New Post</h3>
                <button
                  onClick={() => {
                    setShowCreatePost(false);
                    setNewPostContent("");
                  }}
                  className="btn btn-sm btn-ghost"
                >
                  ✕
                </button>
              </div>

              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What's on your mind?"
                className="textarea textarea-bordered w-full h-32 resize-none"
                maxLength={500}
              />

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-zinc-500">
                  {newPostContent.length}/500 characters
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowCreatePost(false);
                      setNewPostContent("");
                    }}
                    className="btn btn-ghost btn-sm"
                    disabled={isCreatingPost}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createPost}
                    className="btn btn-primary btn-sm"
                    disabled={isCreatingPost || !newPostContent.trim()}
                  >
                    {isCreatingPost ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
            <button onClick={fetchPosts} className="btn btn-sm btn-ghost">
              Retry
            </button>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {postData.length === 0 && !loading ? (
            <div className="text-center py-16">
              <MessageSquare className="w-16 h-16 mx-auto text-zinc-400 mb-4" />
              <h3 className="text-xl font-semibold text-zinc-400 mb-2">
                No posts yet
              </h3>
              <p className="text-zinc-500 mb-4">
                Be the first to share something!
              </p>
            </div>
          ) : (
            postData.map((post) => (
              <div key={post._id} className="card bg-base-200 shadow-lg">
                <div className="card-body">
                  {/* Post Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div>
                      <h4 className="font-semibold text-sm">
                        {post.authorName || "Unknown User"}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-zinc-400">
                        <Calendar className="w-3 h-3" />
                        {formatTimestamp(post.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="text-base-content">
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {post.postContent}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Loading more indicator */}
        {loading && postData.length > 0 && (
          <div className="flex justify-center mt-6">
            <div className="loading loading-spinner loading-md"></div>
          </div>
        )}
      </div>

      {/* Fixed Floating Create Post Button - Aligned with content */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 max-w-2xl w-full px-4">
        <div className="flex justify-end">
          <button
            onClick={() => setShowCreatePost(true)}
            className="btn btn-primary btn-lg rounded-full w-16 h-16 shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
