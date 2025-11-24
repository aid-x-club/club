import React, { useEffect, useState } from 'react';
import './CodingBackground.css';

const CodingBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      const codeSnippets = [
        'function()', 'const', 'let', 'var', 'if()', 'for()', 'while()',
        'return', 'class', 'import', 'export', 'async', 'await', '=>',
        'useState', 'useEffect', 'React', 'Component', 'props', 'state',
        'git add', 'git commit', 'git push', 'npm install', 'npm run',
        'fetch()', 'axios', 'Promise', '.then()', '.catch()',
        'array.map()', 'array.filter()', 'array.reduce()', 'JSON',
        'console.log', 'document.getElementById', 'addEventListener',
        'localStorage', 'sessionStorage', 'setTimeout', 'setInterval',
        '<div>', '<span>', '<p>', '<h1>', '<button>', '<input>',
        'color:', 'background:', 'margin:', 'padding:', 'display:',
        'flex:', 'grid:', 'position:', 'transform:', 'transition:',
        'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE',
        'CREATE TABLE', 'PRIMARY KEY', 'FOREIGN KEY', 'JOIN', 'INNER',
        'python', 'java', 'javascript', 'typescript', 'react', 'node',
        'html', 'css', 'sql', 'mongodb', 'express', 'django'
      ];

      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          fontSize: Math.random() * 14 + 10,
          speed: Math.random() * 20 + 10,
          delay: Math.random() * 5,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="coding-background">
      <div className="code-particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="code-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              fontSize: `${particle.fontSize}px`,
              animationDuration: `${particle.speed}s`,
              animationDelay: `${particle.delay}s`,
              opacity: particle.opacity
            }}
          >
            {particle.text}
          </div>
        ))}
      </div>
      
      <div className="binary-rain">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="binary-column"
            style={{
              left: `${i * 5}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          >
            {[...Array(15)].map((_, j) => (
              <div
                key={j}
                className="binary-digit"
                style={{
                  animationDelay: `${j * 0.1}s`
                }}
              >
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="code-lines">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="code-line"
            style={{
              top: `${i * 12.5}%`,
              animationDelay: `${i * 0.5}s`,
              width: `${Math.random() * 60 + 20}%`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CodingBackground;
