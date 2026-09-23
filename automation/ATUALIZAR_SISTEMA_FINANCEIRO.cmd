@echo off
cd /d "%~dp0"
if not exist node_modules call npm install
call npm run process -- "C:\Users\Eliomarssa\Controladoria"
pause
