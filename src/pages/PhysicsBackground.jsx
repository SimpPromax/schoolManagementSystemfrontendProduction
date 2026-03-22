// src/components/PhysicsBackground.jsx
import React, { useEffect, useRef } from 'react';
import { Engine, World, Bodies, Runner, Body } from 'matter-js';

const PhysicsBackground = ({ 
  isActive = true,
  particleCount = 30,
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(Engine.create());
  const animationRef = useRef();

  const neonColors = [
    '#00f2ff', '#7000ff', '#ff0055', '#00ff66', '#ffcc00', 
    '#ff3300', '#0066ff', '#ccff00', '#ff00ff', '#ff66b2', 
    '#00ffaa', '#ffaa00'
  ];

  const happyEmojis = [
    '😊', '😄', '😃', '😁', '😆', '🥳', '✨', '🌟', '⭐', 
    '💫', '🎉', '🎊', '🌈', '☀️', '🌸', '🌺', '🦋', '🐝', 
    '🐞', '🕊️', '🦄', '🧸', '🎈', '🎀', '🎁', '🍭', '🍬', 
    '🍫', '🍦', '🧁', '🍩', '🍪', '🍇', '🍉', '🍒', '🍓', 
    '🥝', '🍍', '🥑', '🌞', '🌼', '🌻', '🌷', '🌹', '🪷', 
    '🐠', '🐬', '🐳', '💖', '💝', '💕', '💗', '💓', '💞', 
    '💘', '❤️‍🔥', '🫶', '⚡', '🔥', '💫', '⭐', '🌟', '✨'
  ];

  useEffect(() => {
    if (!isActive) return;

    const engine = engineRef.current;
    const world = engine.world;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set constant gravity - lower gravity for slower falling
    engine.world.gravity.y = 0.2; // Reduced from 0.4 for slower falling
    engine.world.gravity.x = 0;

    // Set canvas size
    const rect = container.getBoundingClientRect();
    let width = Math.max(rect.width, 200);
    let height = Math.max(rect.height, 400);
    canvas.width = width;
    canvas.height = height;

    // Clear existing world
    World.clear(world);
    Engine.clear(engine);

    // Consistent sizing
    const isMobile = width < 768;
    const emojiSize = isMobile ? 40 : 50;
    const fontSize = isMobile ? 26 : 34;

    // Create particles
    const particles = Array.from({ length: particleCount }).map(() => {
      const x = Math.random() * width;
      const y = -Math.random() * height - 100;
      
      const body = Bodies.circle(x, y, emojiSize/2, {
        restitution: 0.3,
        friction: 0.001,
        frictionAir: 0.001,
        density: 0.001,
        mass: 1,
        inertia: Infinity,
        isSleeping: false
      });

      // Store emoji data
      body.renderStyle = {
        color: neonColors[Math.floor(Math.random() * neonColors.length)],
        emoji: happyEmojis[Math.floor(Math.random() * happyEmojis.length)],
        size: emojiSize,
        fontSize: fontSize,
      };

      // Set slow downward velocity
      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 0.3, // Less horizontal movement
        y: 0.8 + Math.random() * 0.7     // Slow falling: between 0.8 and 1.5
      });

      return body;
    });

    // Add only side walls
    const boundaries = [
      Bodies.rectangle(-50, height / 2, 100, height * 2, { 
        isStatic: true,
        restitution: 0.3
      }),
      Bodies.rectangle(width + 50, height / 2, 100, height * 2, { 
        isStatic: true,
        restitution: 0.3
      })
    ];

    World.add(world, [...particles, ...boundaries]);

    // Start the engine
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Simple render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(body => {
        const { x, y } = body.position;
        const style = body.renderStyle;
        
        ctx.save();
        ctx.translate(x, y);
        
        // Draw circle background
        ctx.beginPath();
        ctx.arc(0, 0, style.size/2, 0, Math.PI * 2);
        ctx.fillStyle = style.color;
        ctx.shadowColor = style.color;
        ctx.shadowBlur = 15;
        ctx.fill();
        
        // Draw emoji
        ctx.font = `${style.fontSize}px 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif`;
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'transparent';
        ctx.fillText(style.emoji, 0, 0);
        
        ctx.restore();

        // Reset position when below screen
        if (y > height + 100) {
          Body.setPosition(body, {
            x: Math.random() * width,
            y: -Math.random() * 200 - 100
          });
          
          // Reset to slow velocity
          Body.setVelocity(body, {
            x: (Math.random() - 0.5) * 0.3,
            y: 0.8 + Math.random() * 0.7
          });

          // Randomize emoji for variety
          if (Math.random() < 0.3) {
            body.renderStyle.emoji = happyEmojis[Math.floor(Math.random() * happyEmojis.length)];
          }
        }
      });
      
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    // Handle resize
    const handleResize = () => {
      const newRect = container.getBoundingClientRect();
      width = canvas.width = Math.max(newRect.width, 200);
      height = canvas.height = Math.max(newRect.height, 400);
      
      // Update boundaries
      Body.setPosition(boundaries[0], { x: -50, y: height / 2 });
      Body.setPosition(boundaries[1], { x: width + 50, y: height / 2 });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      Runner.stop(runner);
      World.clear(world);
      Engine.clear(engine);
    };
  }, [isActive, particleCount]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
    >
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full"
      />
    </div>
  );
};

export default PhysicsBackground;