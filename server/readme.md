export PUPPETEER_DOWNLOAD_HOST=https://npm.taobao.org/mirrors


docker network create scan-monitor
docker run --name scan-monitor-mysql -v ~/mysql-data:/var/lib/mysql  -p 3306:3306 --network scan-monitor -d -e MYSQL_ROOT_PASSWORD=my-secret-pw  mysql:latest