"use client";

import { useParams } from "next/navigation";

export default function CreatorDetailPage() {
  const params = useParams();
  const id = params.id;

  return (
    <div className="min-h-screen bg-[#000411] text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Creator Profile</h1>
        <p>Creator ID: {id}</p>
        <p className="text-white/60 mt-4">This page is under construction.</p>
      </div>
    </div>
  );
}
