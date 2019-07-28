const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const Blog = require("../models/blog")
const helper = require("./test_helper")

const api = supertest(app)

beforeEach(async () => {
	await Blog.deleteMany({})

	let blogObject = new Blog(helper.initialBlogs[0])
	await blogObject.save()

	blogObject = new Blog(helper.initialBlogs[1])
	await blogObject.save()

	blogObject = new Blog(helper.initialBlogs[2])
	await blogObject.save()
})

test.skip("3 blogs are returned as json", async () => {
	await api
		.get("/api/blogs")
		.expect(200)
		.expect("Content-Type", /application\/json/)

	const totalBlogs = await helper.blogsInDB()
	expect(totalBlogs.length).toBe(
		helper.initialBlogs.length
	)
})

test.skip("Returned objects have the 'id' field, not '_id'", async () => {
	await api
		.get("/api/blogs")
		.expect(200)

	const totalBlogs = await helper.blogsInDB()
	expect(totalBlogs[0].id).toBeDefined()
})

test.skip("POST works; array increased by one blog with the correct contents", async () => {
	await api
		.post("/api/blogs")
		.send(helper.postBlog)
		.expect(200)
		.expect("Content-Type", /application\/json/)

	const totalBlogs = await helper.blogsInDB()
	expect(totalBlogs.length).toBe(
		helper.initialBlogs.length + 1
	)
	console.log(totalBlogs)
	//would like to use toContainEqual here, but I don't know
	//how to remove the received object's id field, because
	//that messes up the comparison with the original object
	const titles = totalBlogs.map(n => n.title)
	expect(titles).toContain(helper.postBlog.title)
	const authors = totalBlogs.map(n => n.author)
	expect(authors).toContain(helper.postBlog.author)
})

test.skip("If likes field is not given, add likes value 0 to the object", async () => {
	const totalBlogs = await helper.blogsInDB()
	expect(totalBlogs[2].likes).toBe(0)
})

test.skip("Error status 400 if 'title' or 'url' fields are missing", async () => {
	const noTitle =
	{
		author: "jksdjaks",
		url: "kldsakj",
		likes: 231
	}
	await api
		.post("/api/blogs")
		.send(noTitle)
		.expect(400)

	const noUrl =
	{
		title: "kjsldja",
		author: "klsjdja",
		likes: 231
	}

	await api
		.post("/api/blogs")
		.send(noUrl)
		.expect(400)
})

test.skip("Status code 204 when deleting a blog", async () => {
	const totalBlogs = await helper.blogsInDB()
	const removeId = totalBlogs[0].id
	await api
		.delete(`/api/blogs/${removeId}`)
		.expect(204)

	const notesAtEnd = await helper.blogsInDB()
	expect(notesAtEnd.length).toBe(helper.initialBlogs.length - 1)
})

test.skip("Updated likes should be 5", async () => {
	const updateBlog = {
		title: "muna pilluun",
		author: "ah ah",
		url: "dickinpussy.org",
		likes: 5
	}
	const totalBlogs = await helper.blogsInDB()
	const updatedLikes = totalBlogs.find(n => n.title === "muna pilluun")

	await api
		.put(`/api/blogs/${updatedLikes.id}`)
		.send(updateBlog)
		.expect(200)
	const updatedTotalBlogs = await helper.blogsInDB()
	const updatedBlogs = updatedTotalBlogs.find(n => n.title === "muna pilluun")
	expect(updatedBlogs.likes).toBe(updateBlog.likes)
})

afterAll(() => {
	mongoose.connection.close()
})