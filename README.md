# Netflix Clone - React Movie App

A fully functional Netflix clone built with React.js, using The Movie Database (TMDB) API to fetch and display movie and TV show data. The app replicates the Netflix browsing experience with a sleek interface styled with Tailwind CSS, allowing users to explore popular, trending, and top-rated content with an immersive viewing experience.


## ✨ Features

- 🎯 **Netflix-Style Interface**: Authentic Netflix browsing experience with horizontal scrolling movie rows
- 🎥 **Trailer Integration**: Watch trailers directly from movie details pages
- 🔍 **Dynamic Search**: Real-time search functionality with live results as you type
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices using Tailwind CSS
- 🎭 **Movie Categories**: Browse different content categories:
  - Trending Now (Popular Movies)
  - Critics' Choice (Top Rated)
  - Coming Soon (Upcoming)
  - Now Playing (In Theaters)
- 📊 **Detailed Information**: Comprehensive movie data including ratings, synopsis, release dates, and cast

## 🛠️ Tech Stack

- **Frontend**: React.js 
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **API**: The Movie Database (TMDB)

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ashifck07/netflix-clone.git
   cd netflix-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and add your TMDB API key:
   ```env
   REACT_APP_TMDB_API_KEY=your_tmdb_api_key_here
   ```
   
   To get your API key:
   - Visit [The Movie Database (TMDB)](https://www.themoviedb.org/)
   - Create an account and go to Settings > API
   - Generate your API key

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173/` to view the app

```

## 🎬 API Integration

This app uses [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api) to fetch:

- Popular movies
- Top-rated movies
- Upcoming movies
- Now playing movies
- Movie details and cast information
- Movie trailers and videos
- Search results

### Key API Endpoints Used:
- `/movie/popular` - Popular movies
- `/movie/top_rated` - Top rated movies
- `/movie/upcoming` - Upcoming movies
- `/movie/now_playing` - Now playing movies
- `/movie/{movie_id}` - Movie details
- `/search/movie` - Search movies

## 🎨 Styling

The app is styled with **Tailwind CSS** for:
- Responsive design across all devices
- Netflix-inspired dark theme
- Smooth animations and transitions
- Grid and flexbox layouts
- Custom component styling

## 📱 Responsive Design

The app is fully responsive and optimized for:
- **Desktop** (1024px and above)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)
