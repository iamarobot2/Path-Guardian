"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface PotholeData {
  id: number;
  title: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  location: string;
  size: string;
  top: string;
  left: string;
  width: number;
  height: number;
  discoveredAt?: number;
  damage: number;
  repairCost: number;
  depth: number;
  age: number;
  avoided?: boolean;
}

interface GameStats {
  score: number;
  potholesDodged: number;
  damageAvoided: number;
  fuelSaved: number;
  timeElapsed: number;
  level: number;
  achievements: string[];
  streak: number;
  multiplier: number;
  coins: number;
  experience: number;
}

interface Vehicle {
  health: number;
  speed: number;
  efficiency: number;
  position: { x: number; y: number };
  rotation: number;
  shield: boolean;
  nitro: number;
}

interface PowerUp {
  id: number;
  type: 'shield' | 'nitro' | 'coin' | 'repair' | 'scanner';
  position: { x: number; y: number };
  active: boolean;
  effect: string;
  collected?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
  unlockedAt?: number;
}

interface WeatherEffect {
  type: 'rain' | 'snow' | 'fog' | 'clear';
  intensity: number;
  visibility: number;
}

export default function InteractiveDemo() {
  // Core game state
  const [selectedPothole, setSelectedPothole] = useState<PotholeData | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [gameMode, setGameMode] = useState<"manual" | "auto" | "challenge">("auto");
  const [routeProgress, setRouteProgress] = useState(0);
  const [showDetectionWave, setShowDetectionWave] = useState(false);
  
  // Vehicle and movement state
  const [carPosition, setCarPosition] = useState({ top: "80%", left: "20%" });
  const [carRotation, setCarRotation] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [isRouting, setIsRouting] = useState(false);
  
  // Advanced game features
  const [vehicle, setVehicle] = useState<Vehicle>({
    health: 100,
    speed: 60,
    efficiency: 85,
    position: { x: 20, y: 80 },
    rotation: 0,
    shield: false,
    nitro: 100
  });
  
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    potholesDodged: 0,
    damageAvoided: 0,
    fuelSaved: 0,
    timeElapsed: 0,
    level: 1,
    achievements: [],
    streak: 0,
    multiplier: 1,
    coins: 0,
    experience: 0
  });
  
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_dodge',
      title: 'First Dodge',
      description: 'Successfully avoid your first pothole',
      icon: '🎯',
      unlocked: false,
      progress: 0,
      target: 1
    },
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      description: 'Maintain high speed for 30 seconds',
      icon: '⚡',
      unlocked: false,
      progress: 0,
      target: 30
    },
    {
      id: 'perfect_route',
      title: 'Perfect Route',
      description: 'Complete a route without hitting any potholes',
      icon: '🏆',
      unlocked: false,
      progress: 0,
      target: 1
    }
  ]);
  
  const [weather, setWeather] = useState<WeatherEffect>({
    type: 'clear',
    intensity: 0,
    visibility: 100
  });
  
  // AI suggestions and challenges
  const [aiSuggestion, setAiSuggestion] = useState<string>("");
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [challengeTimer, setChallengeTimer] = useState(0);
  
  // Refs for game loop
  const gameLoopRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const particleIdRef = useRef(0);

  // Enhanced pothole data with proper severity values
  const potholeData: PotholeData[] = [
    {
      id: 1,
      title: "Critical Damage Zone",
      severity: "Critical",
      location: "25.3176° N, 82.9739° E",
      size: "45cm × 30cm, 8cm deep",
      top: "30%",
      left: "25%",
      width: 35,
      height: 35,
      damage: 25,
      repairCost: 1500,
      depth: 8,
      age: 180
    },
    {
      id: 2,
      title: "High Priority Repair",
      severity: "High",
      location: "25.3142° N, 82.9812° E",
      size: "30cm × 25cm, 5cm deep",
      top: "70%",
      left: "60%",
      width: 28,
      height: 28,
      damage: 15,
      repairCost: 800,
      depth: 5,
      age: 90
    },
    {
      id: 3,
      title: "Minor Surface Damage",
      severity: "Medium",
      location: "25.3201° N, 82.9768° E",
      size: "20cm × 15cm, 3cm deep",
      top: "40%",
      left: "75%",
      width: 22,
      height: 22,
      damage: 8,
      repairCost: 300,
      depth: 3,
      age: 30
    }
  ];

  // Generate random power-ups
  const generatePowerUp = useCallback(() => {
    const types: PowerUp['type'][] = ['shield', 'nitro', 'coin', 'repair', 'scanner'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    return {
      id: Date.now() + Math.random(),
      type,
      position: {
        x: Math.random() * 70 + 15, // Keep in bounds
        y: Math.random() * 70 + 15
      },
      active: true,
      effect: type === 'shield' ? 'Temporary damage immunity' :
              type === 'nitro' ? 'Speed boost for 10 seconds' :
              type === 'coin' ? 'Bonus points' :
              type === 'repair' ? 'Restore vehicle health' :
              'Enhanced pothole detection'
    };
  }, []);

  // Create particle effects
  const createParticles = useCallback((x: number, y: number, color: string, count: number = 5) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1,
        maxLife: 1,
        color,
        size: Math.random() * 4 + 2
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  // AI suggestion system
  const generateAISuggestion = useCallback(() => {
    const suggestions = [
      "Consider reducing speed when approaching damaged areas",
      "Your current route avoids 3 major potholes - well done!",
      "Weather conditions are optimal for safe driving",
      "Try using the scanner power-up for better detection",
      "Maintain steady speed to improve fuel efficiency"
    ];
    setAiSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
  }, []);

  // Challenge system
  const startChallenge = useCallback(() => {
    const challenges = [
      "Speed Challenge: Maintain 50+ km/h for 20 seconds",
      "Efficiency Challenge: Complete route with 90%+ efficiency",
      "Dodge Challenge: Avoid 5 potholes in a row"
    ];
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    setActiveChallenge(challenge);
    setChallengeTimer(20); // 20 seconds
  }, []);

  // Main game loop
  const gameLoop = useCallback(() => {
    if (!isActive) return;

    // Update particles
    setParticles(prev => prev
      .map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        life: p.life - 0.02,
        vx: p.vx * 0.98,
        vy: p.vy * 0.98
      }))
      .filter(p => p.life > 0)
    );

    // Update game stats
    setGameStats(prev => ({
      ...prev,
      timeElapsed: prev.timeElapsed + 0.1,
      score: prev.score + (currentSpeed > 0 ? Math.floor(currentSpeed / 10) : 0)
    }));

    // Check for level progression
    setGameStats(prev => {
      const newLevel = Math.floor(prev.experience / 1000) + 1;
      if (newLevel > prev.level) {
        createParticles(400, 300, '#FFD700', 10);
        return { ...prev, level: newLevel };
      }
      return prev;
    });

    // Generate power-ups occasionally
    if (Math.random() < 0.005 && powerUps.length < 3) {
      setPowerUps(prev => [...prev, generatePowerUp()]);
    }

    // Update challenge timer
    if (activeChallenge && challengeTimer > 0) {
      setChallengeTimer(prev => prev - 0.1);
    } else if (activeChallenge && challengeTimer <= 0) {
      setActiveChallenge(null);
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [isActive, currentSpeed, activeChallenge, challengeTimer, powerUps.length, generatePowerUp, createParticles]);

  // Start game loop when active
  useEffect(() => {
    if (isActive) {
      startTimeRef.current = Date.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isActive, gameLoop]);

  // Handle pothole interaction
  const handlePotholeClick = (pothole: PotholeData) => {
    setSelectedPothole(pothole);
    createParticles(
      parseInt(pothole.left.replace('%', '')) * 8, 
      parseInt(pothole.top.replace('%', '')) * 6, 
      '#FF6B6B', 
      3
    );
  };

  // Collect power-up
  const collectPowerUp = useCallback((powerUp: PowerUp) => {
    setPowerUps(prev => prev.filter(p => p.id !== powerUp.id));
    
    // Apply power-up effect
    switch (powerUp.type) {
      case 'shield':
        setVehicle(prev => ({ ...prev, shield: true }));
        setTimeout(() => setVehicle(prev => ({ ...prev, shield: false })), 10000);
        break;
      case 'nitro':
        setVehicle(prev => ({ ...prev, nitro: Math.min(100, prev.nitro + 25) }));
        break;
      case 'coin':
        setGameStats(prev => ({ ...prev, coins: prev.coins + 10, score: prev.score + 100 }));
        break;
      case 'repair':
        setVehicle(prev => ({ ...prev, health: Math.min(100, prev.health + 20) }));
        break;
      case 'scanner':
        setShowDetectionWave(true);
        setTimeout(() => setShowDetectionWave(false), 3000);
        break;
    }
    
    createParticles(powerUp.position.x * 8, powerUp.position.y * 6, '#00FF88', 8);
    setGameStats(prev => ({ ...prev, experience: prev.experience + 50 }));
  }, [createParticles]);  // Enhanced route with dynamic waypoints
  const startRoute = () => {
    setIsRouting(true);
    setIsActive(true);
    setRouteProgress(0);
    generateAISuggestion();

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
    const animationSpeed = 250;

    const moveVehicle = () => {
      if (currentWaypoint >= detailedWaypoints.length) {
        setIsRouting(false);
        setRouteProgress(100);
        setCurrentSpeed(0);
        
        // Check for perfect route achievement
        const perfectRoute = !potholeData.some(p => p.avoided === false);
        if (perfectRoute) {
          unlockAchievement('perfect_route');
        }
        
        return;
      }

      const waypoint = detailedWaypoints[currentWaypoint];
      setCarPosition({ top: waypoint.top, left: waypoint.left });
      setCarRotation(waypoint.rotation);
      setCurrentSpeed(waypoint.speed);
      setRouteProgress((currentWaypoint / detailedWaypoints.length) * 100);

      // Update vehicle position in state
      setVehicle(prev => ({
        ...prev,
        position: { 
          x: parseInt(waypoint.left.replace('%', '')), 
          y: parseInt(waypoint.top.replace('%', ''))
        },
        rotation: waypoint.rotation,
        speed: waypoint.speed
      }));

      // Check for pothole avoidance
      potholeData.forEach(pothole => {
        const vehicleX = parseInt(waypoint.left.replace('%', ''));
        const vehicleY = parseInt(waypoint.top.replace('%', ''));
        const potholeX = parseInt(pothole.left.replace('%', ''));
        const potholeY = parseInt(pothole.top.replace('%', ''));
        
        const distance = Math.sqrt(
          Math.pow(vehicleX - potholeX, 2) + Math.pow(vehicleY - potholeY, 2)
        );
        
        if (distance < 8 && !pothole.avoided) {
          // Successfully avoided pothole
          pothole.avoided = true;
          setGameStats(prev => ({
            ...prev,
            potholesDodged: prev.potholesDodged + 1,
            score: prev.score + 200,
            experience: prev.experience + 100
          }));
          createParticles(potholeX * 8, potholeY * 6, '#00FF88', 5);
          unlockAchievement('first_dodge');
        }
      });

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

  // Unlock achievement helper
  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.id === achievementId && !achievement.unlocked) {
        createParticles(400, 300, '#FFD700', 15);
        setGameStats(prevStats => ({
          ...prevStats,
          achievements: [...prevStats.achievements, achievement.title],
          score: prevStats.score + 500,
          experience: prevStats.experience + 250
        }));
        return { ...achievement, unlocked: true, unlockedAt: Date.now() };
      }
      return achievement;
    }));
  };

  // Reset function
  const reset = () => {
    setCarPosition({ top: "80%", left: "20%" });
    setCarRotation(0);
    setSelectedPothole(null);
    setIsRouting(false);
    setIsActive(false);
    setCurrentSpeed(0);
    setRouteProgress(0);
    setShowDetectionWave(false);
    setPowerUps([]);
    setParticles([]);
    setActiveChallenge(null);
    setChallengeTimer(0);
    
    // Reset vehicle
    setVehicle({
      health: 100,
      speed: 60,
      efficiency: 85,
      position: { x: 20, y: 80 },
      rotation: 0,
      shield: false,
      nitro: 100
    });
    
    // Reset pothole avoided status
    potholeData.forEach(p => p.avoided = false);
  };

  // Weather effects
  useEffect(() => {
    const weatherInterval = setInterval(() => {
      const weatherTypes: WeatherEffect['type'][] = ['clear', 'rain', 'fog'];
      const newWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
      setWeather({
        type: newWeather,
        intensity: newWeather === 'clear' ? 0 : Math.random() * 0.5 + 0.3,
        visibility: newWeather === 'fog' ? 60 : newWeather === 'rain' ? 80 : 100
      });
    }, 30000); // Change weather every 30 seconds

    return () => clearInterval(weatherInterval);
  }, []);

  // AI suggestions timer
  useEffect(() => {
    if (isActive) {
      const suggestionInterval = setInterval(generateAISuggestion, 15000);
      return () => clearInterval(suggestionInterval);
    }
  }, [isActive, generateAISuggestion]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500 border-red-600 shadow-red-500/50";
      case "High":
        return "bg-orange-500 border-orange-600 shadow-orange-500/50";
      case "Medium":
        return "bg-yellow-500 border-yellow-600 shadow-yellow-500/50";
      case "Low":
        return "bg-green-500 border-green-600 shadow-green-500/50";
      default:
        return "bg-gray-500 border-gray-600 shadow-gray-500/50";
    }
  };

  const getPowerUpIcon = (type: PowerUp['type']) => {
    switch (type) {
      case 'shield': return '🛡️';
      case 'nitro': return '⚡';
      case 'coin': return '🪙';
      case 'repair': return '🔧';
      case 'scanner': return '📡';
      default: return '✨';
    }
  };
  return (
    <section id="interactive-demo" className="py-16 px-4 bg-gradient-to-br from-slate-50 via-white to-teal-50 overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-teal-600 bg-clip-text text-transparent mb-4">
            Advanced Path Guardian Simulator
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-6">
            Experience our next-generation road safety technology with gamified interactions, 
            real-time AI suggestions, and immersive 3D-like effects.
          </p>
          
          {/* Game Mode Selector */}
          <div className="flex justify-center gap-2 mb-6">
            {(['auto', 'manual', 'challenge'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setGameMode(mode)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  gameMode === mode
                    ? 'bg-teal-600 text-white shadow-lg'
                    : 'bg-white/70 text-gray-600 hover:bg-white/90 backdrop-blur-sm'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
              </button>
            ))}
          </div>
        </div>

        {/* Main Game Area */}
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20">
          <div className="flex flex-col xl:flex-row gap-8">
            
            {/* Game Map */}
            <div className="xl:w-2/3">
              <div className="relative">
                {/* Weather Overlay */}
                {weather.type !== 'clear' && (
                  <div className={`absolute inset-0 z-10 pointer-events-none rounded-xl ${
                    weather.type === 'rain' ? 'bg-blue-500/10' :
                    weather.type === 'fog' ? 'bg-gray-500/20' : ''
                  }`}>
                    {weather.type === 'rain' && (
                      <div className="rain-effect absolute inset-0">
                        {Array.from({ length: 50 }).map((_, i) => (
                          <div
                            key={i}
                            className="rain-drop absolute w-0.5 h-8 bg-blue-400/30 animate-bounce"
                            style={{
                              left: `${Math.random() * 100}%`,
                              animationDelay: `${Math.random() * 2}s`,
                              animationDuration: `${0.5 + Math.random()}s`
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-96 lg:h-[500px] relative rounded-xl overflow-hidden shadow-inner">
                  {/* Enhanced Road Map */}
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 800 600"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Map background with gradient */}
                    <defs>
                      <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#E5E7EB" />
                        <stop offset="100%" stopColor="#D1D5DB" />
                      </linearGradient>
                      <filter id="roadShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                      </filter>
                    </defs>
                    
                    <rect x="0" y="0" width="800" height="600" fill="url(#mapGradient)" />

                    {/* Enhanced Roads with shadows */}
                    <rect
                      x="80" y="80" width="640" height="440"
                      fill="#374151" filter="url(#roadShadow)" rx="20"
                    />
                    
                    {/* Road markings */}
                    <path
                      d="M400,80 L400,520"
                      stroke="#FFFFFF" strokeWidth="4" strokeDasharray="20,20"
                      className="animate-pulse"
                    />
                    <path
                      d="M80,300 L720,300"
                      stroke="#FFFFFF" strokeWidth="4" strokeDasharray="20,20"
                      className="animate-pulse"
                    />
                    
                    {/* Route path visualization */}
                    {isRouting && (
                      <path
                        d="M160,480 Q200,400 300,360 Q500,320 600,280 Q650,250 680,200"
                        stroke="#00FF88" strokeWidth="3" fill="none"
                        strokeDasharray="10,5" className="animate-pulse"
                      />
                    )}
                  </svg>

                  {/* Potholes with enhanced effects */}
                  {potholeData.map((pothole) => (
                    <div
                      key={pothole.id}
                      className={`absolute rounded-full cursor-pointer transition-all duration-300 hover:scale-125 ${getSeverityColor(
                        pothole.severity
                      )} opacity-90 border-2 shadow-lg ${
                        pothole.avoided ? 'opacity-40 bg-green-500' : 'animate-pulse'
                      }`}
                      style={{
                        top: pothole.top,
                        left: pothole.left,
                        width: `${pothole.width}px`,
                        height: `${pothole.height}px`,
                        transform: "translate(-50%, -50%)",
                      }}
                      onClick={() => handlePotholeClick(pothole)}
                    >
                      {/* Danger indicator */}
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                    </div>
                  ))}

                  {/* Power-ups */}
                  {powerUps.map((powerUp) => (
                    <div
                      key={powerUp.id}
                      className="absolute w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full cursor-pointer hover:scale-110 transition-all duration-200 animate-bounce shadow-lg border-2 border-white"
                      style={{
                        top: `${powerUp.position.y}%`,
                        left: `${powerUp.position.x}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      onClick={() => collectPowerUp(powerUp)}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-sm">
                        {getPowerUpIcon(powerUp.type)}
                      </span>
                    </div>
                  ))}

                  {/* Particle Effects */}
                  {particles.map((particle) => (
                    <div
                      key={particle.id}
                      className="absolute pointer-events-none rounded-full"
                      style={{
                        left: `${particle.x}px`,
                        top: `${particle.y}px`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        backgroundColor: particle.color,
                        opacity: particle.life,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  ))}

                  {/* Enhanced Vehicle */}
                  <div
                    className="absolute transition-all duration-200 ease-out z-20"
                    style={{
                      top: carPosition.top,
                      left: carPosition.left,
                      transform: `translate(-50%, -50%) rotate(${carRotation}deg)`,
                    }}
                  >
                    {/* Vehicle Shield Effect */}
                    {vehicle.shield && (
                      <div className="absolute inset-0 -z-10">
                        <div className="w-16 h-16 border-4 border-blue-400 rounded-full animate-pulse opacity-60" />
                      </div>
                    )}

                    {/* Detection Wave */}
                    {showDetectionWave && (
                      <div className="absolute inset-0 -z-10">
                        <div className="w-20 h-20 border-2 border-teal-500 rounded-full animate-ping opacity-50" />
                        <div className="w-16 h-16 border-2 border-teal-400 rounded-full animate-ping opacity-70" style={{ animationDelay: "0.2s" }} />
                        <div className="w-12 h-12 border-2 border-teal-300 rounded-full animate-ping opacity-90" style={{ animationDelay: "0.4s" }} />
                      </div>
                    )}

                    {/* Enhanced Vehicle Design */}
                    <svg width="60" height="30" viewBox="0 0 60 30" className="drop-shadow-lg">
                      {/* Car Body with gradient */}
                      <defs>
                        <linearGradient id="carGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#14B8A6" />
                          <stop offset="100%" stopColor="#0F766E" />
                        </linearGradient>
                      </defs>
                      
                      <rect x="0" y="6" width="60" height="18" fill="url(#carGradient)" rx="9" />
                      
                      {/* Car Windows */}
                      <rect x="10" y="9" width="18" height="10" fill="#E0F2FE" rx="3" />
                      <rect x="32" y="9" width="18" height="10" fill="#E0F2FE" rx="3" />
                      
                      {/* Car Wheels */}
                      <circle cx="15" cy="27" r="7" fill="#1F2937" />
                      <circle cx="45" cy="27" r="7" fill="#1F2937" />
                      <circle cx="15" cy="27" r="4" fill="#6B7280" />
                      <circle cx="45" cy="27" r="4" fill="#6B7280" />
                      
                      {/* Headlights */}
                      <circle cx="58" cy="12" r="2.5" fill="#FEF3C7" />
                      <circle cx="58" cy="18" r="2.5" fill="#FEF3C7" />
                      
                      {/* Speed indicator */}
                      {currentSpeed > 0 && (
                        <text x="30" y="-5" textAnchor="middle" className="text-xs font-bold fill-teal-600">
                          {currentSpeed} km/h
                        </text>
                      )}
                      
                      {/* Nitro effect */}
                      {vehicle.nitro > 80 && currentSpeed > 40 && (
                        <g>
                          <rect x="-8" y="10" width="6" height="2" fill="#FF6B35" opacity="0.8">
                            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.3s" repeatCount="indefinite"/>
                          </rect>
                          <rect x="-8" y="18" width="6" height="2" fill="#FF6B35" opacity="0.8">
                            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="0.3s" repeatCount="indefinite"/>
                          </rect>
                        </g>
                      )}
                    </svg>
                  </div>
                </div>

                {/* Advanced Control Panel */}
                <div className="mt-6 space-y-4">
                  {/* Route Progress */}
                  {isRouting && (
                    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/20">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-semibold text-gray-700">Route Progress</span>
                        <span className="text-sm text-teal-600 font-bold">{Math.round(routeProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                        <div
                          className="bg-gradient-to-r from-teal-500 to-emerald-500 h-3 rounded-full transition-all duration-300 shadow-sm"
                          style={{ width: `${routeProgress}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                        <div className="text-center">
                          <div className="font-semibold text-gray-800">{currentSpeed}</div>
                          <div className="text-gray-600">km/h</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-600">{vehicle.health}%</div>
                          <div className="text-gray-600">Health</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-blue-600">{vehicle.nitro}%</div>
                          <div className="text-gray-600">Nitro</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-purple-600">{vehicle.efficiency}%</div>
                          <div className="text-gray-600">Efficiency</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Suggestion Panel */}
                  {aiSuggestion && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🤖</span>
                        <span className="font-semibold text-gray-800">AI Assistant</span>
                      </div>
                      <p className="text-sm text-gray-700">{aiSuggestion}</p>
                    </div>
                  )}

                  {/* Active Challenge */}
                  {activeChallenge && (
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🏆</span>
                          <span className="font-semibold text-gray-800">Challenge Active</span>
                        </div>
                        <span className="text-sm font-mono text-orange-600">
                          {Math.ceil(challengeTimer)}s
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{activeChallenge}</p>
                    </div>
                  )}

                  {/* Weather Info */}
                  {weather.type !== 'clear' && (
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-3 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {weather.type === 'rain' ? '🌧️' : weather.type === 'fog' ? '🌫️' : '☀️'}
                          </span>
                          <span className="text-sm font-semibold text-gray-700">
                            {weather.type === 'rain' ? 'Rainy' : weather.type === 'fog' ? 'Foggy' : 'Clear'} Conditions
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">Visibility: {weather.visibility}%</span>
                      </div>
                    </div>
                  )}

                  {/* Control Buttons */}
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={startRoute}
                      disabled={isRouting}
                      className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-3 rounded-full hover:from-teal-700 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
                    >
                      {isRouting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Navigating...
                        </>
                      ) : (
                        <>
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          Start Smart Route
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={startChallenge}
                      disabled={!!activeChallenge}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full hover:from-orange-600 hover:to-red-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
                    >
                      🏆 Start Challenge
                    </button>
                    
                    <button
                      onClick={reset}
                      className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-50 transition-all flex items-center gap-2 font-semibold"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Sidebar */}
            <div className="xl:w-1/3 space-y-6">
              {/* Game Stats */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Game Statistics
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{gameStats.score.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Score</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{gameStats.level}</div>
                    <div className="text-xs text-gray-600">Level</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{gameStats.potholesDodged}</div>
                    <div className="text-xs text-gray-600">Dodged</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{gameStats.coins}</div>
                    <div className="text-xs text-gray-600">Coins</div>
                  </div>
                </div>

                {/* Experience Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Experience</span>
                    <span className="text-gray-600">{gameStats.experience}/1000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(gameStats.experience % 1000) / 10}%` }}
                    />
                  </div>
                </div>

                {/* Achievements */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">Recent Achievements</h4>
                  {achievements.filter(a => a.unlocked).slice(-3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                      <span className="text-lg">{achievement.icon}</span>
                      <div>
                        <div className="font-medium text-sm text-gray-800">{achievement.title}</div>
                        <div className="text-xs text-gray-600">{achievement.description}</div>
                      </div>
                    </div>
                  ))}
                  
                  {achievements.filter(a => !a.unlocked).slice(0, 2).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg opacity-60">
                      <span className="text-lg grayscale">{achievement.icon}</span>
                      <div>
                        <div className="font-medium text-sm text-gray-600">{achievement.title}</div>
                        <div className="text-xs text-gray-500">
                          Progress: {achievement.progress}/{achievement.target}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pothole Details */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🕳️</span>
                  Road Damage Report
                </h3>
                
                {selectedPothole ? (
                  <div className="space-y-4">
                    <div className={`border-l-4 pl-4 py-3 rounded-r-lg ${
                      selectedPothole.severity === 'Critical' ? 'border-red-500 bg-red-50' :
                      selectedPothole.severity === 'High' ? 'border-orange-500 bg-orange-50' :
                      selectedPothole.severity === 'Medium' ? 'border-yellow-500 bg-yellow-50' :
                      'border-green-500 bg-green-50'
                    }`}>
                      <h4 className="font-bold text-gray-800 text-lg">{selectedPothole.title}</h4>
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Severity:</span>
                          <span className={`text-sm font-semibold ${
                            selectedPothole.severity === 'Critical' ? 'text-red-600' :
                            selectedPothole.severity === 'High' ? 'text-orange-600' :
                            selectedPothole.severity === 'Medium' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>{selectedPothole.severity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Damage:</span>
                          <span className="text-sm text-red-600 font-semibold">{selectedPothole.damage} HP</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Repair Cost:</span>
                          <span className="text-sm text-green-600 font-semibold">${selectedPothole.repairCost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Age:</span>
                          <span className="text-sm text-gray-700">{selectedPothole.age} days</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Location:</strong> {selectedPothole.location}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Size:</strong> {selectedPothole.size}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🗺️</div>
                    <p className="text-gray-600 mb-4">
                      Click on a pothole to view detailed damage analysis or start the route to see our AI-powered navigation in action.
                    </p>
                  </div>
                )}

                {/* Summary Stats */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Damage Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Critical issues:</span>
                      <span className="font-semibold text-red-600">
                        {potholeData.filter(p => p.severity === 'Critical').length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">High priority:</span>
                      <span className="font-semibold text-orange-600">
                        {potholeData.filter(p => p.severity === 'High').length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Medium priority:</span>
                      <span className="font-semibold text-yellow-600">
                        {potholeData.filter(p => p.severity === 'Medium').length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total repair cost:</span>
                      <span className="font-semibold text-gray-800">
                        ${potholeData.reduce((sum, p) => sum + p.repairCost, 0).toLocaleString()}
                      </span>
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
