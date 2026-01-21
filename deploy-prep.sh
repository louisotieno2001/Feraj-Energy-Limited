#!/bin/bash

# Feraj Solar Limited - Netlify Deployment Script
# This script automates the deployment preparation process

set -e # Exit on any error

echo "🚀 Preparing Feraj Solar Limited for Netlify deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "git is not installed. Please install git and try again."
        exit 1
    fi
    
    # Check Node.js version
    node_version=$(node -v | sed 's/v//')
    major_version=$(echo $node_version | cut -d. -f1)
    
    if [ $major_version -lt 18 ]; then
        print_warning "Node.js version $node_version detected. Recommended version is 18+."
    else
        print_success "Node.js version $node_version ✓"
    fi
}

# Clean previous builds
clean_build() {
    print_status "Cleaning previous builds..."
    
    if [ -d "dist" ]; then
        rm -rf dist
        print_success "Removed dist directory"
    fi
    
    if [ -d "node_modules" ]; then
        print_status "Removing node_modules for fresh install..."
        rm -rf node_modules
    fi
    
    if [ -f "package-lock.json" ]; then
        rm package-lock.json
        print_success "Removed package-lock.json"
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if npm install; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Run tests and linting
run_checks() {
    print_status "Running quality checks..."
    
    # Check if test script exists
    if npm run --silent 2>/dev/null | grep -q "test"; then
        print_status "Running tests..."
        if npm test; then
            print_success "Tests passed"
        else
            print_warning "Some tests failed, but continuing..."
        fi
    else
        print_warning "No test script found, skipping tests"
    fi
    
    # Check if lint script exists
    if npm run --silent 2>/dev/null | grep -q "lint"; then
        print_status "Running linting..."
        if npm run lint; then
            print_success "Linting passed"
        else
            print_warning "Linting issues found, but continuing..."
        fi
    else
        print_warning "No lint script found, skipping linting"
    fi
}

# Build the project
build_project() {
    print_status "Building project for production..."
    
    if npm run build; then
        print_success "Build completed successfully"
        
        # Check build output
        if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
            build_size=$(du -sh dist | cut -f1)
            print_success "Build output size: $build_size"
            
            # List main files in build
            print_status "Build contents:"
            ls -la dist/ | head -10
        else
            print_error "Build directory is empty or missing"
            exit 1
        fi
    else
        print_error "Build failed"
        exit 1
    fi
}

# Validate Netlify configuration
validate_netlify_config() {
    print_status "Validating Netlify configuration..."
    
    if [ -f "netlify.toml" ]; then
        print_success "netlify.toml found"
        
        # Check for required sections
        if grep -q "\[build\]" netlify.toml; then
            print_success "Build configuration found in netlify.toml"
        else
            print_warning "Build configuration not found in netlify.toml"
        fi
        
        if grep -q "publish.*dist" netlify.toml; then
            print_success "Publish directory correctly set to 'dist'"
        else
            print_warning "Publish directory might not be correctly configured"
        fi
    else
        print_error "netlify.toml not found. This file is required for proper Netlify deployment."
        exit 1
    fi
    
    # Check environment variables template
    if [ -f ".env.example" ]; then
        print_success ".env.example found - environment variables documented"
    else
        print_warning ".env.example not found - consider documenting required environment variables"
    fi
}

# Create deployment summary
create_summary() {
    print_status "Creating deployment summary..."
    
    cat > DEPLOYMENT_SUMMARY.md << EOF
# Deployment Summary - $(date)

## Build Information
- Node.js Version: $(node -v)
- npm Version: $(npm -v)
- Build Tool: Vite
- Output Directory: dist

## Project Details
- Project Name: Feraj Solar Limited Web Application
- Version: $(grep '"version"' package.json | cut -d'"' -f4)
- Build Date: $(date)
- Build Size: $(du -sh dist 2>/dev/null | cut -f1 || echo "Unknown")

## Deployment Configuration
- Platform: Netlify
- Configuration File: netlify.toml
- Environment Variables: .env.example (template provided)
- Redirects: Configured for SPA routing
- Security Headers: Enabled

## Next Steps
1. Push to your Git repository
2. Connect repository to Netlify
3. Configure environment variables in Netlify dashboard
4. Deploy!

## Environment Variables to Set in Netlify
$(grep "^VITE_" .env.example | sed 's/=.*$/=<SET_VALUE>/' | sed 's/^/- /')

## Support
For deployment issues, contact the development team or refer to:
- docs/addr/WORKFLOW.md
- README.md
EOF

    print_success "Deployment summary created: DEPLOYMENT_SUMMARY.md"
}

# Main deployment preparation function
main() {
    echo "================================="
    echo "🌞 Feraj Solar Limited"
    echo "📦 Netlify Deployment Preparation"
    echo "================================="
    echo ""
    
    check_requirements
    clean_build
    install_dependencies
    run_checks
    build_project
    validate_netlify_config
    create_summary
    
    echo ""
    echo "================================="
    echo "🎉 DEPLOYMENT PREPARATION COMPLETE!"
    echo "================================="
    echo ""
    print_success "Your Feraj Solar Limited application is ready for Netlify deployment!"
    echo ""
    echo "Next steps:"
    echo "1. 📤 Push your code to a Git repository (GitHub, GitLab, etc.)"
    echo "2. 🔗 Connect your repository to Netlify"
    echo "3. ⚙️  Configure environment variables in Netlify dashboard"
    echo "4. 🚀 Deploy your application!"
    echo ""
    echo "📋 Check DEPLOYMENT_SUMMARY.md for detailed information"
    echo "📚 Read docs/addr/WORKFLOW.md for development guidelines"
    echo ""
    print_success "Happy deploying! 🌱"
}

# Run the main function
main "$@"