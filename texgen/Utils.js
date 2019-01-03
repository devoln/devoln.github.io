var ChromeVersion = function() {     
    var raw = navigator.userAgent.match(/Chrom(e|ium)\/(\d+)\./);
	if(!raw) return null;
    return parseInt(raw[2], 10);
}();
var BrowserIsIE = navigator.userAgent.indexOf("Trident") !== -1 || navigator.userAgent.indexOf("MSIE") !== -1;
var BrowserIsEdge = navigator.userAgent.indexOf("Edge") !== -1;

var TemplateStringSupport = false;
try {new Function( "`{2+2}`" ); TemplateStringSupport = true;} catch (err) {}

if(navigator.language === undefined) navigator.language = navigator.userLanguage

if(!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(searchString, position) {
      position = position || 0;
      return this.indexOf(searchString, position) === position;
    }
  });
}

if(typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

function ToQueryString(obj) {
  var str = [];
  for(var p in obj) if(obj[p] !== undefined && obj[p] != null)
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
  return str.join("&");
}

function Http(options)
{
	var xhr = new XMLHttpRequest();
	var query = ToQueryString(options.query || {});
	if(query) query = "?" + query;
	xhr.open(options.method || "GET", options.path + query, true);
	var headers = options.headers || {};
	for(var key in headers)
		xhr.setRequestHeader(key, headers[key]);
	var body = options.body;
	if(body && options.json)
	{
		xmlHttp.setRequestHeader('Content-Type', 'application/json')
		body = JSON.stringify(body);
	}
	xhr.send(body);
	xhr.onreadystatechange = function()
	{
		if(xhr.readyState != 4) return;
		if(xhr.status >= 400)
		{
			if(options.catch) options.catch(xhr);
			else alert("Error sending request to " + options.path + ":\n" + xhr.status + ': ' + xhr.statusText);
			return;
		}
		if(options.then) options.then(xhr);
		if(options.finally) options.finally(xhr);
	}
}

function Base64ToBuffer(base64)
{
    var binstr = atob(base64);
    var buf = new Uint8Array(binstr.length);
    Array.prototype.forEach.call(binstr, function(ch, i) {
      buf[i] = ch.charCodeAt(0);
    });
    return buf;
}

if(!HTMLCanvasElement.prototype.toBlob)
{
	Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob',
	{
		value: function(callback, type, quality)
		{
			if(HTMLCanvasElement.prototype.msToBlob && (!type || type === 'image/png'))
			{
				callback(this.msToBlob());
				return;
			}
			var binStr = this.toDataURL(type, quality).split(',')[1];
			callback(new Blob([Base64ToBuffer(binStr)], {type: type || 'image/png'}));
		}
	});
}

function IsEmptyString(str)
{
	return !str || str.trim() === "";
}

function EscapeHTML(str)
{
	return str.replace(/&/g,'&amp;')
		.replace(/</g,'&lt;')
		.replace(/>/g,'&gt;')
		.replace(/\n/g, '<br/>');
}

function Slugify(text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

function LoadShaderAsync(path)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', path, true);
	try {
		xhr.send();
	} catch(e) {
		return {code: ""};
	}
	var loader = {}
	xhr.onreadystatechange = function()
	{
		if(xhr.readyState != 4) return;
		if(xhr.status != 200)
		{
			alert("Couldn't load shader library:\n" + xhr.status + ': ' + xhr.statusText);
			return;
		}
		loader.code = xhr.responseText;
	}
	return loader;
}


function CreateBMPInMemory(pixelsRGBA8, width, height)
{
	var w4 = width * 4;
	var data32 = new Uint32Array(pixelsRGBA8.buffer);

	var stride = width * 4; // row length incl. padding
	var pixelArraySize = stride * height;            // total bitmap size
	var fileLength = 122 + pixelArraySize;           // header size is known + bitmap

	var file = new ArrayBuffer(fileLength);          // raw byte buffer (returned)
	var view = new DataView(file);                   // handle endian, reg. width etc.
	var pos = 0, x, y = 0, p, s = 0, a, v;

	// write file header
	setU16(0x4d42);          // BM
	setU32(fileLength);      // total length
	pos += 4;                // skip unused fields
	setU32(0x7a);            // offset to pixels

	// DIB header
	setU32(108);             // header size
	setU32(width);
	setU32(-height >>> 0);   // negative = top-to-bottom
	setU16(1);               // 1 plane
	setU16(32);              // 32-bits (RGBA)
	setU32(3);               // no compression (BI_BITFIELDS, 3)
	setU32(pixelArraySize);  // bitmap size incl. padding (stride x height)
	setU32(2835);            // pixels/meter h (~72 DPI x 39.3701 inch/m)
	setU32(2835);            // pixels/meter v
	pos += 8;                // skip color/important colors
	setU32(0x000000ff);        // red channel mask
	setU32(0xff00);          // green channel mask
	setU32(0xff0000);            // blue channel mask
	setU32(0xff000000);      // alpha channel mask
	setU32(0x57696e20);      // " win" color space
	
	new Uint8Array(file, 122).set(pixelsRGBA8);

	return file;

	// helper method to move current buffer position
	function setU16(data) {view.setUint16(pos, data, true); pos += 2}
	function setU32(data) {view.setUint32(pos, data, true); pos += 4}
}

function CreateBMPBlob(pixelsRGBA8, width, height)
{
	return new Blob([CreateBMPInMemory(pixelsRGBA8, width, height)], {type: "image/bmp"});
}

function CreateImageFromPixels(pixelsRGBA8, width, height)
{
	var img = new Image();
	img.setAttribute('crossOrigin', 'Anonymous');
	img.crossOrigin = "Anonymous";
	var blob = CreateBMPBlob(pixelsRGBA8, width, height);
	var blobUrl = URL.createObjectURL(blob);
	img.onload = function()
	{
		if(ChromeVersion && !BrowserIsEdge)
		{
			//Chrome cross origin bug workaround: it is necessary for future ImageToCanvas
			img.reviveCanvas = document.createElement("canvas");
			var ctx = img.reviveCanvas.getContext("2d");
			img.reviveCanvas.width = img.reviveCanvas.height = 1;
			ctx.drawImage(this, 0, 0, 1, 1);
		}
		URL.revokeObjectURL(blobUrl);
	};
	img.src = blobUrl;
	return img;
}


//Copied from FileSaver.js
var SaveBlob = SaveBlob || (function(view) {
	"use strict";
	if(typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent))
		return;
	var doc = view.document,
		get_URL = function() {
			return view.URL || view.webkitURL || view;
		}, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a"),
		can_use_save_link = "download" in save_link,
		click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}, is_safari = /constructor/i.test(view.HTMLElement) || view.safari,
		is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent),
		throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}, force_saveable_type = "application/octet-stream",
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		arbitrary_revoke_timeout = 1000 * 40, // in ms
		revoke = function(file)
		{
			var revoker = function() {
				if(typeof file === "string") get_URL().revokeObjectURL(file); // file is an object URL
				else file.remove();
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}, dispatch = function(filesaver, event_types, event)
		{
			event_types = [].concat(event_types);
			var i = event_types.length;
			while(i--)
			{
				var listener = filesaver["on" + event_types[i]];
				if(typeof listener === "function")
					try {listener.call(filesaver, event || filesaver);}
					catch (ex) {throw_outside(ex);}
			}
		}, auto_bom = function(blob)
		{
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		},
		FileSaver = function(blob, name, no_auto_bom)
		{
			if(!no_auto_bom) blob = auto_bom(blob);
			// First try a.download, then web filesystem, then object URLs
			var filesaver = this,
				type = blob.type,
				force = type === force_saveable_type,
				object_url,
				dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}, fs_error = function()
				{
					if((is_chrome_ios || (force && is_safari)) && view.FileReader)
					{
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; // release reference before dispatching
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					if(!object_url) object_url = get_URL().createObjectURL(blob);
					if(force) view.location.href = object_url;
					else
					{
						var opened = view.open(object_url, "_blank");
						if(!opened) view.location.href = object_url;
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				};
			filesaver.readyState = filesaver.INIT;

			if(can_use_save_link) 
			{
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}
			fs_error();
		},
		FS_proto = FileSaver.prototype,
		SaveBlob = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		};
		
	if(typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob)
	{
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";
			if(!no_auto_bom) blob = auto_bom(blob);
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
		FS_proto.onwritestart =
		FS_proto.onprogress =
		FS_proto.onwrite =
		FS_proto.onabort =
		FS_proto.onerror =
		FS_proto.onwriteend = null;

	return SaveBlob;
}(typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content));

if(typeof module !== "undefined" && module.exports) module.exports.SaveBlob = SaveBlob;
else if((typeof define !== "undefined" && define !== null) && (define.amd !== null))
	define("Utils.js", function() {return SaveBlob;});



function ImageToCanvas(img)
{
	var canvas = img.reviveCanvas? img.reviveCanvas: document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	var context = canvas.getContext('2d');
	context.drawImage(img, 0, 0);
	return [canvas, context];
}

function SaveCanvasPNG(canvas, filename)
{
	canvas.toBlob(function(blob) {
		SaveBlob(blob, filename);
	}, "image/png");
}

function SaveCanvasJPEG(canvas, filename, quality)
{
	canvas.toBlob(function(blob) {
		SaveBlob(blob, filename);
	}, "image/jpeg", quality);
}

function SaveCanvasWEBP(canvas, filename, quality)
{
	canvas.toBlob(function(blob) {
		SaveBlob(blob, filename);
	}, "image/webp", quality);
}

function SaveImagePNG(img, filename)
{
	SaveCanvasPNG(ImageToCanvas(img)[0], filename);
}

function SaveImageJPEG(img, filename, quality)
{
	SaveCanvasJPEG(ImageToCanvas(img)[0], filename, quality);
}

function SaveImageWEBP(img, filename, quality)
{
	SaveCanvasWEBP(ImageToCanvas(img)[0], filename, quality);
}

var gTempCanvas
function SaveCanvasBMP(canvas, filename)
{
	gTempCanvas = document.createElement("canvas");
	gTempCanvas.width = canvas.width;
	gTempCanvas.height = canvas.height;
	var ctx = gTempCanvas.getContext("2d");

	ctx.drawImage(canvas, 0, 0);
	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
	gTempCanvas.width = 0
	gTempCanvas.height = 0
	var blob = CreateBMPBlob(imageData, canvas.width, canvas.height);
	SaveBlob(blob, filename);
}

function SaveImageBMP(img, filename)
{
	var blob = CreateBMPBlob(ImageToCanvas(img)[1].getImageData(0, 0, img.width, img.height).data, img.width, img.height);
	SaveBlob(blob, filename);
}

function GetCookie(name)
{
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches? decodeURIComponent(matches[1]) : undefined;
}


function DBInsert(dbCollection, entry, onSuccess)
{
	var xhr = new XMLHttpRequest();

	var body = {
		"app": "815d6c32a3884ee5b7382faf349138b0",
		"cli": "e95b39465c1a4fcdbcf4da2dd08736e5",
		"coll": dbCollection,
		"doc": entry
	};

	xhr.open("POST", 'https://api.scorocode.ru/api/v1/data/insert', true);
	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.onreadystatechange = function() {
		if(this.readyState != 4) return;
		if(xhr.status != 200)
		{
			alert("Error inserting to DB:\nstatus: " + xhr.status + ': ' + xhr.statusText);
			return;
		}
		var result = JSON.parse(xhr.responseText);
		if(result.error)
		{
			if(result.result && result.result.startsWith("ALREADY_EXISTS_ID:"))
			{
				result.result = {_id: result.result.substr(18), duplicate: true};
				onSuccess(result.result);
			}
			else alert("Error inserting to DB:\n" + result.errMsg + "\nresult: " + result.result);
			return;
		}
		result.result.duplicate = false;
		onSuccess(result.result);
	}

	xhr.send(JSON.stringify(body));
}

function DBReadById(dbCollection, id, fields, onSuccess)
{
	DBQuery(dbCollection,
		{"_id": {"$eq": id}},
		function(results) {if(results[0] !== undefined) onSuccess(results[0]);},
		{fields: fields, limit: 1});
}

function DBQuery(dbCollection, query, onSuccess, params)
{
	var xhr = new XMLHttpRequest();

	var body = {
		app: "815d6c32a3884ee5b7382faf349138b0",
		cli: "e95b39465c1a4fcdbcf4da2dd08736e5",
		coll: dbCollection,
		query: query
	};
	if(params)
	{
		if(params.limit) body.limit = params.limit;
		if(params.skip) body.skip = params.skip;
		if(params.fields) body.fields = params.fields;
	}

	xhr.open("POST", 'https://api.scorocode.ru/api/v1/data/find', true);
	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.onreadystatechange = function() {
		if(this.readyState != 4) return;
		if(xhr.status != 200)
		{
			alert("Error querying from DB:\n" + xhr.status + ': ' + xhr.statusText);
			return;
		}
		var result = JSON.parse(xhr.responseText);
		if(result.error)
		{
			alert("Error querying from DB:\n" + xhr.errMsg);
			return;
		}
		onSuccess(BSON.deserialize(Base64ToBuffer(result.result)));
	}

	xhr.send(JSON.stringify(body));
}
