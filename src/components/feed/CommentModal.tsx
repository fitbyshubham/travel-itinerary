import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  X,
  Send,
  MessageCircle,
  Trash2,
  Loader2,
  AlertCircle,
  Terminal,
  ChevronRight,
  Activity,
} from "lucide-react";
import { feedApi } from "@/lib/api";
import type { Comment } from "@/types/feed";
import { useAuthStore } from "@/lib/store";

interface CommentModalProps {
  postId: string;
  onClose: () => void;
  onCommentAdded?: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  postId,
  onClose,
  onCommentAdded,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAuthStore((state) => state.user);

  // Cast motion.div to any to bypass environment-specific typing issues
  const MotionDiv = motion.div;

  const commentsEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const response = await feedApi.fetchComments(postId);
        if (isMounted) {
          setComments(response.comments);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Error loading comments");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (postId) {
      fetchComments();
    }

    return () => {
      isMounted = false;
    };
  }, [postId]);

  useEffect(() => {
    if (comments.length > 0) {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  // Focus textarea on mount
  useEffect(() => {
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 500); // Wait for animation
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await feedApi.addComment(postId, commentText);
      if (response.success) {
        // Enrich comment with current user info if missing
        const newComment = {
          ...response.comment,
          commenter: response.comment.commenter || {
            id: user?.id || "",
            name: user?.name || user?.user_metadata?.name || "You",
            avatar_url: user?.avatar_url || user?.user_metadata?.avatar_url
          }
        };
        setComments((prev) => [...prev, newComment]);
        setCommentText("");
        if (onCommentAdded) {
          onCommentAdded();
        }
      }
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setIsSubmitting(false);
      // Keep focus
      textareaRef.current?.focus();
    }
  };

  const handleDeleteUI = (commentId: string) => {
    console.log("Delete requested for:", commentId);
    // UI-only for now
  };

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4 backdrop-blur-sm bg-black/80"
      onClick={onClose}
    >
      <MotionDiv
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 350, mass: 0.8 }}
        className="w-full max-w-lg h-[85vh] sm:h-[650px] flex flex-col bg-[#030508] border-t sm:border border-white/10 sm:rounded-xl shadow-2xl relative overflow-hidden"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header HUD */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#050A15] relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-neon-lime" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-tech text-xs text-white tracking-wider">
                  Comments
                </span>
                <div className="w-1.5 h-1.5 bg-neon-lime rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 transition-colors text-white/50 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Data Stream (Comments) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 relative bg-[#030508] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {/* Tech Background Grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 opacity-60">
              <Loader2 className="w-6 h-6 text-neon-lime animate-spin" />
              <span className="font-tech text-[10px] tracking-widest text-neon-lime">
                Loading comments...
              </span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-neon-pink gap-2">
              <AlertCircle className="w-6 h-6" />
              <span className="font-mono text-xs">{error}</span>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-white/20 gap-3">
              <Terminal className="w-8 h-8 opacity-20" />
              <span className="font-tech text-[10px]">No comments yet</span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {comments.map((comment, index) => (
                <MotionDiv
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-3 group"
                >
                  {/* Line Number / Avatar */}
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <span className="font-mono text-[8px] text-white/20">
                      {index + 1}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 overflow-hidden relative">
                      {comment.commenter?.avatar_url ? (
                        <Image
                          src={comment.commenter.avatar_url}
                          fill
                          className="object-cover"
                          alt="User"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-white/30 font-tech">
                          <Activity className="w-3 h-3 opacity-20" />
                        </div>
                      )}
                    </div>
                    <div className="w-px h-full bg-white/5 group-last:hidden min-h-[10px]" />
                  </div>

                  {/* Content Bubble */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-tech text-[10px] text-neon-blue/80">
                        {comment.commenter?.name || `User_${comment.commenter_id.slice(0, 4)}`}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] text-white/20">
                          {new Date(comment.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <button
                          onClick={() => handleDeleteUI(comment.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.08] p-2.5 rounded-sm rounded-tr-lg relative">
                      <p className="text-xs sm:text-sm text-white/90 font-light leading-relaxed whitespace-pre-wrap font-sans">
                        {comment.comment_text}
                      </p>
                      {/* Corner tick */}
                      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
                    </div>
                  </div>
                </MotionDiv>
              ))}
              <div ref={commentsEndRef} />
            </div>
          )}
        </div>

        {/* Footer Input - Horizontal Layout */}
        <div className="relative z-50 p-2 sm:p-3 bg-[#050A15] border-t border-white/10">
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <div className="flex-1 relative bg-black/40 border border-white/10 rounded-lg focus-within:border-neon-lime/40 focus-within:bg-black/60 transition-all duration-300">
              <div className="absolute left-3 top-3.5 pointer-events-none">
                <ChevronRight className="w-4 h-4 text-neon-lime animate-pulse" />
              </div>
              <textarea
                ref={textareaRef}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Write a comment..."
                className="relative z-10 w-full bg-transparent border-none text-white font-mono text-sm py-3 pl-9 pr-3 focus:outline-none resize-none max-h-32 min-h-[46px] placeholder-white/20 leading-relaxed scrollbar-none"
                rows={1}
                style={{ height: "46px" }}
              />
            </div>

            <button
              type="submit"
              disabled={!commentText.trim() || isSubmitting}
              className="h-[46px] px-4 bg-neon-lime hover:bg-neon-lime/90 disabled:bg-white/5 disabled:text-white/20 text-black rounded-lg flex items-center justify-center transition-all duration-200 font-tech text-xs tracking-wider min-w-[50px] sm:min-w-[100px] shadow-[0_0_15px_rgba(204,255,0,0.1)] hover:shadow-[0_0_20px_rgba(204,255,0,0.3)]"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  <span className="hidden sm:inline">Post</span>
                  <Send className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>
        </div>
      </MotionDiv>
    </MotionDiv>
  );
};

export default CommentModal;
