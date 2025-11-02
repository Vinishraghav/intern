# Stop any running Node.js processes
taskkill /F /IM node.exe 2>&1 | Out-Null

# Remove problematic directories
$paths = @(
    "src/app/api/posts/[id]",
    "src/app/posts/[id]"
)

foreach ($path in $paths) {
    if (Test-Path $path) {
        Remove-Item -Recurse -Force $path -ErrorAction SilentlyContinue
        Write-Host "Removed: $path"
    } else {
        Write-Host "Not found: $path"
    }
}

# Clean Next.js cache
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
    Write-Host "Removed: .next cache"
}

# Clean npm cache
if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force "node_modules/.cache" -ErrorAction SilentlyContinue
    Write-Host "Removed: node_modules/.cache"
}

Write-Host "\nCleanup complete. Please restart your development server."
