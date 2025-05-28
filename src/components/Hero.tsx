"use client";

import { useState, useEffect } from "react";

export default function Hero() {
  const [currentPothole, setCurrentPothole] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [vehiclePosition, setVehiclePosition] = useState(0);

  const potholes = [
    {
      id: 1,
      x: 120,
      y: 100,
      severity: "Medium",
      distance: "50m",
      color: "#F59E0B",
    },
    {
      id: 2,
      x: 220,
      y: 180,
      severity: "High",
      distance: "25m",
      color: "#EF4444",
    },
    {
      id: 3,
      x: 300,
      y: 120,
      severity: "Low",
      distance: "75m",
      color: "#10B981",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setVehiclePosition((prev) => (prev + 1) % 100);

      // Show alert when approaching potholes
      if (vehiclePosition % 25 === 0) {
        setCurrentPothole((prev) => (prev + 1) % potholes.length);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [vehiclePosition, potholes.length]);

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
          </div>

          {/* Right Animation */}
          <div className="lg:w-1/2 relative">
            <div className="flex items-center justify-center gap-8">
              {/* Mobile Phone Mockup */}
              <div className="relative">
                <div className="w-64 h-[480px] bg-gray-900 rounded-[2.5rem] p-4 shadow-2xl">
                  <div className="w-full h-full bg-black rounded-[2rem] relative overflow-hidden">
                    {/* Phone Screen */}
                    <div className="absolute inset-2 bg-white rounded-[1.5rem] overflow-hidden">
                      {/* Status Bar */}
                      <div className="bg-[#229799] text-white p-3 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-[#229799] rounded-full"></div>
                          </div>
                          <span className="font-semibold text-sm">
                            Path Guardian
                          </span>
                        </div>
                        <div className="text-xs">9:41 AM</div>
                      </div>

                      {/* Map View */}
                      <div className="relative h-64 bg-gray-100">
                        <svg className="w-full h-full" viewBox="0 0 240 200">
                          {/* Road */}
                          <path
                            d="M20 100 Q120 50 220 100"
                            stroke="#374151"
                            strokeWidth="20"
                            fill="none"
                          />
                          <path
                            d="M20 100 Q120 50 220 100"
                            stroke="#FFFFFF"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                            fill="none"
                          />
                          {/* Moving Vehicle */}
                          <g
                            transform={`translate(${
                              20 + vehiclePosition * 2
                            }, ${100 - Math.sin(vehiclePosition * 0.1) * 20})`}
                          >
                            <circle cx="0" cy="0" r="8" fill="#229799" />
                            <circle cx="0" cy="0" r="4" fill="white" />
                          </g>{" "}
                          {/* Potholes */}
                          {potholes.map((pothole) => (
                            <g key={pothole.id}>
                              <circle
                                cx={pothole.x}
                                cy={pothole.y}
                                r="6"
                                fill={pothole.color}
                                className="animate-pulse"
                              />
                              <circle
                                cx={pothole.x}
                                cy={pothole.y}
                                r="12"
                                stroke={pothole.color}
                                strokeWidth="2"
                                fill="none"
                                opacity="0.6"
                                className="animate-ping"
                              />
                            </g>
                          ))}
                        </svg>
                      </div>

                      {/* Alert Section */}
                      <div className="p-4 space-y-3">
                        <div
                          className={`transform transition-all duration-500 ${
                            showAlert
                              ? "translate-y-0 opacity-100"
                              : "translate-y-4 opacity-0"
                          }`}
                        >
                          <div
                            className={`p-4 rounded-lg border-l-4 ${
                              potholes[currentPothole]?.severity === "High"
                                ? "bg-red-50 border-red-500"
                                : potholes[currentPothole]?.severity ===
                                  "Medium"
                                ? "bg-yellow-50 border-yellow-500"
                                : "bg-green-50 border-green-500"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-800">
                                  ⚠️ Pothole Alert
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {potholes[currentPothole]?.severity} severity
                                  - {potholes[currentPothole]?.distance} ahead
                                </p>
                              </div>
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  potholes[currentPothole]?.severity === "High"
                                    ? "bg-red-500"
                                    : potholes[currentPothole]?.severity ===
                                      "Medium"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                } animate-pulse`}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Route Options */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <h4 className="font-semibold text-gray-800 mb-2">
                            🚗 Route Options
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-[#229799]">
                                ● Optimal Route
                              </span>
                              <span className="text-gray-600">+2 min</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500">
                                ● Fastest Route
                              </span>
                              <span className="text-gray-500">+5 min</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <button className="bg-[#229799] text-white p-2 rounded-lg text-xs font-medium">
                            Navigate
                          </button>
                          <button className="border border-gray-300 text-gray-700 p-2 rounded-lg text-xs font-medium">
                            Report Issue
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating UI Elements */}
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold animate-bounce">
                  Live Detection
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white text-[#229799] px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  AI Powered
                </div>
              </div>

              {/* Road Animation */}
              <div className="hidden lg:block relative">
                <svg
                  width="300"
                  height="400"
                  viewBox="0 0 300 400"
                  className="drop-shadow-2xl"
                >
                  {/* Road Surface */}
                  <rect x="100" y="0" width="100" height="400" fill="#374151" />

                  {/* Road Markings */}
                  <line
                    x1="150"
                    y1="0"
                    x2="150"
                    y2="400"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="20,20"
                    opacity="0.8"
                  />

                  {/* Potholes on road */}
                  <circle
                    cx="130"
                    cy="80"
                    r="12"
                    fill="#EF4444"
                    opacity="0.9"
                    className="animate-pulse"
                  />
                  <circle
                    cx="170"
                    cy="200"
                    r="15"
                    fill="#F59E0B"
                    opacity="0.9"
                    className="animate-pulse"
                  />
                  <circle
                    cx="140"
                    cy="320"
                    r="10"
                    fill="#10B981"
                    opacity="0.9"
                    className="animate-pulse"
                  />

                  {/* Moving Vehicle */}
                  <g
                    transform={`translate(150, ${50 + vehiclePosition * 3})`}
                    className="drop-shadow-lg"
                  >
                    <rect
                      x="-15"
                      y="-8"
                      width="30"
                      height="16"
                      fill="#229799"
                      rx="3"
                    />
                    <circle cx="-8" cy="8" r="4" fill="#1F2937" />
                    <circle cx="8" cy="8" r="4" fill="#1F2937" />
                    <rect x="-10" y="-5" width="8" height="5" fill="#DBEAFE" />
                    <rect x="2" y="-5" width="8" height="5" fill="#DBEAFE" />
                  </g>

                  {/* Detection Waves */}
                  <circle
                    cx="150"
                    cy={`${50 + vehiclePosition * 3}`}
                    r="30"
                    stroke="#229799"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.4"
                    className="animate-ping"
                  />
                  <circle
                    cx="150"
                    cy={`${50 + vehiclePosition * 3}`}
                    r="50"
                    stroke="#229799"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.2"
                    className="animate-ping"
                    style={{ animationDelay: "0.5s" }}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
