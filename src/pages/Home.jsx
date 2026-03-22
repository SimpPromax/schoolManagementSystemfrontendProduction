import React, { useEffect, useRef, useState, lazy, Suspense, useMemo, useCallback, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PhysicsBackground from './PhysicsBackground';
import PhysicsFruits from './PhysicsFruits';
import AdmissionJourney from './AdmissionJourney';

// Lazy load heavy components
const Gallery = lazy(() => import('./Gallery'));

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ===== OPTIMIZED COMPONENTS =====

// Memoized Skeleton Loader
const ImageSkeleton = React.memo(() => (
  <div className="animate-pulse bg-gray-200 rounded-2xl w-full h-full min-h-50 flex items-center justify-center">
    <div className="text-gray-400">Loading...</div>
  </div>
));

// Memoized Stat Card with School Colors
const StatCard = React.memo(({ stat, index, forwardedRef }) => (
  <div
    ref={forwardedRef}
    className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-lg sm:shadow-xl hover:shadow-2xl transition-all border-t-4 border-[#7cb9e8] transform hover:-translate-y-1"
    role="statistic"
    aria-label={`${stat.number} ${stat.label}`}
  >
    <div className="w-10 h-10 sm:w-16 sm:h-16 mx-auto bg-linear-to-br from-[#0a192f] to-[#1e3a8a] rounded-full flex items-center justify-center mb-2 sm:mb-4">
      <svg className="w-5 h-5 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
      </svg>
    </div>
    <div className="text-xl sm:text-3xl font-bold text-[#0a192f] mb-1">{stat.number}</div>
    <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
  </div>
));

// Memoized Tuition Card with School Colors
const TuitionCard = React.memo(({ level, index }) => {
  const gradients = [
    'from-[#7cb9e8] to-[#0a192f]',
    'from-[#ffb6c1] to-[#7cb9e8]',
    'from-[#0a192f] to-[#7cb9e8]'
  ];
  return (
    <div className="group relative bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2">
      <div className={`absolute top-0 left-0 right-0 h-2 bg-linear-to-r ${gradients[index % gradients.length]}`}></div>
      <div className="p-5 sm:p-6 md:p-8">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0a192f] mb-3 sm:mb-4">{level.level}</h3>
        <div className="mb-4 sm:mb-6">
          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#7cb9e8]">{level.tuition}</span>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">per term (3 terms per year)</p>
        </div>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-start space-x-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs sm:text-sm text-gray-600">Additional: {level.additionalFees}</span>
          </div>
          <div className="flex items-start space-x-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs sm:text-sm text-gray-600">Includes: {level.includes}</span>
          </div>
        </div>
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
          <p className="text-[10px] sm:text-xs text-gray-400">* Application fee: KES 500 (one-time)</p>
          <p className="text-[10px] sm:text-xs text-gray-400">* Sibling discount: 10% off for 3rd child</p>
        </div>
      </div>
    </div>
  );
});

// ===== MAIN COMPONENT =====
const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState({ hero: false, about: false });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  // Refs for animation targets
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const aboutRef = useRef(null);
  const programsRef = useRef(null);
  const statsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const programCardsRef = useRef([]);
  const statItemsRef = useRef([]);
  const teacherCardsRef = useRef([]);

  // ===== DATA DEFINITIONS =====
  
  // School stats
  const schoolStats = useMemo(() => [
    { number: '3+', label: 'Years of Excellence', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { number: '6+', label: 'Happy Students', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { number: '3+', label: 'Expert Teachers', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { number: '100%', label: 'Pass Rate', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
  ], []);

  // Programs offered
  const programs = useMemo(() => [
    {
      title: 'Early Years (Ages 3-5)',
      description: 'Nurturing young minds through play-based learning, creativity, and social development in a safe environment.',
      ageGroup: 'Playgroup & Pre-Primary',
      image: '🏫',
      color: 'from-[#ffb6c1] to-[#7cb9e8]',
      features: ['Play-Based Learning', 'Creative Arts', 'Social Skills']
    },
    {
      title: 'Lower Primary (Ages 6-8)',
      description: 'Building strong foundations in literacy, numeracy, and character development with modern teaching methods.',
      ageGroup: 'Grades 1-3',
      image: '📚',
      color: 'from-[#7cb9e8] to-[#0a192f]',
      features: ['Core Academics', 'STEM Education', 'Character Building']
    },
    {
      title: 'Upper Primary (Ages 9-13)',
      description: 'Building strong foundations in literacy, numeracy, and character development with modern teaching methods.',
      ageGroup: 'Grades 4-6',
      image: '🎓',
      color: 'from-[#0a192f] to-[#7cb9e8]',
      features: ['Core Academics', 'STEM Education', 'Character Building']
    }
  ], []);

  // Testimonials
  const testimonials = useMemo(() => [
    {
      name: 'Mrs. Wanjiku Kamau',
      role: 'Parent of Primary 1 Student',
      content: 'IG-Besthood Academy has transformed my child\'s love for learning. The teachers are incredibly dedicated and the facilities are top-notch.',
      rating: 5,
      image: '👩'
    },
    {
      name: 'Mr. Odhiambo Otieno',
      role: 'Parent of grade 1 Student',
      content: 'The caring environment and excellent curriculum have helped my daughter grow confidently. Best decision we made for her education.',
      rating: 5,
      image: '👨'
    },
    {
      name: 'Mrs. Muthoni Kipruto',
      role: 'Parent of Primary 1 Student',
      content: 'One of the finest elementary schools I\'ve encountered. Their holistic approach to education is truly commendable.',
      rating: 5,
      image: '👩‍⚕️'
    }
  ], []);

  // Gallery images data
  const galleryImages = useMemo(() => [
    {
      id: 1,
      title: 'Modern Classrooms',
      category: 'Classroom',
      description: 'Bright, spacious classrooms designed for interactive learning',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
      icon: '🏛️'
    },
    {
      id: 2,
      title: 'Safe Play Area',
      category: 'Playground',
      description: 'Secure outdoor space with modern playground equipment',
      image: 'https://images.unsplash.com/photo-1547496613-4e19af6736dc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      thumbnail: 'https://images.unsplash.com/photo-1587653263896-f5a5c888c4c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
      icon: '🛝'
    },
    {
      id: 3,
      title: 'Reading Corner',
      category: 'Library',
      description: 'Cozy library with diverse collection of children\'s books',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
      icon: '📖'
    },
    {
      id: 4,
      title: 'Sports Facilities',
      category: 'Sports',
      description: 'Multi-purpose court for physical education and sports',
      image: 'https://images.unsplash.com/photo-1553778562-8121e4c332a7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      thumbnail: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
      icon: '⚽'
    },
    {
      id: 5,
      title: 'Science Lab',
      category: 'Science Lab',
      description: 'Hands-on learning with age-appropriate science equipment',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
      icon: '🔬'
    },
    {
      id: 6,
      title: 'Creative Space',
      category: 'Art Room',
      description: 'Inspiring space for artistic expression and creativity',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
      icon: '🎨'
    }
  ], []);

  // Tuition & Fees
  const tuitionInfo = useMemo(() => [
    {
      level: 'Early Years (Ages 3-5)',
      tuition: 'KES 12,000',
      additionalFees: 'KES 500 (application fee)',
      includes: 'All materials, meals, snacks'
    },
    {
      level: 'Primary School (Grades 1-6)',
      tuition: 'KES 15,000',
      additionalFees: 'KES 500 (application fee)',
      includes: 'All materials, meals, snacks, textbooks'
    },
    {
      level: 'After-School Program',
      tuition: 'KES 3,000',
      additionalFees: 'KES 500 (application fee)',
      includes: 'All activities, snacks, homework supervision'
    }
  ], []);

  // Curriculum Details
  const curriculumInfo = useMemo(() => ({
    approach: 'Competency-Based Curriculum (CBC) with international best practices',
    core: ['Literacy (English & Kiswahili)', 'Numeracy (Mathematics)', 'Environmental Activities', 'Hygiene and Nutrition', 'Religious Education'],
    enrichment: ['ICT', 'Music', 'Art & Craft', 'Physical Education', 'Movement and Creative Activities'],
    teachingMethods: [
      'Play-based learning',
      'Differentiated instruction',
      'Multi-sensory approaches',
      'Regular progress tracking',
      'Project-based learning'
    ]
  }), []);

  // Language & Values
  const valuesInfo = useMemo(() => ({
    instruction: 'English (primary), Kiswahili as national language, mother tongue exposure',
    religious: 'Multi-faith approach with Christian, Islamic, and Hindu moral instruction available',
    values: ['Integrity', 'Gratitude', 'Boldness', 'Excellence', 'Success', 'Teamwork', 'Humility',
      'Objective', 'Orderliness', 'Discipline'
    ]
  }), []);

  // Uniform Requirements
  const uniformInfo = useMemo(() => ({
    required: [
      'Navy blue sweater (with school logo)',
      'Beige trousers/shorts or skirt',
      'White shirt or blouse',
      'School tie',
      'Black leather shoes',
      'White socks',
      'PE Kit: White t-shirt, navy blue shorts, sports shoes'
    ],
    optional: [
      'School sweater (available at school store)',
      'School cap/hat for outdoor activities',
      'Water bottle (available at school store)',
      'School raincoat'
    ],
    cost: 'Complete uniform set: KES 4,500 - KES 6,000 (available at the school store)'
  }), []);

  // Academic Calendar
  const academicCalendar = useMemo(() => ({
    terms: [
      { name: 'First Term', dates: 'January 5 - April 2, 2024', holidays: 'January 13 (Mid-term), March 29- April 1 (Easter)' },
      { name: 'Second Term', dates: 'April 27 - July 31, 2024', holidays: 'May 1 (Labour Day), June 1 (Madaraka Day), July 1 (Mid-term)' },
      { name: 'Third Term', dates: 'August 24 - October 23, 2024', holidays: 'October 10 (Huduma Day), October 20 (Mashujaa Day), December 12 (Jamhuri Day)' }
    ],
    breaks: [
      'April Break: April 3 - April 26',
      'August Break: August 1 - August 23',
      'December Break: December 24 - January 5'
    ]
  }), []);

  // Transportation Options
  const transportInfo = useMemo(() => ({
    routes: [
      'Route A: Njiru - Chokaa - Mihango - Kayole junction',
      'Route B: Joska - Kamulu - Pipeline - Donholm - Kamakis',
      'Route C: Kitengela - Rongai - Kangemi - Roysambu - Juja - Malaa'
    ],
    pricing: 'KES 7,000 - KES 12,000 per term (depending on distance)',
    safety: 'All buses equipped with GPS tracking, speed limiters, speed governors, and trained matrons',
    contact: 'Transport Office: 0711851390'
  }), []);

  // News & Announcements
  const newsItems = useMemo(() => [
    {
      date: 'March 15, 2024',
      title: 'Annual Sports Day',
      excerpt: 'Join us for a day of fun, games, and athletic activities at our Nairobi campus.',
      emoji: '🏆',
      color: 'from-[#7cb9e8] to-[#0a192f]'
    },
    {
      date: 'March 20, 2024',
      title: 'Parent-Teacher Conference',
      excerpt: 'Schedule your meeting to discuss your child\'s progress and development.',
      emoji: '📅',
      color: 'from-[#ffb6c1] to-[#7cb9e8]'
    },
    {
      date: 'April 1, 2024',
      title: 'Term 2 Enrollment Opens',
      excerpt: 'Limited slots available for the April - August term. Apply early!',
      emoji: '☀️',
      color: 'from-[#0a192f] to-[#7cb9e8]'
    }
  ], []);

  // Teachers data
  const teachers = useMemo(() => [
    { 
      name: 'Madam Maurine Bonareri', 
      role: 'School Manager', 
      experience: '5+ years', 
      emoji: '👩‍🏫', 
      specialty: 'Early Childhood Education',
      qualification: 'B.Ed in Early Childhood',
      quote: 'Every child is a unique story waiting to unfold.',
      color: 'from-[#ffb6c1] to-[#7cb9e8]'
    },
    { 
      name: 'Ms. Domitilla', 
      role: 'Instructor', 
      experience: '8+ years', 
      emoji: '👩‍🏫', 
      specialty: 'CBC Curriculum Specialist',
      qualification: 'M.Ed in Curriculum Development',
      quote: 'Nurturing minds, building character, shaping futures.',
      color: 'from-[#7cb9e8] to-[#0a192f]'
    },
    { 
      name: 'Ms. Centrine Luvisia', 
      role: 'Instructor', 
      experience: '3+ years', 
      emoji: '👩‍🎨', 
      specialty: 'Creative Arts and Physical Education',
      qualification: 'ECDE',
      quote: 'Creativity is intelligence having fun.',
      color: 'from-[#0a192f] to-[#7cb9e8]'
    }
  ], []);

  // ===== OPTIMIZED EFFECTS =====

  // Check for mobile and tablet
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Auto-rotate testimonials with cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, isMobile ? 8000 : 5000);
    return () => clearInterval(interval);
  }, [testimonials.length, isMobile]);

  // Preload critical images
  useEffect(() => {
    const preloadImages = async () => {
      const images = [
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
        'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80'
      ];
      
      await Promise.all(images.map(src => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src;
        });
      }));
      
      setImagesLoaded({ hero: true, about: true });
    };
    
    preloadImages();
  }, []);

  // Optimized GSAP Animations - disabled on mobile
  useEffect(() => {
    if (isMobile) return; // No animations on mobile
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Hero animations - only on desktop
      if (heroContentRef.current) {
        const heroTimeline = gsap.timeline();
        heroTimeline
          .from('.hero-badge', { y: 30, opacity: 0, duration: 0.8 })
          .from('.hero-title', { y: 50, opacity: 0, duration: 1 }, '-=0.4')
          .from('.hero-description', { y: 50, opacity: 0, duration: 0.8 }, '-=0.6')
          .from('.hero-buttons', { scale: 0, opacity: 0, duration: 0.6, stagger: 0.2 }, '-=0.4');
      }

      // Stats animation
      statItemsRef.current.forEach((stat, index) => {
        if (stat) {
          gsap.from(stat, {
            scrollTrigger: {
              trigger: stat,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            },
            scale: 0.5,
            opacity: 0,
            duration: 1,
            delay: index * 0.2,
            ease: 'back.out(1.2)'
          });
        }
      });

      // Program cards animation
      programCardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            },
            x: index % 2 === 0 ? -100 : 100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
          });
        }
      });

      // About section animation
      if (aboutRef.current) {
        gsap.from(aboutRef.current, {
          scrollTrigger: {
            trigger: aboutRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          x: -100,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });
      }

      // CTA animation
      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scale: 0.9,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });
      }
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isMobile]);

  // Testimonial animation - disabled on mobile
  useLayoutEffect(() => {
    if (isMobile) return;
    if (!cardsContainerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.active-card', 
        { x: 50, opacity: 0, scale: 0.95 }, 
        { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }
      );

      gsap.fromTo('.avatar-anim', 
        { scale: 0.8, rotation: -5 }, 
        { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.5)', delay: 0.2 }
      );

      gsap.fromTo('.star-anim', 
        { scale: 0, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.1, delay: 0.4 }
      );
    }, cardsContainerRef);

    return () => ctx.revert();
  }, [activeTestimonial, isMobile]);

  // Memoized handlers
  const handleFaqToggle = useCallback((index) => {
    setOpenFaq(prev => prev === index ? null : index);
  }, []);

  const handleTestimonialChange = useCallback((index) => {
    setActiveTestimonial(index);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#f0f9ff] via-white to-[#fff5f5]">
      {/* Skip to content link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#f97316] text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>

      <main id="main-content">
        {/* Hero Section with School Colors */}
        <div ref={heroRef} className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center overflow-x-hidden bg-linear-to-r from-[#0a192f] to-[#1e3a8a]">
          {/* Hero background */}
          <div className="absolute inset-0 overflow-hidden">
            {!imagesLoaded.hero && <ImageSkeleton />}
            <div 
              className={`absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80')] bg-cover bg-center opacity-20 transition-opacity duration-500 ${imagesLoaded.hero ? 'opacity-20' : 'opacity-0'}`}
              role="img"
              aria-label="Children learning in classroom"
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#0a192f]/90 to-[#1e3a8a]/90" />
          </div>

          {/* Auth Buttons - Responsive positioning */}
          <div className="absolute top-4 right-4 z-20 flex flex-col sm:flex-row items-end sm:items-center gap-2">
            {isAuthenticated ? (
              <Link
                to={`/${user?.role?.toLowerCase()}/dashboard`}
                className="rounded-full bg-white/95 backdrop-blur-sm px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                aria-label="Go to dashboard"
              >
                <span className="flex items-center gap-1.5 sm:gap-2 text-gray-800 hover:text-[#f97316]">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">Home</span>
                </span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2.5 text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transition-all hover:scale-105"
                  aria-label="Sign in"
                >
                  <span className="flex items-center gap-1 sm:gap-1.5 text-gray-700 hover:text-[#f97316]">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden sm:inline">Sign In</span>
                    <span className="sm:hidden">Login</span>
                  </span>
                </Link>

                <Link
                  to="/register"
                  className="rounded-full bg-linear-to-r from-[#f97316] to-[#eab308] px-3 sm:px-5 py-1.5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  aria-label="Enroll now"
                >
                  <span className="flex items-center gap-1 sm:gap-1.5">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Enroll</span>
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Hero Content */}
          <div ref={heroContentRef} className="relative max-w-7xl mx-auto px-4 py-12 sm:py-16 text-center">
            <span className="hero-badge inline-block px-4 sm:px-6 py-1.5 sm:py-2 bg-[#7cb9e8]/20 text-[#7cb9e8] rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 backdrop-blur-sm">
              🌟 Knowledge is power plus
            </span>
            <h1 className="hero-title text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6">
              <span className="text-white">
                Welcome to
              </span>
              <br />
              <span className="bg-linear-to-r from-[#7cb9e8] via-[#ffb6c1] to-white bg-clip-text text-transparent text-2xl sm:text-4xl md:text-7xl">
                IG-Besthood Academy
              </span>
            </h1>
            <p className="hero-description text-base sm:text-xl text-[#e2e8f0] mb-6 sm:mb-10 max-w-3xl mx-auto px-4">
              A private school offering Competency-Based Education that fosters academic excellence, 
              critical thinking, and character development in a nurturing environment.
            </p>
            <div className="hero-buttons flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 relative z-20">
              {!isAuthenticated && (
                <>
                  <Link
                    to="/register"
                    className="rounded-full bg-linear-to-r from-[#f97316] to-[#eab308] text-white px-6 sm:px-10 py-3 sm:py-4 text-sm sm:text-lg font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all text-center"
                    style={{ pointerEvents: 'auto' }}
                  >
                    Schedule a Visit
                  </Link>
                  <button
                    onClick={() => {
                      const programsSection = document.getElementById('programs');
                      if (programsSection) {
                        programsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="rounded-full border-2 border-[#7cb9e8] text-[#7cb9e8] px-6 sm:px-10 py-3 sm:py-4 text-sm sm:text-lg font-semibold hover:bg-[#7cb9e8]/10 hover:shadow-xl hover:scale-105 transition-all text-center"
                    style={{ pointerEvents: 'auto' }}
                  >
                    Explore Programs
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div ref={statsRef} className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {schoolStats.map((stat, index) => (
              <StatCard
                key={index}
                stat={stat}
                index={index}
                forwardedRef={el => statItemsRef.current[index] = el}
              />
            ))}
          </div>
        </div>

        {/* Virtual Tour/Achievements Section */}
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 overflow-x-hidden">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-lg sm:shadow-xl">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div>
                <span className="text-[#7cb9e8] font-semibold text-xs sm:text-sm tracking-wider uppercase mb-2 block">Virtual Tour</span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0a192f] mb-3 sm:mb-4">Take a Peek Inside Our School</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Experience our vibrant learning environment through this interactive glimpse into daily life at IG-Besthood Academy.</p>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="text-center p-3 sm:p-4 bg-[#7cb9e8]/10 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-3xl font-bold text-[#7cb9e8]">2 +</div>
                    <div className="text-[10px] sm:text-xs md:text-sm text-gray-600">Years of Excellence</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-[#ffb6c1]/10 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-3xl font-bold text-[#ffb6c1]">95%</div>
                    <div className="text-[10px] sm:text-xs md:text-sm text-gray-600">Parent Satisfaction</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-3xl font-bold text-green-600">2:1</div>
                    <div className="text-[10px] sm:text-xs md:text-sm text-gray-600">Teacher-Student Ratio</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-3xl font-bold text-blue-600">4+</div>
                    <div className="text-[10px] sm:text-xs md:text-sm text-gray-600">Extracurriculars</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video bg-linear-to-br from-[#7cb9e8] to-[#ffb6c1] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl sm:text-6xl md:text-8xl mb-2 sm:mb-4">🎥</div>
                      <p className="text-white text-xs sm:text-sm md:text-base font-semibold">Watch Our School Video</p>
                    </div>
                  </div>
                </div>
                <button 
                  className="absolute inset-0 m-auto w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                  aria-label="Play school video tour"
                >
                  <div className="w-0 h-0 border-t-[6px] sm:border-t-10 md:border-t-12 border-t-transparent border-l-10 sm:border-l-16 md:border-l-20 border-l-[#f97316] border-b-[6px] sm:border-b-10 md:border-b-12 border-b-transparent ml-0.5 sm:ml-1"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tuition & Fees Section */}
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20 md:py-24 overflow-x-hidden">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-[#7cb9e8] font-semibold text-xs sm:text-sm tracking-wider uppercase mb-2 block">Investment in Education</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0a192f] mb-3 sm:mb-4">Tuition & Fees</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Transparent pricing with no hidden costs. All fees include materials and meals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {tuitionInfo.map((level, index) => (
              <TuitionCard key={index} level={level} index={index} />
            ))}
          </div>
        </div>

        {/* Curriculum Details Section */}
        <div className="bg-linear-to-r from-[#f0f9ff] to-[#fff5f5] py-16 sm:py-20 md:py-24 overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12 sm:mb-16">
              <span className="text-[#7cb9e8] font-semibold text-xs sm:text-sm tracking-wider uppercase mb-2 block">How We Teach</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0a192f] mb-3 sm:mb-4">Curriculum & Approach</h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                Competency-Based Curriculum (CBC) with international best practices
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border-l-4 sm:border-l-8 border-[#7cb9e8]">
                <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#7cb9e8]/20 rounded-full flex items-center justify-center">
                    <span className="text-xl sm:text-2xl">📚</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0a192f]">Core Subjects</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {curriculumInfo.core.map((subject, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-[#7cb9e8] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs sm:text-sm text-gray-700">{subject}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border-l-4 sm:border-l-8 border-[#ffb6c1]">
                <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#ffb6c1]/20 rounded-full flex items-center justify-center">
                    <span className="text-xl sm:text-2xl">🎨</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0a192f]">Enrichment Subjects</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {curriculumInfo.enrichment.map((subject, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-[#ffb6c1] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs sm:text-sm text-gray-700">{subject}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold text-[#0a192f] mb-4">Teaching Methods</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {curriculumInfo.teachingMethods.map((method, idx) => (
                  <div key={idx} className="text-center p-3 sm:p-4 bg-linear-to-r from-[#7cb9e8]/10 to-[#ffb6c1]/10 rounded-lg sm:rounded-xl">
                    <span className="text-xs sm:text-sm font-medium text-gray-800">{method}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 sm:mt-8 bg-linear-to-r from-[#0a192f] to-[#1e3a8a] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-sm sm:text-base mb-2">Language of Instruction</h4>
                  <p className="text-white/90 text-xs sm:text-sm">{valuesInfo.instruction}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base mb-2">Values Education</h4>
                  <p className="text-white/90 text-xs sm:text-sm mb-2">{valuesInfo.religious}</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {valuesInfo.values.map((value, idx) => (
                      <span key={idx} className="px-2 sm:px-3 py-1 bg-white/20 rounded-full text-[10px] sm:text-xs">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Programs Section */}
        <div id="programs" ref={programsRef} className="py-16 sm:py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12 sm:mb-16">
              <span className="text-[#7cb9e8] font-semibold text-xs sm:text-sm tracking-wider uppercase mb-2 block">
                Our Programs
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0a192f] mb-3 sm:mb-4">
                Learning Programs for Every Stage
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                Age-appropriate curriculum designed to inspire and challenge young learners
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {programs.map((program, index) => (
                <div
                  key={index}
                  ref={el => programCardsRef.current[index] = el}
                  className="group bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all cursor-pointer"
                  role="article"
                  aria-label={`Program: ${program.title}`}
                >
                  <div className={`absolute inset-0 bg-linear-to-br ${program.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <div className="p-6 sm:p-8">
                    <div className="text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-6 transform transition-transform group-hover:scale-110">
                      {program.image}
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0a192f] mb-2">{program.title}</h3>
                    <p className="text-[#7cb9e8] font-semibold text-sm sm:text-base mb-3 sm:mb-4">{program.ageGroup}</p>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">{program.description}</p>
                    <div className="space-y-2">
                      {program.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-xs sm:text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-[#7cb9e8] to-[#ffb6c1] transform scale-x-0 group-hover:scale-x-100 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div id="about" ref={aboutRef} className="max-w-7xl mx-auto px-4 py-16 sm:py-20 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="relative">
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                {!imagesLoaded.about && <ImageSkeleton />}
                <div className={`aspect-w-4 aspect-h-3 bg-linear-to-br from-[#7cb9e8] to-[#ffb6c1] transition-opacity duration-500 ${imagesLoaded.about ? 'opacity-100' : 'opacity-0'}`}>
                  {imagesLoaded.about && (
                    <img 
                      src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"
                      alt="Our beautiful school campus"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Our Beautiful Campus</h3>
                  <p className="text-xs sm:text-sm opacity-90">Where learning comes alive</p>
                </div>
              </div>
            </div>
            <div>
              <span className="text-[#7cb9e8] font-semibold text-xs sm:text-sm tracking-wider uppercase mb-2 block">
                About Us
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0a192f] mb-4 sm:mb-6">
                Building Bright Futures Since 2025
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                At IG-Besthood Academy, we believe every child is unique and deserves an education that 
                nurtures their individual talents while building strong academic foundations.
              </p>
              <div className="space-y-3 sm:space-y-4">
                {[
                  'Qualified and caring teachers',
                  'Small class sizes for individual attention',
                  'Modern facilities and resources',
                  'Safe and secure environment'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-linear-to-r from-[#7cb9e8] to-[#ffb6c1] rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm sm:text-base text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Uniform Information Section */}
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20 md:py-24 overflow-x-hidden">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-6 sm:p-8 md:p-12 bg-linear-to-br from-[#0a192f] to-[#1e3a8a] text-white">
                <span className="text-white/80 font-semibold text-xs sm:text-sm tracking-wider uppercase mb-2 block">Dress Code</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Uniform Requirements</h2>
                <p className="text-white/90 text-sm sm:text-base mb-4 sm:mb-6">All uniform items available at the school store</p>
                
                <div className="flex justify-around items-center mb-4 sm:mb-6">
                  <div className="text-center transform hover:scale-110 transition-transform">
                    <div className="relative">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-blue-100 rounded-full flex items-center justify-center text-3xl sm:text-4xl md:text-5xl mb-2 border-4 border-white shadow-lg">
                        👦
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-[#7cb9e8] text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                        Boys
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center transform hover:scale-110 transition-transform">
                    <div className="relative">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-pink-100 rounded-full flex items-center justify-center text-3xl sm:text-4xl md:text-5xl mb-2 border-4 border-white shadow-lg">
                        👧
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-[#ffb6c1] text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                        Girls
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs sm:text-sm text-white/80 mt-3 sm:mt-4 bg-white/20 p-2 sm:p-3 rounded-xl backdrop-blur-sm">
                  <span className="font-bold">Complete uniform set:</span> KES 6,000 - KES 8,000
                </p>
              </div>
              
              <div className="p-6 sm:p-8 md:p-12">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-[#7cb9e8]">
                    <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#7cb9e8] rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                        👦
                      </div>
                      <h3 className="font-bold text-gray-800 text-sm sm:text-base">Boys</h3>
                    </div>
                    <ul className="space-y-1.5 sm:space-y-2">
                      <li className="flex items-start space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600">
                        <span className="text-[#7cb9e8]">👕</span>
                        <span>Sky blue shirt (logo)</span>
                      </li>
                      <li className="flex items-start space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600">
                        <span className="text-[#7cb9e8]">👖</span>
                        <span>Grey trousers</span>
                      </li>
                      <li className="flex items-start space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600">
                        <span className="text-[#7cb9e8]">👔</span>
                        <span>White shirt & tie</span>
                      </li>
                      <li className="flex items-start space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600">
                        <span className="text-[#7cb9e8]">🧥</span>
                        <span>Navy blue fleece jacket</span>
                      </li>
                      <li className="flex items-start space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600">
                        <span className="text-[#7cb9e8]">🧥</span>
                        <span>Navy blue sweater with white stripe</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-[#ffb6c1]">
                    <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#ffb6c1] rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                        👧
                      </div>
                      <h3 className="font-bold text-gray-800 text-sm sm:text-base">Girls</h3>
                    </div>
                    <ul className="space-y-1.5 sm:space-y-2">
                      <li className="flex items-start space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600">
                        <span className="text-[#ffb6c1]">👚</span>
                        <span>Navy blue fleece (logo)</span>
                      </li>
                      <li className="flex items-start space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600">
                        <span className="text-[#ffb6c1]">👗</span>
                        <span>Grey trousers</span>
                      </li>
                      <li className="flex items-start space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600">
                        <span className="text-[#ffb6c1]">👚</span>
                        <span>Pink shirt</span>
                      </li>
                      <li className="flex items-start space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600">
                        <span className="text-[#ffb6c1]">🧦</span>
                        <span>White socks</span>
                      </li>
                      <li className="flex items-start space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600">
                        <span className="text-[#ffb6c1]">🧥</span>
                        <span>Navy blue sweater with white stripe</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm">
                      ⚽
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base">PE Kit (All Students)</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <div className="flex items-center space-x-1 bg-white px-2 sm:px-3 py-1 rounded-full shadow-sm">
                      <span className="text-green-500 text-sm sm:text-base">👕</span>
                      <span className="text-[10px] sm:text-xs">White t-shirt</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-white px-2 sm:px-3 py-1 rounded-full shadow-sm">
                      <span className="text-green-500 text-sm sm:text-base">🩳</span>
                      <span className="text-[10px] sm:text-xs">Navy blue shorts</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-white px-2 sm:px-3 py-1 rounded-full shadow-sm">
                      <span className="text-green-500 text-sm sm:text-base">👟</span>
                      <span className="text-[10px] sm:text-xs">Sports shoes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div id="gallery" className="overflow-x-hidden">
          <Suspense fallback={
            <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20 md:py-24">
              <div className="text-center mb-12 sm:mb-16">
                <div className="h-3 w-20 sm:h-4 sm:w-24 bg-gray-200 animate-pulse mx-auto mb-2" />
                <div className="h-6 w-48 sm:h-8 sm:w-64 bg-gray-200 animate-pulse mx-auto mb-3 sm:mb-4" />
                <div className="h-4 w-64 sm:h-6 sm:w-96 bg-gray-200 animate-pulse mx-auto" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg sm:rounded-xl" />
                ))}
              </div>
            </div>
          }>
            <Gallery images={galleryImages} />
          </Suspense>
        </div>

        {/* Meet Our Teachers */}
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20 md:py-24">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-[#7cb9e8] font-semibold text-xs sm:text-sm tracking-wider uppercase mb-2 block">
              Our Team
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0a192f] mb-3 sm:mb-4">
              Meet Our Dedicated Teachers
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Experienced educators committed to nurturing every child's potential
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {teachers.map((teacher, index) => (
              <div
                key={index}
                ref={el => teacherCardsRef.current[index] = el}
                className="group bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className={`h-1.5 sm:h-2 bg-linear-to-r ${teacher.color}`} />
                <div className="p-5 sm:p-6">
                  <div className="relative mb-4 sm:mb-5">
                    <div className={`absolute inset-0 bg-linear-to-r ${teacher.color} rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity`} />
                    <div className={`relative w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-linear-to-br ${teacher.color} rounded-full flex items-center justify-center text-3xl sm:text-4xl shadow-lg group-hover:scale-110 transition-transform`}>
                      {teacher.emoji}
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-1 group-hover:text-[#7cb9e8] transition-colors">
                      {teacher.name}
                    </h3>
                    <p className="text-[#7cb9e8] font-semibold text-xs sm:text-sm mb-2 sm:mb-3">
                      {teacher.role}
                    </p>
                    <div className="inline-flex items-center gap-1 bg-[#7cb9e8]/10 px-2 sm:px-3 py-1 rounded-full mb-3 sm:mb-4">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#7cb9e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-[10px] sm:text-xs font-medium text-[#7cb9e8]">{teacher.experience}</span>
                    </div>
                    <div className="space-y-2 sm:space-y-3 overflow-hidden transition-all max-h-0 group-hover:max-h-48 sm:group-hover:max-h-56 opacity-0 group-hover:opacity-100">
                      <div className="pt-2 sm:pt-3 border-t border-gray-100">
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2">
                          <span className="font-semibold text-gray-700">Specialty:</span> {teacher.specialty}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2">
                          <span className="font-semibold text-gray-700">Qualification:</span> {teacher.qualification}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 italic bg-gray-50 p-1.5 sm:p-2 rounded-lg">
                          "{teacher.quote}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Teacher Stats Summary */}
          <div className="mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {[
              { label: 'Total Teachers', value: '3+', icon: '👥' },
              { label: 'Avg. Experience', value: '2+ years', icon: '⭐' },
              { label: "Master's Degrees", value: '1+', icon: '🎓' },
              { label: 'Student-Teacher Ratio', value: '2:1', icon: '📚' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-2.5 sm:p-4 bg-linear-to-r from-[#7cb9e8]/10 to-[#ffb6c1]/10 rounded-lg sm:rounded-xl">
                <span className="text-xl sm:text-2xl mb-1 sm:mb-2 block">{stat.icon}</span>
                <div className="text-base sm:text-lg md:text-xl font-bold text-[#7cb9e8]">{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Admission Process Section */}
        <div className="relative w-full">
          <AdmissionJourney />
        </div>

        {/* Testimonials Section */}
        <div ref={testimonialsRef} className="bg-linear-to-r from-[#0a192f] to-[#1e3a8a] py-16 sm:py-20 md:py-24 overflow-hidden">
          <div className="max-w-4xl mx-auto px-4">
            <div className="testimonial-header text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">What Parents Say</h2>
              <p className="text-base sm:text-lg md:text-xl text-[#7cb9e8]">Trusted by families in our community</p>
            </div>

            <div className="relative min-h-87.5 sm:min-h-100" ref={cardsContainerRef}>
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`
                    transition-all duration-500 w-full
                    ${index === activeTestimonial 
                      ? 'active-card relative z-10 opacity-100' 
                      : 'absolute top-0 left-0 right-0 opacity-0 pointer-events-none scale-95'
                    }
                  `}
                  role="region"
                  aria-hidden={index !== activeTestimonial}
                >
                  <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4 sm:mb-6">
                      <div className="avatar-anim text-4xl sm:text-5xl bg-linear-to-br from-[#7cb9e8]/20 to-[#ffb6c1]/20 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0 mb-3 sm:mb-0">
                        {testimonial.image}
                      </div>
                      <div>
                        <h4 className="text-lg sm:text-xl font-bold text-gray-800">{testimonial.name}</h4>
                        <p className="text-xs sm:text-sm text-[#7cb9e8] font-medium uppercase tracking-wider">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 italic mb-3 sm:mb-4 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg 
                          key={i} 
                          className="star-anim w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Navigation dots */}
              <div className="flex justify-center space-x-2 sm:space-x-3 mt-6 sm:mt-10">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleTestimonialChange(index)}
                    className={`
                      rounded-full transition-all duration-500 
                      ${index === activeTestimonial 
                        ? 'bg-white w-8 sm:w-10 h-2 sm:h-3' 
                        : 'bg-[#7cb9e8] w-2 h-2 sm:w-3 sm:h-3 hover:bg-white'
                      }
                    `}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Academic Calendar Section */}
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20 md:py-24 overflow-x-hidden">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-[#7cb9e8] font-semibold text-xs sm:text-sm tracking-wider uppercase mb-2 block">Plan Ahead</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0a192f] mb-3 sm:mb-4">2024 Academic Calendar</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Important dates and holidays for the academic year
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {academicCalendar.terms.map((term, idx) => (
              <div key={idx} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border-l-4 border-[#7cb9e8]">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2">{term.name}</h3>
                <p className="text-xs sm:text-sm text-[#7cb9e8] font-semibold mb-2 sm:mb-3">{term.dates}</p>
                <p className="text-[10px] sm:text-xs text-gray-500">Holidays: {term.holidays}</p>
              </div>
            ))}
          </div>

          <div className="bg-linear-to-r from-[#7cb9e8]/10 to-[#ffb6c1]/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h3 className="font-bold text-gray-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#7cb9e8] rounded-full mr-1.5 sm:mr-2"></span>
              School Breaks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {academicCalendar.breaks.map((break_item, idx) => (
                <div key={idx} className="flex items-center space-x-1.5 sm:space-x-2">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#7cb9e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[10px] sm:text-xs text-gray-600">{break_item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transportation Section */}
        <div className="bg-linear-to-r from-[#f0f9ff] to-[#fff5f5] py-16 sm:py-20 md:py-24 overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div>
                <span className="text-[#7cb9e8] font-semibold text-xs sm:text-sm tracking-wider uppercase mb-2 block">Safe Travel</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0a192f] mb-3 sm:mb-4">Transportation Services</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Safe, reliable transportation for your child with trained staff and modern, GPS-tracked vehicles operating across Nairobi.</p>
                
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-1.5 sm:mb-2">Available Routes:</h3>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {transportInfo.routes.map((route, idx) => (
                        <li key={idx} className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          <span>{route}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1.5 sm:mb-2">
                      <span className="font-semibold text-gray-800 text-sm sm:text-base">Pricing:</span>
                      <span className="text-[#7cb9e8] font-bold text-xs sm:text-sm">{transportInfo.pricing}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span className="font-semibold text-gray-800 text-sm sm:text-base">Safety:</span>
                      <span className="text-[10px] sm:text-xs text-gray-600">{transportInfo.safety}</span>
                    </div>
                  </div>
                  
                  <p className="text-[10px] sm:text-xs text-gray-500">Transport Office: {transportInfo.contact}</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-square bg-linear-to-br from-[#7cb9e8] to-[#ffb6c1] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl sm:text-6xl md:text-8xl mb-2 sm:mb-4">🚌</div>
                      <p className="text-white font-semibold text-xs sm:text-sm md:text-base">School Bus Service</p>
                      <p className="text-white/80 text-[10px] sm:text-xs mt-1 sm:mt-2">GPS tracked • Trained matrons • Speed governors</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 text-4xl sm:text-5xl md:text-6xl opacity-20 transform rotate-12">🚌</div>
              </div>
            </div>
          </div>
        </div>

        {/* News & Announcements Section */}
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20 md:py-24 overflow-x-hidden">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-[#7cb9e8] font-semibold text-xs sm:text-sm tracking-wider uppercase mb-2 block">Stay Updated</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0a192f] mb-3 sm:mb-4">Latest News & Announcements</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Keep up with exciting events and important updates from our school
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {newsItems.map((news, index) => (
              <div key={index} className="group bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all">
                <div className={`h-1.5 sm:h-2 bg-linear-to-r ${news.color}`} aria-hidden="true"></div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="text-[10px] sm:text-xs text-gray-500">{news.date}</span>
                    <span className="text-2xl sm:text-3xl">{news.emoji}</span>
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#0a192f] mb-1.5 sm:mb-2 group-hover:text-[#7cb9e8] transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{news.excerpt}</p>
                  <a href="#" className="inline-flex items-center text-[#7cb9e8] font-semibold text-xs sm:text-sm hover:text-[#0a192f]">
                    Read More
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="relative w-full bg-white/50 overflow-hidden">
          <div className="absolute inset-0 w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
            <PhysicsBackground isActive={true} particleCount={30} />
          </div>
          <div className="absolute inset-0 w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-linear-to-b from-white/30 via-transparent to-white/30 pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 sm:py-20 md:py-24">
            <div className="text-center mb-10 sm:mb-16">
              <span className="text-[#7cb9e8] font-semibold text-xs sm:text-sm tracking-wider uppercase mb-2 block">
                FAQ
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0a192f] mb-3 sm:mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
                Everything you need to know about IG-Besthood Academy
              </p>
            </div>

            <div className="space-y-3 sm:space-y-5">
              {[
                {
                  q: 'What are your school hours?',
                  a: 'Our school day runs from 6:30 AM to 6:00 PM, Monday through Friday. We offer early drop-off from 7:30 AM and after-school care until 3:30 PM.'
                },
                {
                  q: 'Do you provide meals and snacks?',
                  a: 'No, we do not provide meals. We encourage parents to pack nutritious lunches and snacks for their children. We also have a water station for hydration throughout the day.'
                },
                {
                  q: 'What is your teacher-to-student ratio?',
                  a: 'We maintain small class sizes with ratios of 1:2 in Early Years and 1:2 in Primary grades, ensuring individual attention for every child.'
                },
                {
                  q: 'How do you handle discipline?',
                  a: 'We use positive reinforcement and restorative practices, teaching children to make good choices while maintaining a nurturing environment.'
                },
                {
                  q: 'What are the tuition fees?',
                  a: 'Early Years: KES 12,000/term, Primary: KES 15,000/term, After-School: KES 3,000/term and one-time application fee of KES 500.'
                },
                {
                  q: 'Do you offer transportation?',
                  a: 'Yes, we provide bus services on major Nairobi routes. All buses are GPS-tracked with trained matrons and speed governors.'
                },
                {
                  q: 'What curriculum do you follow?',
                  a: 'We follow the Competency-Based Curriculum (CBC) with international best practices. Instruction is primarily in English.'
                },
                {
                  q: 'What is the admission process?',
                  a: '1) School tour & application, 2) Child assessment, 3) Family interview, 4) Acceptance within 5 working days.'
                }
              ].map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden"
                >
                  <button
                    onClick={() => handleFaqToggle(index)}
                    className="w-full px-4 sm:px-7 py-3 sm:py-5 text-left flex items-center justify-between gap-3 sm:gap-4 hover:bg-[#7cb9e8]/5 transition-all group"
                    aria-expanded={openFaq === index}
                  >
                    <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 group-hover:text-[#7cb9e8] pr-2">
                      {faq.q}
                    </span>
                    <div className={`
                      relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0
                      transition-all duration-500 transform
                      ${openFaq === index 
                        ? 'bg-[#7cb9e8] rotate-180 shadow-lg' 
                        : 'bg-[#7cb9e8]/10 group-hover:bg-[#7cb9e8]/20'
                      }
                    `}>
                      <svg
                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-500 ${
                          openFaq === index ? 'text-white' : 'text-[#7cb9e8]'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  
                  <div 
                    className={`
                      overflow-hidden transition-all duration-500
                      ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                    `}
                  >
                    <div className="px-4 sm:px-7 pb-3 sm:pb-5 pt-0 sm:pt-2 text-gray-600 border-t border-gray-100">
                      <p className="text-xs sm:text-sm md:text-base leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div id="contact" ref={ctaRef} className="max-w-7xl mx-auto px-4 py-16 sm:py-20 md:py-24">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-linear-to-br from-[#0a192f] via-[#1e3a8a] to-[#7cb9e8] p-8 sm:p-12 md:p-16 text-center">
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6">
                Begin Your Child's Journey Today
              </h2>
              <p className="text-sm sm:text-base md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                Contact us for a tour of our facilities and meet our dedicated teachers. 
                Limited spaces available for the upcoming academic term.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                {!isAuthenticated && (
                  <>
                    <Link
                      to="/register"
                      className="rounded-full bg-white text-[#0a192f] px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all"
                    >
                      Enroll Now
                    </Link>
                    <a
                      href="#contact"
                      className="rounded-full border-2 border-white text-white px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold hover:bg-white/10 hover:scale-105 transition-all"
                    >
                      Contact Us
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Physics Fruits */}
        <div className="w-full overflow-hidden">
          <PhysicsFruits />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12 sm:py-16 relative overflow-hidden" role="contentinfo">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px"
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-[#7cb9e8] to-[#ffb6c1] rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                  IG
                </div>
                <span className="text-base sm:text-lg md:text-xl font-bold">IG-Besthood Academy</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 leading-relaxed">
                To provide a transformative, student-centered education that fosters academic excellence, 
                critical thinking, and character development.
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs bg-gray-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">Playgroup</span>
                <span className="text-[10px] sm:text-xs bg-gray-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">Primary</span>
                <span className="text-[10px] sm:text-xs bg-gray-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">After-School</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li><a href="#about" className="hover:text-[#7cb9e8] transition">About Us</a></li>
                <li><a href="#programs" className="hover:text-[#7cb9e8] transition">Programs</a></li>
                <li><a href="#gallery" className="hover:text-[#7cb9e8] transition">Gallery</a></li>
                <li><a href="#contact" className="hover:text-[#7cb9e8] transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Info</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li className="flex items-start space-x-1.5 sm:space-x-2">
                  <span>📍</span>
                  <span className="flex-1">Njiru Rama, behind St.Monica Catholic Church</span>
                </li>
                <li className="flex items-center space-x-1.5 sm:space-x-2">
                  <span>📞</span>
                  <span>(254) 711-851-390</span>
                </li>
                <li className="flex items-center space-x-1.5 sm:space-x-2">
                  <span>✉️</span>
                  <span className="break-all">besthoodacademy@gmail.com</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Follow Us</h4>
              <div className="flex space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                <a
                  href="https://www.facebook.com/share/1Apk5aCsJo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#1877F2] transition-all hover:scale-110"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/igbesthoodacademy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-linear-to-tr hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#FCAF45] transition-all hover:scale-110"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
                  </svg>
                </a>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500">Office Hours: Mon-Fri 8am-4pm</p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center">
            <p className="text-[10px] sm:text-xs text-gray-400">© {new Date().getFullYear()} IG-Besthood Academy. All rights reserved. Nairobi, Kenya.</p>
          </div>
        </div>
      </footer>

      {/* Custom CSS animations - disabled on mobile */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @media (min-width: 640px) {
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        /* Ensure no animations on mobile */
        @media (max-width: 639px) {
          .animate-float, .animate-bounce, .transition-all, .transition-transform, .hover\\:scale-*, .group-hover\\:scale-* {
            animation: none !important;
            transition: none !important;
          }
          .group:hover .group-hover\\:scale-110 {
            transform: none !important;
          }
          .hover\\:scale-105:hover {
            transform: none !important;
          }
          .hover\\:translate-y-1:hover, .hover\\:-translate-y-1:hover {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;