const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const User = require("../models/user")

usersRouter.get("/", async (request, response) => {
	const users = await User.find({}).populate(
		"blogs", {title: 1, author: 1, url: 1, id: 1})
	response.json(users.map(u => u.toJSON()))
}) //Populating blog data so the blogs added by each user are part of the JSON data

usersRouter.get("/:id", async (request, response, next) => {
	try {
		const user = await User.findById(request.params.id)
		if (user) {
			response.json(user.toJSON())
		}
		else {
			response.status(404).end()
		}
	}
	catch (error) {
		next(error)
	}
})

usersRouter.post("/", async (request, response, next) => {
	try {
		const body = request.body
		if (body.username === undefined || body.password === undefined || body.name === undefined) {
			return response.status(400).json({error: "Content missing"})
		}
		const saltRounds = 10
		const passwordHash = await bcrypt.hash(body.password, saltRounds)

		const user = new User({
			username: body.username,
			name: body.name,
			passwordHash,
		})

		const savedUser = await user.save()

		response.json(savedUser)
	}
	catch (error) {
		next(error)
	}
})

module.exports = usersRouter