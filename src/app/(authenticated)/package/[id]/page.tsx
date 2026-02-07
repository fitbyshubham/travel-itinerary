// src/app/package/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Calendar,
  Lock,
  ShoppingBag,
} from "lucide-react";

export default function PackageDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  // No longer using state for pkg as it's derived
  // const [pkg, setPkg] = useState<any>(null);

  // Mock data — replace with real API call
  const allPackages = [
    {
      id: "pkg-1",
      title: "Tokyo Neon Nights",
      description:
        "Experience Tokyo's electric nightlife, hidden izakayas, and futuristic districts.",
      creator: { name: "Yuki Tanaka", avatar: "/avatars/yuki.jpg" },
      media: [
        { type: "video", url: "/videos/tokyo-night.mp4" },
        { type: "image", url: "/images/tokyo-shibuya.jpg" },
        { type: "image", url: "/images/tokyo-robot-restaurant.jpg" },
        { type: "image", url: "/images/tokyo-skytree.jpg" },
      ],
      price: 399,
      currency: "USD",
      itineraries: [
        {
          title: "Day 1: Shibuya & Harajuku",
          steps: [
            {
              start_location: "Shibuya Station",
              end_location: "Meiji Shrine",
              mode_of_transport: "Walk + Metro",
              duration_mins: 180,
              notes: "Visit at golden hour for best photos!",
              costs: [{ category: "Transport", amount: 5, currency: "JPY" }],
              stays: [],
              food: [],
              activities: [
                {
                  name: "Shibuya Crossing View",
                  cost: 0,
                  currency: "JPY",
                  duration_mins: 30,
                },
                {
                  name: "Harajuku Fashion Walk",
                  cost: 0,
                  currency: "JPY",
                  duration_mins: 120,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "pkg-2",
      title: "Santorini Sunset Escape",
      description:
        "Whitewashed villages, blue-domed churches, and endless Aegean views.",
      creator: { name: "Nikos", avatar: "/avatars/nikos.jpg" },
      media: [
        { type: "image", url: "/images/santorini-caldera.jpg" },
        { type: "image", url: "/images/santorini-blue-dome.jpg" },
        { type: "image", url: "/images/santorini-sunset.jpg" },
        { type: "video", url: "/videos/ santorini-walk.mp4" },
      ],
      price: 599,
      currency: "USD",
      itineraries: [
        {
          title: "Day 1: Oia Village Exploration",
          steps: [
            {
              start_location: "Fira Port",
              end_location: "Oia Castle",
              mode_of_transport: "Local Bus",
              duration_mins: 60,
              notes: "Arrive by 4 PM for sunset views",
              costs: [{ category: "Transport", amount: 3, currency: "EUR" }],
              stays: [],
              food: [],
              activities: [
                {
                  name: "Oia Castle Visit",
                  cost: 0,
                  currency: "EUR",
                  duration_mins: 60,
                },
                {
                  name: "Sunset Cocktail",
                  cost: 15,
                  currency: "EUR",
                  duration_mins: 90,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "pkg-3",
      title: "Marrakech Medina Magic",
      description:
        "Lose yourself in spice markets, riads, and ancient palaces of Morocco.",
      creator: { name: "Amina El Fassi", avatar: "/avatars/amina.jpg" },
      media: [
        { type: "image", url: "/images/marrakech-jemaa-el-fna.jpg" },
        { type: "image", url: "/images/marrakech-riad.jpg" },
        { type: "video", url: "/videos/marrakech-market.mp4" },
        { type: "image", url: "/images/marrakech-palace.jpg" },
      ],
      price: 450,
      currency: "USD",
      itineraries: [
        {
          title: "Day 1: Jemaa el-Fnaa Market",
          steps: [
            {
              start_location: "Riad Entrance",
              end_location: "Jemaa el-Fnaa Square",
              mode_of_transport: "Walk",
              duration_mins: 30,
              notes: "Go early to avoid crowds",
              costs: [{ category: "Transport", amount: 0, currency: "MAD" }],
              stays: [],
              food: [],
              activities: [
                {
                  name: "Spice Market Tour",
                  cost: 10,
                  currency: "MAD",
                  duration_mins: 90,
                },
                {
                  name: "Henna Art",
                  cost: 20,
                  currency: "MAD",
                  duration_mins: 60,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "pkg-4",
      title: "Patagonia Adventure",
      description:
        "Glaciers, mountains, and untouched wilderness in Argentina’s southern frontier.",
      creator: { name: "Diego Fernandez", avatar: "/avatars/diego.jpg" },
      media: [
        { type: "video", url: "/videos/patagonia-glacier.mp4" },
        { type: "image", url: "/images/patagonia-mountains.jpg" },
        { type: "image", url: "/images/patagonia-lake.jpg" },
        { type: "image", url: "/images/patagonia-camp.jpg" },
      ],
      price: 899,
      currency: "USD",
      itineraries: [
        {
          title: "Day 1: Perito Moreno Glacier",
          steps: [
            {
              start_location: "El Calafate Hotel",
              end_location: "Perito Moreno Glacier",
              mode_of_transport: "Bus",
              duration_mins: 120,
              notes: "Bring warm layers!",
              costs: [{ category: "Transport", amount: 25, currency: "ARS" }],
              stays: [],
              food: [],
              activities: [
                {
                  name: "Glacier Walk",
                  cost: 50,
                  currency: "ARS",
                  duration_mins: 180,
                },
                {
                  name: "Boat Tour",
                  cost: 75,
                  currency: "ARS",
                  duration_mins: 120,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "pkg-5",
      title: "Kyoto Zen Retreat",
      description:
        "Temples, tea houses, and tranquil gardens in Japan’s cultural heart.",
      creator: { name: "Haruto Sato", avatar: "/avatars/haruto.jpg" },
      media: [
        { type: "image", url: "/images/kyoto-fushimi-inari.jpg" },
        { type: "image", url: "/images/kyoto-golden-pavilion.jpg" },
        { type: "video", url: "/videos/kyoto-tea-ceremony.mp4" },
        { type: "image", url: "/images/kyoto-arashiyama.jpg" },
      ],
      price: 425,
      currency: "USD",
      itineraries: [
        {
          title: "Day 1: Fushimi Inari Shrine",
          steps: [
            {
              start_location: "Kyoto Station",
              end_location: "Fushimi Inari Shrine",
              mode_of_transport: "Train",
              duration_mins: 45,
              notes: "Start early to beat the crowds",
              costs: [{ category: "Transport", amount: 4, currency: "JPY" }],
              stays: [],
              food: [],
              activities: [
                {
                  name: "Torii Gate Hike",
                  cost: 0,
                  currency: "JPY",
                  duration_mins: 180,
                },
                {
                  name: "Matcha Tea Break",
                  cost: 12,
                  currency: "JPY",
                  duration_mins: 60,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "pkg-6",
      title: "Iceland Northern Lights",
      description:
        "Chase auroras, soak in geothermal pools, and explore volcanic landscapes.",
      creator: { name: "Elin Jónsdóttir", avatar: "/avatars/elin.jpg" },
      media: [
        { type: "image", url: "/images/iceland-northern-lights.jpg" },
        { type: "image", url: "/images/iceland-blue-lagoon.jpg" },
        { type: "video", url: "/videos/iceland-aurora.mp4" },
        { type: "image", url: "/images/iceland-waterfall.jpg" },
      ],
      price: 750,
      currency: "USD",
      itineraries: [
        {
          title: "Day 1: Blue Lagoon & Reykjavik",
          steps: [
            {
              start_location: "Keflavik Airport",
              end_location: "Blue Lagoon",
              mode_of_transport: "Transfer Bus",
              duration_mins: 45,
              notes: "Book Blue Lagoon in advance",
              costs: [{ category: "Transport", amount: 20, currency: "ISK" }],
              stays: [],
              food: [],
              activities: [
                {
                  name: "Blue Lagoon Soak",
                  cost: 80,
                  currency: "ISK",
                  duration_mins: 120,
                },
                {
                  name: "Reykjavik City Tour",
                  cost: 35,
                  currency: "ISK",
                  duration_mins: 180,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "pkg-7",
      title: "New Orleans Jazz Journey",
      description:
        "Live music, Creole cuisine, and historic streets in the Big Easy.",
      creator: { name: "Marcus LeBlanc", avatar: "/avatars/marcus.jpg" },
      media: [
        { type: "video", url: "/videos/new-orleans-street-music.mp4" },
        { type: "image", url: "/images/new-orleans-french-quarter.jpg" },
        { type: "image", url: "/images/new-orleans-jazz-club.jpg" },
        { type: "image", url: "/images/new-orleans-beignets.jpg" },
      ],
      price: 375,
      currency: "USD",
      itineraries: [
        {
          title: "Day 1: French Quarter Walk",
          steps: [
            {
              start_location: "Hotel in French Quarter",
              end_location: "Bourbon Street",
              mode_of_transport: "Walk",
              duration_mins: 120,
              notes: "Try beignets at Café du Monde",
              costs: [{ category: "Transport", amount: 0, currency: "USD" }],
              stays: [],
              food: [],
              activities: [
                {
                  name: "Jazz Club Visit",
                  cost: 25,
                  currency: "USD",
                  duration_mins: 90,
                },
                {
                  name: "Beignet Tasting",
                  cost: 8,
                  currency: "USD",
                  duration_mins: 30,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "pkg-8",
      title: "Dubai Desert Dreams",
      description:
        "Luxury desert camps, dune bashing, and skyscrapers that touch the clouds.",
      creator: { name: "Zayed Al Maktoum", avatar: "/avatars/zayed.jpg" },
      media: [
        { type: "image", url: "/images/dubai-burj-khalifa.jpg" },
        { type: "image", url: "/images/dubai-desert-camp.jpg" },
        { type: "video", url: "/videos/dubai-dune-bashing.mp4" },
        { type: "image", url: "/images/dubai-sunset.jpg" },
      ],
      price: 650,
      currency: "USD",
      itineraries: [
        {
          title: "Day 1: Desert Safari",
          steps: [
            {
              start_location: "Dubai Hotel",
              end_location: "Desert Camp",
              mode_of_transport: "SUV",
              duration_mins: 60,
              notes: "Wear comfortable clothes",
              costs: [{ category: "Transport", amount: 40, currency: "AED" }],
              stays: [],
              food: [],
              activities: [
                {
                  name: "Dune Bashing",
                  cost: 50,
                  currency: "AED",
                  duration_mins: 60,
                },
                {
                  name: "Camel Ride",
                  cost: 25,
                  currency: "AED",
                  duration_mins: 30,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "pkg-9",
      title: "Queenstown Adventure",
      description:
        "Bungee jumping, jet boating, and alpine scenery in New Zealand’s adventure capital.",
      creator: { name: "Tara Williams", avatar: "/avatars/tara.jpg" },
      media: [
        { type: "video", url: "/videos/queenstown-bungee.mp4" },
        { type: "image", url: "/images/queenstown-lake.jpg" },
        { type: "image", url: "/images/queenstown-mountain.jpg" },
        { type: "image", url: "/images/queenstown-town.jpg" },
      ],
      price: 525,
      currency: "USD",
      itineraries: [
        {
          title: "Day 1: Bungee Jumping",
          steps: [
            {
              start_location: "Queenstown Hotel",
              end_location: "Kawarau Bridge",
              mode_of_transport: "Taxi",
              duration_mins: 20,
              notes: "Book bungee in advance",
              costs: [{ category: "Transport", amount: 15, currency: "NZD" }],
              stays: [],
              food: [],
              activities: [
                {
                  name: "Bungee Jump",
                  cost: 150,
                  currency: "NZD",
                  duration_mins: 60,
                },
                {
                  name: "Jet Boat Ride",
                  cost: 80,
                  currency: "NZD",
                  duration_mins: 45,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "pkg-10",
      title: "Cape Town Coastal Escape",
      description:
        "Table Mountain, penguins, and wine country in South Africa’s most scenic city.",
      creator: { name: "Thandiwe Mbeki", avatar: "/avatars/thandiwe.jpg" },
      media: [
        { type: "image", url: "/images/cape-town-table-mountain.jpg" },
        { type: "image", url: "/images/cape-town-penguins.jpg" },
        { type: "video", url: "/videos/cape-town-coast.mp4" },
        { type: "image", url: "/images/cape-town-wine.jpg" },
      ],
      price: 475,
      currency: "USD",
      itineraries: [
        {
          title: "Day 1: Table Mountain & Cape Point",
          steps: [
            {
              start_location: "Cape Town Hotel",
              end_location: "Table Mountain",
              mode_of_transport: "Car",
              duration_mins: 30,
              notes: "Go early for clear views",
              costs: [{ category: "Transport", amount: 20, currency: "ZAR" }],
              stays: [],
              food: [],
              activities: [
                {
                  name: "Cable Car Ride",
                  cost: 25,
                  currency: "ZAR",
                  duration_mins: 60,
                },
                {
                  name: "Cape Point Visit",
                  cost: 15,
                  currency: "ZAR",
                  duration_mins: 120,
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const pkg = allPackages.find((p) => p.id === id);

  useEffect(() => {
    if (id && !pkg) {
      router.push("/404");
    }
  }, [id, pkg, router]);

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const handlePurchase = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    alert(`Purchased ${pkg.title} for $${pkg.price}`);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex justify-between items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="p-2 bg-white/80 backdrop-blur-xl rounded-full shadow-sm border border-gray-200"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </motion.button>
        <span className="text-lg font-semibold text-gray-900">{pkg.title}</span>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="px-6 mb-6">
        {pkg.media.map((media: { type: string; url: string }, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl overflow-hidden mb-4"
          >
            {media.type === "video" ? (
              <video
                src={media.url}
                className="w-full aspect-[9/16] object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={media.url}
                alt="Media"
                className="w-full aspect-[9/16] object-cover"
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Package Info */}
      <div className="px-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900">{pkg.title}</h2>
        <p className="text-gray-600 mt-1">{pkg.description}</p>
        <div className="flex items-center mt-3 space-x-4">
          <span className="text-gray-900 font-medium">
            ${pkg.price} {pkg.currency}
          </span>
          <span className="text-gray-400">•</span>
          <div className="flex items-center space-x-2">
            <img
              src={pkg.creator.avatar}
              alt={pkg.creator.name}
              className="w-6 h-6 rounded-full object-cover border border-gray-200"
            />
            <span className="text-gray-600">By {pkg.creator.name}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 mb-6">
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Heart className="w-6 h-6 text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <MapPin className="w-6 h-6 text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Share2 className="w-6 h-6 text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full hover:bg-gray-100 ml-auto"
          >
            <Calendar className="w-6 h-6 text-gray-600" />
          </motion.button>
        </div>
      </div>

      <div className="px-6 mb-6">
        {pkg.itineraries.map((itinerary: { title: string; steps: any[] }, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-4 shadow-sm mb-4"
          >
            <h3 className="font-medium text-gray-900 mb-3">
              {itinerary.title}
            </h3>
            {itinerary.steps.map((step: { start_location: string; end_location: string; duration_mins: number; activities: any[]; food: any[]; stays: any[] }, j: number) => (
              <div key={j} className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    {step.start_location} → {step.end_location}
                  </span>
                  <span className="text-sm text-gray-600">
                    {step.duration_mins} min
                  </span>
                </div>
                <div className="space-y-2">
                  {/* Activities (Unlocked) */}
                  {step.activities.map((activity: { name: string; cost: number; currency: string }, k: number) => (
                    <motion.div
                      key={k}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: k * 0.05 }}
                      className="flex items-center justify-between p-2 bg-green-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-900">
                        {activity.name}
                      </span>
                      <span className="text-sm text-gray-600">
                        ${activity.cost} {activity.currency}
                      </span>
                    </motion.div>
                  ))}

                  {/* Food & Stays (Locked) */}
                  {step.food.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center justify-between p-2 bg-gray-100 rounded-lg cursor-not-allowed"
                    >
                      <span className="text-sm text-gray-600">
                        Food options
                      </span>
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Lock className="w-4 h-4" /> Unlock with purchase
                      </span>
                    </motion.div>
                  )}

                  {step.stays.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                      className="flex items-center justify-between p-2 bg-gray-100 rounded-lg cursor-not-allowed"
                    >
                      <span className="text-sm text-gray-600">
                        Accommodations
                      </span>
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Lock className="w-4 h-4" /> Unlock with purchase
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Purchase Button */}
      <div className="px-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePurchase}
          className="w-full py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl font-medium shadow-sm"
        >
          <div className="flex items-center justify-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <span>Purchase Package</span>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
