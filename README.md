# English Teacher Forum Website

A professional, responsive website for the English Teachers Forum - Bharath (ETF), an educational organization dedicated to promoting solidarity and professional development among English teachers across India.

## 🚀 Live Demo

[View Live Website](https://your-github-username.github.io/english-teacher-forum)

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [File Structure](#file-structure)
- [Installation](#installation)
- [Deployment](#deployment)
- [Page Hierarchy](#page-hierarchy)
- [Usage](#usage)
- [Contributing](#contributing)

## 📖 About

The English Teachers Forum - Bharath (ETF) was founded in 2006 by Prof. V. Prakasam and Dr. S.D. Subba Reddy. This website serves as the digital presence for the organization, providing information about conferences, training programs, resources, and more for English educators across India.

## ✨ Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Theme Toggle**: User preference with localStorage persistence
- **Single Page Application**: Smooth navigation without page reloads
- **Interactive Photo Gallery**: Slideshow with 55 images for conference documentation
- **Hamburger Navigation**: Clean, mobile-friendly navigation menu
- **Accessibility**: ARIA labels and keyboard navigation support
- **SEO Optimized**: Proper meta tags and semantic HTML structure

## 🛠 Technologies Used

### Frontend Languages
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with custom properties and animations
- **JavaScript (ES6+)**: Interactive functionality and SPA navigation

### CSS Features
- CSS Grid and Flexbox for responsive layouts
- CSS Custom Properties for theme management
- CSS Animations and Transitions
- Media queries for mobile responsiveness
- Gradient backgrounds and modern styling

### JavaScript Features
- Class-based architecture
- Local Storage for theme persistence
- Touch/swipe support for mobile gallery
- Intersection Observer for performance
- Event delegation and keyboard navigation

## 📁 File Structure

```
english-teacher-forum/
├── index.html              # Main HTML file with all page content
├── style.css               # Complete stylesheet with theme support
├── app.js                  # JavaScript functionality
├── README.md               # Project documentation
└── images/                 # Image directory for gallery
    ├── img1.jpg           # Conference/event photos
    ├── img2.jpg
    ├── ...
    └── img55.jpg          # (Total: 55 images)
```

## 📱 Page Hierarchy

### Primary Navigation Structure

```
English Teacher Forum (Homepage)
├── 🏠 About ETF (index.html)
├── 📅 Conferences and Training Programmes
│   ├── ETF Conference 2024 (External Link)
│   └── Photo Gallery (55 images slideshow)
├── 📖 Journal
├── 🎥 ETF Webinars  
├── 💡 Innovation Corner
├── 📚 Resources
├── 👥 Membership
└── 🏆 Achievements of ETF
```

### Page Details

1. **About ETF** (Homepage)
   - Organization history and mission
   - Founder information
   - Core objectives and values

2. **Conferences and Training Programmes**
   - Link to ETF Conference 2024 documentation
   - Interactive photo gallery with slideshow
   - Navigation controls and thumbnails

3. **Other Pages** (Placeholder for future content)
   - Journal
   - ETF Webinars
   - Innovation Corner
   - Resources
   - Membership
   - Achievements of ETF

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/english-teacher-forum.git
   cd english-teacher-forum
   ```

2. **Add Images** (Important!)
   Create an `images` folder and add your conference photos:
   ```bash
   mkdir images
   # Add img1.jpg through img55.jpg to the images folder
   ```

3. **Open in Browser**
   ```bash
   # Simply open index.html in your web browser
   # Or use a local server for better performance:
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

## 🌐 Deployment

### GitHub Pages Deployment

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: English Teacher Forum website"
   git branch -M main
   git remote add origin https://github.com/your-username/english-teacher-forum.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click Save

3. **Add Images to Repository**
   ```bash
   # Add your 55 images (img1.jpg - img55.jpg) to the images folder
   git add images/
   git commit -m "Add conference photo gallery images"
   git push
   ```

4. **Access Your Site**
   - Your site will be available at: `https://your-username.github.io/english-teacher-forum`

### Alternative Deployment Options
- **Netlify**: Drag and drop the folder to Netlify
- **Vercel**: Connect your GitHub repository
- **Traditional Web Hosting**: Upload files via FTP

## 📖 Usage

### Navigation
- Click the hamburger menu (☰) in the top-left to access all pages
- Use the theme toggle (🌞/🌙) in the top-right to switch between light and dark modes

### Photo Gallery (Conferences Page)
- Auto-play slideshow with pause/play controls
- Use arrow buttons for manual navigation
- Click thumbnails for direct image access
- Swipe gestures supported on mobile devices

### Theme Persistence
- Your theme preference is automatically saved
- Settings persist across browser sessions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Maintain responsive design principles
2. Follow accessibility best practices
3. Test across different browsers and devices
4. Keep code well-commented and organized

## 📄 License

© English Teacher Forum all rights reserved-2025

## 📞 Contact

For questions about the English Teachers Forum organization, please contact the ETF administration.

---

**Note**: This is a static website built for the English Teachers Forum - Bharath (ETF). The gallery requires 55 images (img1.jpg through img55.jpg) to be manually added to the images folder for full functionality.