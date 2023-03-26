import express from "express"
import bodyParser from "body-parser"
import date from "./date.js"
import mongoose from "mongoose"
const { Schema } = mongoose

const app = express()
// const items = ["Buy food", "Cook food", "Eat food"]
// const workItems = []

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
mongoose
	.connect("mongodb://127.0.0.1:27017/todo-listDB", { useNewUrlParser: true })
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.log(err))

const itemsSchema = {
	name: String,
}

const Item = mongoose.model("Item", itemsSchema)
const item1 = new Item({
	name: "Item 1",
})

const item2 = new Item({
	name: "Item 2",
})

const item3 = new Item({
	name: "Item 3",
})

const defaultItem = [item1, item2, item3]

app.get("/", async function (req, res) {
	const day = date.getDate()
	Item.find().then((items) => {
		if (items.length === 0) {
			Item.insertMany(defaultItem)
				.then(() => console.log("Items inserted successfully"))
				.catch(err => console.log(err))
		}
		res.render("list", { listTitle: day, newItems: items })
	})
})

app.get("/work", function (req, res) {
	res.render("list", { listTitle: "Work List", newItems: workItems })
})

app.get("/about", function (req, res) {
	res.render("about")
})

app.post("/", function (req, res) {
	const item = req.body.newItem
	if (req.body.list === "Work") {
		// workItems.push(item)
		res.redirect("/work")
	} else {
		// items.push(item)
		Item.insertMany({ name: item })
		res.redirect("/")
	}
})

app.post("/work", function (req, res) {
	const work = req.body.newItem
	workItems.push(work)
	res.redirect("/work")
})

app.listen(8080, function () {
	console.log("listening on 8080")
})
