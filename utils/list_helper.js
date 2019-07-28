const dummy = (blogs) => {
	return 1
}

//This component is a remnant of some older tasks and is not currently used
//Similar operations are done in front of the app and I kind of forgot about this stuff,
//thus working unnecessarily...
const totalLikes = (blogs) => {
	return blogs.reduce((sum, blog) => {
		return sum + blog.likes
	}, 0)
}

const favoriteBlog = (blogs) => {
	const maxlikes = Math.max(...blogs.map(blog => blog.likes))
	const favblogArr = blogs.filter(blog => blog.likes === maxlikes)
	const favblog = favblogArr[0]
	delete favblog._id
	delete favblog.url
	delete favblog.__v
	return favblog
}

const mostBlogs = (blogs) => {
	const authorArr = blogs.reduce((list, blog) => {
		if (list.find(entry => entry.author === blog.author)) {
			const index = list.findIndex(n => n.author === blog.author)
			list[index].blogs += 1
		}
		else {
			list.push(
				{
					author: blog.author,
					blogs: 1
				}
			)}
		return list
	}, [])

	const maxblogs = Math.max(...authorArr.map(auth => auth.blogs))
	const busiestAuthor = authorArr.filter(auth => auth.blogs === maxblogs)
	return busiestAuthor[0]
}

const mostLikes = (blogs) => {
	const authorArr = blogs.reduce((list, blog) => {
		if (list.find(entry => entry.author === blog.author)) {
			const index = list.findIndex(n => n.author === blog.author)
			list[index].likes += blog.likes
		}
		else {
			list.push(
				{
					author: blog.author,
					likes: blog.likes
				}
			)}
		return list
	}, [])

	const mostlikedblogs = Math.max(...authorArr.map(entry => entry.likes))
	const mostpopularAuthor = authorArr.filter(auth => auth.likes === mostlikedblogs)

	return mostpopularAuthor[0]
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
}