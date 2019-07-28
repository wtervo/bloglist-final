const Blog = require("../models/blog")
const User = require("../models/user")

const initialBlogs = [
	{
		title: "testiä",
		author: "testijäbä",
		url: "testi.com",
		likes: 213
	},
	{
		title: "muna pilluun",
		author: "ah ah",
		url: "dickinpussy.org",
		likes: 712376131

	},
	{
		title: "martan lettublogi",
		author: "ronkaisen martta",
		url: "martanletut.fi"
	}
]

const postBlog =
	{
		title: "lisättyblogi",
		author: "postijäbä",
		url: "postaanvain.fi",
		likes: 2
	}

const blogsInDB = async () => {
	const blogs = await Blog.find({})
	return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
	const users = await User.find({})
	return users.map(u => u.toJSON())
}


module.exports = {
	initialBlogs,
	blogsInDB,
	postBlog,
	usersInDb
}