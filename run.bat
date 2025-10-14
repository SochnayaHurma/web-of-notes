@echo off
chcp 65001
echo Старт django сервера...

echo Подключение виртуального окружения
call .\backend\venv\Scripts\activate.bat

echo Запуск...
start cmd /k "python .\backend\manage.py runserver"


echo Старт react-debug сервера...
cd .\frontend
start cmd /k "yarn start"

