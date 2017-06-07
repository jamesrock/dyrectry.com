(function() {

	/*
	
	sign-in (also sign-up)
	ads
		edit (perhaps a tab which can be opened)
		renew
		expires
		delete (where expired)
	account
		email (verified)
		password


	if no results are returned for a category; show 'create new category'
	tabs over to the right - of existing ads

	*/

	var body = new ROCK.DOM.Body();

	var exampleAd = new d.Advert("0", "", "", "", new d.Address("", "", "", new d.LatLng(0, 0), ""), "");

	var app = new ROCK.DOM.Div().attr("data-role", "app").prependTo(body);

	var uploadPane = new ROCK.DOM.Pane("02").appendTo(app);

	var img = new ROCK.DOM.Div().attr("id", "img").appendTo(uploadPane);

	var uploader = new d.Uploader();
	uploader.appendTo(uploadPane);

	var 
	nameAndWebPane = new ROCK.DOM.Pane("02").appendTo(app),
	nameWrap = new ROCK.DOM.FormField().appendTo(nameAndWebPane),
	name = new ROCK.DOM.TextField("name").appendTo(nameWrap),
	webWrap = new ROCK.DOM.FormField().appendTo(nameAndWebPane),
	web = new ROCK.DOM.TextField("web address").appendTo(webWrap),
	contactPane = new ROCK.DOM.Pane("02").appendTo(app),
	emailWrap = new ROCK.DOM.FormField().appendTo(contactPane),
	email = new ROCK.DOM.TextField("email").appendTo(emailWrap),
	phoneWrap = new ROCK.DOM.FormField().appendTo(contactPane),
	phone = new ROCK.DOM.TextField("phone").appendTo(phoneWrap),
	addressPane = new ROCK.DOM.Pane("02").appendTo(app),
	addressWrap = new ROCK.DOM.FormField().appendTo(addressPane),
	address = new ROCK.DOM.TextField("address").appendTo(addressWrap),
	placeWrap = new ROCK.DOM.FormField().appendTo(addressPane),
	place = new ROCK.DOM.TextField("place").appendTo(placeWrap),
	postcodeWrap = new ROCK.DOM.FormField().appendTo(addressPane),
	postcode = new ROCK.DOM.TextField("postcode").appendTo(postcodeWrap),
	renderAd = function() {
		
		img.empty();
		exampleAd.toHTML().appendTo(img);

	};

	renderAd();
	
	uploader.on("fileselect", function(src) {

		exampleAd.src = src;
		renderAd();
	
	});

	name.on("change", function() {

		exampleAd.name = name.input.getValue();
		renderAd();

	});

	web.on("change", function() {

		exampleAd.website = web.input.getValue();
		renderAd();

	});

	email.on("change", function() {

		exampleAd.email = email.input.getValue();
		renderAd();

	});

	phone.on("change", function() {

		exampleAd.phone = phone.input.getValue();
		renderAd();

	});

	address.on("change", function() {

		exampleAd.address.address = address.input.getValue();
		renderAd();

	});

	place.on("change", function() {

		exampleAd.address.place = place.input.getValue();
		renderAd();

	});

	postcode.on("change", function() {

		exampleAd.address.postcode = postcode.input.getValue();
		renderAd();

	});

	var
	categoriesPane = new ROCK.DOM.Pane("02").appendTo(app), 
	categoriesAutoCompleteWrap = new ROCK.DOM.FormField().appendTo(categoriesPane),
	categoriesAutoComplete = new d.AutoComplete(d.categories, "categories");

	categoriesAutoComplete.on("change", function() {
		
		var 
		categoryid = categoriesAutoComplete.getValue(),
		category = d.categories.getItemByKeyValue("id", categoryid);

		category.toHTML().appendTo(categoriesNode);

		categoriesAutoComplete.clear();

	});

	categoriesAutoComplete.render().appendTo(categoriesAutoCompleteWrap);

	var 
	categoriesNodeWrapWrap = new ROCK.DOM.FormField().appendTo(categoriesPane),
	categoriesNode = new ROCK.DOM.Div().appendTo(categoriesNodeWrapWrap).attr("id", "categories");

	var
	durationPane = new ROCK.DOM.Pane("02").appendTo(app),
	durationWrap = new ROCK.DOM.FormField().appendTo(durationPane),
	duration = new ROCK.DOM.Select().appendTo(durationWrap);

	duration.setItem("duration", "0");
	duration.setItem("to date", "-1");
	duration.setItem("1 week", "1");
	duration.setItem("2 weeks", "2");
	duration.setItem("4 weeks", "4");
	duration.setItem("8 weeks", "8");
	duration.setItem("16 weeks", "16");
	duration.setItem("32 weeks", "32");
	duration.setItem("64 weeks", "64");
	
	var 
	generateSQL = function() {
		
		var 
		SQLStting = new ROCK.StringBuilder(),
		SQL = new ROCK.DOM.TextArea().attr("rows", "10").attr("cols", "100").appendTo(body);

		SQLStting.append(d.categories.toSQL());
		SQLStting.append(d.locations.toSQL());
		SQLStting.append(d.adverts.toSQL());

		SQL.setValue(SQLStting.join("\n"));

	},
	generateAddresses = function() {
		
		var 
		SQLStting = new ROCK.StringBuilder(),
		SQL = new ROCK.DOM.TextArea().attr("rows", "10").attr("cols", "100").appendTo(body);

		SQLStting.append(d.adverts.toAddressString());

		SQL.setValue(SQLStting.join("\n"));

	};

	//generateSQL();
	//generateAddresses();

	//console.log(d.adverts.toJS());

	//new ROCK.TextArea().attr("rows", "10").attr("cols", "100").setValue(d.adverts.toJS()).appendTo(body);

})();