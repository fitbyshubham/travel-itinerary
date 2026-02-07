import React from "react";
import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  Globe,
  Lock,
  Map,
  Calendar,
  EyeOff,
} from "lucide-react";
import type { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
  onClick: (id: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  // 1. Get Thumbnail (First image upload)
  // We prefer image type for thumbnail, but if only video exists, we might need a placeholder or first frame logic
  // For now, prompt says "Use the first upload where type === 'image'"
  const thumbnail = post.uploads?.find((u) => u.type === "image")?.signed_url;

  // 2. Media Count
  const mediaCount = post.uploads?.length || 0;

  // 3. Date Formatting
  const createdDate = new Date(post.created_at).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const isPrivate =
    post.visibility === "private" || post.visibility === "draft";

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onClick(post.id)}
      className="group relative bg-[#050A15] border border-white/10 hover:border-neon-pink/30 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col md:flex-row h-auto md:h-32"
    >
      {/* Thumbnail Section */}
      <div className="relative w-full md:w-32 h-32 md:h-full bg-white/5 shrink-0 overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#0A1020]">
            <ImageIcon className="w-8 h-8 text-white/10" />
            <span className="text-[9px] font-tech text-white/20">
              NO_PREVIEW
            </span>
          </div>
        )}

        {/* Visibility Badge (Overlay) */}
        <div className="absolute top-2 left-2">
          <div
            className={`px-1.5 py-0.5 rounded text-[8px] font-tech uppercase tracking-wider border backdrop-blur-md flex items-center gap-1 ${
              !isPrivate
                ? "bg-black/60 border-neon-blue/30 text-neon-blue"
                : "bg-black/60 border-white/10 text-white/50"
            }`}
          >
            {!isPrivate ? (
              <Globe className="w-2 h-2" />
            ) : (
              <Lock className="w-2 h-2" />
            )}
            {post.visibility}
          </div>
        </div>

        {/* Media Count Badge */}
        {mediaCount > 0 && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1">
            <ImageIcon className="w-2.5 h-2.5 text-white/70" />
            <span className="text-[9px] font-mono text-white/90">
              {mediaCount}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 p-3 flex flex-col justify-between min-h-[100px] md:min-h-0">
        <div className="space-y-1">
          <h3 className="font-sans text-sm font-medium text-white group-hover:text-neon-pink transition-colors line-clamp-1">
            {post.title}
          </h3>

          <p className="text-xs text-white/60 font-light line-clamp-2 leading-relaxed">
            {post.description}
          </p>

          {/* Linked Itinerary */}
          {post.itineraries && (
            <div className="flex items-center gap-1.5 pt-1 text-[10px] text-neon-blue/80 font-mono">
              <Map className="w-2.5 h-2.5" />
              <span className="truncate">
                Itinerary: {post.itineraries.title}
              </span>
            </div>
          )}
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-[10px] text-white/20 font-mono">
            <Calendar className="w-2.5 h-2.5" />
            <span>{createdDate}</span>
          </div>

          {post.visibility === "draft" && (
            <div className="flex items-center gap-1 text-[9px] font-tech text-white/30 uppercase">
              <EyeOff className="w-2.5 h-2.5" />
              Draft
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
