const app = require("./app")
const http = require("http")
const config = require("./utils/config")
const logger = require("./utils/logger")

const server = http.createServer(app)

const port = process.env.PORT || config.PORT
server.listen(port, () => {
	logger.info(`Server running on port ${port}`)
})