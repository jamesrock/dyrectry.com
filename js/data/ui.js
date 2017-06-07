(function() {

	var
	body = new ROCK.DOM.Body(),
	categoriesParser = new ROCK.Parser("/categories.txt", function(split, loop) {
			
		var
		output = new ROCK.StringBuilder();

		while(loop--) {

			var 
			itemSplit = split[loop].split("\t");
			
			output.prependFormatted("d.categories.append(new d.Category(\"{ID}\", \"{LABEL}\"))", {
				"ID": itemSplit[0],
				"LABEL": itemSplit[1]
			});

		};

		new ROCK.DOM.TextArea().attr("rows", "10").attr("cols", "150").setValue((output.join(";\n") + ";")).appendTo(body);

	}),
	locationsParser = new ROCK.Parser("/locations2.txt", function(split, loop) {
			
		var
		output = new ROCK.StringBuilder();

		while(loop--) {

			var 
			itemSplit = split[loop].split("\t");
	
			output.prependFormatted("d.locations.append(new d.Location(\"{ID}\", \"{LABEL}\", new d.LatLng({LAT}, {LNG})))", {
				"ID": ROCK.GUID.get(),
				"LABEL": itemSplit[0],
				"LAT": itemSplit[1],
				"LNG": itemSplit[2]
			});

		};

		new ROCK.DOM.TextArea().attr("rows", "10").attr("cols", "150").setValue(output.join(";\n") + ";").appendTo(body);

	});

	//categoriesParser.parse();
	//locationsParser.parse();

})();