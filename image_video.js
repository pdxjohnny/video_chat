var image_video = function image_video ( id )
{
	this.image_element = document.getElementById( id );
	this.page = this.image_element.src;
	this.running = false;
	return this;
}

image_video.prototype.get_image = function get_image ( page, callback )
{
	var xmlHTTP = new XMLHttpRequest();
	xmlHTTP.open('GET',page,true);
	xmlHTTP.responseType = 'arraybuffer';
	xmlHTTP.onload = function(e)
	{
		var binary = '';
		var bytes = new Uint8Array( this.response );
		var len = bytes.byteLength;
		for (var i = 0; i < len; i++) {
			binary += String.fromCharCode( bytes[ i ] );
		}
		var b64 = window.btoa( binary );
		var dataURL = "data:image/jpeg;base64," + b64;
		callback( page, dataURL );
	};
	xmlHTTP.send();
}

image_video.prototype.reload_image = function reload_image ( image_element, page, callback )
{
	this.get_image( page, function( page, data ) {
		image_element.src = data;
		if ( typeof callback === "function" )
		{
			callback();
		}
	});
}

image_video.prototype.start = function ()
{
	this.running = true;
	window.requestAnimationFrame( this.main.bind( this ) );
}

image_video.prototype.stop = function ()
{
	this.running = false;
}

image_video.prototype.main = function ()
{
	var callback = function ()
	{
		window.requestAnimationFrame( this.main.bind( this ) );
	}
	if ( this.running )
	{
		this.reload_image( this.image_element, this.page, callback.bind( this ) );
	}
}