#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Build the project
echo "Building the project..."
npm run build

echo "✅ Deployment successful!"
