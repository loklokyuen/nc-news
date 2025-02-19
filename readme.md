# News and Discussion

A web platform for reading articles, participating in discussions through comments, and engaging with content via voting. This is the frontend portion of the News and Discussion platform. The backend API repository can be found [here](https://github.com/loklokyuen/news-website-project).

## Features
- Retrieve, sort, and filter news articles by topic
- Vote on articles and comments
- Post and delete comments
- Display articles by specific topics
- RESTful endpoints with JSON responses

## Usage

The hosted version of this platform is available [here](https://news-and-discussion.netlify.app/articles). This frontend interacts with the [News and Discussion API](https://github.com/loklokyuen/news-website-project) to fetch articles, comments, and voting data.

## Tech Stack
### Frontend Technologies
- **Framework**: React (v19)
- **Build Tool**: Vite (v6)
- **Routing**: React Router (v7)
- **Styling**: CSS, Tailwind CSS (v4)
- **HTTP Client**: Axios
- **Deployment**: Netlify

## Local Development

### Pre-requisites
Before development, make sure you have the following installed:
- Node.js (v20.15.1 or higher)
- npm (10.8.2 or higher)
- Git

### Installation

1. Clone the repository
```
git clone https://github.com/loklokyuen/nc-news.git && cd nc-news
```
2. Install dependencies
```
npm install
```
3. Start the project locally
```
npm run dev
```
4. The development server runs on localhost:5173 by default. The terminal will display the exact URL after running `npm run dev`. Follow the link to view your changes in real-time.

## Production Deployment
This project is deployed using [Netlify](https://www.netlify.com/). To deploy your own version, connect the repository to Netlify and run the build command:
```
npm run build
```
The site will be built and deployed automatically on every push to the main branch.

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)