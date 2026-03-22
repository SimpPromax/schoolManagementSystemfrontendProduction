// src/components/PhysicsFruits.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint, Events, Body } from 'matter-js';
import { gsap } from 'gsap';

const PhysicsFruits = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(Engine.create());
  const pillRefs = useRef([]);
  const [isAntigravity, setIsAntigravity] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  const fruits = [
    "INTEGRITY", "GRATITUDE", "BOLDNESS", "EXCELLENCE", "SUCCESS", "TEAMWORK",
    "HUMILITY", "OBJECTIVITY", "ORDERLINESS", "DISCIPLINE"
  ];

  // Neon-bright colors
  const neonColors = [
    '#ff00ff', // Neon Pink
    '#00ffff', // Neon Cyan
    '#ffff00', // Neon Yellow
    '#ff1493', // Deep Pink
    '#00ff00', // Neon Green
    '#ff4500', // Neon Orange
    '#9400d3', // Neon Purple
    '#00ced1', // Dark Turquoise
    '#ff69b4'  // Hot Pink
  ];

  // Calculate responsive pill size based on screen width
  const getPillSize = () => {
    const baseSize = 200; // Base size (200x80)
    const screenWidth = windowSize.width;
    
    // Scale factor based on screen size
    // For screens >= 1920px (full HD), scale to 2.5x (500x200)
    // For smaller screens, scale proportionally
    let scaleFactor = 1;
    
    if (screenWidth >= 1920) {
      scaleFactor = 2.5;
    } else if (screenWidth >= 1536) {
      scaleFactor = 2.0;
    } else if (screenWidth >= 1280) {
      scaleFactor = 1.5;
    } else if (screenWidth >= 1024) {
      scaleFactor = 1.2;
    } else if (screenWidth <= 640) {
      scaleFactor = 0.7; // Smaller on mobile
    }
    
    return {
      width: Math.round(baseSize * scaleFactor),
      height: Math.round(80 * scaleFactor),
      fontSize: Math.round(14 * scaleFactor),
      radius: Math.round(40 * scaleFactor)
    };
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. Setup the Physics World
  useEffect(() => {
    const engine = engineRef.current;
    const world = engine.world;
    const container = sceneRef.current;
    const { width, height } = container.getBoundingClientRect();
    const pillSize = getPillSize();

    // Clear existing world
    World.clear(world);
    Engine.clear(engine);

    // Boundaries: Floor AND Ceiling
    const ground = Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true, label: 'ground' });
    const ceiling = Bodies.rectangle(width / 2, -50, width, 100, { isStatic: true, label: 'ceiling' });
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true });
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true });
    
    World.add(world, [ground, ceiling, leftWall, rightWall]);

    // Create Pill Bodies - Responsive size
    const bodies = fruits.map((fruit, i) => {
      // Distribute pills evenly across the width
      const sectionWidth = width / fruits.length;
      const x = (sectionWidth * i) + (sectionWidth / 2);
      const y = height / 2 + (Math.random() * 100 - 50); // Random height variation
      
      const body = Bodies.rectangle(x, y, pillSize.width, pillSize.height, {
        chamfer: { radius: pillSize.radius },
        restitution: 0.8,
        friction: 0.05,
        density: 0.002 * (pillSize.width / 200), // Adjust density based on size
        plugin: { index: i }
      });
      return body;
    });

    World.add(world, bodies);

    // Add initial random velocities for organic movement
    bodies.forEach(body => {
      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 3,
        y: (Math.random() - 0.5) * 2
      });
    });

    // Mouse Interaction (Grab and Toss)
    const mouse = Mouse.create(container);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } }
    });
    World.add(world, mouseConstraint);

    // Sync Loop: Matter.js -> GSAP -> DOM
    Events.on(engine, 'afterUpdate', () => {
      bodies.forEach((body, i) => {
        const domElement = pillRefs.current[i];
        if (domElement) {
          gsap.set(domElement, {
            x: body.position.x - (pillSize.width / 2),
            y: body.position.y - (pillSize.height / 2),
            rotation: body.angle * (180 / Math.PI),
          });
        }
      });
    });

    const runner = Runner.create();
    Runner.run(runner, engine);

    return () => {
      World.clear(world);
      Engine.clear(engine);
      Runner.stop(runner);
    };
  }, [windowSize]); // Re-run when window size changes

  // 2. The Gravity Flip Logic
  const toggleGravity = () => {
    const engine = engineRef.current;
    const newGravity = isAntigravity ? 1 : -1;
    
    // Smoothly transition gravity using GSAP
    gsap.to(engine.world.gravity, {
      y: newGravity,
      duration: 1.5,
      ease: "power2.inOut"
    });

    // Add a "kick" to each body for realism
    engine.world.bodies.forEach(body => {
      if (!body.isStatic) {
        Body.applyForce(body, body.position, { 
          x: (Math.random() - 0.5) * 0.08, 
          y: (Math.random() - 0.5) * 0.08
        });
      }
    });

    setIsAntigravity(!isAntigravity);
  };

  // Neon colors array for pills
  const neonColorsArray = [
    'from-fuchsia-500 to-pink-500',   // Neon Pink
    'from-cyan-400 to-blue-400',       // Neon Cyan
    'from-yellow-300 to-yellow-500',   // Neon Yellow
    'from-pink-500 to-rose-500',       // Deep Pink
    'from-green-400 to-emerald-500',   // Neon Green
    'from-orange-500 to-red-500',      // Neon Orange
    'from-purple-500 to-violet-600',   // Neon Purple
    'from-teal-400 to-cyan-500',       // Dark Turquoise
    'from-pink-400 to-rose-400'        // Hot Pink
  ];

  const pillSize = getPillSize();

  return (
    <section className="relative w-full h-[70vh] bg-slate-950 overflow-hidden cursor-crosshair" ref={sceneRef}>
      {/* UI Overlay */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight uppercase drop-shadow-lg">
          {isAntigravity ? "INTERRACT WITH OUR CORE VALUES" : "CORE VALUES IN MOTION"}
        </h2>
        <button 
          onClick={toggleGravity}
          className="pointer-events-auto px-6 py-2.5 bg-white text-slate-950 font-bold rounded-full hover:scale-110 transition-transform active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.6)] text-sm md:text-base"
        >
          {isAntigravity ? "RESTORE GRAVITY" : "STACK THE VALUES"}
        </button>
      </div>

      {/* The Physics Pills - Responsive size with neon colors and black text */}
      {fruits.map((fruit, i) => (
        <div
          key={i}
          ref={(el) => (pillRefs.current[i] = el)}
          className={`absolute flex items-center justify-center rounded-full 
                     bg-linear-to-r ${neonColorsArray[i % neonColorsArray.length]} 
                     shadow-[0_0_30px_rgba(255,255,255,0.5)] select-none
                     border-2 border-white/30`}
          style={{ 
            width: `${pillSize.width}px`,
            height: `${pillSize.height}px`,
            willChange: 'transform',
            boxShadow: `0 0 30px ${neonColorsArray[i % neonColorsArray.length].includes('pink') ? '#ff00ff' : 
                                      neonColorsArray[i % neonColorsArray.length].includes('cyan') ? '#00ffff' :
                                      neonColorsArray[i % neonColorsArray.length].includes('yellow') ? '#ffff00' :
                                      neonColorsArray[i % neonColorsArray.length].includes('green') ? '#00ff00' :
                                      neonColorsArray[i % neonColorsArray.length].includes('orange') ? '#ff4500' :
                                      neonColorsArray[i % neonColorsArray.length].includes('purple') ? '#9400d3' :
                                      neonColorsArray[i % neonColorsArray.length].includes('teal') ? '#00ced1' : '#ff69b4'}`
          }}
        >
          <span className="text-black font-black uppercase tracking-widest drop-shadow-md"
                style={{ fontSize: `${pillSize.fontSize}px` }}>
            {fruit}
          </span>
        </div>
      ))}

      {/* Decorative glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/20 rounded-full filter blur-3xl"></div>
      </div>
    </section>
  );
};

export default PhysicsFruits;