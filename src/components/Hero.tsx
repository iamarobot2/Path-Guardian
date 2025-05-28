"use client";

import { useState, useEffect } from "react";

export default function Hero() {
  const [currentPothole, setCurrentPothole] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [vehiclePosition, setVehiclePosition] = useState(0);
  const [routeProgress, setRouteProgress] = useState(0);
  const [currentLocation, setCurrentLocation] = useState("Starting Location");
  const [timeRemaining, setTimeRemaining] = useState("23 min");
  const [distanceRemaining, setDistanceRemaining] = useState("15.2 km");
  const potholes = [
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
  ];
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

      // Show alert when approaching potholes (bottom to top movement)
      const vehicleY = 320 - vehiclePosition * 2.7; // Move from bottom to top
      potholes.forEach((pothole, index) => {
        const distance = Math.abs(vehicleY - pothole.y);
        if (distance < 30 && Math.random() > 0.7) {
          setCurrentPothole(index);
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, [vehiclePosition, potholes]);

  return (
    <header className="bg-gradient-to-br from-[#229799] via-[#1a7373] to-[#144d4d] pt-28 pb-20 px-4 overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="lg:w-1/2 text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Smart Road Monitoring &{" "}
              <span className="text-yellow-300">AI-Powered</span> Routing
            </h1>
            <p className="text-xl mb-8 text-emerald-100 leading-relaxed">
              Experience real-time road damage detection with AI-powered alerts,
              dynamic route optimization, and intelligent maintenance planning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="bg-white text-[#229799] px-8 py-4 rounded-full font-semibold hover:bg-emerald-50 transition-all duration-300 shadow-xl transform hover:scale-105 hover:shadow-2xl">
                See Path Guardian in Action
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-[#229799] transition-all duration-300 transform hover:scale-105">
                Watch Live Demo
              </button>
            </div>

            {/* Real-time stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                <div className="text-2xl font-bold text-yellow-300">98%</div>
                <div className="text-sm text-emerald-100">
                  Detection Accuracy
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                <div className="text-2xl font-bold text-yellow-300">15ms</div>
                <div className="text-sm text-emerald-100">Response Time</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                <div className="text-2xl font-bold text-yellow-300">24/7</div>
                <div className="text-sm text-emerald-100">Monitoring</div>
              </div>
            </div>
          </div>{" "}
          {/* Right Animation */}
          <div className="lg:w-1/2 relative px-4 sm:px-0">
            <div className="flex items-center justify-center gap-8">
              {/* Modern Mobile Phone Mockup */}
              <div className="relative transform hover:scale-105 transition-transform duration-300">
                {/* Phone Shadow */}
                <div className="absolute inset-0 bg-black/20 rounded-[3rem] transform translate-x-2 translate-y-2 blur-lg"></div>
                {/* Phone Body */}
                <div className="relative w-72 h-[600px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl">
                  {/* Screen */}
                  <div className="w-full h-full bg-black rounded-[2.5rem] relative overflow-hidden">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>

                    {/* Screen Content */}
                    <div className="absolute inset-1 bg-white rounded-[2.25rem] overflow-hidden">
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
                              PathGuardian Nav
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
                      </div>{" "}
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
                      </div>
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
                          />

                          {/* Side Roads */}
                          <rect
                            x="80"
                            y="80"
                            width="80"
                            height="15"
                            fill="#6B7280"
                            opacity="0.7"
                          />
                          <rect
                            x="155"
                            y="200"
                            width="80"
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
                      </div>
                      {/* Alert Section */}
                      <div className="px-6 py-4 space-y-3">
                        <div
                          className={`transform transition-all duration-500 ${
                            showAlert
                              ? "translate-y-0 opacity-100 scale-100"
                              : "translate-y-4 opacity-0 scale-95"
                          }`}
                        >
                          <div
                            className={`p-4 rounded-xl border-l-4 shadow-lg ${
                              potholes[currentPothole]?.severity === "High"
                                ? "bg-gradient-to-r from-red-50 to-red-100 border-red-500"
                                : potholes[currentPothole]?.severity ===
                                  "Medium"
                                ? "bg-gradient-to-r from-yellow-50 to-orange-100 border-yellow-500"
                                : "bg-gradient-to-r from-green-50 to-emerald-100 border-green-500"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    potholes[currentPothole]?.severity ===
                                    "High"
                                      ? "bg-red-500"
                                      : potholes[currentPothole]?.severity ===
                                        "Medium"
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                  }`}
                                >
                                  <span className="text-white text-lg">⚠️</span>
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-800">
                                    Road Hazard Detected
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {potholes[currentPothole]?.severity}{" "}
                                    severity •{" "}
                                    {potholes[currentPothole]?.distance} ahead
                                  </p>
                                </div>
                              </div>
                              <button className="text-gray-400 hover:text-gray-600">
                                <svg
                                  className="w-5 h-5"
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

                        {/* Enhanced Route Options */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-gray-800 flex items-center gap-2">
                              <svg
                                className="w-5 h-5 text-[#229799]"
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
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border-l-4 border-[#229799]">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-[#229799] rounded-full animate-pulse"></div>
                                <div>
                                  <span className="font-semibold text-[#229799]">
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
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm opacity-60">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                <div>
                                  <span className="font-medium text-gray-600">
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
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                          <button className="bg-gradient-to-r from-[#229799] to-[#1a7373] text-white p-3 rounded-xl text-sm font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
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
                          <button className="border-2 border-gray-200 text-gray-700 p-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2">
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
                    Smart
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
                  {/* Road Surface - Vertical */}
                  <rect x="60" y="0" width="60" height="500" fill="#374151" />

                  {/* Road Markings - Vertical */}
                  <line
                    x1="90"
                    y1="0"
                    x2="90"
                    y2="500"
                    stroke="white"
                    strokeWidth="3"
                    strokeDasharray="25,25"
                    opacity="0.8"
                  />

                  {/* Road Edges */}
                  <line
                    x1="60"
                    y1="0"
                    x2="60"
                    y2="500"
                    stroke="#1F2937"
                    strokeWidth="2"
                  />
                  <line
                    x1="120"
                    y1="0"
                    x2="120"
                    y2="500"
                    stroke="#1F2937"
                    strokeWidth="2"
                  />

                  {/* Potholes on vertical road */}
                  <g>
                    <circle
                      cx="75"
                      cy="120"
                      r="8"
                      fill="#EF4444"
                      opacity="0.9"
                      className="animate-pulse"
                    />
                    <text
                      x="75"
                      y="123"
                      textAnchor="middle"
                      className="text-xs font-bold"
                      fill="white"
                    >
                      ⚠
                    </text>
                  </g>
                  <g>
                    <circle
                      cx="105"
                      cy="280"
                      r="10"
                      fill="#F59E0B"
                      opacity="0.9"
                      className="animate-pulse"
                    />
                    <text
                      x="105"
                      y="284"
                      textAnchor="middle"
                      className="text-xs font-bold"
                      fill="white"
                    >
                      ⚠
                    </text>
                  </g>
                  <g>
                    <circle
                      cx="80"
                      cy="420"
                      r="6"
                      fill="#10B981"
                      opacity="0.9"
                      className="animate-pulse"
                    />
                    <text
                      x="80"
                      y="423"
                      textAnchor="middle"
                      className="text-xs font-bold"
                      fill="white"
                    >
                      ⚠
                    </text>
                  </g>

                  {/* Moving Vehicle - Bottom to Top */}
                  <g
                    transform={`translate(90, ${450 - vehiclePosition * 4})`}
                    className="drop-shadow-lg"
                  >
                    {/* Vehicle Shadow */}
                    <ellipse
                      cx="1"
                      cy="1"
                      rx="10"
                      ry="15"
                      fill="black"
                      opacity="0.3"
                    />
                    {/* Vehicle Body */}
                    <rect
                      x="-8"
                      y="-12"
                      width="16"
                      height="24"
                      fill="#229799"
                      rx="4"
                    />
                    {/* Vehicle Windows */}
                    <rect
                      x="-6"
                      y="-10"
                      width="12"
                      height="8"
                      fill="#DBEAFE"
                      rx="2"
                    />
                    <rect
                      x="-6"
                      y="2"
                      width="12"
                      height="8"
                      fill="#DBEAFE"
                      rx="2"
                    />
                    {/* Vehicle Direction Arrow */}
                    <polygon points="0,-15 6,-10 -6,-10" fill="#10B981" />
                    {/* Headlights */}
                    <circle cx="-4" cy="-14" r="1.5" fill="#FBBF24" />
                    <circle cx="4" cy="-14" r="1.5" fill="#FBBF24" />
                  </g>

                  {/* Detection Waves around moving vehicle */}
                  <circle
                    cx="90"
                    cy={450 - vehiclePosition * 4}
                    r="35"
                    stroke="#229799"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.4"
                    className="animate-ping"
                  />
                  <circle
                    cx="90"
                    cy={450 - vehiclePosition * 4}
                    r="55"
                    stroke="#229799"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.2"
                    className="animate-ping"
                    style={{ animationDelay: "0.5s" }}
                  />

                  {/* Destination marker */}
                  <g transform="translate(90, 30)">
                    <circle cx="0" cy="0" r="18" fill="#10B981" opacity="0.9" />
                    <text
                      x="0"
                      y="2"
                      textAnchor="middle"
                      className="text-sm font-bold"
                      fill="white"
                    >
                      🏢
                    </text>
                    <circle
                      cx="0"
                      cy="0"
                      r="25"
                      stroke="#10B981"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.3"
                      className="animate-ping"
                    />
                  </g>

                  {/* Starting point */}
                  <g transform="translate(90, 470)">
                    <circle cx="0" cy="0" r="15" fill="#229799" opacity="0.9" />
                    <text
                      x="0"
                      y="2"
                      textAnchor="middle"
                      className="text-sm font-bold"
                      fill="white"
                    >
                      🏠
                    </text>
                  </g>

                  {/* Road signs */}
                  <g transform="translate(135, 150)">
                    <rect
                      x="0"
                      y="0"
                      width="30"
                      height="20"
                      fill="#1F2937"
                      rx="2"
                    />
                    <text
                      x="15"
                      y="12"
                      textAnchor="middle"
                      className="text-xs"
                      fill="white"
                    >
                      ROAD
                    </text>
                    <text
                      x="15"
                      y="18"
                      textAnchor="middle"
                      className="text-xs"
                      fill="white"
                    >
                      WORK
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
