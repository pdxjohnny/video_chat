var image_video = function image_video ( id, page )
{
	this.image_element = document.getElementById( id );
	this.page = this.image_element.src;
	if ( typeof page !== "undefined" )
	{
		this.page = page;
	}
	this.b64 = false;
	this.running = false;
	return this;
}

image_video.prototype.get_image = function ( page, callback )
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
		callback( dataURL );
	};
	xmlHTTP.send();
}

image_video.prototype.get_plain = function ( page, callback )
{
	var xmlHTTP = new XMLHttpRequest();
	xmlHTTP.open( 'GET', page, true );
	xmlHTTP.onload = function(e)
	{
		if ( typeof callback === "function" )
		{
			callback( JSON.parse( this.response ) );
		}
	};
	xmlHTTP.send();
}

image_video.prototype.reload_image = function ( image_element, page, callback )
{
	if ( this.b64 )
	{
		this.get_plain( page, function( data ) {
			if ( data["image"] )
			{
				image_element.src = data["image"];
			}
			if ( typeof callback === "function" )
			{
				callback();
			}
		});
	}
	else
	{
		this.get_image( page, function( data ) {
			image_element.src = data;
			if ( typeof callback === "function" )
			{
				callback();
			}
		});
	}
}

image_video.prototype.reload = function ( callback )
{
	this.reload_image( this.image_element, this.page, callback );
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
		this.reload( callback.bind( this ) );
	}
}