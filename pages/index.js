
import { useState, useEffect } from 'react';
import Head from 'next/head';

const GITHUB_USERNAME = 'juanpablodiaz';

export default function Home() {
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [loading, setLoading] = useState(true);

  const technologies = ['React', 'Next.js', 'Jekyll', 'HTML', 'Astro', 'TypeScript', 'TailwindCSS'];

  useEffect(() => {
    fetchRepos();
  }, []);

  useEffect(() => {
    filterRepos();
  }, [repos, selectedTechs]);

  const fetchRepos = async () => {
    try {
      const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
      const data = await response.json();
      
      // Filter out forks and get only public repos
      const publicRepos = data.filter(repo => !repo.fork && !repo.private);
      setRepos(publicRepos);
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
    
    if (language === 'astro' || topics.includes('astro') || name.includes('astro') || description.includes('astro')) {
      detectedTechs.push('Astro');
    }

    if (language === 'typescript' || topics.includes('typescript') || name.includes('typescript') || description.includes('typescript')) {
      detectedTechs.push('TypeScript');
    }

    if (language === 'tailwindcss' || topics.includes('tailwindcss') || name.includes('tailwindcss') || description.includes('tailwindcss')) {
      detectedTechs.push('TailwindCSS');
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
    <div className="container">
      <Head>
        <title>GitHub Portfolio</title>
        <meta name="description" content="My GitHub projects portfolio" />
      </Head>

      <header className="header">
        <h1>My Projects</h1>
        <p>A collection of my GitHub repositories</p>
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
          return (
            <div key={repo.id} className="repo-card">
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

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
        }

        .header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .header h1 {
          font-size: 2.5rem;
          margin: 0 0 0.5rem 0;
          font-weight: 600;
        }

        .header p {
          font-size: 1.1rem;
          color: #666;
          margin: 0;
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
          border: 2px solid #d73a49;
          background: white;
          color: #d73a49;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
        }

        .clear-btn:hover {
          background: #d73a49;
          color: white;
        }

        .repos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .repo-card {
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          padding: 1.5rem;
          background: white;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .repo-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .repo-title {
          margin: 0 0 0.5rem 0;
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
          color: #586069;
          margin: 0 0 1rem 0;
          font-size: 0.9rem;
        }

        .repo-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          font-size: 0.8rem;
        }

        .language {
          color: #586069;
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

        @media (max-width: 768px) {
          .container {
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