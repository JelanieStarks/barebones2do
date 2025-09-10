# Use Node.js 18 as base image for frontend development
FROM node:18

# Install Python and pip for backend support
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace

# Create a non-root user for development
RUN useradd -m -s /bin/bash vscode && \
    echo "vscode ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Switch to non-root user
USER vscode

# Set up environment
ENV NODE_ENV=development
ENV PYTHONPATH=/workspace

# Expose ports for frontend and backend development
EXPOSE 3000 5000

# Default command
CMD ["bash"]