module.exports = function (app, shopData) {
	// Handle our routes

    ///////// BASIC ROUTES ///////
	app.get("/", function (req, res) {
		res.render("index.ejs", shopData);
	});
	app.get("/about", function (req, res) {
		res.render("about.ejs", shopData);
	});
    ///////////////////////////////////

	/////////// SEARCH SECTION /////////
	app.get("/search", function (req, res) {
		res.render("search.ejs", shopData);
	});

	app.get("/search-result", function (req, res) {
		//searching in the database from form input

		//instantiate sqlquery variable
		let sqlquery;

		//check for adv search, set sqlquery to relevant value
		if (req.query.advsearch == "true") {
			sqlquery =
				"SELECT * FROM books WHERE name like '%" +
				req.query.keyword +
				"%'";
		} else {
			sqlquery =
				"SELECT * FROM books WHERE name = '" + req.query.keyword + "'";
		}

		//return newData with relevant database info
		db.query(sqlquery, (err, result) => {
			if (err) {
				res.redirect("./");
			}
			let newData = Object.assign({}, shopData, {
				availableBooks: result,
			});

			//render search result page with new info
			res.render("search-result.ejs", newData);
		});
	});
    //////////////////////////////


	///////// ADDING BOOK SECTION //////////
	app.get("/addbook", function (req, res) {
		res.render("add-book.ejs", shopData);
	});

	app.post("/bookadded", function (req, res) {
		// saving data in database
		let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
		// execute sql query (adding new book into database)
		let newrecord = [req.body.name, req.body.price];
		db.query(sqlquery, newrecord, (err, result) => {
			if (err) {
				return console.error(err.message);
			} else {
				//return info about book added into database
				res.send(
					" This book is added to database, name: " +
						req.body.name +
						", price: " +
						req.body.price
				);
			}
		});
	});
    ////////////////////////////

	/////// REGISTER SECTION ///////
	app.get("/register", function (req, res) {
		res.render("register.ejs", shopData);
	});

	app.post("/registered", function (req, res) {
		// saving data in database
		res.send(
			" Hello " +
				req.body.first +
				" " +
				req.body.last +
				" you are now registered!  We will send an email to you at " +
				req.body.email
		);
	});
    ////////////////////////////

    //////// LIST SECTION ///////
	app.get("/list", function (req, res) {
		let sqlquery = "SELECT * FROM books"; // query database to get all the books
		// execute sql query, return newData populated with all books
		db.query(sqlquery, (err, result) => {
			if (err) {
				res.redirect("./");
			}
			let newData = Object.assign({}, shopData, {
				availableBooks: result,
			});

            //render list page with books from database
			res.render("list.ejs", newData);
		});
	});
    ///////////////////////////////////

    //////// BARGAIN LIST SECTION ///////
	app.get("/bargainbooks", function (req, res) {
		let sqlquery = "SELECT * FROM books WHERE price<20"; // query database to get all the books
		// execute sql query, return newData with all books under <20
		db.query(sqlquery, (err, result) => {
			if (err) {
				res.redirect("./");
			}
			let newData = Object.assign({}, shopData, {
				availableBooks: result,
			});

            //render bargainbooks page with books from database matching price under 20
			res.render("bargain-books.ejs", newData);
		});
	});
    ///////////////////////////////////
};
