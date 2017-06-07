(function() {

	// THIS IS GOLDEN.
	/*
	
	Do away with the worry of SEO by placing your ad on dyrectry.com
	
	*/

	var
	DOWN_KEY = 40,
	UP_KEY = 38,
	ENTER_KEY = 13,
	toRadians = function(a) {
		
		return (a * Math.PI/180);

	};

	var StringBuilder = ROCK.defineClass("PUBLIC", "DYNAMIC", "StringBuilder", ROCK.createClass(ROCK.Collection, function() {}));
	StringBuilder.setProp("appendFormatted", function(a, b) {
		
		var c = a;
		for(var prop in b) {			
			c = c.replace("{" + prop  + "}", b[prop]);
		};
		this.append(c);

	});
	StringBuilder.setProp("prependFormatted", function(a, b) {
		
		var c = a;
		for(var prop in b) {			
			c = c.replace("{" + prop  + "}", b[prop]);
		};
		this.prepend(c);

	});

	var Dyrectry = ROCK.defineClass("PUBLIC", "DYNAMIC", "Dyrectry", ROCK.createClass(Object, function() {

		this.categories = new CategoryCollection();
		this.locations = new LocationCollection();
		this.adverts = new AdvertCollection();

	}));

	var User = Dyrectry.defineClass("PUBLIC", "DYNAMIC", "User", ROCK.createClass(Object, function() {

		// id
		// adverts
		// email
		// password

	}));

	var Advert = Dyrectry.defineClass("PUBLIC", "DYNAMIC", "Advert", ROCK.createClass(Object, function(id, name, phone, website, address, email) {

		this.id = id;
		this.name = name;
		this.phone = phone;
		this.website = website;
		this.address = address;
		this.email = email;
		this.src = this.getSrcURL(id);
		this.categories = new CategoryCollection();

	}));
	Advert.setProp("setCategory", function(a) {

		this.categories.append(dyrectry.categories.getItemByKeyValue("id", a));
		return this;

	});
	Advert.setProp("getSrcURL", function(a) {
		
		return ("/img/" + a + ".png");

	});
	Advert.setProp("getURL", function() {
		
		return ("http://" + this.website);

	});
	Advert.setProp("toHTML", function() {
		
		var 
		node = new ROCK.DOM.Div().attr("data-role", "ad"),
		ad = this;

		new ROCK.DOM.Img().attr("data-ad-role", "img").attr("width", "250").attr("height", "250").attr("src", ad.src).appendTo(node);
		
		var info = new ROCK.DOM.Div().attr("data-ad-role", "info").appendTo(node);
		var nameAndWeb = new ROCK.DOM.Div().attr("data-ad-role", "name-and-web").appendTo(info);
		new ROCK.DOM.Div().attr("data-ad-role", "name").html(ad.name).appendTo(nameAndWeb);
			
		if(ad.website) {
			var website = new ROCK.DOM.Div().attr("data-ad-role", "website").appendTo(nameAndWeb);
			new ROCK.DOM.Anchor().attr("target", "_blank").attr("href", ad.getURL()).attr("title", ad.website).html(ad.website).appendTo(website);
		};

		if(ad.email||ad.phone) {
			var contact = new ROCK.DOM.Div().attr("data-ad-role", "contact").appendTo(info);
		};

		if(ad.email) {
			var email = new ROCK.DOM.Div().attr("data-ad-role", "email").appendTo(contact);
			new ROCK.DOM.Anchor().attr("target", "_blank").attr("href", ("mailto:" + ad.email)).html(ad.email).appendTo(email);
		};

		if(ad.phone) {
			new ROCK.DOM.Div().attr("data-ad-role", "phone").html(ad.phone).appendTo(contact);
		};
		
		var address = new ROCK.DOM.Div().attr("data-ad-role", "address").appendTo(info);
		new ROCK.DOM.Anchor().attr("href", ad.address.latlng.getGoogleMapsURI()).attr("target", "_blank").html(ad.address.toHTML()).appendTo(address);
		
		return node;

	});
	Advert.setProp("getDailyYield", function() {

		return (this.costPerCategory*this.categories.length);

	});
	Advert.setProp("toSQL", function() {

		var 
		sb = new StringBuilder(),
		advert = this,
		address = advert.address;

		sb.append("INSERT INTO tblUser(UserName)");
		sb.append("VALUES (''The User Name'')");
		sb.append("SELECT @UserID = @@IDENTITY");

		sb.append("INSERT INTO tblAddress(UserID, Alias, Line1, Line2, Line3, Town, City, PostCode, Lat, Long)");
		sb.appendFormatted("VALUES (@UserID, '''', ''{LINE1}'', ''{LINE2}'', ''{LINE3}'', ''{TOWN}'', ''{CITY}'', ''{POSTCODE}'', {LAT}, {LONG})", {
			"LINE1": address.address, 
			"LINE2": "", 
			"LINE3": "", 
			"TOWN": address.place, 
			"CITY": "",
			"POSTCODE": address.postcode, 
			"LAT": address.latlng.lat, 
			"LONG": address.latlng.lng
		});
		sb.append("SELECT @AddressID = @@IDENTITY");
		
		sb.append("INSERT INTO tblAdvert(UserID, AddressID, Image, Name, Website, Telephone, Email)");
		sb.appendFormatted("VALUES (@UserID, @AddressID, ''{IMAGE}'', ''{NAME}'', ''{WEBSITE}'', ''{TEL}'', ''{EMAIL}'')", {
			"IMAGE": "",
			"NAME": advert.name,
			"WEBSITE": advert.website,
			"TEL": advert.phone,
			"EMAIL": advert.email
		});
		sb.append("SELECT @AdvertID = @@IDENTITY");

		sb.append("INSERT INTO tblAdvertPlacement(AdvertID, StartDate, EndDate)");
		sb.append("VALUES (@AdvertID, GETDATE(), ''22000101'')");

		advert.categories.each(function(category) {

			var sb2 = new StringBuilder();

			sb2.append("INSERT INTO tblAdvertCategory");
			sb2.appendFormatted("SELECT @AdvertID, (SELECT * FROM tblCategory WHERE Name = ''{NAME}'')", {
				"NAME": category.label
			});

			sb.append(sb2.join("\n"));

		});

		sb.append("\r");

		return sb.join("\n");

	});
	Advert.setProp("toJS", function() {

		var 
		output = new StringBuilder(),
		advert = this;

		output.appendFormatted("d.adverts.append(new d.Advert(\"{ID}\", \"{NAME}\", \"{PHONE}\", \"{WEB}\", new d.Address(\"{ADDRESS}\", \"{PLACE}\", \"{POSTCODE}\", new d.LatLng({LAT}, {LONG})), \"{EMAIL}\")", {
			"ID": advert.id,
			"NAME": advert.name,
			"PHONE": advert.phone,
			"WEB": advert.website,
			"ADDRESS": advert.address.address,
			"PLACE": advert.address.place,
			"POSTCODE": advert.address.postcode,
			"LAT": advert.address.latlng.lat,
			"LONG": advert.address.latlng.lng,
			"EMAIL": advert.email
		});

		this.categories.each(function(category) {			
			output.appendFormatted(".setCategory(\"{ID}\")", {
				"ID": category.id
			});
		});

		return (output.join("") + ");");

	});
	Advert.setProp("costPerCategory", 0.25);

	var AdvertCollection = ROCK.createClass(ROCK.Collection, function() {});
	AdvertCollection.setProp("toHTML", function() {

		var
		output = new ROCK.DOM.Div().attr("data-role", "ads");

		this.each(function(ad) {

			ad.toHTML().appendTo(output);

		});

		new ROCK.DOM.Div().attr("data-role", "clear").appendTo(output);

		return output;

	});
	AdvertCollection.setProp("getDailyYield", function() {

		var
		output = 0;

		this.each(function(ad) {

			output += ad.getDailyYield();

		});

		return output;

	});
	AdvertCollection.setProp("toSQL", function() {

		var 
		output = new StringBuilder();

		output.append("DECLARE @AddressID INT");
		output.append("DECLARE @UserID INT");
		output.append("DECLARE @AdvertID INT");
		output.append("\r");

		this.each(function(item) {
			output.append(item.toSQL());
		});

		return output.join("\n");

	});
	AdvertCollection.setProp("toJS", function() {

		var 
		output = new StringBuilder();

		this.each(function(item) {
			output.append(item.toJS());
		});

		return output.join("\n");

	});
	AdvertCollection.setProp("toAddressString", function() {

		var 
		output = new StringBuilder();

		this.each(function(item) {
			if(!item.address.latlng.lat) {
				output.append(item.address.toString());
			};
		});

		return output.join("\n");

	});
	AdvertCollection.setProp("getLatLngs", function() {

		var
		inc = 0,
		ads = this,
		max = ads.length,
		get = function() {
			
			ads[inc].address.getLatLng(function() {

				setTimeout(function() {
					if(inc<max) {
						get(inc);
						inc ++;
					};
				}, 1*1000);

			});

		};

		get();

	});
	
	var Category = Dyrectry.defineClass("PUBLIC", "DYNAMIC", "Category", ROCK.createClass(Object, function(id, label) {

		this.id = id;
		this.label = label;

	}));
	Category.setProp("getDisplayLabel", function() {

		return this.label.toLowerCase();

	});
	Category.setProp("toHTML", function() {

		return new ROCK.DOM.Div().attr("data-role", "category").html(this.label.toLowerCase());

	});
	Category.setProp("toSQL", function() {

		var output = new StringBuilder();

		output.append("INSERT INTO tblCategory(Name, Active, Deleted)");
		output.appendFormatted("VALUES (''{LABEL}'', 1, 0)", {
			"LABEL": this.label
		});

		return output.join("\n");

	});
	Category.setProp("toJS", function() {

		var output = new StringBuilder();

		return output.join("\n");

	});

	var CategoryCollection = ROCK.createClass(ROCK.Collection, function() {});
	CategoryCollection.setProp("toSQL", function() {

		var output = new StringBuilder();

		this.each(function(item) {
			output.append(item.toSQL());
		});

		return output.join("\n");

	});

	var Location = Dyrectry.defineClass("PUBLIC", "DYNAMIC", "Location", ROCK.createClass(Object, function(id, label, latlng) {

		this.id = id;
		this.label = label;
		this.latlng = latlng;
		this.type = 1;

	}));
	Location.setProp("getDisplayLabel", function() {

		return this.label.toLowerCase();

	});
	Location.setProp("toSQL", function() {

		var 
		output = new StringBuilder(),
		location = this;
		
		output.append("INSERT INTO tblLocation(Label, Long, Lat, [Type])");
		output.appendFormatted("VALUES (''{LABEL}'', {LONG}, {LAT}, {TYPE})", {
			"LABEL": location.label,
			"LONG": location.latlng.lng,
			"LAT": location.latlng.lat,
			"TYPE": location.type
		});

		return output.join("\n");

	});

	var LocationCollection = ROCK.createClass(ROCK.Collection, function() {});
	LocationCollection.setProp("toSQL", function() {

		var output = new StringBuilder();

		this.each(function(item) {
			output.append(item.toSQL());
		});

		return output.join("\n");

	});

	var Address = Dyrectry.defineClass("PUBLIC", "DYNAMIC", "Address", ROCK.createClass(Object, function(a, b, c, d) {

		this.address = a;
		this.place = b;
		this.postcode = c;
		this.latlng = d;

	}));
	Address.setProp("toHTML", function() {

		var output = new StringBuilder();

		if(this.address) {
			output.append(this.address);
		};

		if(this.place) {
			output.append(this.place);
		};

		if(this.postcode) {
			output.append(this.postcode);
		};

		return output.join("<br />");

	});
	Address.setProp("toString", function() {

		var output = new StringBuilder();

		if(this.address) {
			output.append(this.address);
		};

		if(this.place) {
			output.append(this.place);
		};

		if(this.postcode) {
			output.append(this.postcode);
		};

		return output.join(", ");

	});
	Address.setProp("getLatLng", function(fn) {

		var 
		geocoder = new google.maps.Geocoder(),
		address = this;

		geocoder.geocode({
			"address": address.toString()
		}, function(results, status) {
			
			if(status===google.maps.GeocoderStatus.OK) {

				var location = results[0].geometry.location;
				address.latlng.lat = location.lat();
				address.latlng.lng = location.lng();
				fn();

			};

		});

	});

	var AddressCollection = ROCK.createClass(ROCK.Collection, function() {});
	AddressCollection.setProp("toSQL", function() {

		var output = new StringBuilder();

		this.each(function(item) {
			output.append(item.toSQL());
		});

		return output.join("\n");

	});

	var LatLng = Dyrectry.defineClass("PUBLIC", "DYNAMIC", "LatLng", ROCK.createClass(Object, function(a, b) {

		this.lat = a;
		this.lng = b;

	}));
	LatLng.setProp("getDistance", function(location) {
		
		var lat1 = this.lat;
		var lon1 = this.lng;
		var lat2 = location.lat;
		var lon2 = location.lng;

		var R = 6371; // km
		var φ1 = toRadians(lat1);
		var φ2 = toRadians(lat2);
		var Δφ = toRadians(lat2-lat1);
		var Δλ = toRadians(lon2-lon1);

		var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
		var c = (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));

		var d = (R*c);

		return d;

	});
	LatLng.setProp("getGoogleMapsURI", function() {
		
		return ("http://maps.google.com/?q=" + [this.lat, this.lng].join(","));

	});
	LatLng.setProp("setLat", function(a) {
			
		this.lat = a;
		return this;

	});
	LatLng.setProp("setLng", function(a) {
			
		this.lng = a;
		return this;

	});

	var Parser = ROCK.defineClass("PUBLIC", "DYNAMIC", "Parser", ROCK.createClass(Object, function(a, b) {

		this.url = a;
		this.fn = b;

	}));
	Parser.setProp("parse", function() {

		var
		parser = this;

		$.ajax({
			url: this.url,
			complete: function(response) {

				var
				items = response.responseText,
				split = items.split("\r\n"),
				loop = split.length;

				parser.fn(split, loop);
			}
		});

	});

	var EventDispatcher = ROCK.defineClass("PRIVATE", "DYNAMIC", "EventDispatcher", ROCK.createClass(Object, function() {

		this.events = new ROCK.Collection();

	}));
	EventDispatcher.setProp("on", function(a, b) {

		this.events.append({name:a, handler: b});
		return this;

	});
	EventDispatcher.setProp("off", function(a, b) {

		
		return this;

	});
	EventDispatcher.setProp("trigger", function(a, b) {

		this.events.filter(function(e) {
			return e.name===a;
		}).each(function(e) {
			e.handler(b);
		});
		return this;

	});

	var AutoComplete = Dyrectry.defineClass("PUBLIC", "DYNAMIC", "AutoComplete", ROCK.createClass(EventDispatcher, function(data, label) {

		this.inherits();

		this.data = data;
		this.label = label;

		var
		_this = this,
		dyrectry = this.data,
		index = -1,
		wrap = this.wrap = new ROCK.DOM.Div().attr("data-role", "input"),
		count = 0,
		matched,
		val = "",
		oldVal = "",
		change,
		input = this.input = new ROCK.DOM.TextInput().attr("placeholder", this.label).on("keyup", function(e) {
			
			val = input.getValue();
			change = true;

			if(!val) {
				index = -1;
				autocomplete.attr("data-active", "false");
				oldVal = val;
				count = 0;
				return;
			};

			if(oldVal===val) {
				change = false;
			};

			oldVal = val;

			if(count>-1&&change) {

				autocomplete.attr("data-active", "false");
				autocompleteSelect.empty();
				index = -1;

				var
				regex = new RegExp(("^" + val), "i");

				matched = dyrectry.filter(function(tag) {

					return regex.test(tag.label);

				}).sort(ROCK.SORT.STRING_ASCENDING("label")).each(function(tag, d) {

					new ROCK.DOM.OptionNode().attr("data-auto-complete-role", "item").attr("value", tag.id).html(tag.getDisplayLabel()).appendTo(autocompleteSelect);

				});

				count = matched.length;

				if(count) {
					autocomplete.attr("data-active", "true");
				};

			};

		}).on("keydown", function(e) {

			if(!val) {
				return;
			};

			if(e.keyCode===UP_KEY) {
				if(index<=0) {
					index = count;	
				};				
				index --;
			}
			else if(e.keyCode===DOWN_KEY) {
				if(index===(count-1)) {
					index = -1;
				};
				index ++;
			}
			else if(e.keyCode===ENTER_KEY) {
				input.setValue(matched[index].getDisplayLabel());
				autocompleteSelect.setValue(matched[index].id);
				_this.trigger("change");
				autocomplete.attr("data-active", "false");
				count = -1;
			};
			
			if(index>-1) {
				autocompleteSelect.setValue(matched[index].id);
			};

		}).appendTo(wrap),
		autocomplete = new ROCK.DOM.Div().attr("data-role", "auto-complete").attr("data-active", "false").appendTo(wrap),
		autocompleteSelect = this.autocompleteSelect = new ROCK.DOM.Select().attr("id", dyrectry.uiid).attr("size", "10").appendTo(autocomplete);

	}));
	AutoComplete.setProp("render", function() {

		return this.wrap;

	});
	AutoComplete.setProp("clear", function() {

		this.input.setValue("");
		return this;

	});
	AutoComplete.setProp("getValue", function() {
		
		return this.autocompleteSelect.getValue();

	});
	
	dyrectry = d = new ROCK.Dyrectry();

})();