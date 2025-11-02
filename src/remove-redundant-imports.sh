#!/bin/bash

# Script to remove redundant @import 'src/styles/site.sass' lines from component files
# Since global styles are already imported in src/index.sass

echo "Removing redundant global style imports..."

# Find all .sass files that import the global styles
find src -name "*.sass" -type f -exec grep -l "@import 'src/styles/site.sass'" {} \; | while read file; do
    echo "Processing: $file"
    
    # Remove the import line and any empty lines that follow
    sed -i '' '/@import '\''src\/styles\/site\.sass'\''/d' "$file"
    
    # Remove any empty lines at the beginning of the file
    sed -i '' '/^[[:space:]]*$/d' "$file"
done

echo "Done! Redundant imports removed."
echo ""
echo "Note: Global styles are still available because they're imported in src/index.sass"
echo "which is imported in src/main.tsx" 