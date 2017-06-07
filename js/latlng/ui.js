(function() {
	
	var
	outputInput = $("#output"),
	data,
	count,
	inc = -1,
	timer,
	stopped = false,
	start = $("#start").on("click", function() {

		data = d.adverts;
		count = data.length;		
		get();

	}),
	stop = $("#stop").on("click", function() {

		stopped = true;
		outputInput.val(d.adverts.toJS());

	}),
	get = function() {

		if(stopped||inc===data.length) {
			return;
		};

		inc ++;

		data[inc].address.getLatLng(function() {

			outputInput.val("count:" + (inc+1));
			clearTimeout(timer);
			setTimeout(function() {
				get();
			}, 1*1000);

		});

	};

})();