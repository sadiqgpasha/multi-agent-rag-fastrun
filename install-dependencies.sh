#!/bin/bash
# Multi-Agent RAG - Complete Dependency Installation Script
# This script installs all dependencies for the entire project

set -e  # Exit on any error

echo "=========================================="
echo "Multi-Agent RAG Dependency Installer"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.10 or higher."
        exit 1
    fi
    
    PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
    print_info "Found Python version: $PYTHON_VERSION"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_info "Found Node.js version: $NODE_VERSION"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    print_info "All prerequisites met!"
    echo ""
}

# Install Docker services
install_docker_services() {
    print_info "Starting Docker services (PostgreSQL + Redis)..."
    
    if ! command -v docker &> /dev/null; then
        print_warn "Docker is not installed. Skipping Docker services setup."
        print_warn "To use PostgreSQL and Redis, please install Docker and run: docker-compose up -d"
        return
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_warn "Docker Compose is not installed. Trying 'docker compose' instead..."
        if docker compose up -d 2>/dev/null; then
            print_info "Docker services started successfully!"
        else
            print_warn "Could not start Docker services. Please start them manually."
        fi
    else
        if docker-compose up -d; then
            print_info "Docker services started successfully!"
        else
            print_warn "Could not start Docker services. Please start them manually."
        fi
    fi
    echo ""
}

# Install backend dependencies
install_backend() {
    print_info "Installing Backend Dependencies..."
    
    cd backend
    
    # Check if Poetry is available
    if command -v poetry &> /dev/null; then
        print_info "Using Poetry for dependency management..."
        poetry install --with dev
        print_info "Backend dependencies installed with Poetry!"
        print_info "To activate the environment, run: cd backend && poetry shell"
    else
        print_warn "Poetry not found. Falling back to pip..."
        print_info "Installing with pip from requirements.txt..."
        
        # Create virtual environment if it doesn't exist
        if [ ! -d "venv" ]; then
            print_info "Creating Python virtual environment..."
            python3 -m venv venv
        fi
        
        # Activate virtual environment
        source venv/bin/activate
        
        # Upgrade pip
        pip install --upgrade pip
        
        # Install requirements
        pip install -r requirements.txt
        
        print_info "Backend dependencies installed with pip!"
        print_info "Virtual environment is activated. To reactivate, run: source backend/venv/bin/activate"
    fi
    
    cd ..
    echo ""
}

# Install frontend dependencies
install_frontend() {
    print_info "Installing Frontend Dependencies..."
    
    cd frontend
    
    # Check if node_modules exists
    if [ -d "node_modules" ]; then
        print_warn "node_modules already exists. Removing for clean install..."
        rm -rf node_modules package-lock.json
    fi
    
    # Install npm packages
    npm install
    
    print_info "Frontend dependencies installed!"
    
    cd ..
    echo ""
}

# Install root-level dependencies (if any)
install_root_deps() {
    if [ -f "package.json" ]; then
        print_info "Installing root-level dependencies..."
        npm install
        print_info "Root dependencies installed!"
        echo ""
    fi
}

# Print next steps
print_next_steps() {
    echo "=========================================="
    echo -e "${GREEN}Installation Complete!${NC}"
    echo "=========================================="
    echo ""
    echo "Next Steps:"
    echo "-----------"
    echo ""
    echo "1. Start Docker services (if not already running):"
    echo "   docker-compose up -d"
    echo ""
    echo "2. Configure environment variables:"
    echo "   cp backend/.env.example backend/.env"
    echo "   # Edit backend/.env with your AWS credentials and settings"
    echo ""
    echo "3. Start the backend server:"
    echo "   # If using Poetry:"
    echo "   cd backend && poetry shell && uvicorn app.main:app --reload"
    echo "   # If using pip/venv:"
    echo "   cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
    echo ""
    echo "4. Start the frontend dev server (in a new terminal):"
    echo "   cd frontend && npm run dev"
    echo ""
    echo "5. Open your browser and navigate to:"
    echo "   http://localhost:3000"
    echo ""
    echo "=========================================="
}

# Main execution
main() {
    check_prerequisites
    install_docker_services
    install_root_deps
    install_backend
    install_frontend
    print_next_steps
}

# Run the script
main
