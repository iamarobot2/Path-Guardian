"use client";

import { useState, useEffect, useMemo, useRef } from "react";

export default function Hero() {
  const [currentPothole, setCurrentPothole] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [vehiclePosition, setVehiclePosition] = useState(0);
  const [routeProgress, setRouteProgress] = useState(0);
  const [currentLocation, setCurrentLocation] = useState("Starting Location");
  const [timeRemaining, setTimeRemaining] = useState("23 min");
  const [distanceRemaining, setDistanceRemaining] = useState("15.2 km");
  const [alertedPotholes, setAlertedPotholes] = useState(new Set());
  const [isInteractive, setIsInteractive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const potholes = useMemo(
    () => [
      {
        id: 1,
        x: 140,
        y: 280,
        severity: "Medium",
        distance: "50m",
        color: "#F59E0B",
      },
      {
        id: 2,
        x: 140,
        y: 180,
        severity: "High",
        distance: "25m",
        color: "#EF4444",
      },
      {
        id: 3,
        x: 140,
        y: 80,
        severity: "Low",
        distance: "75m",
        color: "#10B981",
      },
    ],
    []
  );
  useEffect(() => {
    const locations = [
      "Starting Journey",
      "Main Street",
      "City Center",
      "Highway 101",
      "Downtown Area",
      "Near Destination",
    ];

    const interval = setInterval(() => {
      setVehiclePosition((prev) => (prev + 1) % 100);

      // Update route progress
      const progress = (vehiclePosition / 100) * 100;
      setRouteProgress(progress);

      // Update location based on progress
      const locationIndex = Math.floor(
        (vehiclePosition / 100) * locations.length
      );
      setCurrentLocation(locations[locationIndex] || "Near Destination");

      // Update time and distance remaining
      const remaining = Math.max(0, 23 - Math.floor(progress * 0.23));
      setTimeRemaining(`${remaining} min`);
      setDistanceRemaining(`${(15.2 - progress * 0.152).toFixed(1)} km`);

      // Show alert when approaching potholes (only once per pothole)
      const vehicleY = 320 - vehiclePosition * 2.7; // Move from bottom to top
      potholes.forEach((pothole, index) => {
        const distance = vehicleY - pothole.y;

        // Show alert when 50 pixels before reaching pothole (only once)
        if (
          distance <= 50 &&
          distance > 0 &&
          !alertedPotholes.has(pothole.id)
        ) {
          setCurrentPothole(index);
          setShowAlert(true);
          setAlertedPotholes((prev) => new Set([...prev, pothole.id]));
          setTimeout(() => setShowAlert(false), 2500);
        } // Reset alerts when vehicle passes all potholes
        if (vehiclePosition > 95) {
          setAlertedPotholes(new Set());
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, [vehiclePosition, potholes, alertedPotholes]);
  return (
    <header className="bg-gradient-to-br from-[#229799] via-[#1a7373] to-[#144d4d] pt-16 md:pt-28 pb-12 md:pb-20 px-4 overflow-hidden min-h-screen flex items-center">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Content */}
          <div className="text-white order-2 lg:order-1 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Smart Road Monitoring &{" "}
              <span className="text-yellow-300">AI-Powered</span> Routing
            </h1>
            <p className="text-lg md:text-xl mb-6 md:mb-8 text-emerald-100 leading-relaxed">
              Experience real-time road damage detection with AI-powered alerts,
              dynamic route optimization, and intelligent maintenance planning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6 md:mb-8">
              <button className="bg-white text-[#229799] px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:bg-emerald-50 transition-all duration-300 shadow-xl transform hover:scale-105 hover:shadow-2xl">
                See Path Guardian in Action
              </button>
              <button className="border-2 border-white text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:bg-white hover:text-[#229799] transition-all duration-300 transform hover:scale-105">
                Watch Live Demo
              </button>
            </div>

            {/* Real-time stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 text-center">
              <div className="bg-white/10 backdrop-blur rounded-lg p-2 md:p-3">
                <div className="text-xl md:text-2xl font-bold text-yellow-300">
                  98%
                </div>
                <div className="text-xs md:text-sm text-emerald-100">
                  Detection Accuracy
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-2 md:p-3">
                <div className="text-xl md:text-2xl font-bold text-yellow-300">
                  15ms
                </div>
                <div className="text-xs md:text-sm text-emerald-100">
                  Response Time
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-2 md:p-3">
                <div className="text-xl md:text-2xl font-bold text-yellow-300">
                  24/7
                </div>
                <div className="text-xs md:text-sm text-emerald-100">
                  Monitoring
                </div>
              </div>
            </div>
          </div>

          {/* Right Animation */}
          <div className="order-1 lg:order-2 flex justify-center items-center mt-8 md:mt-0">
            <div className="flex items-center justify-center gap-6 lg:gap-8 w-full max-w-full">
              {/* Interactive Mobile Phone Mockup */}
              <div className="relative transform md:hover:scale-105 transition-transform duration-300 flex-shrink-0">
                {/* Phone Shadow */}
                <div className="absolute inset-0 bg-black/20 rounded-[2.5rem] md:rounded-[3rem] transform translate-x-1 translate-y-1 md:translate-x-2 md:translate-y-2 blur-lg"></div>{" "}
                {/* Phone Body */}
                <div
                  className="relative w-72 h-[600px] md:w-80 md:h-[680px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] md:rounded-[3rem] p-1.5 md:p-2 shadow-2xl cursor-pointer transition-all duration-300"
                  onClick={() => setIsInteractive(!isInteractive)}
                  onTouchStart={() => setIsInteractive(!isInteractive)}
                >
                  {/* Screen */}
                  <div className="w-full h-full bg-black rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden">
                    {/* Punch-hole Camera */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 md:w-5 md:h-5 bg-black rounded-full z-10 border-2 border-gray-700"></div>
                    {/* Scrollable Screen Content */}
                    <div
                      ref={scrollRef}
                      className={`absolute inset-1 bg-white rounded-[1.75rem] md:rounded-[2.25rem] overflow-hidden overflow-y-auto scrollbar-hide transition-all duration-300 ${
                        isInteractive
                          ? "ring-2 ring-[#229799] ring-opacity-50"
                          : ""
                      }`}
                      style={{
                        height: "calc(100% - 8px)",
                        scrollBehavior: isInteractive ? "auto" : "smooth",
                      }}
                    >
                      {/* Status Bar */}
                      <div className="bg-gradient-to-r from-[#229799] to-[#1a7373] text-white px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                            <svg
                              className="w-5 h-5 text-[#229799]"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div>
                            <div className="font-bold text-sm">
                              PathGuardian
                            </div>
                            <div className="text-xs opacity-90">
                              Smart routing active
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs">9:41</div>
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                            <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                            <svg
                              className="w-4 h-4 ml-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M17 4h-2V2a1 1 0 00-2 0v2H7V2a1 1 0 00-2 0v2H3a1 1 0 000 2v10a3 3 0 003 3h8a3 3 0 003-3V6a1 1 0 000-2z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      {/* Navigation Header */}
                      <div className="bg-gray-50 px-6 py-3 border-b">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-semibold text-gray-800">
                              {currentLocation}
                            </div>
                            <div className="text-sm text-gray-600">
                              {distanceRemaining} • {timeRemaining} optimal
                              route
                            </div>
                          </div>
                          <div className="bg-[#229799] text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                            LIVE
                          </div>
                        </div>
                        {/* Route Progress Bar */}
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Route Progress</span>
                            <span>{Math.round(routeProgress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#229799] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${routeProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>{" "}
                      {/* Map View */}
                      <div className="relative h-80 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
                        {/* Map Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="grid grid-cols-8 h-full">
                            {[...Array(64)].map((_, i) => (
                              <div
                                key={i}
                                className="border border-gray-300"
                              ></div>
                            ))}
                          </div>
                        </div>
                        <svg className="w-full h-full" viewBox="0 0 280 320">
                          {/* Vertical Main Road */}
                          <rect
                            x="125"
                            y="0"
                            width="30"
                            height="320"
                            fill="#374151"
                          />
                          <line
                            x1="140"
                            y1="0"
                            x2="140"
                            y2="320"
                            stroke="white"
                            strokeWidth="2"
                            strokeDasharray="15,15"
                            fill="none"
                          />{" "}
                          {/* Side Roads - Synchronized with side animation */}
                          <rect
                            x="55"
                            y="120"
                            width="70"
                            height="15"
                            fill="#6B7280"
                            opacity="0.7"
                          />
                          <rect
                            x="155"
                            y="300"
                            width="70"
                            height="15"
                            fill="#6B7280"
                            opacity="0.7"
                          />
                          {/* Moving Vehicle (Bottom to Top) */}
                          <g
                            transform={`translate(140, ${
                              320 - vehiclePosition * 2.7
                            })`}
                          >
                            {/* Vehicle Shadow */}
                            <ellipse
                              cx="1"
                              cy="1"
                              rx="8"
                              ry="12"
                              fill="black"
                              opacity="0.2"
                            />
                            {/* Vehicle Body */}
                            <rect
                              x="-6"
                              y="-10"
                              width="12"
                              height="20"
                              fill="#229799"
                              rx="3"
                            />
                            {/* Vehicle Windows */}
                            <rect
                              x="-4"
                              y="-8"
                              width="8"
                              height="6"
                              fill="#DBEAFE"
                              rx="1"
                            />
                            <rect
                              x="-4"
                              y="2"
                              width="8"
                              height="6"
                              fill="#DBEAFE"
                              rx="1"
                            />
                            {/* Vehicle Direction Indicator */}
                            <polygon points="0,-12 4,-8 -4,-8" fill="#10B981" />
                            {/* GPS Pulse */}
                            <circle
                              cx="0"
                              cy="0"
                              r="20"
                              stroke="#229799"
                              strokeWidth="2"
                              fill="none"
                              opacity="0.3"
                              className="animate-ping"
                            />
                            <circle
                              cx="0"
                              cy="0"
                              r="35"
                              stroke="#229799"
                              strokeWidth="1"
                              fill="none"
                              opacity="0.2"
                              className="animate-ping"
                              style={{ animationDelay: "0.5s" }}
                            />
                          </g>
                          {/* Potholes positioned vertically */}
                          {potholes.map((pothole) => (
                            <g key={pothole.id}>
                              <circle
                                cx={pothole.x}
                                cy={pothole.y}
                                r="8"
                                fill="white"
                                stroke={pothole.color}
                                strokeWidth="2"
                                className="drop-shadow-sm"
                              />
                              <text
                                x={pothole.x}
                                y={pothole.y + 2}
                                textAnchor="middle"
                                className="text-xs font-bold"
                                fill={pothole.color}
                              >
                                ⚠
                              </text>
                              <circle
                                cx={pothole.x}
                                cy={pothole.y}
                                r="12"
                                stroke={pothole.color}
                                strokeWidth="1"
                                fill="none"
                                opacity="0.4"
                                className="animate-pulse"
                              />
                            </g>
                          ))}
                          {/* Destination Marker */}
                          <g transform="translate(140, 20)">
                            <circle
                              cx="0"
                              cy="0"
                              r="15"
                              fill="#10B981"
                              opacity="0.9"
                            />
                            <text
                              x="0"
                              y="1"
                              textAnchor="middle"
                              className="text-xs font-bold"
                              fill="white"
                            >
                              🏢
                            </text>
                            <circle
                              cx="0"
                              cy="0"
                              r="20"
                              stroke="#10B981"
                              strokeWidth="2"
                              fill="none"
                              opacity="0.3"
                              className="animate-ping"
                            />
                          </g>
                          {/* Starting Point */}
                          <g transform="translate(140, 300)">
                            <circle
                              cx="0"
                              cy="0"
                              r="12"
                              fill="#229799"
                              opacity="0.9"
                            />
                            <text
                              x="0"
                              y="1"
                              textAnchor="middle"
                              className="text-xs font-bold"
                              fill="white"
                            >
                              🏠
                            </text>
                          </g>
                        </svg>

                        {/* Navigation Controls Overlay */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-xl p-2 shadow-lg">
                          <button className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center mb-2">
                            <svg
                              className="w-4 h-4 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </button>
                          <button className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18 12H6"
                              />
                            </svg>
                          </button>{" "}
                        </div>

                        {/* Alert Overlay - Positioned over the map */}
                        <div
                          className={`absolute top-4 left-4 right-4 transform transition-all duration-500 z-20 ${
                            showAlert
                              ? "translate-y-0 opacity-100 scale-100"
                              : "translate-y-4 opacity-0 scale-95 pointer-events-none"
                          }`}
                        >
                          <div
                            className={`p-3 rounded-lg border-l-4 shadow-xl backdrop-blur-sm ${
                              potholes[currentPothole]?.severity === "High"
                                ? "bg-gradient-to-r from-red-50/95 to-red-100/95 border-red-500"
                                : potholes[currentPothole]?.severity ===
                                  "Medium"
                                ? "bg-gradient-to-r from-yellow-50/95 to-orange-100/95 border-yellow-500"
                                : "bg-gradient-to-r from-green-50/95 to-emerald-100/95 border-green-500"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    potholes[currentPothole]?.severity ===
                                    "High"
                                      ? "bg-red-500"
                                      : potholes[currentPothole]?.severity ===
                                        "Medium"
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                  }`}
                                >
                                  <span className="text-white text-sm">⚠️</span>
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-800 text-sm">
                                    Road Hazard Detected
                                  </h3>
                                  <p className="text-xs text-gray-600">
                                    {potholes[currentPothole]?.severity}{" "}
                                    severity •{" "}
                                    {potholes[currentPothole]?.distance} ahead
                                  </p>
                                </div>
                              </div>
                              <button className="text-gray-400 hover:text-gray-600">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>{" "}
                      {/* Enhanced Route Options */}
                      <div className="px-4 py-2 space-y-2">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-[#229799]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                />
                              </svg>
                              Route Options
                            </h4>
                            <span className="text-xs bg-[#229799] text-white px-2 py-1 rounded-full">
                              AI
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm border-l-4 border-[#229799]">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#229799] rounded-full animate-pulse"></div>
                                <div>
                                  <span className="font-semibold text-[#229799] text-sm">
                                    Optimal Route
                                  </span>
                                  <p className="text-xs text-gray-500">
                                    Avoids 3 hazards
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-semibold text-gray-700">
                                  +2 min
                                </span>
                                <p className="text-xs text-green-600">
                                  Recommended
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm opacity-60">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                <div>
                                  <span className="font-medium text-gray-600 text-sm">
                                    Fastest Route
                                  </span>
                                  <p className="text-xs text-gray-400">
                                    Through hazards
                                  </p>
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">
                                +0 min
                              </span>
                            </div>
                          </div>
                        </div>{" "}
                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <button className="bg-gradient-to-r from-[#229799] to-[#1a7373] text-white p-2 rounded-lg text-sm font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
                            <svg
                              className="w-4 h-4"
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
                            Navigate
                          </button>
                          <button className="border-2 border-gray-200 text-gray-700 p-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Report
                          </button>
                        </div>
                        {/* Additional Scrollable Content */}
                        {/* Traffic Updates */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-3 shadow-sm">
                          <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2 mb-2">
                            <svg
                              className="w-4 h-4 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Traffic Updates
                          </h4>
                          <div className="space-y-1">
                            <div className="text-xs text-gray-600">
                              • Light traffic on Main St
                            </div>
                            <div className="text-xs text-gray-600">
                              • Construction on Highway 101
                            </div>
                            <div className="text-xs text-gray-600">
                              • Clear roads ahead
                            </div>
                          </div>
                        </div>
                        {/* Weather Conditions */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-3 shadow-sm">
                          <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2 mb-2">
                            <svg
                              className="w-4 h-4 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                              />
                            </svg>
                            Road Conditions
                          </h4>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">
                              Clear, Dry
                            </span>
                            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                              Good
                            </span>
                          </div>
                        </div>
                        {/* Recent Reports */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-lg p-3 shadow-sm">
                          <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2 mb-2">
                            <svg
                              className="w-4 h-4 text-purple-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            Recent Reports
                          </h4>
                          <div className="space-y-2">
                            <div className="text-xs text-gray-600 p-2 bg-white rounded border-l-2 border-purple-400">
                              Pothole reported on Oak St - 2 min ago
                            </div>
                            <div className="text-xs text-gray-600 p-2 bg-white rounded border-l-2 border-blue-400">
                              Road surface issue fixed - 15 min ago
                            </div>
                          </div>
                        </div>{" "}
                        {/* Performance Stats */}
                        <div className="bg-gradient-to-br from-orange-50 to-yellow-100 rounded-lg p-3 shadow-sm">
                          <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2 mb-2">
                            <svg
                              className="w-4 h-4 text-orange-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                            Today&apos;s Stats
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-center bg-white rounded p-2">
                              <div className="font-bold text-orange-600">
                                47
                              </div>
                              <div className="text-gray-600">
                                Hazards Avoided
                              </div>
                            </div>
                            <div className="text-center bg-white rounded p-2">
                              <div className="font-bold text-orange-600">
                                12 min
                              </div>
                              <div className="text-gray-600">Time Saved</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>{" "}
                {/* Enhanced Floating UI Elements - Positioned to avoid overlap */}
                <div className="absolute -top-6 -right-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce">
                  <span className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    Live AI
                  </span>
                </div>
                <div className="absolute -bottom-6 -left-8 bg-gradient-to-r from-white to-gray-100 text-[#229799] px-3 py-1 rounded-full text-xs font-bold shadow-xl border border-gray-200">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {isInteractive ? "Interactive" : "Tap to Interact"}
                  </span>
                </div>
              </div>{" "}
              {/* Enhanced Vertical Road Animation */}
              <div className="hidden lg:block relative">
                <svg
                  width="180"
                  height="500"
                  viewBox="0 0 180 500"
                  className="drop-shadow-2xl"
                >
                  {" "}
                  {/* Road Surface - Vertical - Matching mockup exactly */}
                  <rect x="65" y="0" width="50" height="500" fill="#374151" />
                  {/* Road Markings - Vertical - Matching mockup exactly */}
                  <line
                    x1="90"
                    y1="0"
                    x2="90"
                    y2="500"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="15,15"
                    fill="none"
                  />
                  {/* Side Roads - Exactly matching mobile mockup */}
                  <rect
                    x="10"
                    y="150"
                    width="55"
                    height="15"
                    fill="#6B7280"
                    opacity="0.7"
                  />
                  <rect
                    x="115"
                    y="375"
                    width="70"
                    height="15"
                    fill="#6B7280"
                    opacity="0.7"
                  />
                  {/* Potholes positioned exactly like mockup */}
                  <g>
                    <circle
                      cx="90"
                      cy="350"
                      r="8"
                      fill="white"
                      stroke="#F59E0B"
                      strokeWidth="2"
                      className="drop-shadow-sm"
                    />
                    <text
                      x="90"
                      y="352"
                      textAnchor="middle"
                      className="text-xs font-bold"
                      fill="#F59E0B"
                    >
                      ⚠
                    </text>
                    <circle
                      cx="90"
                      cy="350"
                      r="12"
                      stroke="#F59E0B"
                      strokeWidth="1"
                      fill="none"
                      opacity="0.4"
                      className="animate-pulse"
                    />
                  </g>
                  <g>
                    <circle
                      cx="90"
                      cy="225"
                      r="8"
                      fill="white"
                      stroke="#EF4444"
                      strokeWidth="2"
                      className="drop-shadow-sm"
                    />
                    <text
                      x="90"
                      y="227"
                      textAnchor="middle"
                      className="text-xs font-bold"
                      fill="#EF4444"
                    >
                      ⚠
                    </text>
                    <circle
                      cx="90"
                      cy="225"
                      r="12"
                      stroke="#EF4444"
                      strokeWidth="1"
                      fill="none"
                      opacity="0.4"
                      className="animate-pulse"
                    />
                  </g>
                  <g>
                    <circle
                      cx="90"
                      cy="100"
                      r="8"
                      fill="white"
                      stroke="#10B981"
                      strokeWidth="2"
                      className="drop-shadow-sm"
                    />
                    <text
                      x="90"
                      y="102"
                      textAnchor="middle"
                      className="text-xs font-bold"
                      fill="#10B981"
                    >
                      ⚠
                    </text>
                    <circle
                      cx="90"
                      cy="100"
                      r="12"
                      stroke="#10B981"
                      strokeWidth="1"
                      fill="none"
                      opacity="0.4"
                      className="animate-pulse"
                    />
                  </g>{" "}
                  {/* Moving Vehicle - Bottom to Top - Matching mockup exactly */}
                  <g
                    transform={`translate(90, ${470 - vehiclePosition * 4.2})`}
                    className="drop-shadow-lg"
                  >
                    {/* Vehicle Shadow */}
                    <ellipse
                      cx="1"
                      cy="1"
                      rx="8"
                      ry="12"
                      fill="black"
                      opacity="0.2"
                    />
                    {/* Vehicle Body */}
                    <rect
                      x="-6"
                      y="-10"
                      width="12"
                      height="20"
                      fill="#229799"
                      rx="3"
                    />
                    {/* Vehicle Windows */}
                    <rect
                      x="-4"
                      y="-8"
                      width="8"
                      height="6"
                      fill="#DBEAFE"
                      rx="1"
                    />
                    <rect
                      x="-4"
                      y="2"
                      width="8"
                      height="6"
                      fill="#DBEAFE"
                      rx="1"
                    />
                    {/* Vehicle Direction Indicator */}
                    <polygon points="0,-12 4,-8 -4,-8" fill="#10B981" />
                    {/* GPS Pulse */}
                    <circle
                      cx="0"
                      cy="0"
                      r="20"
                      stroke="#229799"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.3"
                      className="animate-ping"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="35"
                      stroke="#229799"
                      strokeWidth="1"
                      fill="none"
                      opacity="0.2"
                      className="animate-ping"
                      style={{ animationDelay: "0.5s" }}
                    />
                  </g>
                  {/* Destination marker - Matching mockup */}
                  <g transform="translate(90, 25)">
                    <circle cx="0" cy="0" r="15" fill="#10B981" opacity="0.9" />
                    <text
                      x="0"
                      y="1"
                      textAnchor="middle"
                      className="text-xs font-bold"
                      fill="white"
                    >
                      🏢
                    </text>
                    <circle
                      cx="0"
                      cy="0"
                      r="20"
                      stroke="#10B981"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.3"
                      className="animate-ping"
                    />
                  </g>
                  {/* Starting point - Matching mockup */}{" "}
                  <g transform="translate(90, 450)">
                    <circle cx="0" cy="0" r="12" fill="#229799" opacity="0.9" />
                    <text
                      x="0"
                      y="1"
                      textAnchor="middle"
                      className="text-xs font-bold"
                      fill="white"
                    >
                      🏠
                    </text>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
