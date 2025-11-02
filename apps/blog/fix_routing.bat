@echo off
echo Fixing routing issues...

REM Change to the project directory
cd /d %~dp0

REM Remove the [id] directory
if exist "src\app\posts\[id]" (
    echo Removing [id] directory...
    rmdir /s /q "src\app\posts\[id]"
) else (
    echo [id] directory not found.
)

REM Remove .next directory
echo Cleaning Next.js cache...
if exist ".next" rmdir /s /q ".next"

REM Remove node_modules/.cache
echo Cleaning npm cache...
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"

echo.
echo Cleanup complete. Please run 'pnpm dev' to start the development server.
pause
