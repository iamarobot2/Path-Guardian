"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Vehicle {
  id: string;
  x: number;
  y: number;
  progress: number;
  angle: number;
  currentRoute: "route1" | "route2" | "route3";
  hasAlert: boolean;
}

interface RouteHazard {
  id: string;
  x: number;
  y: number;
  type: "pothole" | "crack" | "construction" | "flooding";
  severity: "low" | "medium" | "high" | "critical";
  routeId: string;
}

interface Route {
  id: "route1" | "route2" | "route3";
  name: string;
  distance: number;
  estimatedTime: number;
  hazardCount: number;
  trafficLevel: "low" | "medium" | "high";
  description: string;
  color: string;
  path: string;
}

export default function InteractiveDemo() {
  const [selectedRoute, setSelectedRoute] = useState<
    "route1" | "route2" | "route3"
  >("route3");
  const [hazards, setHazards] = useState<RouteHazard[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedHazard, setSelectedHazard] = useState<RouteHazard | null>(
    null
  );
  const [isVerticalLayout, setIsVerticalLayout] = useState(false);

  // Use refs for animation state to avoid unnecessary re-renders
  const vehicleRef = useRef<Vehicle>({
    id: "vehicle1",
    x: 0,
    y: 0,
    progress: 0,
    angle: 0,
    currentRoute: "route2",
    hasAlert: false,
  });
  const activeHazardsRef = useRef<Set<string>>(new Set());
  const animationRef = useRef<number | undefined>(undefined);
  const [, forceUpdate] = useState({});

  // Responsive layout detection
  useEffect(() => {
    const checkLayout = () => {
      setIsVerticalLayout(window.innerWidth < 1024);
    };

    checkLayout();
    window.addEventListener("resize", checkLayout);
    return () => window.removeEventListener("resize", checkLayout);
  }, []);

  // Helper function to get point on cubic Bezier curve
  const getPointOnCubicBezier = (
    t: number,
    p0: { x: number; y: number },
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number }
  ) => {
    const x =
      Math.pow(1 - t, 3) * p0.x +
      3 * Math.pow(1 - t, 2) * t * p1.x +
      3 * (1 - t) * Math.pow(t, 2) * p2.x +
      Math.pow(t, 3) * p3.x;
    const y =
      Math.pow(1 - t, 3) * p0.y +
      3 * Math.pow(1 - t, 2) * t * p1.y +
      3 * (1 - t) * Math.pow(t, 2) * p2.y +
      Math.pow(t, 3) * p3.y;
    return { x, y };
  };
  // Optimized vehicle angle calculation with correct orientation
  const calculateVehicleAngle = useCallback(
    (
      t: number,
      p0: { x: number; y: number },
      p1: { x: number; y: number },
      p2: { x: number; y: number },
      p3: { x: number; y: number }
    ) => {
      const delta = 0.01; // Larger delta for better performance
      const nextT = Math.min(t + delta, 1);
      const currentPos = getPointOnCubicBezier(t, p0, p1, p2, p3);
      const nextPos = getPointOnCubicBezier(nextT, p0, p1, p2, p3);

      // Calculate the direction vector
      const dx = nextPos.x - currentPos.x;
      const dy = nextPos.y - currentPos.y;

      // Calculate angle in degrees
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);

      // The vehicle SVG points upward by default (negative Y direction)
      // We need to add 90 degrees to make it point in the movement direction
      angle += 90;

      return angle;
    },
    []
  );

  // Get route-specific control points
  const getRouteControlPoints = useCallback(
    (routeId: string) => {
      if (isVerticalLayout) {
        const start = { x: 50, y: 30 };
        const end = { x: 65, y: 470 };
        if (routeId === "route1") {
          return { start, cp1: { x: 25, y: 120 }, cp2: { x: 20, y: 350 }, end };
        } else if (routeId === "route2") {
          return { start, cp1: { x: 52, y: 150 }, cp2: { x: 58, y: 350 }, end };
        } else {
          return { start, cp1: { x: 75, y: 180 }, cp2: { x: 80, y: 320 }, end };
        }
      } else {
        const start = { x: 50, y: 150 };
        const end = { x: 650, y: 150 };
        if (routeId === "route1") {
          return {
            start,
            cp1: { x: 200, y: 100 },
            cp2: { x: 450, y: 80 },
            end,
          };
        } else if (routeId === "route2") {
          return {
            start,
            cp1: { x: 250, y: 140 },
            cp2: { x: 450, y: 145 },
            end,
          };
        } else {
          return {
            start,
            cp1: { x: 200, y: 200 },
            cp2: { x: 450, y: 220 },
            end,
          };
        }
      }
    },
    [isVerticalLayout]
  );

  // Helper function to get position on route curve based on route ID
  const getRoutePosition = useCallback(
    (t: number, routeId: string) => {
      const { start, cp1, cp2, end } = getRouteControlPoints(routeId);
      return getPointOnCubicBezier(t, start, cp1, cp2, end);
    },
    [getRouteControlPoints]
  );

  // Initialize routes and hazards
  useEffect(() => {
    const startPoint = isVerticalLayout ? { x: 50, y: 30 } : { x: 50, y: 150 };
    const endPoint = isVerticalLayout ? { x: 65, y: 470 } : { x: 650, y: 150 };

    const routeData: Route[] = [
      {
        id: "route1",
        name: "Shortest Route",
        distance: 8.2,
        estimatedTime: 25,
        hazardCount: 8,
        trafficLevel: "medium",
        description: "Shortest distance but poor road quality",
        color: "#EF4444",
        path: isVerticalLayout
          ? `M ${startPoint.x} ${startPoint.y} C 25 120, 20 350, ${endPoint.x} ${endPoint.y}`
          : `M ${startPoint.x} ${startPoint.y} C 200 100, 450 80, ${endPoint.x} ${endPoint.y}`,
      },
      {
        id: "route2",
        name: "Balanced Route",
        distance: 9.8,
        estimatedTime: 18,
        hazardCount: 3,
        trafficLevel: "low",
        description: "Optimal balance of distance and road quality",
        color: "#10B981",
        path: isVerticalLayout
          ? `M ${startPoint.x} ${startPoint.y} C 52 150, 58 350, ${endPoint.x} ${endPoint.y}`
          : `M ${startPoint.x} ${startPoint.y} C 250 140, 450 145, ${endPoint.x} ${endPoint.y}`,
      },
      {
        id: "route3",
        name: "Longest Route",
        distance: 12.5,
        estimatedTime: 22,
        hazardCount: 1,
        trafficLevel: "high",
        description: "Longest but highest quality roads",
        color: "#3B82F6",
        path: isVerticalLayout
          ? `M ${startPoint.x} ${startPoint.y} C 75 180, 80 320, ${endPoint.x} ${endPoint.y}`
          : `M ${startPoint.x} ${startPoint.y} C 200 200, 450 220, ${endPoint.x} ${endPoint.y}`,
      },
    ];

    const hazardData: RouteHazard[] = [
      // Route 1 hazards (many)
      {
        id: "h1",
        ...getRoutePosition(0.15, "route1"),
        type: "pothole",
        severity: "high",
        routeId: "route1",
      },
      {
        id: "h2",
        ...getRoutePosition(0.25, "route1"),
        type: "crack",
        severity: "medium",
        routeId: "route1",
      },
      {
        id: "h3",
        ...getRoutePosition(0.35, "route1"),
        type: "pothole",
        severity: "critical",
        routeId: "route1",
      },
      {
        id: "h4",
        ...getRoutePosition(0.45, "route1"),
        type: "construction",
        severity: "high",
        routeId: "route1",
      },
      {
        id: "h5",
        ...getRoutePosition(0.55, "route1"),
        type: "flooding",
        severity: "medium",
        routeId: "route1",
      },
      {
        id: "h6",
        ...getRoutePosition(0.65, "route1"),
        type: "pothole",
        severity: "high",
        routeId: "route1",
      },
      {
        id: "h7",
        ...getRoutePosition(0.75, "route1"),
        type: "crack",
        severity: "low",
        routeId: "route1",
      },
      {
        id: "h8",
        ...getRoutePosition(0.85, "route1"),
        type: "pothole",
        severity: "medium",
        routeId: "route1",
      },

      // Route 2 hazards (few)
      {
        id: "h9",
        ...getRoutePosition(0.3, "route2"),
        type: "crack",
        severity: "low",
        routeId: "route2",
      },
      {
        id: "h10",
        ...getRoutePosition(0.5, "route2"),
        type: "pothole",
        severity: "medium",
        routeId: "route2",
      },
      {
        id: "h11",
        ...getRoutePosition(0.7, "route2"),
        type: "crack",
        severity: "low",
        routeId: "route2",
      },

      // Route 3 hazards (minimal)
      {
        id: "h12",
        ...getRoutePosition(0.4, "route3"),
        type: "crack",
        severity: "low",
        routeId: "route3",
      },
    ];

    setRoutes(routeData);
    setHazards(hazardData);

    // Initialize vehicle position
    const initialPosition = getRoutePosition(0, selectedRoute);
    vehicleRef.current = {
      id: "vehicle1",
      x: initialPosition.x,
      y: initialPosition.y,
      progress: 0,
      angle: 0,
      currentRoute: selectedRoute,
      hasAlert: false,
    };
  }, [isVerticalLayout, selectedRoute, getRoutePosition]);

  // High-performance vehicle animation using requestAnimationFrame
  useEffect(() => {
    if (routes.length === 0) return;

    let currentProgress = 0;
    let lastTime = performance.now();

    const updateLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Slower speed for better visualization
      const speedPerSecond = 12; // 12% per second
      currentProgress += (speedPerSecond * deltaTime) / 1000;

      if (currentProgress > 100) currentProgress = 0;

      const t = currentProgress / 100;
      const position = getRoutePosition(t, selectedRoute);

      // Calculate angle using route-specific control points
      const { start, cp1, cp2, end } = getRouteControlPoints(selectedRoute);
      const angle = calculateVehicleAngle(t, start, cp1, cp2, end);

      // Check for hazard alerts with optimized detection
      let hasAlert = false;
      activeHazardsRef.current.clear();

      const routeHazards = hazards.filter((h) => h.routeId === selectedRoute);
      for (const hazard of routeHazards) {
        const distance = Math.sqrt(
          Math.pow(hazard.x - position.x, 2) +
            Math.pow(hazard.y - position.y, 2)
        );
        if (distance < 30) {
          hasAlert = true;
          activeHazardsRef.current.add(hazard.id);
        }
      }

      // Update vehicle ref (no state update for performance)
      vehicleRef.current = {
        ...vehicleRef.current,
        x: position.x,
        y: position.y,
        angle,
        progress: currentProgress,
        currentRoute: selectedRoute,
        hasAlert,
      };

      // Force a re-render every few frames for smooth animation
      forceUpdate({});

      // Continue animation loop
      animationRef.current = requestAnimationFrame(updateLoop);
    };

    // Start the animation loop
    animationRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    routes,
    hazards,
    selectedRoute,
    calculateVehicleAngle,
    getRoutePosition,
    getRouteControlPoints,
  ]);

  const getSeverityColor = (severity: RouteHazard["severity"]) => {
    switch (severity) {
      case "low":
        return "#10B981";
      case "medium":
        return "#F59E0B";
      case "high":
        return "#EF4444";
      case "critical":
        return "#DC2626";
      default:
        return "#6B7280";
    }
  };

  const getTrafficColor = (level: Route["trafficLevel"]) => {
    switch (level) {
      case "low":
        return "#10B981";
      case "medium":
        return "#F59E0B";
      case "high":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getRouteRecommendation = () => {
    // Recommend based on lowest hazard count and good time
    const sortedRoutes = [...routes].sort((a, b) => {
      const aScore = a.hazardCount + a.estimatedTime / 10;
      const bScore = b.hazardCount + b.estimatedTime / 10;
      return aScore - bScore;
    });
    return sortedRoutes[0]?.id || "route2";
  };

  const getVehicleRingColor = () => {
    if (activeHazardsRef.current.size === 0) {
      return "#229799"; // Default teal color
    }

    // Find the highest severity among active hazards
    let highestSeverity: RouteHazard["severity"] = "low";
    hazards.forEach((hazard) => {
      if (activeHazardsRef.current.has(hazard.id)) {
        if (
          hazard.severity === "critical" ||
          (hazard.severity === "high" && highestSeverity !== "critical") ||
          (hazard.severity === "medium" && highestSeverity === "low")
        ) {
          highestSeverity = hazard.severity;
        }
      }
    });

    return getSeverityColor(highestSeverity);
  };

  // Get current vehicle for rendering
  const vehicle = vehicleRef.current;

  return (
    <div
      id="interactive-demo"
      className="py-20 px-4 bg-gradient-to-br from-[#229799] via-[#1a7373] to-[#144d4d] relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/3 rounded-full blur-2xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Intelligent Route Planning
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            See how PathGuardian calculates the optimal route from Location A to
            B by analyzing road quality, hazards, traffic, and distance to
            minimize travel costs and time.
          </p>
        </div>{" "}
        {/* Main Demo Container */}
        <div className="space-y-8">
          {/* Route Visualization */}
          <div className="w-full">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Route Analysis: Location A → B
                </h3>
                <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-100 text-sm">Analyzing</span>
                </div>
              </div>

              {/* Route Map */}
              <div className="bg-gray-900/50 rounded-xl p-4 h-96 relative overflow-hidden">
                {/* Map background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `
                      linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                </div>
                <svg
                  viewBox={isVerticalLayout ? "0 0 100 500" : "0 0 700 300"}
                  className="w-full h-full relative z-10"
                >
                  {/* Location Markers */}
                  <g>
                    {/* Location A */}
                    <circle
                      cx={isVerticalLayout ? 50 : 50}
                      cy={isVerticalLayout ? 30 : 150}
                      r="12"
                      fill="#22C55E"
                      stroke="white"
                      strokeWidth="4"
                    />
                    <circle
                      cx={isVerticalLayout ? 50 : 50}
                      cy={isVerticalLayout ? 30 : 150}
                      r="18"
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth="2"
                      opacity="0.5"
                      className="animate-pulse"
                    />
                    <text
                      x={isVerticalLayout ? 65 : 75}
                      y={isVerticalLayout ? 38 : 158}
                      fill="white"
                      fontSize={isVerticalLayout ? "14" : "20"}
                      fontWeight="bold"
                      stroke="black"
                      strokeWidth="1"
                    >
                      A
                    </text>

                    {/* Location B */}
                    <circle
                      cx={isVerticalLayout ? 65 : 650}
                      cy={isVerticalLayout ? 470 : 150}
                      r="12"
                      fill="#EF4444"
                      stroke="white"
                      strokeWidth="4"
                    />
                    <text
                      x={isVerticalLayout ? 80 : 675}
                      y={isVerticalLayout ? 478 : 158}
                      fill="white"
                      fontSize={isVerticalLayout ? "14" : "20"}
                      fontWeight="bold"
                      stroke="black"
                      strokeWidth="1"
                    >
                      B
                    </text>
                  </g>

                  {/* Road base layers */}
                  {routes.map((route) => (
                    <g key={`road-${route.id}`}>
                      {/* Road base (darker) */}
                      <path
                        d={route.path}
                        stroke="#374151"
                        strokeWidth={selectedRoute === route.id ? "16" : "12"}
                        fill="none"
                        opacity={selectedRoute === route.id ? "0.8" : "0.6"}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Road surface */}
                      <path
                        d={route.path}
                        stroke={route.color}
                        strokeWidth={selectedRoute === route.id ? "8" : "6"}
                        fill="none"
                        opacity={selectedRoute === route.id ? "1" : "0.7"}
                        strokeDasharray={
                          route.id === getRouteRecommendation()
                            ? "none"
                            : "15,10"
                        }
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Road center line */}
                      <path
                        d={route.path}
                        stroke="white"
                        strokeWidth="1"
                        fill="none"
                        opacity={selectedRoute === route.id ? "0.8" : "0.5"}
                        strokeDasharray="8,8"
                        strokeLinecap="round"
                      />
                    </g>
                  ))}

                  {/* Route labels */}
                  {routes.map((route) => (
                    <g key={`label-${route.id}`}>
                      <text
                        x={
                          isVerticalLayout
                            ? route.id === "route1"
                              ? 10
                              : route.id === "route2"
                              ? 40
                              : 70
                            : 350
                        }
                        y={
                          isVerticalLayout
                            ? 20
                            : route.id === "route1"
                            ? 35
                            : route.id === "route2"
                            ? 135
                            : 235
                        }
                        fill={route.color}
                        fontSize="10"
                        fontWeight="bold"
                        stroke="black"
                        strokeWidth="0.3"
                      >
                        {route.name}
                      </text>
                    </g>
                  ))}

                  {/* Hazards - only show for selected route */}
                  {hazards
                    .filter((hazard) => hazard.routeId === selectedRoute)
                    .map((hazard) => (
                      <g key={hazard.id}>
                        {/* Hazard shadow */}
                        <circle
                          cx={hazard.x + 1}
                          cy={hazard.y + 1}
                          r="7"
                          fill="black"
                          opacity="0.3"
                        />
                        {/* Main hazard circle */}
                        <circle
                          cx={hazard.x}
                          cy={hazard.y}
                          r="6"
                          fill={getSeverityColor(hazard.severity)}
                          stroke="white"
                          strokeWidth="1"
                          className="cursor-pointer"
                          onClick={() => setSelectedHazard(hazard)}
                        />
                        {/* Hazard icon */}
                        <text
                          x={hazard.x}
                          y={hazard.y + 2}
                          textAnchor="middle"
                          fill="white"
                          fontSize="8"
                          fontWeight="bold"
                          className="pointer-events-none"
                        >
                          {hazard.type === "pothole"
                            ? "●"
                            : hazard.type === "crack"
                            ? "⚡"
                            : hazard.type === "construction"
                            ? "🚧"
                            : "💧"}
                        </text>
                      </g>
                    ))}

                  {/* Vehicle */}
                  <g
                    transform={`translate(${vehicle.x}, ${vehicle.y}) rotate(${vehicle.angle})`}
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
                      fill={vehicle.hasAlert ? "#F59E0B" : "#229799"}
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

                    {/* GPS Pulse rings with dynamic color based on hazards */}
                    <circle
                      cx="0"
                      cy="0"
                      r="15"
                      stroke={getVehicleRingColor()}
                      strokeWidth="2"
                      fill="none"
                      opacity="0.6"
                      className="animate-pulse"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="25"
                      stroke={getVehicleRingColor()}
                      strokeWidth="1"
                      fill="none"
                      opacity="0.3"
                      className="animate-ping"
                    />

                    {/* Alert indicator */}
                    {vehicle.hasAlert && (
                      <>
                        <circle
                          cx="0"
                          cy="-15"
                          r="4"
                          fill="#F59E0B"
                          className="alert-indicator"
                        >
                          <animate
                            attributeName="r"
                            values="4;6;4"
                            dur="0.8s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <text
                          x="0"
                          y="-13"
                          textAnchor="middle"
                          fill="white"
                          fontSize="6"
                          fontWeight="bold"
                        >
                          !
                        </text>
                      </>
                    )}
                  </g>
                </svg>

                {/* Hazard Detail Modal */}
                {selectedHazard && (
                  <div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setSelectedHazard(null)}
                  >
                    <div
                      className="bg-white/95 backdrop-blur-md rounded-xl p-6 max-w-sm mx-4 relative z-60"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-bold text-gray-900">
                          Road Hazard Detected
                        </h4>
                        <button
                          onClick={() => setSelectedHazard(null)}
                          className="text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-600">Type:</span>
                          <span className="ml-2 text-gray-900 font-medium capitalize">
                            {selectedHazard.type}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">
                            Severity:
                          </span>
                          <span
                            className="ml-2 px-2 py-1 rounded text-white text-sm font-medium"
                            style={{
                              backgroundColor: getSeverityColor(
                                selectedHazard.severity
                              ),
                            }}
                          >
                            {selectedHazard.severity.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Impact:</span>
                          <span className="ml-2 text-gray-900 font-medium">
                            {selectedHazard.severity === "critical"
                              ? "High vehicle damage risk"
                              : selectedHazard.severity === "high"
                              ? "Moderate vehicle damage risk"
                              : selectedHazard.severity === "medium"
                              ? "Minor vehicle impact"
                              : "Minimal impact"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>{" "}
          {/* Available Routes - Full Width */}
          <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">
              Available Routes
            </h3>
            <div className="space-y-3 md:space-y-0 md:space-x-3 md:flex md:flex-row">
              {routes.map((route) => (
                <button
                  key={route.id}
                  onClick={() => setSelectedRoute(route.id)}
                  className={`w-full md:flex-1 p-4 rounded-xl text-left transition-all border-2 ${
                    selectedRoute === route.id
                      ? "bg-white/20 border-white/40"
                      : "bg-white/5 border-white/20 hover:bg-white/10"
                  } ${
                    route.id === getRouteRecommendation()
                      ? "ring-2 ring-yellow-400"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className="font-bold text-sm"
                      style={{ color: route.color }}
                    >
                      {route.name}
                    </span>
                    {route.id === getRouteRecommendation() && (
                      <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold">
                        RECOMMENDED
                      </span>
                    )}
                  </div>
                  <div className="text-white/90 text-xs mb-2">
                    {route.description}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-white/70">Distance:</span>
                      <span className="text-white ml-1">
                        {route.distance} km
                      </span>
                    </div>
                    <div>
                      <span className="text-white/70">Time:</span>
                      <span className="text-white ml-1">
                        {route.estimatedTime} min
                      </span>
                    </div>
                    <div>
                      <span className="text-white/70">Hazards:</span>
                      <span className="text-white ml-1">
                        {route.hazardCount}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-white/70 text-xs">Traffic:</span>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: getTrafficColor(route.trafficLevel),
                      }}
                    ></div>
                    <span className="text-white text-xs capitalize">
                      {route.trafficLevel}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {/* Benefits and Why PathGuardian - Two Column Row */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* PathGuardian Benefits */}
            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4">
                PathGuardian Benefits
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5"></div>
                  <span className="text-white/90">
                    Reduces vehicle maintenance costs by up to 40%
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5"></div>
                  <span className="text-white/90">
                    Increases fuel efficiency by avoiding poor road conditions
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-1.5"></div>
                  <span className="text-white/90">
                    Provides real-time hazard alerts and safety warnings
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-1.5"></div>
                  <span className="text-white/90">
                    Optimizes delivery routes for commercial fleets
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-1.5"></div>
                  <span className="text-white/90">
                    Contributes to safer roads through crowd-sourced data
                  </span>
                </div>
              </div>
            </div>

            {/* Why Choose PathGuardian */}
            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4">
                Why Choose PathGuardian?
              </h3>
              {routes.find((r) => r.id === selectedRoute) && (
                <div className="space-y-4">
                  {selectedRoute === getRouteRecommendation() ? (
                    <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-green-100 font-bold">
                          Optimal Route Selected
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-green-50">
                        <div className="flex items-start gap-2">
                          <span>💰</span>
                          <span>
                            Save up to 40% on vehicle maintenance costs
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span>⛽</span>
                          <span>
                            Reduce fuel consumption by avoiding rough roads
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span>🚗</span>
                          <span>
                            Extend vehicle lifespan with smoother routes
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span>📊</span>
                          <span>
                            Real-time optimization based on current conditions
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span className="text-yellow-100 font-bold">
                          Consider Our Recommendation
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-yellow-50">
                        <div className="flex items-start gap-2">
                          <span>⚠️</span>
                          <span>
                            Current route may have higher maintenance costs
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span>🔄</span>
                          <span>
                            Switch to recommended route for better savings
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span>🎯</span>
                          <span>
                            PathGuardian analyzes 1000+ factors for optimization
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-white/20 pt-4">
                    <h4 className="text-white font-semibold mb-3">
                      Route Performance
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-white/70">Route Quality</div>
                        <div className="text-white font-bold text-lg">
                          {routes.find((r) => r.id === selectedRoute)!
                            .hazardCount < 3
                            ? "95%"
                            : routes.find((r) => r.id === selectedRoute)!
                                .hazardCount < 6
                            ? "78%"
                            : "62%"}
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-white/70">Safety Rating</div>
                        <div className="text-white font-bold text-lg">
                          {routes.find((r) => r.id === selectedRoute)!
                            .hazardCount < 3
                            ? "A+"
                            : routes.find((r) => r.id === selectedRoute)!
                                .hazardCount < 6
                            ? "B"
                            : "C"}
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-white/70">Time Efficiency</div>
                        <div className="text-white font-bold text-lg">
                          {
                            routes.find((r) => r.id === selectedRoute)!
                              .estimatedTime
                          }
                          min
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl inline-block">
            <h3 className="text-2xl font-bold text-white mb-4">
              Experience Smarter Route Planning
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              PathGuardian&apos;s AI considers road quality, hazards, traffic,
              and distance to find the truly optimal route - not just the
              shortest one.
            </p>
            <button className="bg-white text-[#229799] px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/90 transition-all transform hover:scale-105 shadow-xl">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
