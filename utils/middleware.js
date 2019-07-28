const logger = require("./logger")

//Middleware for error handling and token extraction

const tokenExtractor = (request, response, next) => {
	const authorization = request.get("authorization")
	if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
		request.token = authorization.substring(7)
		next()
	}
	else {
		request.token = null
		next()
	}
}

const unknownEndpoint = (request, response) => {
	response.status(404).send({error: "Unknown endpoint"})
}

const errorHandler = (error, request, response, next) => {
	logger.error(error.message)
	if (error.name === "CastError" && error.kind === "ObjectId") {
		return response.status(400).send({error: "Malformatted ID"})
	}
	else if (error.name === "ValidationError") {
		return response.status(400).json({error: error.message})
	}
	else if (error.name === "JsonWebTokenError") {
		return response.status(401).json({
			error: "Invalid token"
		})
	}

	next(error)
}



module.exports = {
	unknownEndpoint,
	errorHandler,
	tokenExtractor
}