import express from "express"
import bodyParser from "body-parser"
import date from "./date.js"

const app = express()
const items = ["Buy food", "Cook food", "Eat food"]
const workItems = []

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", function (req, res) {
	const day = date.getDate()
	res.render("list", { listTitle: day, newItems: items })
})

app.get("/work", function (req, res) {
	res.render("list", { listTitle: "Work List", newItems: workItems })
})

app.get("/about", function (req, res) {
	res.render("about")
})

app.post("/", function (req, res) {
	const item = req.body.newItem
	console.log(req.body)
	if (req.body.list === "Work") {
		workItems.push(item)
		res.redirect("/work")
	} else {
		items.push(item)
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
