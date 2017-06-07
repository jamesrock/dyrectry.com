(function() {

	var 
	body = new ROCK.DOM.Body(), 
	app = new ROCK.DOM.Div().attr("data-role", "app").appendTo(body),
	appHead = new ROCK.DOM.Div().attr("data-app-role", "head").appendTo(app),
	appHeadHead = new ROCK.DOM.Div().attr("data-app-head-role", "head").appendTo(appHead),
	appHeadBody = new ROCK.DOM.Div().attr("data-app-head-role", "body").appendTo(appHead),
	appHeadClear = new ROCK.DOM.Div().attr("data-role", "clear").appendTo(appHead),
	appBody = new ROCK.DOM.Div().attr("data-app-role", "body").appendTo(app),
	ads = new ROCK.DOM.Div().attr("data-role", "ad-wrap").appendTo(appBody),
	maxDistance = 10,
	filter = function() {

		var
		category = categories.getValue(),
		location = locations.getValue();

		//console.log(categories, category);
		//console.log(locations, location);

		if(!category||!location) {
			return;
		};

		var 
		locationObject = dyrectry.locations.getItemByKeyValue("id", location),
		output = dyrectry.adverts.filter(function(ad) {

			return !!(ad.categories.getItemByKeyValue("id", category)&&ad.address.latlng.getDistance(locationObject.latlng)<maxDistance);

		});

		//.sort(ROCK.SORT.STRING_ASCENDING("label"));
		
		ads.empty();
		output.toHTML().appendTo(ads);

	};

	var categories = new d.AutoComplete(dyrectry.categories, "anything");
	categories.render().appendTo(appHeadHead);

	var locations = new d.AutoComplete(dyrectry.locations, "anywhere");
	locations.render().appendTo(appHeadHead);

	categories.on("change", function() {
		filter();
	});
	locations.on("change", function() {
		filter();
	});

	dyrectry.adverts.toHTML().appendTo(ads);

	new ROCK.DOM.Anchor().html("sign-in").attr("href", "#").appendTo(appHeadBody);
	
	console.log("ad count: " + dyrectry.adverts.length);
	console.log("yield/day: £" + dyrectry.adverts.getDailyYield());

})();