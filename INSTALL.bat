@echo off
color 0A
echo.
echo ============================================================
echo    GROCERY STORE - INSTALLER
echo ============================================================
echo.
echo [1] Checking Node.js...
node -v || (echo ERROR: Install Node.js from nodejs.org && pause && exit /b)
echo.
echo [2] Installing pnpm...
call npm install -g pnpm@9
echo.
echo [3] Installing packages...
call pnpm install
echo.
echo [4] Generating Prisma client...
call pnpm db:generate
echo.
echo [5] Creating database...
call pnpm db:push
echo.
echo [6] Seeding data...
call pnpm db:seed
echo.
echo ============================================================
echo    DONE! Now run START.bat
echo    Dashboard: http://localhost:3000
echo    Login: 9999999999 / admin123
echo ============================================================
pause
