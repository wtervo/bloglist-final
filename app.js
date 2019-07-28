const config = require("./utils/config")
const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const cors = require("cors")
const path = require("path")
const blogsRouter = require("./controllers/blogs")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")
const middleware = require("./utils/middleware")
const mongoose = require("mongoose")
const logger = require("./utils/logger")

const mongoUrl = config.MONGODB_URL
logger.info("Connecting to", config.MONGODB_URL)
mongoose.connect(mongoUrl, {useNewUrlParser: true})
	.then(() => {
		logger.info("Connected to MongoDB")
	})
	.catch((error) => {
		logger.error("Error while connecting to MongoDB:", error.message)
	})

app.use(cors())
app.use(bodyParser.json())

app.use(express.static("build"))
app.use(middleware.tokenExtractor)
app.use("/api/blogs", blogsRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)
//This route will redirect all non-valid paths to index.html
//This type of catch-all method was necessary, as the app broke quite badly
//after pushed into production, despite no problems with the dev build
app.get("/*", (request, response) => {
	response.sendFile(path.join(__dirname, "./build/index.html"), (error) => {
		if (error) {
			return response.status(500).json({error})
		}
	})
})

if (process.env.NODE_ENV === "test") {
	const testingRouter = require("./controllers/tests")
	app.use("/api/testing", testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app