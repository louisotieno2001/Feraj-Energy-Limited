
# Feraj Solar Limited - Company Website

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-netlify-badge-id/deploy-status)](https://app.netlify.com/sites/your-netlify-site/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF.svg)](https://vitejs.dev/)

> **Live Site**: [https://feraj-solar.netlify.app](https://feraj-solar.netlify.app)

## Overview

This repository contains the complete company website for **Feraj Solar Limited**, Kenya's leading solar energy solutions provider. The website showcases our comprehensive solar services, team expertise, and commitment to sustainable energy transformation across Kenya.

### Key Features

- **Company Overview** - Mission, vision, and company story
- **Leadership Team** - Meet our directors and executive team
- **Product Catalog** - Solar panels, inverters, and energy solutions
- **E-commerce Cart** - Interactive shopping experience
- **Energy Statistics** - Real-time solar energy data visualization
- **Partnership Programs** - Business collaboration opportunities
- **Interactive Globe** - Global solar energy visualization
- **Responsive Design** - Optimized for all devices

## Repository Structure

```
Feraj/
├── public/                     # Static assets
│   └── images/
│       ├── logos/              # Company logos
│       └── team/               # Team member photos
├── src/
│   ├── app/
│   │   ├── components/         # Reusable React components
│   │   │   ├── ui/            # UI component library (Radix UI)
│   │   │   ├── figma/         # Figma-exported components
│   │   │   ├── Navbar.tsx     # Navigation component
│   │   │   └── Footer.tsx     # Footer component
│   │   ├── data/              # Static data and configurations
│   │   │   ├── teamData.ts    # Team member information
│   │   │   ├── products.ts    # Product catalog
│   │   │   └── energyData.ts  # Energy statistics
│   │   ├── pages/             # Page components
│   │   │   ├── Home.tsx       # Landing page
│   │   │   ├── About.tsx      # Company information
│   │   │   ├── Team.tsx       # Leadership team
│   │   │   ├── Products.tsx   # Product catalog
│   │   │   ├── Cart.tsx       # Shopping cart
│   │   │   ├── EnergyStats.tsx # Energy visualization
│   │   │   ├── Partnerships.tsx # Partnership programs
│   │   │   ├── WhyGreen.tsx   # Sustainability info
│   │   │   └── Login.tsx      # User authentication
│   │   └── App.tsx            # Main application component
│   ├── styles/                # CSS and styling
│   │   ├── index.css         # Main stylesheet
│   │   ├── tailwind.css      # Tailwind configuration
│   │   ├── theme.css         # Custom theme variables
│   │   └── fonts.css         # Font declarations
│   └── main.tsx              # Application entry point
├── package.json              # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── postcss.config.mjs       # PostCSS configuration
├── guidelines/              # Development guidelines
└── README.md               # This file
```

## Principles

### Technical Principles
- **Modern Stack**: Built with React 18, TypeScript, and Vite for optimal performance
- **Component-Driven**: Modular, reusable components for maintainability
- **Responsive First**: Mobile-first design approach for all screen sizes
- **Accessibility**: WCAG 2.1 compliance for inclusive user experience
- **Performance**: Optimized loading times and smooth interactions

### Business Principles
- **Sustainability Focus**: Promoting clean energy and environmental responsibility
- **Local Impact**: Tailored for the Kenyan market and energy landscape
- **Innovation**: Cutting-edge solar technology solutions
- **Transparency**: Clear communication about services and pricing
- **Community**: Building partnerships and supporting local development

### Design Principles
- **Clean & Professional**: Reflects the precision of solar technology
- **Green Energy Branding**: Consistent use of eco-friendly color palette
- **User-Centric**: Intuitive navigation and clear call-to-actions
- **Visual Storytelling**: Engaging graphics and data visualizations

## Getting Started

### Prerequisites

- **Node.js** (version 18 or higher)
- **npm** (version 8 or higher)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/feraj-solar.git
   cd feraj-solar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Environment Setup

Create a `.env` file in the root directory for environment variables:

```env
VITE_APP_TITLE=Feraj Solar Limited
VITE_API_URL=your-api-url
VITE_CONTACT_EMAIL=info@ferajsolar.com
```

## Documentation Index

### Development Docs
- [Component Guidelines](./guidelines/Guidelines.md) - Best practices for component development
- [Styling Guide](./docs/styling.md) - CSS and Tailwind usage patterns
- [State Management](./docs/state.md) - Application state handling
- [API Integration](./docs/api.md) - External service integrations

### Business Docs
- [Brand Guidelines](./docs/brand.md) - Logo usage and brand standards
- [Content Strategy](./docs/content.md) - Writing and messaging guidelines
- [SEO Strategy](./docs/seo.md) - Search optimization approach

### Technical Docs
- [Architecture](./docs/architecture.md) - System design and patterns
- [Performance](./docs/performance.md) - Optimization strategies
- [Security](./docs/security.md) - Security best practices
- [Deployment](./docs/deployment.md) - CI/CD and hosting setup

## Roadmap

### Q1 2026 - Foundation
- [x] Company website launch
- [x] Team profiles and company information
- [x] Product catalog integration
- [x] Responsive design implementation
- [x] Custom branding and logo integration

### Q2 2026 - Enhancement
- [ ] Customer portal development
- [ ] Online payment integration (M-Pesa, Bank transfers)
- [ ] Real-time solar calculator
- [ ] Customer testimonials section
- [ ] Blog and news section

### Q3 2026 - Expansion
- [ ] Multi-language support (English, Swahili)
- [ ] Advanced energy analytics dashboard
- [ ] Mobile app development
- [ ] WhatsApp integration for customer support
- [ ] Inventory management system

### Q4 2026 - Integration
- [ ] CRM system integration
- [ ] Advanced SEO optimization
- [ ] Marketing automation tools
- [ ] Performance analytics dashboard
- [ ] AI-powered chat support

### 2027 & Beyond
- [ ] IoT device monitoring integration
- [ ] Blockchain-based energy trading platform
- [ ] Advanced AI energy optimization
- [ ] Regional expansion (East Africa)

## Contributing

We welcome contributions from developers, designers, and solar energy enthusiasts! Here's how you can help:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow our coding standards
   - Add appropriate tests
   - Update documentation
4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Contribution Guidelines

- **Code Style**: Follow TypeScript best practices and use Prettier formatting
- **Testing**: Write tests for new features and bug fixes
- **Documentation**: Update README and component documentation
- **Design**: Maintain consistency with existing design patterns
- **Accessibility**: Ensure WCAG 2.1 AA compliance
- **Localization**: Consider multi-language support in implementations

### Development Workflow

1. Check existing issues and discussions
2. Create an issue for new features or bugs
3. Wait for approval before starting work
4. Follow our branch naming conventions
5. Submit PRs with descriptive titles and descriptions

## Support

### Get Help

- **Email**: [tech@ferajsolar.com](mailto:tech@ferajsolar.com)
- **Bug Reports**: [GitHub Issues](https://github.com/your-username/feraj-solar/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/feraj-solar/discussions)
- **WhatsApp**: +254-XXX-XXX-XXX (Business hours: 8 AM - 6 PM EAT)

### Business Inquiries

- **Sales**: [sales@ferajsolar.com](mailto:sales@ferajsolar.com)
- **Partnerships**: [partnerships@ferajsolar.com](mailto:partnerships@ferajsolar.com)
- **Media**: [media@ferajsolar.com](mailto:media@ferajsolar.com)
- **General**: [info@ferajsolar.com](mailto:info@ferajsolar.com)

### Office Location

**Feraj Solar Limited**  
Nairobi, Kenya  
Monday - Friday: 8:00 AM - 6:00 PM EAT  
Saturday: 9:00 AM - 2:00 PM EAT  

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Leadership Team**: Mr Joshua Orwa (CEO), Mr Jerry Onyango (Director), Mr Max Feng (Director), Mr Bonkee Omwai (Director of Operations)
- **Design**: Original Figma design inspiration
- **Technology**: Built with React, TypeScript, Tailwind CSS, and Vite
- **Community**: Thanks to all contributors and supporters of clean energy in Kenya

---

<div align="center">

**Powering Kenya's Sustainable Future**

*Made with care by the Feraj Solar Limited team*

[![Feraj Solar Limited](https://img.shields.io/badge/Feraj%20Solar%20Limited-Leading%20Solar%20Solutions-green?style=for-the-badge)](https://feraj-solar.netlify.app)

</div>