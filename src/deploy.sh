#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Build the project
echo "Building the project..."
npm run build

# Deploy to Blockcell
echo "Deploying to Blockcell..."
/Users/peterwright/bin/blockcell manage_site --action upload --site_name interventions-hub --directory_path /Users/peterwright/code/react-prototype/src/dist

echo "✅ Deployment successful!"
