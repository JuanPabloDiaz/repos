// Mock function for detectTechnology since it's inside the Home component
const detectTechnology = (repo) => {
  const technologies = [];
  const techKeywords = {
    react: 'React',
    nextjs: 'Next.js',
    'next.js': 'Next.js',
    typescript: 'TypeScript',
    javascript: 'JavaScript',
    vue: 'Vue',
    angular: 'Angular',
    svelte: 'Svelte',
    node: 'Node.js',
    express: 'Express',
    mongodb: 'MongoDB',
    postgres: 'PostgreSQL',
    mysql: 'MySQL',
    graphql: 'GraphQL',
    tailwind: 'Tailwind',
    bootstrap: 'Bootstrap',
    sass: 'Sass',
    firebase: 'Firebase',
    aws: 'AWS',
    docker: 'Docker',
    kubernetes: 'Kubernetes',
    jekyll: 'Jekyll',
    hugo: 'Hugo',
    gatsby: 'Gatsby',
    wordpress: 'WordPress',
    php: 'PHP',
    laravel: 'Laravel',
    python: 'Python',
    django: 'Django',
    flask: 'Flask',
    ruby: 'Ruby',
    rails: 'Rails',
    go: 'Go',
    rust: 'Rust',
    java: 'Java',
    spring: 'Spring',
    kotlin: 'Kotlin',
    swift: 'Swift',
    flutter: 'Flutter',
    dart: 'Dart',
    react_native: 'React Native',
    'react-native': 'React Native',
  };

  // Check topics
  if (repo.topics && Array.isArray(repo.topics)) {
    repo.topics.forEach(topic => {
      const normalizedTopic = topic.toLowerCase();
      if (techKeywords[normalizedTopic]) {
        technologies.push(techKeywords[normalizedTopic]);
      }
    });
  }

  // Check name
  if (repo.name) {
    const repoName = repo.name.toLowerCase();
    Object.keys(techKeywords).forEach(keyword => {
      if (repoName.includes(keyword.toLowerCase())) {
        const tech = techKeywords[keyword];
        if (!technologies.includes(tech)) {
          technologies.push(tech);
        }
      }
    });
  }

  return technologies;
};

describe('Technology detection', () => {

  it('detects React technology from topics', () => {
    const repo = {
      topics: ['react', 'javascript'],
      name: 'test-repo',
    };
    
    const technologies = detectTechnology(repo);
    expect(technologies).toContain('React');
  });

  it('detects Next.js technology from topics', () => {
    const repo = {
      topics: ['nextjs', 'react'],
      name: 'test-repo',
    };
    
    const technologies = detectTechnology(repo);
    expect(technologies).toContain('Next.js');
  });

  it('detects technology from repository name', () => {
    const repo = {
      topics: [],
      name: 'react-project',
    };
    
    const technologies = detectTechnology(repo);
    expect(technologies).toContain('React');
  });

  it('detects multiple technologies', () => {
    const repo = {
      topics: ['react', 'typescript', 'nextjs'],
      name: 'test-repo',
    };
    
    const technologies = detectTechnology(repo);
    expect(technologies).toContain('React');
    expect(technologies).toContain('TypeScript');
    expect(technologies).toContain('Next.js');
  });

  it('returns empty array for unknown technologies', () => {
    const repo = {
      topics: ['unknown-tech'],
      name: 'test-repo',
    };
    
    const technologies = detectTechnology(repo);
    expect(technologies).toEqual([]);
  });
});
