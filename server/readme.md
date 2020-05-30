PUPPETEER_DOWNLOAD_HOST=https://npm.taobao.org/mirrors


docker run --name scan-monitor-mysql  -p 3306:3306 --network scan-monitor -d -e MYSQL_ROOT_PASSWORD=my-secret-pw  mysql:latest