#!/bin/bash

# Script to add @import 'styles/site' to all SASS files
# Excludes the _site.sass file itself to avoid circular imports

echo "Adding @import 'styles/site' to all SASS files..."

# Find all .sass files except _site.sass
find . -name "*.sass" -type f | grep -v "_site.sass" | while read -r file; do
    echo "Processing: $file"
    
    # Check if the file already has the import
    if grep -q "^@import 'styles/site'" "$file"; then
        echo "  - Already has the import, skipping"
        continue
    fi
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Add the import at the very top
    echo "@import 'styles/site'" > "$temp_file"
    echo "" >> "$temp_file"  # Add a blank line
    
    # Append the original content
    cat "$file" >> "$temp_file"
    
    # Replace the original file
    mv "$temp_file" "$file"
    
    echo "  - Added import to $file"
done

echo "Done! Added @import 'styles/site' to all SASS files." 