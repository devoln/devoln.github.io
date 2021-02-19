"use strict"

const ChromeVersion = function() {
    const raw = navigator.userAgent.match(/Chrom(e|ium)\/(\d+)\./);
	if(!raw) return null;
    return parseInt(raw[2], 10);
}();

function ToQueryString(obj) {
  let str = [];
  for(let p in obj) if(obj.hasOwnProperty(p) && obj[p] != null)
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
  return str.join("&");
}

async function Http(options)
{
	return new Promise(function(resolve, reject) {
		let xhr = new XMLHttpRequest();
		let query = ToQueryString(options.query || {});
		if (query) query = "?" + query;
		xhr.open(options.method || "GET", options.path + query, true);
		let headers = options.headers || {};
		for (const key in headers) {
			if (!headers.hasOwnProperty(key)) continue;
			xhr.setRequestHeader(key, headers[key]);
		}
		let body = options.body;
		if (body && options.json) {
			xhr.setRequestHeader('Content-Type', 'application/json')
			body = JSON.stringify(body);
		}
		xhr.send(body);
		xhr.onreadystatechange = function () {
			if (xhr.readyState !== 4) return;
			if (xhr.status >= 400) {
				reject(xhr);
				//alert("Error sending request to " + options.path + ":\n" + xhr.status + ': ' + xhr.statusText);
				return;
			}
			resolve(xhr);
		}
	});
}

function DeepEqual(object1, object2) {
	const keys1 = Object.keys(object1);
	const keys2 = Object.keys(object2);

	if(keys1.length !== keys2.length) return false;

	for(const key of keys1) {
		const val1 = object1[key];
		const val2 = object2[key];
		const areObjectsOrArrays =
			val1 != null &&
			val2 != null &&
			typeof val1 === 'object' &&
			typeof val2 === 'object';
		if(!areObjectsOrArrays && val1 !== val2) return false;
		if(areObjectsOrArrays && !DeepEqual(val1, val2)) return false;
	}
	return true;
}

function CreateEmptyObjectArray(length) {
	return new Array(length).fill({}).map(() => ({}));
}

function Base64ToBuffer(base64)
{
    const binStr = atob(base64);
    let buf = new Uint8Array(binStr.length);
    Array.prototype.forEach.call(binStr, function(ch, i) {
      buf[i] = ch.charCodeAt(0);
    });
    return buf;
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


function CreateBMPInMemory(pixelsRGBA8, width, height)
{
	const w4 = width * 4;
	const data32 = new Uint32Array(pixelsRGBA8.buffer);

	const stride = width * 4; // row length incl. padding
	const pixelArraySize = stride * height;            // total bitmap size
	const fileLength = 122 + pixelArraySize;           // header size is known + bitmap

	const file = new ArrayBuffer(fileLength);          // raw byte buffer (returned)
	let view = new DataView(file);                   // handle endian, reg. width etc.
	let pos = 0;

	// write file header
	setU16(0x4d42);          // BM
	setU32(fileLength);           // total length
	pos += 4;                     // skip unused fields
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
	let img = new Image();
	img.setAttribute('crossOrigin', 'Anonymous');
	img.crossOrigin = "Anonymous";
	let blob = CreateBMPBlob(pixelsRGBA8, width, height);
	let blobUrl = URL.createObjectURL(blob);
	img.onload = () => URL.revokeObjectURL(blobUrl);
	img.src = blobUrl;
	return img;
}

const SaveBlob = (function () {
	let a = document.createElement("a");
	document.body.appendChild(a);
	a.style.display = "none";
	return function (blob, filename) {
		const url = window.URL.createObjectURL(blob);
		a.href = url;
		a.download = filename;
		a.click();
		window.URL.revokeObjectURL(url);
	};
}());


function ImageToCanvas(img)
{
	let canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	let context = canvas.getContext('2d');
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

function SaveCanvasBMP(canvas, filename)
{
	let tempCanvas = document.createElement("canvas");
	tempCanvas.width = canvas.width;
	tempCanvas.height = canvas.height;
	let ctx = tempCanvas.getContext("2d");

	ctx.drawImage(canvas, 0, 0);
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
	tempCanvas.width = 0;
	tempCanvas.height = 0;
	const blob = CreateBMPBlob(imageData, canvas.width, canvas.height);
	SaveBlob(blob, filename);
}

function SaveImageBMP(img, filename)
{
	const imageData = ImageToCanvas(img)[1].getImageData(0, 0, img.width, img.height).data;
	const blob = CreateBMPBlob(imageData, img.width, img.height);
	SaveBlob(blob, filename);
}

function GetCookie(name)
{
	const matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches? decodeURIComponent(matches[1]): undefined;
}
