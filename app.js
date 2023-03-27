import express from "express"
import bodyParser from "body-parser"
import date from "./date.js"
import mongoose from "mongoose"
import _ from "lodash"

const app = express()

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))

// Connect to MongoDB
mongoose
	.connect("mongodb://127.0.0.1:27017/todo-listDB", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.log(err))

// Define items schema and model
const itemsSchema = {
	name: String,
}

const listSchema = {
	name: String,
	items: [itemsSchema],
}

const List = mongoose.model("List", listSchema)

const Item = mongoose.model("Item", itemsSchema)

const defaultItems = [
	{ name: "Item 1" },
	{ name: "Item 2" },
	{ name: "Item 3" },
]

app.get("/", async function (req, res) {
	// const day = date.getDate()
	try {
		const items = await Item.find()
		if (items.length === 0) {
			await Item.insertMany(defaultItems)
			console.log("Items inserted successfully")
		}
		res.render("list", { listTitle: "Today", newItems: items })
	} catch (err) {
		console.log(err)
	}
})

app.get("/:customListName", (req, res) => {
	const customListName = _.capitalize(req.params.customListName)

	List.findOne({ name: customListName })
		.then((foundList) => {
			if (!foundList) {
				const list = new List({
					name: customListName,
					items: defaultItems,
				})
				list.save()

				res.redirect("/" + customListName)
			} else {
				res.render("list", {
					listTitle: foundList.name,
					newItems: foundList.items,
				})
			}
		})
		.catch((err) => console.log(err))
})

app.get("/about", function (req, res) {
	res.render("about")
})

app.post("/", function (req, res) {
	const itemName = req.body.newItem
	const listName = req.body.list

	const item = new Item({ name: itemName })
	if (listName === "Today") {
		item.save()
		res.redirect("/")
	} else {
		List.findOne({ name: listName }).then((list) => {
			list.items.push(item)
			list.save()
		})
		res.redirect("/" + listName)
	}
})

app.post("/delete", async (req, res) => {
	const itemId = req.body.checkbox
	const listName = req.body.listName
	if (listName === "Today") {
		await Item.deleteOne({ _id: itemId })
		res.redirect("/")
	} else {
		await List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemId}}})
			.then(() => {
				res.redirect("/" + listName)
			})
	}

})

app.listen(8080, function () {
	console.log("listening on 8080")
})
