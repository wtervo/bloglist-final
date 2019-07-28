const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const blogSchema = mongoose.Schema({
	title: {
		type: String,
		unique: true,
		maxlength: 100
	},
	author: {
		type: String,
		maxlength: 30
	},
	url: {
		type: String,
		maxlength: 100
	},
	likes: {
		type: Number,
		default: 0,
		max: 1e+10,
		min: 0,
		validate: {
			validator: Number.isInteger,
			message: `{VALUE} is not an integer value`
		}
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	comments: {
		type: Array,
		maxlength: 100
	}
})

blogSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id
		delete returnedObject._id
		delete returnedObject.__v
	}
})

blogSchema.plugin(uniqueValidator)

module.exports = mongoose.model("Blog", blogSchema)