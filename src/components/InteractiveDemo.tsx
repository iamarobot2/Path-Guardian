"use client";

import { useState } from "react";

interface PotholeData {
  id: number;
  title: string;
  severity: string;
  location: string;
  size: string;
  top: string;
  left: string;
  width: number;
  height: number;
}

export default function InteractiveDemo() {
  const [selectedPothole, setSelectedPothole] = useState<PotholeData | null>(
    null
  );
  const [carPosition, setCarPosition] = useState({ top: "80%", left: "20%" });
  const [isRouting, setIsRouting] = useState(false);

  const potholeData: PotholeData[] = [
    {
      id: 1,
      title: "Pothole #1",
      severity: "Severe",
      location: "25.3176° N, 82.9739° E",
      size: "45cm × 30cm, 8cm deep",
      top: "30%",
      left: "25%",
      width: 30,
      height: 30,
    },
    {
      id: 2,
      title: "Pothole #2",
      severity: "Moderate",
      location: "25.3142° N, 82.9812° E",
      size: "30cm × 25cm, 5cm deep",
      top: "70%",
      left: "60%",
      width: 25,
      height: 25,
    },
    {
      id: 3,
      title: "Pothole #3",
      severity: "Minor",
      location: "25.3201° N, 82.9768° E",
      size: "20cm × 15cm, 3cm deep",
      top: "40%",
      left: "75%",
      width: 20,
      height: 20,
    },
  ];

  const handlePotholeClick = (pothole: PotholeData) => {
    setSelectedPothole(pothole);
  };

  const startRoute = () => {
    setIsRouting(true);
    const waypoints = [
      { top: "80%", left: "20%" },
      { top: "60%", left: "30%" },
      { top: "40%", left: "40%" },
      { top: "30%", left: "50%" },
      { top: "40%", left: "60%" },
      { top: "50%", left: "70%" },
      { top: "30%", left: "80%" },
    ];

    let currentWaypoint = 0;
    const interval = setInterval(() => {
      if (currentWaypoint >= waypoints.length) {
        clearInterval(interval);
        setIsRouting(false);
        return;
      }
      setCarPosition(waypoints[currentWaypoint]);
      currentWaypoint++;
    }, 1000);
  };

  const reset = () => {
    setCarPosition({ top: "80%", left: "20%" });
    setSelectedPothole(null);
    setIsRouting(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Severe":
        return "bg-red-500 border-red-600";
      case "Moderate":
        return "bg-orange-500 border-orange-600";
      case "Minor":
        return "bg-yellow-500 border-yellow-600";
      default:
        return "bg-gray-500 border-gray-600";
    }
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            See Path Guardian in Action
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our interactive demo to understand how our system detects,
            maps, and helps navigate around road damage.
          </p>
        </div>
        <div className="bg-gray-100 p-6 rounded-xl">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="bg-gray-200 h-96 relative rounded-lg overflow-hidden">
                {/* Road Map Background */}
                <svg
                  className="w-full h-full"
                  viewBox="0 0 800 600"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Map background */}
                  <rect x="0" y="0" width="800" height="600" fill="#E5E7EB" />

                  {/* Roads */}
                  <rect
                    x="100"
                    y="100"
                    width="600"
                    height="400"
                    fill="#374151"
                  />
                  <path
                    d="M400,100 L400,500"
                    stroke="#FFFFFF"
                    strokeWidth="4"
                    strokeDasharray="20,20"
                  />
                  <path
                    d="M100,300 L700,300"
                    stroke="#FFFFFF"
                    strokeWidth="4"
                    strokeDasharray="20,20"
                  />
                </svg>

                {/* Potholes */}
                {potholeData.map((pothole) => (
                  <div
                    key={pothole.id}
                    className={`absolute rounded-full cursor-pointer animate-pulse hover:scale-110 transition-transform ${getSeverityColor(
                      pothole.severity
                    )} opacity-80 border-2`}
                    style={{
                      top: pothole.top,
                      left: pothole.left,
                      width: `${pothole.width}px`,
                      height: `${pothole.height}px`,
                      transform: "translate(-50%, -50%)",
                    }}
                    onClick={() => handlePotholeClick(pothole)}
                  />
                ))}

                {/* Car */}
                <div
                  className="absolute transition-all duration-1000 ease-in-out"
                  style={{
                    top: carPosition.top,
                    left: carPosition.left,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <svg width="40" height="20" viewBox="0 0 40 20">
                    {" "}
                    <rect
                      x="0"
                      y="0"
                      width="40"
                      height="20"
                      fill="#229799"
                      rx="5"
                    />
                    <circle cx="10" cy="20" r="5" fill="#1F2937" />
                    <circle cx="30" cy="20" r="5" fill="#1F2937" />
                    <rect x="5" y="5" width="15" height="8" fill="#DBEAFE" />
                    <rect x="25" y="5" width="10" height="8" fill="#DBEAFE" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex justify-center space-x-4">
                {" "}
                <button
                  onClick={startRoute}
                  disabled={isRouting}
                  className="bg-[#229799] text-white px-6 py-2 rounded-full hover:bg-[#1a7373] transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRouting ? "Routing..." : "Start Route"}
                </button>
                <button
                  onClick={reset}
                  className="border border-[#229799] text-[#229799] px-6 py-2 rounded-full hover:bg-emerald-50 transition"
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="lg:w-1/3">
              <div className="bg-white p-6 rounded-xl shadow-md h-full">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Road Damage Report
                </h3>
                <div className="space-y-4">
                  {selectedPothole ? (
                    <div className="border-l-4 border-red-500 pl-4 py-2">
                      <h4 className="font-medium text-gray-800">
                        {selectedPothole.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Severity: {selectedPothole.severity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Location: {selectedPothole.location}
                      </p>
                      <p className="text-sm text-gray-600">
                        Size: {selectedPothole.size}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      Click on a pothole to view details or start the route to
                      see smart navigation in action.
                    </p>
                  )}

                  <div className="mt-6">
                    <h4 className="font-medium text-gray-800 mb-2">Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Severe issues:</span>
                        <span className="font-medium text-red-600">1</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Moderate issues:</span>
                        <span className="font-medium text-orange-500">1</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Minor issues:</span>
                        <span className="font-medium text-yellow-500">1</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
