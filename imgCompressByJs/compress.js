/**
 * Created by Ian on 2015/9/1.
 */
$(function () {
	var IMG_FILE = "image/pngimage/jpeg";
	var opts = {
			done: function (dataURL, width, height, imgSize, fileName, mime_type) {

			},
			fail: function (msg) {

			},
			maxSize: 300000,//不是很准确，只能是大概的范围,
			maxWidth: 500,//
		},
		fileChangeHandler = function (opts) {
			var self = this;
			var files = self.files;
			if (!files.length) return;
			var file = files[0], fileName = file.name, fileSize = file.size, fileType = file.type;
			var fr = new FileReader();//new mOxie.FileReader();
			if (IMG_FILE.indexOf(fileType) != -1) {
				var $canvas = $('<canvas></canvas>'),
					canvas = $canvas[0],
					context = canvas.getContext('2d');
				var image;
				var callback = function (dataURL, width, height, imgSize, mime_type) {
					opts.done && opts.done.apply(self, [dataURL, width, height, imgSize, fileName, mime_type]);
					$canvas.remove();
					$canvas = canvas = context = image = null;
				};
				var drawImage = function (image) {
					var mime_type = fileType || "image/jpeg";
					//if(opts.output_format!=undefined && opts.output_format=="png"){
					//	mime_type = "image/png";
					//}
					var width = image.width, height = image.height, scale = 1, maxWidth = opts.maxWidth || 500;
					if (width > maxWidth) {
						scale = Math.floor(maxWidth / width), width = width * scale, height = height * scale;
					}
					var imgSize = fileSize * (scale * scale), maxSize = opts.maxSize, quantity = 1;
					if (imgSize > maxSize) {
						quantity = maxSize / imgSize;
						imgSize = maxSize;
					}
					canvas.width = width;
					canvas.height = height;
					context.drawImage(image, 0, 0, width, height);
					var dataURL = canvas.toDataURL(mime_type, quantity);
					if (dataURL.length <= 22) {//fix dataURL is black for some android version
						dataURL = image.src;
					}
					return callback(dataURL, width, height, imgSize, mime_type);
				};
				fr.onerror = function (fEvt) {
					var msg = "文件读取失败";
					opts.fail && opts.fail.apply(self, msg);
				};
				fr.onload = function (fEvt) {
					var target = fEvt.target;
					var result = target.result;
					image = new Image();
					var exif;
					image.onload = function () {
						drawImage.apply(null, [image]);
						image = fr = null;
					};
					image.src = result;
				};
				fr.readAsDataURL(file);
			} else {
				var msg = "文件格式不对"
				opts.fail && opts.fail(msg);
				return;
			}
		};
	$.fn.extend({imgCompress:function(opts){
		$(this).on("change.imgCompress",function(){
			fileChangeHandler(opts);
		})
	}})
})
