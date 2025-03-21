import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Add scan line effect to the terminal
    const terminal = terminalRef.current;
    if (terminal) {
      // Import VT323 font
      const fontLink = document.createElement('link');
      fontLink.href = 'https://fonts.googleapis.com/css2?family=VT323&display=swap';
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
      
      // Add boot-up sequence sound (optional)
      const playBootSound = () => {
        const audio = new Audio();
        audio.src = 'https://freesound.org/data/previews/80/80921_271220-lq.mp3';
        audio.volume = 0.2;
        audio.play().catch(e => console.log('Audio autoplay prevented:', e));
      };
      
      // Uncomment to enable boot sound
      playBootSound();
      
      // Set animation delays for post previews
      const postElements = document.querySelectorAll('.post-preview');
      postElements.forEach((el, index) => {
        (el as HTMLElement).style.setProperty('--index', index.toString());
      });
    }
    
    // Typewriter effect for intro text
    const introText = document.querySelector('.intro-text');
    if (introText) {
      const text = introText.textContent || '';
      introText.textContent = '';
      
      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          introText.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 50);
        }
      };
      
      typeWriter();
    }
  }, []);

  // Command execution simulation
  const simulateCommand = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = event.currentTarget;
    const commandText = target.getAttribute('data-command');
    const commandDisplay = document.querySelector('.command-display');
    
    if (commandDisplay && commandText) {
      commandDisplay.textContent = `> ${commandText}`;
      commandDisplay.classList.add('typing');
      
      // Reset after animation
      setTimeout(() => {
        commandDisplay.classList.remove('typing');
      }, 1000);
    }
  };

  return (
    <div className="terminal-container">
      <div className="terminal" ref={terminalRef}>
        <header>
          <h1>Roy::Terminal <span className="blink">_</span></h1>
          <p className="intro-text">Roy's engineering insights and life musings</p>
          <div className="command-display"></div>
        </header>
        
        <nav>
          <span className="command-prompt">roy@terminal:~$</span> 
          <Link 
            to="/" 
            className="command" 
            data-command="cd /home"
            onClick={simulateCommand}
          >
            home
          </Link> | 
          <Link 
            to="/posts" 
            className="command" 
            data-command="cd /posts"
            onClick={simulateCommand}
          >
            all-posts
          </Link> | 
          <Link 
            to="/about" 
            className="command" 
            data-command="cd /about"
            onClick={simulateCommand}
          >
            about
          </Link> | 
          <Link 
            to="/projects" 
            className="command" 
            data-command="cd /projects"
            onClick={simulateCommand}
          >
            projects
          </Link>
        </nav>
        
        <main>
          {children}
        </main>
        
        <footer>
          <p>[EOF] &copy; {new Date().getFullYear()} Roy Ayoola | 
            <Link to="/rss" className="text-accent hover:underline mx-1">rss</Link> | 
            <a 
              href="https://github.com/yourusername" 
              className="text-accent hover:underline mx-1" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              github
            </a>
          </p>
          <div className="system-stats">
            <span>MEM: {Math.floor(Math.random() * 512) + 256}MB</span> | 
            <span>CPU: {Math.floor(Math.random() * 50) + 10}%</span> | 
            <span>UPTIME: {Math.floor(Math.random() * 1000) + 100}h</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;