const logger = require('./src/utils/logger')
const http = require("http");
const app = require("./src/app")
const server = http.createServer(app);

server.listen(5019, () => {
  logger.info(`Server started on port 5019`);
});
