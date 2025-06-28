# GitHub Portfolio

A clean, modern portfolio that showcases my GitHub repositories with filtering capabilities and a responsive design.

## Features

- **GitHub API Integration**: Automatically fetches and displays repositories from GitHub
- **Project Filtering**: Filter projects by technology (React, Next.js, Jekyll, etc.)
- **Best Projects**: Highlight important projects at the top of the list
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: Toggle between light and dark themes with automatic system preference detection
- **Live Demo Links**: Direct links to deployed project demos
- **Sticky Footer**: Footer stays at the bottom of the page regardless of content amount

## Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation
- **React**: UI component library
- **GitHub REST API v3**: For fetching repository data
- **CSS-in-JSX**: Styled components using Next.js built-in styling
- **localStorage**: For persisting user theme preferences

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/juanpablodiaz/repos.git
   cd repos
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

You can customize the portfolio by modifying the following variables in `pages/index.js`:

- `GITHUB_USERNAME`: Your GitHub username
- `HIDDEN_PROJECTS`: Array of repository names to hide from the portfolio
- `BEST_PROJECTS`: Array of repository names to feature at the top (in order of appearance)

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run export`: Export as static HTML
- `npm run clean`: Clean build directories and reinstall dependencies
- `npm run format`: Format code with Prettier
- `npm run format:check`: Check code formatting without making changes
- `npm run test`: Run all tests
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Run tests with coverage report

## Deployment

This project can be easily deployed to Vercel, Netlify, or GitHub Pages.

### Vercel (Recommended)

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com).

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

Juan Pablo Diaz - [GitHub](https://github.com/juanpablodiaz)
