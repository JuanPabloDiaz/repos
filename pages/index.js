import { useState, useEffect } from 'react';
import Head from 'next/head';

const GITHUB_USERNAME = 'juanpablodiaz';
// Add projects to hide from the portfolio
const HIDDEN_PROJECTS = ['unlighthouse', 'googleClone', 'n8n-backup'];
// Featured projects to show at the top (in order of appearance)
const FEATURED_PROJECTS = ['colombia', '3D', 'jpdiaz', 'fit'];

export default function Home() {
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const technologies = ['React', 'Next.js', 'Jekyll', 'HTML', 'JavaScript', 'Astro', 'TypeScript', 'TailwindCSS', 'CSS'];

  useEffect(() => {
    fetchRepos();
    
    // Check for user preference in localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark-mode');
    } else if (savedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark-mode');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark-mode');
    }
  }, []);

  useEffect(() => {
    filterRepos();
  }, [repos, selectedTechs]);
  
  // Effect to handle dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const fetchRepos = async () => {
    try {
      setLoading(true);
      let allRepos = [];
      let page = 1;
      let hasMorePages = true;
      
      // Fetch all pages of repositories
      while (hasMorePages && page <= 10) { // Limit to 10 pages to prevent infinite loops
        console.log(`Fetching page ${page}...`);
        
        // Use a timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&timestamp=${timestamp}`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        );
        
        // Check for rate limiting or other API issues
        if (!response.ok) {
          console.error(`GitHub API error: ${response.status}`);
          console.error(await response.text());
          break;
        }
        
        const data = await response.json();
        console.log(`Page ${page} returned ${data.length} repositories`);
        
        if (data.length === 0) {
          hasMorePages = false;
        } else {
          allRepos = [...allRepos, ...data];
          page++;
        }
      }
      
      console.log(`Total repositories fetched: ${allRepos.length}`);
      
      // Log some sample data to verify what we're getting
      if (allRepos.length > 0) {
        console.log('Sample repository data:', allRepos[0]);
      }
      
      // Count different types of repos for debugging
      const forkedRepos = allRepos.filter(repo => repo.fork).length;
      const privateRepos = allRepos.filter(repo => repo.private).length;
      const hiddenRepos = allRepos.filter(repo => HIDDEN_PROJECTS.includes(repo.name)).length;
      
      console.log(`Repositories breakdown:`);
      console.log(`- Total: ${allRepos.length}`);
      console.log(`- Forked: ${forkedRepos}`);
      console.log(`- Private: ${privateRepos}`);
      console.log(`- Hidden: ${hiddenRepos}`);
      
      // Filter out forks, private repos, and hidden projects
      const filteredRepos = allRepos.filter(repo => 
        !repo.fork && 
        !repo.private && 
        !HIDDEN_PROJECTS.includes(repo.name)
      );
      
      console.log(`After filtering: ${filteredRepos.length} repositories remain`);
      
      // First sort by creation date (newest first)
      const dateRepos = filteredRepos.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      
      // Then prioritize featured projects
      const sortedRepos = dateRepos.sort((a, b) => {
        // If a is featured but b is not, a comes first
        if (FEATURED_PROJECTS.includes(a.name) && !FEATURED_PROJECTS.includes(b.name)) {
          return -1;
        }
        // If b is featured but a is not, b comes first
        if (!FEATURED_PROJECTS.includes(a.name) && FEATURED_PROJECTS.includes(b.name)) {
          return 1;
        }
        // If both are featured, sort by their position in the FEATURED_PROJECTS array
        if (FEATURED_PROJECTS.includes(a.name) && FEATURED_PROJECTS.includes(b.name)) {
          return FEATURED_PROJECTS.indexOf(a.name) - FEATURED_PROJECTS.indexOf(b.name);
        }
        // Otherwise maintain the date sort order
        return 0;
      });
      
      setRepos(sortedRepos);
      console.log(`Final repositories displayed: ${sortedRepos.length}`);
    } catch (error) {
      console.error('Error fetching repos:', error);
    } finally {
      setLoading(false);
    }
  };

  const detectTechnology = (repo) => {
    const detectedTechs = [];
    const language = repo.language?.toLowerCase() || '';
    const name = repo.name.toLowerCase();
    const description = (repo.description || '').toLowerCase();
    const topics = repo.topics || [];

    // Detect technologies based on various indicators
    if (language === 'javascript' || topics.includes('react') || topics.includes('reactjs') || description.includes('react')) {
      detectedTechs.push('React');
    }
    
    if (topics.includes('nextjs') || topics.includes('next') || name.includes('next') || description.includes('next.js') || description.includes('nextjs')) {
      detectedTechs.push('Next.js');
    }
    
    if (language === 'ruby' || topics.includes('jekyll') || name.includes('jekyll') || description.includes('jekyll')) {
      detectedTechs.push('Jekyll');
    }
    
    if (language === 'html' || topics.includes('html') || description.includes('html')) {
      detectedTechs.push('HTML');
    }

    if (language === 'javascript' || topics.includes('javascript') || name.includes('javascript') || description.includes('javascript')) {
      detectedTechs.push('JavaScript');
    }
    
    if (language === 'astro' || topics.includes('astro') || name.includes('astro') || description.includes('astro')) {
      detectedTechs.push('Astro');
    }

    if (language === 'typescript' || topics.includes('typescript') || name.includes('typescript') || description.includes('typescript')) {
      detectedTechs.push('TypeScript');
    }

    if (language === 'tailwindcss' || topics.includes('tailwindcss') || name.includes('tailwindcss') || description.includes('tailwindcss')) {
      detectedTechs.push('TailwindCSS');
    }

    if (language === 'css' || topics.includes('css') || name.includes('css') || description.includes('css')) {
      detectedTechs.push('CSS');
    }

    return detectedTechs;
  };

  const filterRepos = () => {
    if (selectedTechs.length === 0) {
      setFilteredRepos(repos);
      return;
    }

    const filtered = repos.filter(repo => {
      const repoTechs = detectTechnology(repo);
      return selectedTechs.some(tech => repoTechs.includes(tech));
    });

    setFilteredRepos(filtered);
  };

  const toggleTechnology = (tech) => {
    setSelectedTechs(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  if (loading) {
    return (
      <div className="container">
        <Head>
          <title>GitHub Portfolio</title>
          <meta name="description" content="My GitHub projects portfolio" />
        </Head>
        <div className="loading">Loading repositories...</div>
        <style jsx>{`
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .loading {
            text-align: center;
            padding: 4rem;
            color: #666;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`page-wrapper ${darkMode ? 'dark-mode' : ''}`}>
      <Head>
        <title>GitHub Portfolio</title>
        <meta name="description" content="My GitHub projects portfolio" />
      </Head>

      <div className="content-container">
        <header className="header">
          <div className="header-top">
            <h1>Juan Diaz's Projects</h1>
            <button 
              className={`theme-toggle ${darkMode ? 'dark' : 'light'}`} 
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <p>A collection of my GitHub repositories <span className="project-count">({filteredRepos.length} projects)</span></p>
        </header>

        <div className="filters">
          {technologies.map(tech => (
            <button
              key={tech}
              className={`filter-btn ${selectedTechs.includes(tech) ? 'active' : ''}`}
              onClick={() => toggleTechnology(tech)}
            >
              {tech}
            </button>
          ))}
          {selectedTechs.length > 0 && (
            <button 
              className="clear-btn"
              onClick={() => setSelectedTechs([])}
            >
              Clear All
            </button>
          )}
        </div>

        <div className="repos-grid">
          {filteredRepos.map(repo => {
            const techs = detectTechnology(repo);
            const isFeatured = FEATURED_PROJECTS.includes(repo.name);
            return (
              <div key={repo.id} className={`repo-card ${isFeatured ? 'featured' : ''}`}>
                {isFeatured && <div className="featured-badge">Featured</div>}
                <h3 className="repo-title">
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    {repo.name}
                  </a>
                </h3>
                {repo.description && (
                  <p className="repo-description">{repo.description}</p>
                )}
                <div className="repo-meta">
                  {repo.language && (
                    <span className="language">{repo.language}</span>
                  )}
                  {techs.length > 0 && (
                    <div className="tech-tags">
                      {techs.map(tech => (
                        <span key={tech} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  )}
                  <span className="stars">⭐ {repo.stargazers_count}</span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredRepos.length === 0 && (
          <div className="no-results">
            No repositories found matching the selected technologies.
          </div>
        )}
      </div>
      
      <footer className="footer">
        <a href="https://www.linkedin.com/in/1diazdev/" target="_blank" rel="noopener noreferrer">
          Developed by Juan Diaz
        </a>
      </footer>

      <style jsx>{`
        .page-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          color: #333;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        
        .page-wrapper.dark-mode {
          color: #e1e5e9;
          background-color: #121212;
        }
        
        .content-container {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          flex: 1;
        }

        .header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .header-top {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin-bottom: 0.5rem;
        }

        .header h1 {
          font-size: 2.5rem;
          margin: 0;
          font-weight: 600;
        }
        
        .theme-toggle {
          position: absolute;
          right: 0;
          background: transparent;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .header p {
          font-size: 1.1rem;
          color: #666;
          margin: 0;
        }
        
        .project-count {
          font-size: 0.9rem;
          color: #0366d6;
          font-weight: 500;
        }

        .filters {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          border: 2px solid #e1e5e9;
          background: white;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
        }
        
        .dark-mode .filter-btn {
          background: #2d2d2d;
          border-color: #444;
          color: #e1e5e9;
        }
        
        .dark-mode .filter-btn:hover {
          border-color: #58a6ff;
          box-shadow: 0 0 0 1px rgba(88, 166, 255, 0.4);
        }
        
        .dark-mode .filter-btn.active {
          background: #1f6feb;
          color: white;
          border-color: #58a6ff;
          box-shadow: 0 0 0 2px rgba(88, 166, 255, 0.4);
        }

        .filter-btn:hover {
          border-color: #0366d6;
        }

        .filter-btn.active {
          background: #0366d6;
          color: white;
          border-color: #0366d6;
        }

        .clear-btn {
          padding: 0.5rem 1rem;
          border: none;
          background: #f1f1f1;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.9rem;
          color: #666;
        }

        .repos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .repo-card {
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          padding: 1.5rem;
          background-color: white !important;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease, border-color 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .dark-mode .repo-card {
          background-color: #1e1e1e !important;
          border-color: #333;
        }

        .repo-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .repo-card.featured {
          border-color: #0366d6;
          border-width: 2px;
        }

        .featured-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: #0366d6;
          color: white;
          padding: 0.2rem 0.5rem;
          font-size: 0.7rem;
          border-bottom-left-radius: 8px;
        }

        .repo-title {
          margin-top: 0;
          margin-bottom: 0.5rem;
          font-size: 1.2rem;
        }

        .repo-title a {
          color: #0366d6;
          text-decoration: none;
        }

        .repo-title a:hover {
          text-decoration: underline;
        }

        .repo-description {
          margin: 0.5rem 0 1rem;
          color: #586069;
          font-size: 0.9rem;
        }
        
        .dark-mode .repo-description {
          color: #a0a0a0;
        }

        .repo-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.8rem;
          color: #586069;
          margin-top: auto;
        }

        .language {
          display: inline-block;
        }

        .tech-tags {
          display: flex;
          gap: 0.25rem;
          flex-wrap: wrap;
        }

        .tech-tag {
          background: #f1f8ff;
          color: #0366d6;
          padding: 0.2rem 0.5rem;
          border-radius: 12px;
          font-size: 0.7rem;
        }
        
        .dark-mode .tech-tag {
          background: #182635;
          color: #58a6ff;
        }

        .stars {
          color: #586069;
          margin-left: auto;
        }

        .no-results {
          text-align: center;
          padding: 3rem;
          color: #586069;
          font-style: italic;
        }

        .footer {
          padding: 1rem 0;
          text-align: center;
          border-top: 1px solid #e1e5e9;
          transition: border-color 0.3s ease;
          width: 100%;
          margin-top: auto;
        }
        
        .dark-mode .footer {
          border-color: #333;
        }

        .footer a {
          color: #0366d6;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s ease;
        }

        .footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .content-container {
            padding: 1rem;
          }

          .header h1 {
            font-size: 2rem;
          }

          .repos-grid {
            grid-template-columns: 1fr;
          }

          .filters {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
