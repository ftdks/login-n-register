const http = require('http');
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const session = require("express-session");

const users = require("./users.js")

// Create App & Server
const app = express();
const server = http.createServer(app);

// Port Number
const PORT = 3000;


// View Engine Setup
app.set("view engine", "ejs");
app.set("layout", "layouts/main-layout");

// Express EJS Layouts Middleware
app.use(ejsLayouts);

// Express Middleware
app.use(express.json())
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Express Session Middleware
app.use(session({
	secret: "791HF8ZB3912NBZ6C723",
	resave: false,
	saveUninitialized: false
}));

// Check Authenticated Middleware
const isAuth = (req, res, next) => {
	if(req.session.isAuth) {
		next();
	} else {
		res.redirect("/login");
	}
};
const isNotAuth = (req, res, next) => {
	if(req.session.isAuth) {
		res.redirect("/");
	} else {
		next();
	}
};

// http://localhost:3000/
app.get("/", isAuth, (req, res) => {
	res.render("./pages/index.ejs", {
		title: "Home",
		user: req.session.user
	})
})
app.post("/logout", (req, res) => {
	req.session.destroy();
	res.redirect("/login");
})

// http://localhost:3000/login
let loginError = "";
app.get("/login", isNotAuth, (req, res) => {
	res.render("./pages/login.ejs", {
		title: "Login",
		error: loginError
	})
})
app.post("/login", (req, res) => {
	const { username, password } = req.body;
	try {
		const user = users.fetchAll().find(u => u.username.toLowerCase() == username.toLowerCase());
		if(password === user.password) {
			loginError = ""
			req.session.isAuth = true;
			req.session.user = user
			res.redirect("/");
		} else {
			res.redirect("/login");
			loginError = "Invalid username or password"
		}
	} catch(err) {
		res.redirect("/login");
		loginError = "Invalid username or password"
	}
})

// http://localhost:3000/register
let registerError = ""
app.get("/register", (req, res) => {
	res.render("./pages/register.ejs", {
		title: "Register",
		error: registerError
	});
});
app.post("/register", (req, res) => {
	const { username, password } = req.body
	const listUsername = []
	for(var i = 0; i < users.fetchAll().length; i++)
	{ listUsername.push(users.fetchAll()[i].username) }
	
	if(listUsername.includes(username)) {
		registerError = "Name is already used"
		res.redirect("/register")
		return
	} else registerError = ""
	if(username.length < 3) {
		registerError = "The username must have at least 3 characters"
		res.redirect("/register")
		return
	} else registerError = ""
	if(password.length < 6) {
		registerError = "The password must have at least 6 characters"
		res.redirect("/register")
		return
	} else registerError = ""

	users.addData({
		"username": username,
		"password": password
	})

	res.redirect("/login")
})



app.use("/", (req, res) => {
	res.sendStatus(404);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});