import React, { useState, useEffect, useRef } from 'react';
import TypingEffect from './components/TypingEffect';
import TechTerminal from './components/TechTerminal';
import PhotoUpload from './components/PhotoUpload';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { 
  FaGithub, 
  FaLinkedin, 
  FaEnvelope, 
  FaRocket, 
  FaLaptopCode, 
  FaCloud, 
  FaGraduationCap, 
  FaBuilding, 
  FaBriefcase, 
  FaGlobe, 
  FaHeartPulse, 
  FaLeaf, 
  FaTrophy, 
  FaLocationDot 
} from 'react-icons/fa6';

// Register GreenSock Plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);

  // Custom Snapping Cursor physics using GSAP Ticker & Event Delegation
  useEffect(() => {
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    // Initial position out of viewport
    gsap.set(dot, { x: -100, y: -100 });
    gsap.set(ring, { x: -100, y: -100 });

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set(dot, { x: mouseX, y: mouseY });
    };

    window.addEventListener('mousemove', onMouseMove);

    // Smooth physics-based lerp tracking for ring
    const tick = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      gsap.set(ring, { x: ringX, y: ringY });
    };

    gsap.ticker.add(tick);

    // Event delegation to capture mouse events on all interactive elements
    const onMouseOver = (e) => {
      const target = e.target.closest('a, button, label, input, .skill-pill, .editorial-cell, .contact-cell, .timeline-card');
      if (target) {
        gsap.to(ring, {
          width: 44,
          height: 44,
          backgroundColor: 'rgba(91, 79, 255, 0.06)',
          borderColor: '#5b4fff',
          duration: 0.25,
          ease: 'power2.out'
        });
        gsap.to(dot, {
          scale: 1.5,
          backgroundColor: '#5b4fff',
          duration: 0.25,
          ease: 'power2.out'
        });
      }
    };

    const onMouseOut = (e) => {
      const target = e.target.closest('a, button, label, input, .skill-pill, .editorial-cell, .contact-cell, .timeline-card');
      if (target) {
        gsap.to(ring, {
          width: 24,
          height: 24,
          backgroundColor: 'transparent',
          borderColor: '#5b4fff',
          duration: 0.25,
          ease: 'power2.out'
        });
        gsap.to(dot, {
          scale: 1,
          backgroundColor: '#161616',
          duration: 0.25,
          ease: 'power2.out'
        });
      }
    };

    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      gsap.ticker.remove(tick);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  // Scroll Progress Ruler animation
  useEffect(() => {
    const progressTween = gsap.to('.scroll-progress-bar', {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      }
    });

    return () => {
      if (progressTween.scrollTrigger) progressTween.scrollTrigger.kill();
      progressTween.kill();
    };
  }, []);

  // GSAP Entrance & ScrollTrigger Animations
  useEffect(() => {
    // 1. Hero letters stagger y-reveal
    gsap.to('.hero-name-char', {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power4.out',
      stagger: 0.03,
      delay: 0.2
    });

    // 2. Stat counters (Direct DOM count animation for performance)
    const statsObj = { exp: 0, projects: 0 };
    const counterTween = gsap.to(statsObj, {
      exp: 1,
      projects: 10,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about-stats-grid',
        start: 'top 85%',
      },
      onUpdate: () => {
        const expEl = document.getElementById('stat-num-exp');
        const projEl = document.getElementById('stat-num-projects');
        if (expEl) expEl.textContent = Math.floor(statsObj.exp) + "+";
        if (projEl) projEl.textContent = Math.floor(statsObj.projects) + "+";
      }
    });

    // 3. Terminal Window entrance animation
    const skillsTween = gsap.fromTo('.terminal-window', 
      { scale: 0.95, opacity: 0, y: 35 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#skills',
          start: 'top 75%',
        }
      }
    );

    // 4. Experience timeline elements slide-in
    const timelineTween = gsap.fromTo('.timeline-item',
      { x: -40, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '#experience',
          start: 'top 80%'
        }
      }
    );

    // 5. Project cards staggered lift
    const projectsTween = gsap.fromTo('.project-cell',
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '#projects',
          start: 'top 80%'
        }
      }
    );

    // 6. Contact cells scale-in with back ease
    const contactTween = gsap.fromTo('.contact-cell',
      { scale: 0.92, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'back.out(1.3)',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 85%'
        }
      }
    );

    return () => {
      // Clean up triggers on unmount
      [counterTween, skillsTween, timelineTween, projectsTween, contactTween].forEach(tween => {
        if (tween.scrollTrigger) tween.scrollTrigger.kill();
        tween.kill();
      });
    };
  }, []);

  // IntersectionObserver for tracking current active link inside sticky header
  useEffect(() => {
    const sections = document.querySelectorAll('section');
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // GSAP Smooth ScrollTo trigger
  const handleNavClick = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    gsap.to(window, {
      duration: 1.2,
      scrollTo: { y: `#${id}`, offset: 80 },
      ease: 'power3.inOut'
    });
    setActiveSection(id);
  };



  const renderHeroName = () => {
    const name = "Fathimathu Safna C S";
    return name.split(" ").map((word, wordIndex) => (
      <span key={wordIndex} className="hero-name-word">
        {word.split("").map((char, charIndex) => (
          <span key={charIndex} className="hero-name-char">
            {char}
          </span>
        ))}
        {/* Add space between words */}
        &nbsp;
      </span>
    ));
  };

  return (
    <>
      {/* CUSTOM PHYSICS-BASED DUAL-LAYER CURSOR */}
      <div className="custom-cursor-dot" ref={cursorDotRef} />
      <div className="custom-cursor-ring" ref={cursorRingRef} />

      {/* STICKY NAV SYSTEM WITH PROGRESS RULER */}
      <nav className="navbar" id="main-navbar">
        <div className="nav-container">
          <a href="#home" className="logo" onClick={(e) => handleNavClick(e, 'home')}>
            FS<span>.</span>
          </a>
          
          <button 
            className={`hamburger ${menuOpen ? 'open' : ''}`} 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            id="nav-hamburger"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`nav-menu ${menuOpen ? 'open' : ''}`} id="nav-links-list">
            <li>
              <a 
                href="#home" 
                className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, 'home')}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, 'about')}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#skills" 
                className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, 'skills')}
              >
                Skills
              </a>
            </li>
            <li>
              <a 
                href="#experience" 
                className={`nav-link ${activeSection === 'experience' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, 'experience')}
              >
                Experience
              </a>
            </li>
            <li>
              <a 
                href="#projects" 
                className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, 'projects')}
              >
                Projects
              </a>
            </li>
            <li>
              <a 
                href="#education" 
                className={`nav-link ${activeSection === 'education' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, 'education')}
              >
                Education
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, 'contact')}
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
        {/* Scroll Progress Ruler Indicator */}
        <div className="scroll-progress-container">
          <div className="scroll-progress-bar"></div>
        </div>
      </nav>

      {/* PORTFOLIO CONTENT SECTIONS */}
      <div>
        
        {/* 1. HERO SECTION */}
        <section id="home">
          <div className="container">
            <div className="hero-content">
              <div className="hero-left">
                <span className="hero-greeting">Hi, I'm</span>
                
                <h1 className="hero-name">
                  {renderHeroName()}
                </h1>
                
                <div className="hero-title-container">
                  <TypingEffect />
                </div>

                <p className="hero-summary">
                  Building scalable full-stack applications with React, Node.js &amp; AWS — 
                  from solo freelance to production-grade team environments.
                </p>

                <div className="cta-group">
                  <a href="#projects" className="btn btn-primary" onClick={(e) => handleNavClick(e, 'projects')}>
                    Explore My Work
                  </a>
                  <a href="#contact" className="btn btn-secondary" onClick={(e) => handleNavClick(e, 'contact')}>
                    Get in Touch
                  </a>
                </div>

                <div className="social-links">
                  {/* GitHub */}
                  <a 
                    href="https://github.com/FathimathuSafna" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-icon"
                    title="GitHub"
                    id="hero-github"
                  >
                    <FaGithub />
                  </a>
                  {/* LinkedIn */}
                  <a 
                    href="https://linkedin.com/in/fathimathu-safna" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-icon"
                    title="LinkedIn"
                    id="hero-linkedin"
                  >
                    <FaLinkedin />
                  </a>
                  {/* Email */}
                  <a 
                    href="mailto:fathimathu29@gmail.com" 
                    className="social-icon"
                    title="Email"
                    id="hero-email"
                  >
                    <FaEnvelope />
                  </a>
                </div>
              </div>

              {/* Photo Preview Upload Element */}
              <PhotoUpload />
            </div>
          </div>
        </section>

        {/* 2. ABOUT SECTION */}
        <section id="about">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">About Me</span>
              <h2 className="section-title">Background</h2>
            </div>
            
            <div className="about-grid">
              <div className="about-text-cell">
                <p>
                  Junior Full Stack Developer with professional and internship experience building 
                  scalable MERN stack applications in a production environment. Proven ability to 
                  collaborate in Agile teams to deliver production-ready features, integrate REST 
                  APIs, and deploy cloud-based solutions on AWS.
                </p>
                <p>
                  Skilled in React.js, Node.js, MongoDB, JavaScript, and Python with a strong foundation 
                  in data structures, algorithms, and OOP. Experienced with Docker for containerized 
                  development workflows to maintain development and production environment parity.
                </p>
              </div>

              <div className="about-stats-grid">
                <div className="stat-cell">
                  <span className="stat-emoji"><FaRocket /></span>
                  <span className="stat-number" id="stat-num-exp">0+</span>
                  <span className="stat-label">Years Experience</span>
                </div>
                <div className="stat-cell">
                  <span className="stat-emoji"><FaLaptopCode /></span>
                  <span className="stat-number" id="stat-num-projects">0+</span>
                  <span className="stat-label">Projects Built</span>
                </div>
                <div className="stat-cell">
                  <span className="stat-emoji"><FaCloud /></span>
                  <span className="stat-number">AWS</span>
                  <span className="stat-label">Cloud Deployed</span>
                </div>
                <div className="stat-cell">
                  <span className="stat-emoji"><FaGraduationCap /></span>
                  <span className="stat-number">M.Sc. CS</span>
                  <span className="stat-label">Computer Science</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SKILLS SECTION */}
        <TechTerminal />

        {/* 4. EXPERIENCE SECTION */}
        <section id="experience">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Experience</span>
              <h2 className="section-title">Work History</h2>
            </div>

            <div className="timeline">
              {/* Experience 1 */}
              <div className="timeline-item">
                <div className="timeline-card" id="exp-1">
                  <div className="timeline-header">
                    <div>
                      <h3 className="role-title">
                        <span className="company-logo"><FaBuilding /></span>Junior Full Stack Developer
                      </h3>
                      <span className="company-name">Inspite Technologies Pvt. Ltd. — Infopark, Kochi</span>
                    </div>
                    <span className="timeline-date">Jan 2026 – May 2026</span>
                  </div>
                  <ul className="timeline-details">
                    <li>Developed and maintained scalable MERN stack features for production applications across cross-functional teams</li>
                    <li>Built and optimized REST APIs and DB queries — improved API response performance by ~30%</li>
                    <li>Containerized environments with Docker for consistent dev/prod parity</li>
                    <li>Debugging, unit testing support for stable production releases</li>
                    <li>Code reviews and Git/GitHub workflows in Agile/Scrum sprints</li>
                  </ul>
                </div>
              </div>

              {/* Experience 2 */}
              <div className="timeline-item">
                <div className="timeline-card" id="exp-2">
                  <div className="timeline-header">
                    <div>
                      <h3 className="role-title">
                        <span className="company-logo"><FaBuilding /></span>Full Stack Developer Intern
                      </h3>
                      <span className="company-name">Inspite Technologies Pvt. Ltd. — Infopark, Kochi</span>
                    </div>
                    <span className="timeline-date">Sep 2025 – Dec 2025</span>
                  </div>
                  <ul className="timeline-details">
                    <li>Built frontend and backend features using MERN stack in Agile cycles</li>
                    <li>Implemented JWT authentication and third-party API integrations</li>
                    <li>Supported debugging, issue resolution, and API documentation</li>
                  </ul>
                </div>
              </div>

              {/* Experience 3 */}
              <div className="timeline-item">
                <div className="timeline-card" id="exp-3">
                  <div className="timeline-header">
                    <div>
                      <h3 className="role-title">
                        <span className="company-logo"><FaBriefcase /></span>Freelance Full Stack Developer
                      </h3>
                      <span className="company-name">Self-Employed</span>
                    </div>
                    <span className="timeline-date">Jun 2024 – Jun 2025</span>
                  </div>
                  <ul className="timeline-details">
                    <li>Built responsive web apps using React.js, Node.js, Express.js, and MongoDB</li>
                    <li>Developed RESTful APIs with secure authentication and third-party integrations</li>
                    <li>Deployed on AWS, Vercel, and DigitalOcean cloud infrastructure</li>
                    <li>Managed full project lifecycle from requirements gathering to system deployment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. PROJECTS SECTION */}
        <section id="projects">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Case Studies</span>
              <h2 className="section-title">Selected Work</h2>
            </div>

            <div className="projects-grid">
              {/* Project 1 */}
              <div className="project-cell" id="project-appmosphere">
                <span className="project-icon"><FaGlobe /></span>
                <h3 className="project-title">Appmosphere</h3>
                <p className="project-desc">
                  Full-stack MERN social platform hosted on AWS with real-time messaging via Socket.IO, 
                  authentication, post management, and a follow system.
                </p>
                <div className="project-tech">
                  <span className="tech-chip">React.js</span>
                  <span className="tech-chip">Node.js</span>
                  <span className="tech-chip">Express.js</span>
                  <span className="tech-chip">MongoDB</span>
                  <span className="tech-chip">Socket.IO</span>
                  <span className="tech-chip">JWT</span>
                  <span className="tech-chip">AWS</span>
                </div>
                <div className="project-links">
                  <a href="#" className="project-btn" id="btn-appmosphere-frontend">Frontend &rarr;</a>
                  <a href="#" className="project-btn" id="btn-appmosphere-backend">Backend &rarr;</a>
                </div>
              </div>

              {/* Project 2 */}
              <div className="project-cell" id="project-physio-portal">
                <span className="project-icon"><FaHeartPulse /></span>
                <h3 className="project-title">Physio Portal</h3>
                <p className="project-desc">
                  MERN stack system for physiotherapy clinics featuring appointment scheduling, 
                  patient health record storage, and calendar sync. AWS deployed.
                </p>
                <div className="project-tech">
                  <span className="tech-chip">React.js</span>
                  <span className="tech-chip">Node.js</span>
                  <span className="tech-chip">Express.js</span>
                  <span className="tech-chip">MongoDB</span>
                  <span className="tech-chip">AWS</span>
                </div>
                <div className="project-links">
                  <a href="#" className="project-btn" id="btn-physio-frontend">Frontend &rarr;</a>
                  <a href="#" className="project-btn" id="btn-physio-backend">Backend &rarr;</a>
                </div>
              </div>

              {/* Project 3 */}
              <div className="project-cell" id="project-plant-disease">
                <span className="project-icon"><FaLeaf /></span>
                <h3 className="project-title">Plant Leaf Disease Detection</h3>
                <p className="project-desc">
                  Deep learning CNN model (PyTorch) for real-time plant disease classification 
                  deployed as a Flask REST API.
                </p>
                <div className="project-tech">
                  <span className="tech-chip">Python</span>
                  <span className="tech-chip">PyTorch</span>
                  <span className="tech-chip">CNN</span>
                  <span className="tech-chip">Flask</span>
                  <span className="tech-chip">REST API</span>
                </div>
                <div className="project-links">
                  <a href="#" className="project-btn" id="btn-plant-github">GitHub &rarr;</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. EDUCATION SECTION */}
        <section id="education">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Academics</span>
              <h2 className="section-title">Education</h2>
            </div>

            <div className="education-timeline">
              {/* Education 1 */}
              <div className="edu-row" id="edu-1">
                <div className="edu-content">
                  <h3 className="edu-degree">M.Sc. Computer Science</h3>
                  <span className="edu-school">MES College Marampally, Aluva | Mahatma Gandhi University</span>
                </div>
                <div className="edu-meta">
                  <span className="edu-year">2023 – 2025</span>
                  <span className="edu-result">CGPA: 3.54 / 5.0</span>
                </div>
              </div>

              {/* Education 2 */}
              <div className="edu-row" id="edu-2">
                <div className="edu-content">
                  <h3 className="edu-degree">B.Sc. Chemistry — Petrochemical</h3>
                  <span className="edu-school">Al-Ameen College, Aluva | Mahatma Gandhi University</span>
                </div>
                <div className="edu-meta">
                  <span className="edu-year">2020 – 2023</span>
                  <span className="edu-result">🏆 4th University Rank</span>
                </div>
              </div>

              {/* Education 3 */}
              <div className="edu-row" id="edu-3">
                <div className="edu-content">
                  <h3 className="edu-degree">Higher Secondary — Computer Science</h3>
                  <span className="edu-school">Holy Ghost GHSS, Aluva | Kerala HSE Board</span>
                </div>
                <div className="edu-meta">
                  <span className="edu-year">2018 – 2020</span>
                  <span className="edu-result">Marks: 87.5%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. ACHIEVEMENTS SECTION */}
        <section id="achievements">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Honors</span>
              <h2 className="section-title">Honors</h2>
            </div>

            <div className="achievements-container">
              <div className="editorial-cell trophy-cell" id="achievement-trophy">
                <div className="trophy-icon"><FaTrophy /></div>
                <div className="achievement-details">
                  <h3>4th University Rank</h3>
                  <p className="company-name">Mahatma Gandhi University (2023)</p>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>
                    Awarded for academic excellence in B.Sc. Chemistry (Petrochemical) across 
                    all affiliated colleges of the university.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. CONTACT SECTION */}
        <section id="contact">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Connect</span>
              <h2 className="section-title">Get In Touch</h2>
            </div>

            <div className="contact-container">
              <p className="contact-cta">
                "Let's build something extraordinary together."
              </p>

              <div className="contact-grid">
                <a href="mailto:fathimathu29@gmail.com" className="contact-cell" id="contact-email">
                  <span className="contact-icon"><FaEnvelope /></span>
                  <div>
                    <div className="contact-info-label">EMAIL</div>
                    <div className="contact-info-value">fathimathu29@gmail.com</div>
                  </div>
                </a>

                <a href="https://linkedin.com/in/fathimathu-safna" target="_blank" rel="noopener noreferrer" className="contact-cell" id="contact-linkedin">
                  <span className="contact-icon"><FaLinkedin /></span>
                  <div>
                    <div className="contact-info-label">LINKEDIN</div>
                    <div className="contact-info-value">linkedin.com/in/fathimathu-safna</div>
                  </div>
                </a>

                <a href="https://github.com/FathimathuSafna" target="_blank" rel="noopener noreferrer" className="contact-cell" id="contact-github">
                  <span className="contact-icon"><FaGithub /></span>
                  <div>
                    <div className="contact-info-label">GITHUB</div>
                    <div className="contact-info-value">github.com/FathimathuSafna</div>
                  </div>
                </a>

                <div className="contact-cell" id="contact-location">
                  <span className="contact-icon"><FaLocationDot /></span>
                  <div>
                    <div className="contact-info-label">LOCATION</div>
                    <div className="contact-info-value">Ernakulam, Kerala</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <footer className="footer" id="main-footer">
        <div className="container">
          <p className="footer-text">
            Crafted with gravity-defying code by Fathimathu Safna C S ✦ 2025
          </p>
        </div>
      </footer>
    </>
  );
}
