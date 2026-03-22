// src/pages/Home.jsx
import React, { useEffect, useRef, useState, lazy, Suspense, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Loading skeleton component
const ImageSkeleton = () => (
  <div className="animate-pulse bg-gray-200 rounded-2xl w-full h-full min-h-50 flex items-center justify-center">
    <div className="text-gray-400">Loading...</div>
  </div>
);

// Lazy load Gallery component
const Gallery = lazy(() => import('./Gallery'));

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [openPricingFaq, setOpenPricingFaq] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState({
    hero: false,
    about: false,
    gallery: false
  });
  const [isMobile, setIsMobile] = useState(false);
  
  // Refs for animation targets
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const aboutRef = useRef(null);
  const programsRef = useRef(null);
  const galleryRef = useRef(null);
  const statsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);
  const programCardsRef = useRef([]);
  const statItemsRef = useRef([]);
  const floatingElementsRef = useRef([]);

  // ===== DATA DEFINITIONS =====
  
  // School stats
  const schoolStats = useMemo(() => [
    { number: '25+', label: 'Years of Excellence', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { number: '500+', label: 'Happy Students', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { number: '40+', label: 'Expert Teachers', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { number: '100%', label: 'Pass Rate', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
  ], []);

  // Programs offered
  const programs = useMemo(() => [
    {
      title: 'Early Years (Ages 3-5)',
      description: 'Nurturing young minds through play-based learning, creativity, and social development in a safe environment.',
      ageGroup: 'Playgroup & Pre-Primary',
      image: '🏫',
      color: 'from-pink-500 to-rose-500',
      features: ['Play-Based Learning', 'Creative Arts', 'Social Skills']
    },
    {
      title: 'Primary School (Ages 6-11)',
      description: 'Building strong foundations in literacy, numeracy, and character development with modern teaching methods.',
      ageGroup: 'Grades 1-6',
      image: '📚',
      color: 'from-blue-500 to-cyan-500',
      features: ['Core Academics', 'STEM Education', 'Character Building']
    },
    {
      title: 'After-School Programs',
      description: 'Enrichment activities including sports, arts, music, and homework support for working parents.',
      ageGroup: 'All Grades',
      image: '⚽',
      color: 'from-purple-500 to-indigo-500',
      features: ['Sports', 'Music & Arts', 'Homework Help']
    }
  ], []);

  // Testimonials - Updated with Kenyan names
  const testimonials = useMemo(() => [
    {
      name: 'Mrs. Wanjiku Kamau',
      role: 'Parent of Primary 3 Student',
      content: 'IG-Besthood Academy has transformed my child\'s love for learning. The teachers are incredibly dedicated and the facilities are top-notch.',
      rating: 5,
      image: '👩'
    },
    {
      name: 'Mr. Odhiambo Otieno',
      role: 'Parent of Kindergarten Student',
      content: 'The caring environment and excellent curriculum have helped my daughter grow confidently. Best decision we made for her education.',
      rating: 5,
      image: '👨'
    },
    {
      name: 'Dr. Muthoni Kipruto',
      role: 'Education Consultant',
      content: 'One of the finest elementary schools I\'ve encountered. Their holistic approach to education is truly commendable.',
      rating: 5,
      image: '👩‍⚕️'
    }
  ], []);

  // Gallery images data - Updated with Kenyan-friendly descriptions
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
      image: 'https://images.unsplash.com/photo-1587653263896-f5a5c888c4c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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

  // ===== NEW: Missing Information for Parents =====
  
  // Tuition & Fees - Updated with KES
  const tuitionInfo = useMemo(() => [
    {
      level: 'Early Years (Ages 3-5)',
      tuition: 'KES 85,000/term',
      additionalFees: 'KES 5,000 (activity fee)',
      includes: 'All materials, meals, snacks'
    },
    {
      level: 'Primary School (Grades 1-6)',
      tuition: 'KES 95,000/term',
      additionalFees: 'KES 7,500 (activity + lab fee)',
      includes: 'All materials, meals, snacks, textbooks'
    },
    {
      level: 'After-School Program',
      tuition: 'KES 25,000/term',
      additionalFees: 'None',
      includes: 'All activities, snacks, homework supervision'
    }
  ], []);

  // Admission Process - Updated with KES
  const admissionSteps = useMemo(() => [
    {
      step: 1,
      title: 'School Tour & Application',
      description: 'Schedule a tour of our facilities and submit completed application form with KES 2,500 application fee.'
    },
    {
      step: 2,
      title: 'Child Assessment',
      description: 'Age-appropriate play-based assessment to understand your child\'s developmental level and needs.'
    },
    {
      step: 3,
      title: 'Family Interview',
      description: 'Meet with our admissions team to discuss your child\'s needs and our educational approach.'
    },
    {
      step: 4,
      title: 'Acceptance & Enrollment',
      description: 'Receive acceptance decision within 5 working days and complete enrollment with tuition payment.'
    }
  ], []);

  // Academic Calendar - Updated with Kenyan holidays
  const academicCalendar = useMemo(() => ({
    terms: [
      { name: 'First Term', dates: 'January 8 - April 5, 2024', holidays: 'January 13 (Mid-term), March 29- April 1 (Easter)' },
      { name: 'Second Term', dates: 'April 29 - August 2, 2024', holidays: 'May 1 (Labour Day), June 1 (Madaraka Day), July 1 (Mid-term)' },
      { name: 'Third Term', dates: 'September 2 - November 29, 2024', holidays: 'October 10 (Huduma Day), October 20 (Mashujaa Day), December 12 (Jamhuri Day)' }
    ],
    breaks: [
      'April Break: April 8 - April 26',
      'August Break: August 5 - August 30',
      'December Break: December 2 - January 5'
    ]
  }), []);

  // Uniform Requirements - Updated for Kenyan schools
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

  // Transportation Options - Updated for Nairobi
  const transportInfo = useMemo(() => ({
    routes: [
      'Route A: Westlands - Parklands - Ngara - City Centre',
      'Route B: Kilimani - Kileleshwa - Lavington - Kawangware',
      'Route C: South B - South C - Lang\'ata - Karen',
      'Route D: Eastlands - Buruburu - Donholm - Tassia'
    ],
    pricing: 'KES 5,000 - KES 8,000 per term (depending on distance)',
    safety: 'All buses equipped with GPS tracking, speed limiters, speed governors, and trained matrons',
    contact: 'Transport Office: (254) 722-345-678'
  }), []);

  // Curriculum Details - Updated for Kenyan curriculum
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

  // Language & Values - Updated for Kenya
  const valuesInfo = useMemo(() => ({
    instruction: 'English (primary), Kiswahili as national language, mother tongue exposure',
    religious: 'Multi-faith approach with Christian, Islamic, and Hindu moral instruction available',
    values: ['Integrity', 'Respect', 'Responsibility', 'Compassion', 'Excellence', 'Unity']
  }), []);

  // ===== EFFECTS =====

  // Check for mobile and reduced motion preference
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, isMobile ? 8000 : 5000);
    return () => clearInterval(interval);
  }, [testimonials.length, isMobile]);

  // Preload critical images
  useEffect(() => {
    const preloadImages = async () => {
      const heroImg = new Image();
      heroImg.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
      heroImg.onload = () => setImagesLoaded(prev => ({ ...prev, hero: true }));
      
      const aboutImg = new Image();
      aboutImg.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
      aboutImg.onload = () => setImagesLoaded(prev => ({ ...prev, about: true }));
    };
    
    preloadImages();
  }, []);

  // GSAP Animations
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Skip animations for users who prefer reduced motion
      document.documentElement.style.scrollBehavior = 'smooth';
      return;
    }

    // Smooth scroll initialization
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Initial animations on mount
    const ctx = gsap.context(() => {
      // Hero section animations
      if (!isMobile && heroContentRef.current) {
        const heroTimeline = gsap.timeline();
        
        heroTimeline
          .from(heroContentRef.current.querySelector('.hero-badge'), {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
          })
          .from(heroContentRef.current.querySelector('h1'), {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
          }, "-=0.4")
          .from(heroContentRef.current.querySelector('p'), {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
          }, "-=0.6")
          .from(heroContentRef.current.querySelectorAll('a'), {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: "back.out(1.7)"
          }, "-=0.4");
      }

      // Floating elements animation - disabled on mobile for performance
      if (!isMobile) {
        floatingElementsRef.current.forEach((el, index) => {
          if (el) {
            gsap.to(el, {
              y: "+=30",
              x: index % 2 === 0 ? "+=20" : "-=20",
              rotation: index % 2 === 0 ? 5 : -5,
              duration: 4 + index,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
            });
          }
        });
      }

      // Stats counter animation - simplified on mobile
      statItemsRef.current.forEach((stat, index) => {
        if (stat) {
          gsap.from(stat, {
            scrollTrigger: isMobile ? undefined : {
              trigger: stat,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            },
            scale: isMobile ? 1 : 0.5,
            opacity: 0,
            duration: isMobile ? 0.3 : 1,
            delay: isMobile ? 0 : index * 0.2,
            ease: "back.out(1.2)"
          });
        }
      });

      // Program cards animation - simplified on mobile
      programCardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.from(card, {
            scrollTrigger: isMobile ? undefined : {
              trigger: card,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            },
            x: isMobile ? 0 : (index % 2 === 0 ? -100 : 100),
            opacity: 0,
            duration: isMobile ? 0.3 : 1,
            ease: "power3.out"
          });

          // Hover animations - disabled on mobile for better performance
          if (!isMobile) {
            card.addEventListener('mouseenter', () => {
              gsap.to(card, {
                scale: 1.05,
                y: -15,
                boxShadow: "0 30px 60px rgba(0,0,0,0.15)",
                duration: 0.4,
                ease: "power2.out"
              });
              const icon = card.querySelector('.program-icon');
              if (icon) {
                gsap.to(icon, {
                  scale: 1.2,
                  rotate: 5,
                  duration: 0.3,
                  ease: "power2.out"
                });
              }
            });

            card.addEventListener('mouseleave', () => {
              gsap.to(card, {
                scale: 1,
                y: 0,
                boxShadow: "0 10px 30px -5px rgba(0,0,0,0.1)",
                duration: 0.4,
                ease: "power2.out"
              });
              const icon = card.querySelector('.program-icon');
              if (icon) {
                gsap.to(icon, {
                  scale: 1,
                  rotate: 0,
                  duration: 0.3,
                  ease: "power2.out"
                });
              }
            });
          }
        }
      });

      // About section animation
      if (!isMobile && aboutRef.current) {
        gsap.from(aboutRef.current, {
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          },
          x: -100,
          opacity: 0,
          duration: 1,
          ease: "power3.out"
        });
      }

      // Testimonials animation
      if (!isMobile && testimonialsRef.current) {
        gsap.from(testimonialsRef.current, {
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          },
          y: 100,
          opacity: 0,
          duration: 1,
          ease: "power3.out"
        });
      }

      // CTA section animation
      if (!isMobile && ctaRef.current) {
        gsap.from(ctaRef.current, {
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          },
          scale: 0.9,
          opacity: 0,
          duration: 1,
          ease: "power3.out"
        });
      }

      // Parallax effect - disabled on mobile
      if (!isMobile && heroRef.current) {
        gsap.to(heroRef.current, {
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5
          },
          y: 150,
          scale: 1.1
        });
      }
    });

    return () => {
      ctx.revert();
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 via-white to-yellow-50 overflow-hidden">
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-orange-600 text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>

      {/* Animated background elements - disabled on mobile */}
      {!isMobile && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div ref={el => floatingElementsRef.current[0] = el} className="absolute top-20 left-10 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" aria-hidden="true"></div>
          <div ref={el => floatingElementsRef.current[1] = el} className="absolute top-40 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000" aria-hidden="true"></div>
          <div ref={el => floatingElementsRef.current[2] = el} className="absolute bottom-20 left-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000" aria-hidden="true"></div>
        </div>
      )}

      <main id="main-content">
        {/* Hero Section with Integrated Auth Buttons */}
        <div ref={heroRef} className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center">
          {/* Hero background with lazy loading */}
          <div className="absolute inset-0 bg-gray-200">
            {!imagesLoaded.hero && <ImageSkeleton />}
            <div 
              className={`absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-10 transition-opacity duration-500 ${imagesLoaded.hero ? 'opacity-10' : 'opacity-0'}`}
              role="img"
              aria-label="Children learning in classroom"
            ></div>
          </div>

          {/* Floating Auth Buttons - Positioned absolutely on top of hero */}
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20 flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <Link
                to={`/${user?.role?.toLowerCase()}/dashboard`}
                className="group relative overflow-hidden rounded-full bg-white/95 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200/50 hover:border-orange-200"
                aria-label="Go to dashboard"
              >
                <span className="relative z-10 flex items-center gap-2 text-gray-800 group-hover:text-orange-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">Account</span>
                </span>
              </Link>
            ) : (
              <>
                {/* Sign In Button - Ghost style */}
                <Link
                  to="/login"
                  className="group relative overflow-hidden rounded-full bg-white/90 backdrop-blur-sm px-4 py-2.5 text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-200/50 hover:border-orange-200"
                  aria-label="Sign in to your account"
                >
                  <span className="relative z-10 flex items-center gap-1.5 text-gray-700 group-hover:text-orange-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden sm:inline">Sign In</span>
                    <span className="sm:hidden">Login</span>
                  </span>
                </Link>

                {/* Enroll Now Button - Prominent */}
                <Link
                  to="/register"
                  className="group relative overflow-hidden rounded-full bg-linear-to-r from-orange-600 to-yellow-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:from-orange-700 hover:to-yellow-700"
                  aria-label="Enroll now at IG-Besthood Academy"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Enroll Now</span>
                  </span>
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
                </Link>
              </>
            )}
          </div>

          {/* Hero Content - Updated for Kenya */}
          <div ref={heroContentRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center">
              <span className="hero-badge inline-block px-4 sm:px-6 py-2 bg-orange-100 text-orange-600 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
                🌟 Where Young Minds Blossom
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6">
                <span className="bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Welcome to
                </span>
                <br />
                <span className="bg-linear-to-r from-orange-600 via-yellow-500 to-green-500 bg-clip-text text-transparent">
                  IG-Besthood Academy
                </span>
              </h1>
              <p className="text-base sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
                Nurturing curious minds, building character, and creating a foundation for lifelong learning 
                in a safe, caring, and stimulating environment for children aged 3-11 years in Nairobi.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
                {!isAuthenticated && (
                  <>
                    <Link
                      to="/register"
                      className="group relative overflow-hidden rounded-full bg-linear-to-r from-orange-600 to-yellow-600 text-white px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105"
                      aria-label="Schedule a visit to our school"
                    >
                      <span className="relative z-10">Schedule a Visit</span>
                    </Link>
                    <Link
                      to="/about"
                      className="group relative overflow-hidden rounded-full border-2 border-orange-600 text-orange-600 px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105"
                      aria-label="Explore our programs"
                    >
                      <span className="relative z-10">Explore Programs</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div ref={statsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {schoolStats.map((stat, index) => (
              <div
                key={index}
                ref={el => statItemsRef.current[index] = el}
                className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl transition-all"
                role="statistic"
                aria-label={`${stat.number} ${stat.label}`}
              >
                <div className="w-10 h-10 sm:w-16 sm:h-16 mx-auto bg-linear-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mb-2 sm:mb-4">
                  <svg className="w-5 h-5 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                  </svg>
                </div>
                <div className="text-xl sm:text-3xl font-bold text-gray-800 mb-1">{stat.number}</div>
                <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Virtual Tour/Achievements Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg sm:shadow-xl">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div>
                <span className="text-orange-600 font-semibold text-xs sm:text-sm tracking-wider uppercase mb-2 block">Virtual Tour</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">Take a Peek Inside Our School</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Experience our vibrant learning environment through this interactive glimpse into daily life at IG-Besthood Academy.</p>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="text-center p-3 sm:p-4 bg-orange-50 rounded-lg sm:rounded-xl">
                    <div className="text-xl sm:text-3xl font-bold text-orange-600">15+</div>
                    <div className="text-xs sm:text-sm text-gray-600">Years of Excellence</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-yellow-50 rounded-lg sm:rounded-xl">
                    <div className="text-xl sm:text-3xl font-bold text-yellow-600">95%</div>
                    <div className="text-xs sm:text-sm text-gray-600">Parent Satisfaction</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg sm:rounded-xl">
                    <div className="text-xl sm:text-3xl font-bold text-green-600">1:8</div>
                    <div className="text-xs sm:text-sm text-gray-600">Teacher-Student Ratio</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl">
                    <div className="text-xl sm:text-3xl font-bold text-blue-600">50+</div>
                    <div className="text-xs sm:text-sm text-gray-600">Extracurriculars</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video bg-linear-to-br from-orange-400 to-yellow-400 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl sm:text-8xl mb-2 sm:mb-4">🎥</div>
                      <p className="text-white text-sm sm:text-base font-semibold">Watch Our School Video</p>
                    </div>
                  </div>
                </div>
                {/* Play button overlay */}
                <button 
                  className="absolute inset-0 m-auto w-12 h-12 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                  aria-label="Play school video tour"
                >
                  <div className="w-0 h-0 border-t-8 sm:border-t-12 border-t-transparent border-l-12 sm:border-l-20 border-l-orange-600 border-b-8 sm:border-b-12 border-b-transparent ml-1"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* NEW: Tuition & Fees Section - Updated with KES */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-orange-600 font-semibold text-xs sm:text-sm tracking-wider uppercase mb-2 block">Investment in Education</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Tuition & Fees</h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Transparent pricing with no hidden costs. All fees include materials and meals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {tuitionInfo.map((level, index) => (
              <div key={index} className="group relative bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className={`absolute top-0 left-0 right-0 h-2 bg-linear-to-r ${
                  index === 0 ? 'from-pink-500 to-rose-500' : 
                  index === 1 ? 'from-blue-500 to-cyan-500' : 
                  'from-purple-500 to-indigo-500'
                }`}></div>
                <div className="p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">{level.level}</h3>
                  <div className="mb-6">
                    <span className="text-3xl sm:text-4xl font-bold text-orange-600">{level.tuition}</span>
                    <p className="text-sm text-gray-500 mt-1">per term (3 terms per year)</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Additional: {level.additionalFees}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Includes: {level.includes}</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-xs text-gray-400">* Application fee: KES 2,500 (one-time)</p>
                    <p className="text-xs text-gray-400">* Sibling discount: 10% for second child</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div id="about" ref={aboutRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="relative order-2 md:order-1">
              <div className="relative z-10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl">
                {!imagesLoaded.about && <ImageSkeleton />}
                <div className={`aspect-w-4 aspect-h-3 bg-linear-to-br from-orange-400 to-yellow-400 flex items-center justify-center transition-opacity duration-500 ${imagesLoaded.about ? 'opacity-100' : 'opacity-0'}`}>
                  {imagesLoaded.about ? (
                    <img 
                      src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Our beautiful school campus with modern facilities"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-7xl sm:text-9xl">🏛️</span>
                  )}
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                  <h3 className="text-xl sm:text-2xl font-bold">Our Beautiful Campus</h3>
                  <p className="text-xs sm:text-sm opacity-90">Where learning comes alive</p>
                </div>
              </div>
              {/* Decorative elements - hidden on mobile */}
              {!isMobile && (
                <>
                  <div className="absolute -top-4 -left-4 w-16 sm:w-24 h-16 sm:h-24 bg-yellow-200 rounded-full -z-10 animate-pulse" aria-hidden="true"></div>
                  <div className="absolute -bottom-4 -right-4 w-20 sm:w-32 h-20 sm:h-32 bg-orange-200 rounded-full -z-10 animate-pulse animation-delay-1000" aria-hidden="true"></div>
                </>
              )}
            </div>
            <div className="order-1 md:order-2">
              <span className="text-orange-600 font-semibold text-xs sm:text-sm tracking-wider uppercase mb-2 block">About Us</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
                Building Bright Futures Since 1998
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                At IG-Besthood Academy, we believe every child is unique and deserves an education that 
                nurtures their individual talents while building strong academic foundations. Our child-centered 
                approach combines modern teaching methods with traditional Kenyan values.
              </p>
              <div className="space-y-3 sm:space-y-4">
                {['Qualified and caring teachers', 'Small class sizes for individual attention', 'Modern facilities and resources', 'Safe and secure environment'].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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

        {/* NEW: Curriculum Details Section - Updated for Kenya */}
        <div className="bg-linear-to-r from-orange-50 to-yellow-50 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-16">
              <span className="text-orange-600 font-semibold text-xs sm:text-sm tracking-wider uppercase mb-2 block">How We Teach</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Curriculum & Approach</h2>
              <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                Competency-Based Curriculum (CBC) with international best practices
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Core Subjects</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {curriculumInfo.core.map((subject, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-gray-700">{subject}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Enrichment Subjects</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {curriculumInfo.enrichment.map((subject, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-gray-700">{subject}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Teaching Methods</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {curriculumInfo.teachingMethods.map((method, idx) => (
                  <div key={idx} className="text-center p-4 bg-orange-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-800">{method}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 bg-linear-to-r from-orange-600 to-yellow-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Language of Instruction</h4>
                  <p className="text-white/90 text-sm">{valuesInfo.instruction}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Values Education</h4>
                  <p className="text-white/90 text-sm mb-2">{valuesInfo.religious}</p>
                  <div className="flex flex-wrap gap-2">
                    {valuesInfo.values.map((value, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white/20 rounded-full text-xs">
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
        <div id="programs" ref={programsRef} className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-16">
              <span className="text-orange-600 font-semibold text-xs sm:text-sm tracking-wider uppercase mb-2 block">Our Programs</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
                Learning Programs for Every Stage
              </h2>
              <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                Age-appropriate curriculum designed to inspire and challenge young learners
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
              {programs.map((program, index) => (
                <div
                  key={index}
                  ref={el => programCardsRef.current[index] = el}
                  className="group relative bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl overflow-hidden hover:shadow-xl sm:hover:shadow-2xl transition-all cursor-pointer"
                  role="article"
                  aria-label={`Program: ${program.title}`}
                >
                  <div className={`absolute inset-0 bg-linear-to-br ${program.color} opacity-0 group-hover:opacity-10 transition-opacity`} aria-hidden="true"></div>
                  <div className="p-6 sm:p-8">
                    <div className="program-icon text-5xl sm:text-7xl mb-4 sm:mb-6 transform transition-transform">
                      {program.image}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{program.title}</h3>
                    <p className="text-orange-600 font-semibold text-sm sm:text-base mb-3 sm:mb-4">{program.ageGroup}</p>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">{program.description}</p>
                    <div className="space-y-2">
                      {program.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-xs sm:text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-orange-500 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform" aria-hidden="true"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div id="gallery" ref={galleryRef}>
          <Suspense fallback={
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
              <div className="text-center mb-10 sm:mb-16">
                <div className="h-4 w-24 bg-gray-200 animate-pulse mx-auto mb-2"></div>
                <div className="h-8 w-64 bg-gray-200 animate-pulse mx-auto mb-4"></div>
                <div className="h-6 w-96 max-w-full bg-gray-200 animate-pulse mx-auto"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-xl"></div>
                ))}
              </div>
            </div>
          }>
            <Gallery images={galleryImages} />
          </Suspense>
        </div>

        {/* NEW: Uniform Information Section - Updated for Kenya */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 sm:p-12 bg-linear-to-br from-orange-600 to-yellow-600 text-white">
                <span className="text-white/80 font-semibold text-sm tracking-wider uppercase mb-2 block">Dress Code</span>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Uniform Requirements</h2>
                <p className="text-white/90 mb-6">All uniform items available at the school store</p>
                <div className="text-7xl mb-4">👕👖👟</div>
                <p className="text-sm text-white/80 mt-4">Complete uniform set: KES 4,500 - KES 6,000</p>
              </div>
              <div className="p-8 sm:p-12">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Required Items
                  </h3>
                  <ul className="space-y-2">
                    {uniformInfo.required.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Optional Items
                  </h3>
                  <ul className="space-y-2">
                    {uniformInfo.optional.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meet Our Teachers Section - Updated with Kenyan names */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-orange-600 font-semibold text-xs sm:text-sm tracking-wider uppercase mb-2 block">Our Team</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Meet Our Dedicated Teachers</h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Passionate educators committed to nurturing every child's potential
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
              { name: 'Madam Grace Wanjiku', role: 'Head Teacher', experience: '15 years', emoji: '👩‍🏫', specialty: 'Early Childhood' },
              { name: 'Mr. John Omondi', role: 'Primary Coordinator', experience: '12 years', emoji: '👨‍🏫', specialty: 'STEM Education' },
              { name: 'Ms. Sarah Muthoni', role: 'Kindergarten Lead', experience: '10 years', emoji: '👩‍🎨', specialty: 'Creative Arts' },
              { name: 'Mr. David Kipchoge', role: 'PE Instructor', experience: '8 years', emoji: '🏃‍♂️', specialty: 'Sports Development' }
            ].map((teacher, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-linear-to-r from-orange-600 to-yellow-600 rounded-2xl sm:rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity" aria-hidden="true"></div>
                <div className="relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto bg-linear-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center text-3xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    {teacher.emoji}
                  </div>
                  <h3 className="text-sm sm:text-xl font-bold text-gray-800 mb-1">{teacher.name}</h3>
                  <p className="text-xs sm:text-base text-orange-600 font-semibold mb-1 sm:mb-2">{teacher.role}</p>
                  <p className="text-xs text-gray-500 mb-2">{teacher.experience} experience</p>
                  <p className="text-xs text-gray-400 bg-gray-50 rounded-full px-2 sm:px-3 py-1 inline-block">
                    {teacher.specialty}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NEW: Admission Process Section - Updated with KES */}
        <div className="bg-linear-to-r from-orange-50 to-yellow-50 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-16">
              <span className="text-orange-600 font-semibold text-xs sm:text-sm tracking-wider uppercase mb-2 block">Join Our Community</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Admission Process</h2>
              <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                Four simple steps to begin your child's journey at IG-Besthood Academy
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {admissionSteps.map((step) => (
                <div key={step.step} className="relative">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                    <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  {step.step < 4 && !isMobile && (
                    <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 text-2xl text-orange-400 hidden lg:block">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">Application fee: KES 2,500 (non-refundable)</p>
              <p className="text-sm text-gray-500">Decision timeline: Within 5 working days of assessment</p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div ref={testimonialsRef} className="bg-linear-to-r from-orange-600 to-yellow-600 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">What Parents Say</h2>
              <p className="text-base sm:text-xl text-orange-100">Trusted by families in our community</p>
            </div>

            <div className="relative">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-all duration-700 ${
                    index === activeTestimonial ? 'opacity-100 scale-100 relative' : 'opacity-0 scale-95 absolute top-0 left-0 right-0 pointer-events-none'
                  }`}
                  role="region"
                  aria-label={`Testimonial ${index + 1} of ${testimonials.length}`}
                  aria-hidden={index !== activeTestimonial}
                >
                  <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl sm:shadow-2xl">
                    <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                      <div className="text-3xl sm:text-5xl bg-linear-to-br from-orange-100 to-yellow-100 rounded-full w-12 h-12 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
                        {testimonial.image}
                      </div>
                      <div>
                        <h4 className="text-base sm:text-xl font-bold text-gray-800">{testimonial.name}</h4>
                        <p className="text-xs sm:text-sm text-orange-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-sm sm:text-lg text-gray-600 italic mb-3 sm:mb-4">"{testimonial.content}"</p>
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Navigation dots */}
              <div className="flex justify-center space-x-2 mt-4 sm:mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                      index === activeTestimonial ? 'bg-white w-4 sm:w-6' : 'bg-orange-300 hover:bg-orange-200'
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                    aria-current={index === activeTestimonial ? 'true' : 'false'}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* NEW: Academic Calendar Section - Updated for Kenya */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-orange-600 font-semibold text-xs sm:text-sm tracking-wider uppercase mb-2 block">Plan Ahead</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">2024 Academic Calendar</h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Important dates and holidays for the academic year
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {academicCalendar.terms.map((term, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{term.name}</h3>
                <p className="text-sm text-orange-600 font-semibold mb-3">{term.dates}</p>
                <p className="text-xs text-gray-500">Holidays: {term.holidays}</p>
              </div>
            ))}
          </div>

          <div className="bg-orange-50 rounded-2xl p-6">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              School Breaks
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {academicCalendar.breaks.map((break_item, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-600">{break_item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NEW: Transportation Section - Updated for Kenya */}
        <div className="bg-linear-to-r from-orange-50 to-yellow-50 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-orange-600 font-semibold text-xs tracking-wider uppercase mb-2 block">Safe Travel</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Transportation Services</h2>
                <p className="text-gray-600 mb-6">Safe, reliable transportation for your child with trained staff and modern, GPS-tracked vehicles operating across Nairobi.</p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Available Routes:</h3>
                    <ul className="space-y-2">
                      {transportInfo.routes.map((route, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          <span>{route}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800">Pricing:</span>
                      <span className="text-orange-600 font-bold">{transportInfo.pricing}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800">Safety:</span>
                      <span className="text-sm text-gray-600">{transportInfo.safety}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500">Transport Office: {transportInfo.contact}</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-square bg-linear-to-br from-orange-400 to-yellow-400 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-8xl mb-4">🚌</div>
                      <p className="text-white font-semibold">School Bus Service</p>
                      <p className="text-white/80 text-sm mt-2">GPS tracked • Trained matrons • Speed governors</p>
                    </div>
                  </div>
                </div>
                {/* Decorative bus icons */}
                <div className="absolute -bottom-4 -right-4 text-6xl opacity-20 transform rotate-12">🚌</div>
              </div>
            </div>
          </div>
        </div>

        {/* News & Announcements Section - Updated with Kenyan-friendly content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-orange-600 font-semibold text-xs sm:text-sm tracking-wider uppercase mb-2 block">Stay Updated</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Latest News & Announcements</h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Keep up with exciting events and important updates from our school
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            {[
              {
                date: 'March 15, 2024',
                title: 'Annual Sports Day',
                excerpt: 'Join us for a day of fun, games, and athletic activities at our Nairobi campus.',
                emoji: '🏆',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                date: 'March 20, 2024',
                title: 'Parent-Teacher Conference',
                excerpt: 'Schedule your meeting to discuss your child\'s progress and development.',
                emoji: '📅',
                color: 'from-purple-500 to-pink-500'
              },
              {
                date: 'April 1, 2024',
                title: 'Term 2 Enrollment Opens',
                excerpt: 'Limited slots available for the April - August term. Apply early!',
                emoji: '☀️',
                color: 'from-yellow-500 to-orange-500'
              }
            ].map((news, index) => (
              <div key={index} className="group bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl overflow-hidden hover:shadow-xl sm:hover:shadow-2xl transition-all">
                <div className={`h-2 bg-linear-to-r ${news.color}`} aria-hidden="true"></div>
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="text-xs sm:text-sm text-gray-500">{news.date}</span>
                    <span className="text-2xl sm:text-3xl">{news.emoji}</span>
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 sm:mb-4">{news.excerpt}</p>
                  <a href="#" className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 text-sm">
                    Read More
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section - Expanded */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-orange-600 font-semibold text-xs sm:text-sm tracking-wider uppercase mb-2 block">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Frequently Asked Questions</h2>
            <p className="text-base sm:text-xl text-gray-600">Everything you need to know about IG-Besthood Academy</p>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {[
              {
                q: 'What are your school hours?',
                a: 'Our school day runs from 8:00 AM to 3:00 PM, Monday through Friday. We offer early drop-off from 7:30 AM and after-school care until 5:30 PM.'
              },
              {
                q: 'Do you provide meals and snacks?',
                a: 'Yes, we provide nutritious breakfast, lunch, and afternoon snacks prepared in our kitchen. We accommodate dietary restrictions and allergies. Our menu is designed by a nutritionist and includes local Kenyan dishes alongside international options.'
              },
              {
                q: 'What is your teacher-to-student ratio?',
                a: 'We maintain small class sizes with ratios of 1:8 in Early Years and 1:12 in Primary grades, ensuring individual attention for every child. This allows our teachers to personalize learning experiences and provide the support each child needs.'
              },
              {
                q: 'How do you handle discipline?',
                a: 'We use positive reinforcement and restorative practices, teaching children to make good choices while maintaining a nurturing environment. Our approach focuses on helping children understand the impact of their actions and develop self-regulation skills.'
              },
              {
                q: 'What are the tuition fees?',
                a: 'Early Years: KES 85,000/term, Primary: KES 95,000/term, After-School: KES 25,000/term. Additional fees include activity fee (KES 5,000-7,500) and one-time application fee of KES 2,500. Sibling discount of 10% available for second child.'
              },
              {
                q: 'Do you offer transportation?',
                a: 'Yes, we provide bus services on major Nairobi routes (Westlands, Kilimani, South B, Eastlands areas). Pricing ranges from KES 5,000-8,000 per term depending on distance. All buses are GPS-tracked with trained matrons and speed governors.'
              },
              {
                q: 'What curriculum do you follow?',
                a: 'We follow the Competency-Based Curriculum (CBC) with international best practices. Instruction is primarily in English, with Kiswahili as a national language and mother tongue exposure. We also offer multi-faith moral instruction.'
              },
              {
                q: 'What is the admission process?',
                a: '1) School tour & application (KES 2,500 fee), 2) Child assessment, 3) Family interview, 4) Acceptance within 5 working days. We welcome applications throughout the year, subject to space availability.'
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-5 sm:px-7 py-4 sm:py-5 text-left flex items-center justify-between gap-4 hover:bg-linear-to-r hover:from-orange-50 hover:to-yellow-50 transition-all duration-300 group"
                  aria-expanded={openFaq === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-orange-700 transition-colors duration-300 pr-8">
                    {faq.q}
                  </span>
                  <div className={`
                    relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0
                    transition-all duration-500 transform
                    ${openFaq === index 
                      ? 'bg-orange-500 rotate-180 shadow-lg shadow-orange-200' 
                      : 'bg-orange-100 group-hover:bg-orange-200 rotate-0'
                    }
                  `}>
                    <svg
                      className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-500 ${
                        openFaq === index ? 'text-white' : 'text-orange-600 group-hover:text-orange-700'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2.5" 
                        d="M19 9l-7 7-7-7" 
                      />
                    </svg>
                  </div>
                </button>
                
                {/* Animated answer section */}
                <div 
                  className={`
                    overflow-hidden transition-all duration-500 ease-in-out
                    ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                  `}
                >
                  <div 
                    id={`faq-answer-${index}`}
                    className="px-5 sm:px-7 pb-5 sm:pb-7 pt-2 text-gray-600 border-t border-gray-100"
                  >
                    <div className="flex items-start space-x-3">
                      {/* Decorative element */}
                      <div className="hidden sm:block mt-1">
                        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm sm:text-base leading-relaxed text-gray-600 font-light tracking-wide">
                          {faq.a}
                        </p>
                        {/* Optional subtle gradient line */}
                        <div className="mt-3 h-0.5 w-12 bg-linear-to-r from-orange-300 to-transparent rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div id="contact" ref={ctaRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-linear-to-br from-orange-600 via-yellow-500 to-green-500 p-8 sm:p-16 text-center">
            {/* Animated particles - disabled on mobile */}
            {!isMobile && (
              <div className="absolute inset-0 opacity-20" aria-hidden="true">
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 sm:w-2 h-1 sm:h-2 bg-white rounded-full"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animation: `float ${3 + Math.random() * 7}s linear infinite`,
                      animationDelay: `${Math.random() * 5}s`
                    }}
                  />
                ))}
              </div>
            )}

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                Begin Your Child's Journey Today
              </h2>
              <p className="text-sm sm:text-base md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                Contact us for a tour of our facilities and meet our dedicated teachers. 
                Limited spaces available for the upcoming academic term.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
                {!isAuthenticated && (
                  <>
                    <Link
                      to="/register"
                      className="group relative inline-block overflow-hidden rounded-full bg-white text-orange-600 px-6 sm:px-10 py-3 sm:py-4 text-sm sm:text-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105"
                      aria-label="Enroll now at IG-Besthood Academy"
                    >
                      <span className="relative z-10">Enroll Now</span>
                    </Link>
                    <a
                      href="#contact"
                      className="group relative inline-block overflow-hidden rounded-full border-2 border-white text-white px-6 sm:px-10 py-3 sm:py-4 text-sm sm:text-lg font-semibold transition-all duration-300 hover:bg-white/10 hover:scale-105"
                      aria-label="Contact us for more information"
                    >
                      <span className="relative z-10">Contact Us</span>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Updated with Kenyan contact info */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16 relative overflow-hidden" role="contentinfo">
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px"
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  IG
                </div>
                <span className="text-base sm:text-xl font-bold">IG-Besthood Academy</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mb-4">
                Nurturing young minds and building bright futures in Nairobi since 1998.
              </p>
              <div className="flex space-x-2">
                <span className="text-xs bg-gray-800 px-2 py-1 rounded">Playgroup</span>
                <span className="text-xs bg-gray-800 px-2 py-1 rounded">Primary</span>
                <span className="text-xs bg-gray-800 px-2 py-1 rounded">After-School</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li><a href="#about" className="hover:text-orange-400 transition">About Us</a></li>
                <li><a href="#programs" className="hover:text-orange-400 transition">Programs</a></li>
                <li><a href="#gallery" className="hover:text-orange-400 transition">Gallery</a></li>
                <li><a href="#contact" className="hover:text-orange-400 transition">Contact</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Admissions</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Calendar</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-4">Contact Info</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li className="flex items-start space-x-2">
                  <span>📍</span>
                  <span>123 Education Avenue, Nairobi, Kenya</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>(254) 722-345-678</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>✉️</span>
                  <span>info@igbesthood.ac.ke</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>🚌</span>
                  <span>Transport: (254) 733-456-789</span>
                </li>
              </ul>
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-4">Follow Us</h4>
              <div className="flex space-x-3 sm:space-x-4 mb-4">
                {['facebook', 'twitter', 'instagram', 'youtube'].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-all transform hover:scale-110"
                    aria-label={`Follow us on ${social}`}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                  </a>
                ))}
              </div>
              <p className="text-xs text-gray-500">Office Hours: Mon-Fri 8am-4pm</p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-400">© {new Date().getFullYear()} IG-Besthood Academy. All rights reserved. Nairobi, Kenya.</p>
            <p className="mt-2 text-xs text-gray-500">Where every child's potential is nurtured with care</p>
          </div>
        </div>
      </footer>

      {/* Custom CSS animations - only if reduced motion is not preferred */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
          .animation-delay-1000 {
            animation-delay: 1s;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        }

        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;