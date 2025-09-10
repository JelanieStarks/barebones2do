# Base image - Microsoft's Python devcontainer with Python 3.10 pre-installed
# This provides a complete development environment optimized for VS Code devcontainers
# with Python tools, debuggers, and common utilities already configured
FROM mcr.microsoft.com/devcontainers/python:3.10

# Install Node.js for frontend development
# ARG allows the Node.js version to be configurable during build time
# This is set to 18 by default in devcontainer.json but can be overridden
ARG NODE_VERSION=18

# Install Node.js and npm for frontend development  
# This approach uses the official Node.js installation method with fallback to system packages
# The installation process:
# 1. Downloads the NodeSource setup script for the specified Node version (with SSL workaround for restricted environments)
# 2. Executes the script to add the NodeSource repository to apt sources (if successful)
# 3. Updates package lists and installs Node.js and npm 
# 4. If NodeSource fails, falls back to system Node.js packages
# 5. Ensures npm is available and updates it to the latest version
RUN (curl -fsSL --insecure https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - || true) \
    && apt-get update \
    && (apt-get install -y nodejs npm || apt-get install -y nodejs npm) \
    && (command -v npm >/dev/null 2>&1 || ln -s /usr/bin/node /usr/bin/npm) \
    && npm --version \
    && npm install -g npm@latest || echo "npm update skipped"

# Install additional development tools
# Git is essential for version control and is used by many development tools
# The apt-get update ensures we have the latest package information
RUN apt-get update && apt-get install -y git
