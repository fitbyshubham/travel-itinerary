"use client"
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Image as ImageIcon, Plus } from "lucide-react";
import { postApi } from "@/lib/api";
import type { Post } from "@/types/post";
import { PostCard } from "./PostCard";

interface PostListProps {
  onNavigate: (path: string) => void;
}

type FilterType = "all" | "public" | "private";

export const PostList: React.FC<PostListProps> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await postApi.list();

        // Handle array response directly
        const data = Array.isArray(response) ? response : [];

        // Filter out soft_deleted items
        const activePosts = data.filter((post) => !post.soft_deleted);

        setPosts(activePosts);
      } catch (err: any) {
        console.error("Failed to fetch posts:", err);
        setError("Failed to load posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    if (filter === "all") return true;
    if (filter === "public") return post.visibility === "public";
    // Group private and draft under 'private' filter for simplicity in UI, or strict match
    if (filter === "private")
      return post.visibility === "private" || post.visibility === "draft";
    return true;
  });

  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "public", label: "Public" },
    { id: "private", label: "Private" },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/30">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-neon-pink" />
        <span className="font-tech text-xs tracking-widest">
          Loading Posts...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex p-1 bg-white/5 rounded-lg border border-white/10">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                filter === f.id
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <PostCard
                  post={post}
                  onClick={(id) => onNavigate(`/post/${id}`)}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-xl bg-white/[0.01]"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <ImageIcon className="w-8 h-8 text-white/20" />
              </div>
              <h3 className="text-lg font-medium text-white/80 mb-1">
                No Posts Found
              </h3>
              <p className="text-sm text-white/40 mb-6">
                {filter === "all"
                  ? "You haven't shared any moments yet."
                  : `No ${filter} posts found.`}
              </p>
              <button
                onClick={() => onNavigate("/create/post")}
                className="flex items-center gap-2 px-5 py-2.5 bg-neon-pink/10 hover:bg-neon-pink/20 text-neon-pink border border-neon-pink/30 rounded-lg text-xs font-tech transition-all"
              >
                <Plus className="w-4 h-4" />
                CREATE NEW POST
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* End Marker */}
      {filteredPosts.length > 0 && (
        <div className="flex justify-center pt-4 pb-8">
          <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
            End of Stream
          </span>
        </div>
      )}
    </div>
  );
};
