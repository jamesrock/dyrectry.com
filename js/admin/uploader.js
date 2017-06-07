(function() {

	var 
	acceptedTypes = {
		"image/png": true,
		"image/jpeg": true
	};

	var Uploader = d.defineClass("PUBLIC", "DYNAMIC", "Uploader", ROCK.createClass(ROCK.DOM.FileInput, function Uploader() {

		var 
		uploader = this;

		this.inherits();

		this.on("change", function() {
			
			var reader = new FileReader();
			reader.onload = function(e) {

				uploader.trigger("fileselect", e.target.result);

			};
			reader.readAsDataURL(uploader.node.files[0]);

		});
		
	}));
	
})();