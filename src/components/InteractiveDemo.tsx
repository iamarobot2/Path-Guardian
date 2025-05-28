"use client";

import { useState, useEffect } from "react";

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
  const [carRotation, setCarRotation] = useState(0);
  const [isRouting, setIsRouting] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(60);
  const [routeProgress, setRouteProgress] = useState(0);
  const [showDetectionWave, setShowDetectionWave] = useState(false);

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
    setRouteProgress(0);

    // More realistic route with curves and speed changes
    const detailedWaypoints = [
      { top: "80%", left: "20%", rotation: 0, speed: 45 },
      { top: "75%", left: "25%", rotation: -15, speed: 40 },
      { top: "70%", left: "35%", rotation: -30, speed: 35 },
      { top: "60%", left: "45%", rotation: -10, speed: 50 },
      { top: "50%", left: "50%", rotation: 0, speed: 55 },
      { top: "45%", left: "60%", rotation: 15, speed: 45 },
      { top: "50%", left: "70%", rotation: 25, speed: 40 },
      { top: "55%", left: "75%", rotation: 20, speed: 35 },
      { top: "60%", left: "80%", rotation: 0, speed: 45 },
      { top: "50%", left: "85%", rotation: -20, speed: 50 },
      { top: "40%", left: "80%", rotation: -45, speed: 40 },
      { top: "30%", left: "75%", rotation: -30, speed: 45 },
      { top: "25%", left: "70%", rotation: 0, speed: 55 },
    ];

    let currentWaypoint = 0;
    const animationSpeed = 300; // milliseconds between waypoints

    const moveVehicle = () => {
      if (currentWaypoint >= detailedWaypoints.length) {
        setIsRouting(false);
        setRouteProgress(100);
        setCurrentSpeed(0);
        return;
      }

      const waypoint = detailedWaypoints[currentWaypoint];
      setCarPosition({ top: waypoint.top, left: waypoint.left });
      setCarRotation(waypoint.rotation);
      setCurrentSpeed(waypoint.speed);
      setRouteProgress((currentWaypoint / detailedWaypoints.length) * 100);

      // Show detection wave periodically
      if (currentWaypoint % 3 === 0) {
        setShowDetectionWave(true);
        setTimeout(() => setShowDetectionWave(false), 1000);
      }

      currentWaypoint++;
      setTimeout(moveVehicle, animationSpeed);
    };

    moveVehicle();
  };

  // Detection animation effect
  useEffect(() => {
    if (isRouting) {
      const detectionInterval = setInterval(() => {
        setShowDetectionWave(true);
        setTimeout(() => setShowDetectionWave(false), 800);
      }, 2000);

      return () => clearInterval(detectionInterval);
    }
  }, [isRouting]);
  const reset = () => {
    setCarPosition({ top: "80%", left: "20%" });
    setCarRotation(0);
    setSelectedPothole(null);
    setIsRouting(false);
    setCurrentSpeed(0);
    setRouteProgress(0);
    setShowDetectionWave(false);
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
                ))}{" "}
                {/* Car with enhanced animation */}
                <div
                  className="absolute transition-all duration-300 ease-out"
                  style={{
                    top: carPosition.top,
                    left: carPosition.left,
                    transform: `translate(-50%, -50%) rotate(${carRotation}deg)`,
                  }}
                >
                  {/* Detection Wave */}
                  {showDetectionWave && (
                    <div className="absolute inset-0 -z-10">
                      <div
                        className="w-20 h-20 border-2 border-[#229799] rounded-full animate-ping opacity-50"
                        style={{
                          transform: "translate(-25%, -25%)",
                        }}
                      ></div>
                      <div
                        className="w-16 h-16 border-2 border-[#229799] rounded-full animate-ping opacity-70"
                        style={{
                          transform: "translate(-12.5%, -12.5%)",
                          animationDelay: "0.2s",
                        }}
                      ></div>
                    </div>
                  )}

                  {/* Enhanced Car Design */}
                  <svg width="50" height="25" viewBox="0 0 50 25">
                    {/* Car Body */}
                    <rect
                      x="0"
                      y="5"
                      width="50"
                      height="15"
                      fill="#229799"
                      rx="7"
                    />
                    {/* Car Windows */}
                    <rect
                      x="8"
                      y="8"
                      width="15"
                      height="8"
                      fill="#DBEAFE"
                      rx="2"
                    />
                    <rect
                      x="27"
                      y="8"
                      width="15"
                      height="8"
                      fill="#DBEAFE"
                      rx="2"
                    />
                    {/* Car Wheels */}
                    <circle cx="12" cy="23" r="6" fill="#1F2937" />
                    <circle cx="38" cy="23" r="6" fill="#1F2937" />
                    <circle cx="12" cy="23" r="3" fill="#6B7280" />
                    <circle cx="38" cy="23" r="3" fill="#6B7280" />
                    {/* Headlights */}
                    <circle cx="48" cy="10" r="2" fill="#FEF3C7" />
                    <circle cx="48" cy="15" r="2" fill="#FEF3C7" />
                    {/* Speed indicator */}
                    {isRouting && (
                      <text
                        x="25"
                        y="-5"
                        textAnchor="middle"
                        className="text-xs font-bold"
                        fill="#229799"
                      >
                        {currentSpeed} km/h
                      </text>
                    )}
                  </svg>
                </div>
              </div>{" "}
              <div className="mt-4">
                {/* Route Progress */}
                {isRouting && (
                  <div className="mb-4 bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Route Progress
                      </span>
                      <span className="text-sm text-[#229799] font-semibold">
                        {Math.round(routeProgress)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#229799] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${routeProgress}%` }}
                      ></div>
                    </div>
                    {currentSpeed > 0 && (
                      <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>Speed: {currentSpeed} km/h</span>
                        <span>Scanning road surface...</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Control Buttons */}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={startRoute}
                    disabled={isRouting}
                    className="bg-[#229799] text-white px-6 py-2 rounded-full hover:bg-[#1a7373] transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isRouting ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Navigating...
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                        Start Smart Route
                      </>
                    )}
                  </button>
                  <button
                    onClick={reset}
                    className="border border-[#229799] text-[#229799] px-6 py-2 rounded-full hover:bg-emerald-50 transition flex items-center gap-2"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Reset
                  </button>
                </div>
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
