set NODE_OPTIONS="--openssl-legacy-provider"

rem 開發模式（推薦）：
rem call npm install
rem call npm run devServerSite


rem 正式打包再啟站：
call npm run buildModule
call npm run buildSite
call npx http-server site/deploy -p 8081
rem # 開 http://localhost:8081
