@echo off
title The Nebula Project - Cosmic Journey
cd /d "%~dp0"
echo ========================================================
echo   Starting Cosmic Journey // The Nebula Project
echo   Opening in your browser at http://localhost:8000 ...
echo ========================================================
start http://localhost:8000
python -m http.server 8000
