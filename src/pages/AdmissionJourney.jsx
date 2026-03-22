import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/* =========================
   Scroll Hook (updated with isActive state)
========================= */
const useScrollProgress = (ref, stepsLength) => {
  const [scrollState, setScrollState] = useState({
    progress: 0,
    activeCard: 0,
    isComplete: false,
    isActive: false // Tracks if section is in viewport (sticky zone active)
  });

  const throttle = useCallback((func, limit) => {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }, []);

  // Intersection Observer to detect when section enters viewport
  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrollState(prev => ({
          ...prev,
          isActive: entry.isIntersecting
        }));
      },
      { threshold: 0 }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = throttle(() => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const totalScrollable = Math.max(rect.height - windowHeight, 0);
      const currentScroll = -rect.top;

      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        const progress =
          totalScrollable > 0
            ? Math.min(Math.max(currentScroll / totalScrollable, 0), 1)
            : 0;

        const stepIndex = Math.floor(progress * stepsLength);

        setScrollState(prev => ({
          ...prev,
          progress,
          activeCard: Math.min(stepIndex, stepsLength - 1),
          isComplete: progress > 0.
        }));
      }
    }, 16);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [ref, stepsLength, throttle]);

  return scrollState;
};

/* =========================
   Premium Card Component - Vertical Layout
========================= */
const JourneyCard = ({ step, isVisible, isActive, isMobile, index, activeCard, isScrollActive }) => {
  // On mobile, cards behave differently - they're in a normal flow but only animate when scroll is active
  if (isMobile) {
    return (
      <div
        className={`
          transition-all duration-700 transform
          ${isScrollActive 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-30 translate-y-10'
          }
        `}
      >
        <div
          className={`
            relative rounded-2xl p-5
            transition-all duration-500 border
            ${
              isActive
                ? 'bg-white shadow-[0_10px_30px_rgba(16,185,129,0.25)] border-emerald-300 ring-2 ring-emerald-200 scale-[1.02]'
                : 'bg-white/90 border-slate-200'
            }
          `}
        >
          {/* Step Badge */}
          <div className="absolute -top-3 -right-2 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white z-10">
            {step.step}
          </div>

          {/* Vertical Layout Content */}
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div
              className={`
                w-16 h-16 rounded-2xl flex items-center justify-center
                text-3xl mb-4 transition-all duration-500
                ${
                  isActive
                    ? 'bg-linear-to-br from-emerald-500 to-emerald-600 text-white shadow-lg'
                    : 'bg-emerald-50 text-emerald-600'
                }
              `}
            >
              {step.icon}
            </div>

            {/* Title */}
            <h3
              className={`font-semibold text-lg mb-3 ${
                isActive ? 'text-slate-900' : 'text-slate-700'
              }`}
            >
              {step.title}
            </h3>

            {/* Description */}
            <p
              className={`text-sm leading-relaxed ${
                isActive ? 'text-slate-600' : 'text-slate-500'
              }`}
            >
              {step.description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Desktop version with animations
  return (
    <div
      className={`transition-all duration-700 transform ${
        isVisible && isScrollActive
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-24 scale-90'
      }`}
    >
      <div
        className={`
          relative rounded-2xl sm:rounded-3xl p-5 sm:p-7
          transition-all duration-500 backdrop-blur-xl border
          ${
            isActive
              ? 'bg-white shadow-[0_20px_60px_rgba(16,185,129,0.35)] border-emerald-300 scale-105 ring-2 ring-emerald-200'
              : 'bg-white/80 border-slate-200 hover:bg-white/90'
          }
          w-full max-w-70 lg:max-w-[320px]
        `}
      >
        {/* Step Badge */}
        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white z-10">
          {step.step}
        </div>

        {/* Vertical Layout Content */}
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div
            className={`
              w-16 h-16 rounded-2xl flex items-center justify-center
              text-3xl mb-4 transition-all duration-500
              ${
                isActive
                  ? 'bg-linear-to-br from-emerald-500 to-emerald-600 text-white shadow-lg scale-110'
                  : 'bg-emerald-50 text-emerald-600'
              }
            `}
          >
            {step.icon}
          </div>

          {/* Title */}
          <h3
            className={`font-semibold text-lg mb-3 ${
              isActive ? 'text-slate-900' : 'text-slate-700'
            }`}
          >
            {step.title}
          </h3>

          {/* Description */}
          <p
            className={`text-sm leading-relaxed ${
              isActive ? 'text-slate-600' : 'text-slate-500'
            }`}
          >
            {step.description}
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================
   Enhanced Realistic Confetti
========================= */
const ConfettiOverlay = () => {
  // Generate 60 unique particles with physics-like properties
  const particles = useMemo(() => {
    return [...Array(60)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      color: ['#10b981', '#fbbf24', '#3b82f6', '#f43f5e', '#a855f7'][i % 5],
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
      size: Math.random() * 10 + 5,
      drift: Math.random() * 40 - 20,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(var(--drift), 100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .confetti-particle {
          position: absolute;
          animation: confetti-fall linear forwards;
          will-change: transform;
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--drift': `${p.drift}px`,
            boxShadow: '0 0 2px rgba(0,0,0,0.2)',
          }}
        />
      ))}
    </div>
  );
};

/* =========================
   Main Component
========================= */
const AdmissionJourney = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const sectionRef = useRef(null);
  const horizontalPathRef = useRef(null);
  const verticalPathRef = useRef(null);

  const [pathLength, setPathLength] = useState({
    horizontal: 2800,
    vertical: 2800
  });

  const admissionSteps = useMemo(() => [
    {
      step: 1,
      title: 'Inquiry & School Visit',
      description: 'Parents can tour the school and also inquire about fee structure, curriculum, and facilities. We encourage families to experience our vibrant community firsthand.',
      icon: '🔍'
    },
    {
      step: 2,
      title: 'Application and submission',
      description: 'Paying admisssion and applicable fees foe the application peocess',
      icon: '📝'
    },
    {
      step: 3,
      title: 'Documentation',
      description: 'Provide certified copies of birth certificate, previous academic records, passport photos, and immunization records.',
      icon: '📄'
    },
    {
      step: 4,
      title: 'Assesment & Interview',
      description: 'We offer assesment to asses students sustainability in the school environment. This is followed by an interview with the parents and the student to understand their needs and expectations.',
      icon: '🎯'
    },
    {
      step: 5,
      title: 'Orientation and Admission',
      description: 'Successful students are offered admission and are invited to an orientation session where they can meet teachers, tour the campus, and learn about our culture and values.',
      icon: '🎓'
    }
  ], []);

  const { progress, activeCard, isComplete, isActive } = useScrollProgress(
    sectionRef,
    admissionSteps.length
  );

  /* Mobile detection and window width tracking */
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMobile(width < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /* Path length calculation */
  useEffect(() => {
    if (horizontalPathRef.current && !isMobile) {
      setPathLength((prev) => ({
        ...prev,
        horizontal: horizontalPathRef.current.getTotalLength()
      }));
    }
    if (verticalPathRef.current && isMobile) {
      setPathLength((prev) => ({
        ...prev,
        vertical: verticalPathRef.current.getTotalLength()
      }));
    }
  }, [isMobile]);

  // Responsive vertical path based on screen height
  const getVerticalPath = () => {
    if (windowWidth < 380) {
      return 'M 120 0 C 60 120, 180 240, 120 360 C 60 480, 180 600, 120 720';
    } else if (windowWidth < 480) {
      return 'M 150 0 C 80 150, 220 300, 150 450 C 80 600, 220 750, 150 900';
    } else {
      return 'M 200 0 C 120 180, 280 360, 200 540 C 120 720, 280 900, 200 1080';
    }
  };

  const horizontalPath =
    'M 0 500 C 300 100, 600 900, 950 500 C 1300 100, 1600 900, 1900 500';
  const verticalPath = getVerticalPath();

  // Mobile card container styles
  const getMobileContainerClass = () => {
    return 'w-full max-w-sm mx-auto px-4 flex flex-col gap-6';
  };

  // Desktop grid layout
  const getDesktopContainerClass = () => {
    return 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-5 gap-6 lg:gap-8';
  };

  // Calculate if we should show the "scroll down to begin" message
  const showBeginMessage = !isActive && !isComplete;

  return (
    <div
      ref={sectionRef}
      className={`relative bg-linear-to-b from-slate-50 to-white w-full ${
        isMobile ? 'min-h-screen' : 'h-[400vh]'
      }`}
    >
      {isComplete && <ConfettiOverlay />}

      <div className={`${!isMobile ? 'sticky top-0 h-screen' : ''} w-full flex flex-col overflow-hidden`}>
        {/* Title */}
        <div className={`shrink-0 w-full text-center z-30 px-4 transition-all duration-500 ${
          isMobile ? 'pt-12 pb-4' : 'absolute top-12'
        } ${!isActive && isMobile ? 'opacity-100 translate-y-0' : ''}`}>
          <h2
            className={`${isMobile ? 'text-2xl' : 'text-3xl md:text-5xl'} font-light transition-all duration-700 ${
              isComplete ? 'text-emerald-600 scale-110' : 'text-slate-800'
            }`}
          >
            {isComplete ? 'Registration Ready!' : 'The Admission Path'}
          </h2>

          <p className={`text-slate-400 ${isMobile ? 'text-[10px]' : 'text-xs'} mt-2 uppercase tracking-[0.3em] transition-all duration-500 ${
            showBeginMessage ? 'opacity-100' : 'opacity-50'
          }`}>
            {isComplete
              ? "You're all set to join us"
              : isActive ? '↓ Scroll to trace your journey ↓' : '↓ Scroll down to begin ↓'}
          </p>
        </div>

        {/* SVG Path - Only show when section is active on mobile */}
        {!isMobile ? (
          <svg className="absolute inset-0 w-full h-full opacity-30" style={{ padding: '0 2rem' }}>
            <path
              ref={horizontalPathRef}
              d={horizontalPath}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="14"
            />
            <path
              d={horizontalPath}
              fill="none"
              stroke="#10b981"
              strokeWidth="10"
              strokeDasharray={pathLength.horizontal}
              strokeDashoffset={
                pathLength.horizontal - progress * pathLength.horizontal
              }
            />
          </svg>
        ) : (
          <svg 
            className={`absolute left-4 h-full transition-all duration-700 ${
              isActive ? 'opacity-25 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}
            width="100"
            height="100%"
            viewBox="0 0 200 1200"
            preserveAspectRatio="xMidYMid slice"
          >
            <path
              ref={verticalPathRef}
              d={verticalPath}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="16"
            />
            <path
              d={verticalPath}
              fill="none"
              stroke="#10b981"
              strokeWidth="12"
              strokeDasharray={pathLength.vertical}
              strokeDashoffset={
                pathLength.vertical - progress * pathLength.vertical
              }
            />
          </svg>
        )}

        {/* Cards Container */}
        <div 
          className={`flex-1 w-full ${
            isMobile 
              ? 'py-4' 
              : 'overflow-y-auto py-4 flex items-center'
          }`}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <div
            className={`${
              isMobile
                ? getMobileContainerClass()
                : getDesktopContainerClass()
            }`}
          >
            {admissionSteps.map((step, i) => (
              <JourneyCard
                key={step.step}
                step={step}
                index={i}
                activeCard={activeCard}
                isVisible={progress >= i / admissionSteps.length}
                isActive={activeCard === i}
                isMobile={isMobile}
                isScrollActive={isMobile ? true : isActive} // On mobile, cards are always "active" for visibility
              />
            ))}
          </div>
        </div>

        {/* Progress Indicator for Mobile - Shows when active */}
        {isMobile && isActive && !isComplete && (
          <div className="shrink-0 w-full px-6 pb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-500">Progress</span>
              <span className="text-xs font-medium text-emerald-600">
                {Math.round(progress * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* CTA Button */}
        <div
          className={`shrink-0 w-full flex flex-col items-center transition-all duration-1000 z-30 ${
            isComplete ? 'opacity-100' : 'opacity-0 translate-y-10 pointer-events-none'
          } ${isMobile ? 'pb-8 pt-2' : 'absolute bottom-10'}`}
        >
          <button className={`bg-emerald-600 hover:bg-emerald-700 text-white ${
            isMobile ? 'px-8 py-3 text-base' : 'px-8 py-3'
          } rounded-full font-bold shadow-lg hover:scale-105 transition`}>
            Apply Now
          </button>

          <p className={`text-slate-400 ${isMobile ? 'text-[10px]' : 'text-xs'} mt-2 uppercase tracking-widest`}>
            Registration Fee: KES 500
          </p>
        </div>

        {/* Visual cue for mobile to start scrolling */}
        {isMobile && !isActive && !isComplete && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <span className="text-emerald-600 text-sm">↓ Scroll to start journey ↓</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdmissionJourney;