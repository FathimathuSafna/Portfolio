import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const categories = ['languages', 'frontend', 'backend', 'databases', 'testing', 'tools', 'practices'];

const skillsData = {
  languages: [
    { name: "JavaScript ES6+", level: 95, context: "Primary language, 3+ years in production at Inspite" },
    { name: "TypeScript", level: 90, context: "Used in NestJS backend and typed React frontends" },
    { name: "Python", level: 85, context: "Implemented CNN image models & custom server automation" },
    { name: "Java", level: 80, context: "Strong foundations in OOP and data structures" },
    { name: "C", level: 75, context: "Academic memory management and low-level code" },
    { name: "C++", level: 75, context: "Algorithm optimization and structural programming" }
  ],
  frontend: [
    { name: "React.js", level: 95, context: "Main SPA framework, built 5+ responsive dashboard portals" },
    { name: "Angular", level: 80, context: "Corporate admin panels and strict MVC layouts" },
    { name: "HTML5", level: 95, context: "Semantic web markup, SEO elements, and clean templates" },
    { name: "CSS3", level: 95, context: "Advanced layouts (Grid/Flexbox) and custom theme engines" },
    { name: "Bootstrap", level: 90, context: "Grid styling, custom utility overrides, rapid mockups" },
    { name: "Material UI", level: 90, context: "Used extensively for consistent MERN platform styling" },
    { name: "Responsive Design", level: 95, context: "Mobile-first, dynamic media queries, and fluid assets" }
  ],
  backend: [
    { name: "Node.js", level: 90, context: "Core asynchronous runtime for building microservices" },
    { name: "Express.js", level: 95, context: "Primary REST router, secure middlewares & request handling" },
    { name: "NestJS", level: 85, context: "Enterprise TypeScript architecture, modules & injection" },
    { name: "REST APIs", level: 95, context: "Designed CRUD endpoints, optimized queries, pagination" },
    { name: "JWT Auth", level: 90, context: "Role-based stateless access, cookie & header parsing" },
    { name: "Socket.IO", level: 85, context: "Built real-time private chat channels in Appmosphere" },
    { name: "API Integration", level: 95, context: "Connected Razorpay, SMS Gateways, Firebase Admin SDK" }
  ],
  databases: [
    { name: "MongoDB", level: 90, context: "Document-oriented modeling, indexes & schema creation" },
    { name: "Mongoose", level: 90, context: "Strict typing wrappers, middleware, ref hooks" },
    { name: "MySQL", level: 85, context: "Triggers, complex JOINs, transactional consistency" },
    { name: "Firebase", level: 80, context: "Used for firestore messaging, dynamic assets upload" }
  ],
  testing: [
    { name: "Jest", level: 85, context: "Unit tests for helper libs, snapshot rendering tests" },
    { name: "Postman", level: 95, context: "Endpoint regression suites, pre-request auth scripts" },
    { name: "API Testing", level: 90, context: "Testing rate limits, validation boundaries, edge headers" },
    { name: "Debugging", level: 95, context: "Inspectors, stack trace analysis, memory profile audits" },
    { name: "Bug Fixing", level: 95, context: "Identified and solved production concurrency leaks" }
  ],
  tools: [
    { name: "AWS", level: 85, context: "EC2 provisioning, S3 asset buckets, IAM policies" },
    { name: "Docker", level: 85, context: "Built multi-stage dev/prod Dockerfiles for MERN stacks" },
    { name: "Git", level: 95, context: "Branching strategies, interactive rebases, stash management" },
    { name: "GitHub", level: 95, context: "PR flows, conflict resolution, collaborative review" },
    { name: "Vercel", level: 90, context: "CI/CD staging configurations for React projects" },
    { name: "DigitalOcean", level: 80, context: "Linux Droplet provisioning, SSH keys configuration" },
    { name: "Nginx", level: 80, context: "Proxy redirects, HTTP/2 config, SSL certs with Let's Encrypt" },
    { name: "Linux", level: 85, context: "Shell scripting, cron automation, file ownerships" }
  ],
  practices: [
    { name: "DSA", level: 85, context: "Strong fundamentals: HashMaps, Trees, Graph traversals" },
    { name: "OOP", level: 90, context: "Polymorphism, abstraction principles, structural separation" },
    { name: "SDLC", level: 90, context: "Waterfall & Agile methodology lifecycles, release stages" },
    { name: "Agile/Scrum", level: 95, context: "Participated in daily standups, Jira sprints planning" },
    { name: "MVC", level: 90, context: "Separating routes, controllers, and db models cleanly" },
    { name: "Code Review", level: 90, context: "Ensuring code clean standards and review protocols" },
    { name: "Version Control", level: 95, context: "Robust repository flows with Git hooks" }
  ]
};

export default function TechTerminal() {
  const [activeCategory, setActiveCategory] = useState('languages');
  const [focusedCategory, setFocusedCategory] = useState('languages');
  
  // Typewriter state
  const [typedCommand, setTypedCommand] = useState('');
  const [typedLines, setTypedLines] = useState([]);
  const [showPromptBottom, setShowPromptBottom] = useState(false);
  const [terminalFocused, setTerminalFocused] = useState(false);

  // Tooltip state
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const terminalRef = useRef(null);
  const screenRef = useRef(null);
  const timelineRef = useRef(null);

  // Handle crossfade and launch typewriter
  const selectCategory = (categoryKey) => {
    if (categoryKey === activeCategory && typedCommand !== '') return;

    // Fade out screen, swap content, fade back in
    gsap.to(screenRef.current, {
      opacity: 0,
      y: 8,
      duration: 0.15,
      ease: 'power1.in',
      onComplete: () => {
        setActiveCategory(categoryKey);
        setFocusedCategory(categoryKey);
        
        // Reset typing states
        setTypedCommand('');
        setTypedLines([]);
        setShowPromptBottom(false);

        gsap.to(screenRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.25,
          ease: 'power2.out'
        });
      }
    });
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    const currentIndex = categories.indexOf(focusedCategory);
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % categories.length;
      setFocusedCategory(categories[nextIndex]);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + categories.length) % categories.length;
      setFocusedCategory(categories[prevIndex]);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      selectCategory(focusedCategory);
    }
  };

  // Typewriter animation trigger
  useEffect(() => {
    // Kill any existing running timeline to avoid collisions
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const currentSkills = skillsData[activeCategory] || [];
    
    // Create new GSAP timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setShowPromptBottom(true);
      }
    });
    timelineRef.current = tl;

    // 1. Initial empty lines set
    setTypedLines(currentSkills.map(s => ({ ...s, visibleText: '', barScale: 0 })));

    // 2. Animate typing of command
    const cmdText = `./${activeCategory}.sh`;
    const cmdObj = { length: 0 };
    
    tl.to(cmdObj, {
      length: cmdText.length,
      duration: Math.max(cmdText.length * 0.03, 0.4),
      ease: 'none',
      onUpdate: () => {
        setTypedCommand(cmdText.slice(0, Math.floor(cmdObj.length)));
      }
    });

    // Small delay after command types (hitting enter)
    tl.to({}, { duration: 0.2 });

    // 3. Animate each skill line typing and filling progress bar sequentially
    currentSkills.forEach((skill, index) => {
      const lineObj = { length: 0 };
      
      // Type out skill name
      tl.to(lineObj, {
        length: skill.name.length,
        duration: Math.max(skill.name.length * 0.02, 0.25),
        ease: 'none',
        onUpdate: () => {
          setTypedLines(prev => {
            const updated = [...prev];
            if (updated[index]) {
              updated[index] = {
                ...updated[index],
                visibleText: skill.name.slice(0, Math.floor(lineObj.length))
              };
            }
            return updated;
          });
        }
      });

      // Fill progress bar (right-to-left animation handled by transform-origin in CSS)
      const barObj = { scale: 0 };
      tl.to(barObj, {
        scale: 1,
        duration: 0.35,
        ease: 'power1.out',
        onUpdate: () => {
          setTypedLines(prev => {
            const updated = [...prev];
            if (updated[index]) {
              updated[index] = {
                ...updated[index],
                barScale: barObj.scale
              };
            }
            return updated;
          });
        }
      });
    });

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [activeCategory]);

  // Tooltip tracking
  const handleMouseMove = (e, skill) => {
    if (!terminalRef.current) return;
    const rect = terminalRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top - 12; // offset upward slightly
    setTooltipPos({ x, y });
    setHoveredSkill(skill);
  };

  const handleMouseLeave = () => {
    setHoveredSkill(null);
  };

  return (
    <section id="skills" className="terminal-section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Technical Toolkit</span>
          <h2 className="section-title">Technology</h2>
        </div>

        {/* Info panel instructing keyboard capability */}
        <div className="terminal-helper">
          <span className="helper-icon">⌨</span> Use <strong>Up/Down arrows</strong> to select categories, <strong>Enter</strong> to run. Click to focus terminal.
        </div>

        {/* Dark Terminal Window */}
        <div 
          className={`terminal-window ${terminalFocused ? 'focused' : ''}`}
          ref={terminalRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onFocus={() => setTerminalFocused(true)}
          onBlur={() => setTerminalFocused(false)}
        >
          {/* Header Bar */}
          <div className="terminal-header">
            <div className="terminal-controls">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <div className="terminal-title">skills.sh</div>
            <div className="terminal-spacer"></div>
          </div>

          {/* Window Body Layout */}
          <div className="terminal-body">
            {/* Left Sidebar (Categories) */}
            <div className="terminal-sidebar">
              {categories.map((cat) => {
                const isActive = cat === activeCategory;
                const isFocused = cat === focusedCategory;
                return (
                  <button
                    key={cat}
                    className={`terminal-tab ${isActive ? 'active' : ''} ${isFocused ? 'focused' : ''}`}
                    onClick={() => selectCategory(cat)}
                  >
                    <span className="tab-marker">
                      {isActive ? '$' : isFocused ? '>' : ' '}
                    </span>
                    <span className="tab-text">{cat}.sh</span>
                  </button>
                );
              })}
            </div>

            {/* Right Screen (Terminal Prompt & Outputs) */}
            <div className="terminal-screen" ref={screenRef}>
              <div className="terminal-screen-wrapper">
                
                {/* Active Command Prompt */}
                <div className="terminal-prompt-line">
                  <span className="prompt-prefix">fs@portfolio:~$</span>{' '}
                  <span className="prompt-cmd">{typedCommand}</span>
                  {typedCommand.length < `./${activeCategory}.sh`.length && (
                    <span className="terminal-cursor blink"></span>
                  )}
                </div>

                {/* Command Outputs (Skills and Bars) */}
                <div className="terminal-outputs">
                  {typedLines.map((skill, index) => {
                    const isFullyTyped = skill.visibleText.length === skill.name.length;
                    return (
                      <div 
                        key={index} 
                        className={`terminal-skill-line ${isFullyTyped ? 'typed' : ''}`}
                        onMouseMove={(e) => handleMouseMove(e, skill)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="skill-content-left">
                          <span className="skill-arrow">&gt;</span>{' '}
                          <span className="skill-name">{skill.visibleText}</span>
                          {!isFullyTyped && skill.visibleText.length > 0 && (
                            <span className="terminal-cursor blink small"></span>
                          )}
                        </div>

                        {/* Proficiency Bar (Animates ScaleX right-to-left) */}
                        {isFullyTyped && (
                          <div className="skill-bar-wrapper">
                            <div className="skill-bar-track">
                              <div 
                                className="skill-bar-fill" 
                                style={{ 
                                  width: `${skill.level}%`,
                                  transform: `scaleX(${skill.barScale})` 
                                }}
                              />
                            </div>
                            <span className="skill-percent">
                              {Math.round(skill.level * skill.barScale)}%
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Final Blinking Prompt Line */}
                {showPromptBottom && (
                  <div className="terminal-prompt-line bottom">
                    <span className="prompt-prefix">fs@portfolio:~$</span>{' '}
                    <span className="terminal-cursor blink always"></span>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Mouse Tooltip */}
          {hoveredSkill && (
            <div 
              className="terminal-tooltip"
              style={{
                left: `${tooltipPos.x}px`,
                top: `${tooltipPos.y}px`
              }}
            >
              {hoveredSkill.context}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
