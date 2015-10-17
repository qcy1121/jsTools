/**
 * Created by Ian on 2015/10/17.
 */
//https://portal.qiniu.com/bucket/setting/domain/default?bucket=pro-activity
// https://portal.qiniu.com/bucket/activity/files?marker=&limit=169&prefix= get
//https://portal.qiniu.com/bucket/activity/files?marker=eyJjIjowLCJrIjoiX2xvZy9hY3Rpdml0eS8yMDE1LTA5LTE5L3BhcnQwLmd6In0%3D&limit=130&prefix=   get
//https://portal.qiniu.com/bucket/activity/files/0/delete  formdata  bucket=activity&keys%5B%5D=jsLib%2Fwxjs.min.js&keys%5B%5D=marketing%2FbabyVote%2Fimages%2FLoading.gif&keys%5B%5D=marketing%2FbabyVote%2Fimages%2Farrow.png
//https://portal.qiniu.com/bucket/activity/files/0/delete formdata bucket=activity&keys%5B%5D=marketing%2FbabyVote%2Fscripts%2Fhammer.min.js
	var QTools = (function(){
		var config = {
			bucket :"activity",
			reg:/\.(js|png|css|jpg|jpeg|gif|gz)$/i
		}
		var webApi = (function () {
			var loadFiles = function (data) {
					var url = "//portal.qiniu.com/bucket/" + config.bucket+"/files",
						dftData = {
							marker:"",
							limit:169,
							prefix:""
						},d = {};

					$.extend(d,dftData,data);
					return $.ajax({url:url,data: d})
					/*
					var res = {
						"bucketType": "public",
						"hasMore": true,
						"hasSensitiveWord": false,
						"items": [{
							"fsize": 9338,
							"hash": "Fs5mLQg5HIZfKsVELDKxAe8ZJyYq",
							"key": "_log/activity/2015-03-28/part0.gz",
							"mimeType": "application/x-gzip",
							"putTime": 1.4277202197254368e+16,
							"signed_download_url": "http://7vihri.com1.z0.glb.clouddn.com/_log/activity/2015-03-28/part0.gz?attname=\u0026e=1445150793\u0026token=XWce5BqDs_9nqcC67N-vBRUfBKhm2LtlaKmhIvwP:dff228WDMJCLu4s3iiLFLZ1jf-o"
						}],
						"marker": "eyJjIjowLCJrIjoiX2xvZy9hY3Rpdml0eS8yMDE1LTA5LTE5L3BhcnQwLmd6In0="
					}
					*/
				},
				deleteFiles = function (arr) {
					var url = config.deleteUrl = "//portal.qiniu.com/bucket/" + config.bucket + "/files/0/delete",
						//keys = typeo
						data = {
							bucket: config.bucket,
							"keys":arr
						}
					return $.ajax({url:url,data:data,type:'POST'});
					/*
					{
						"error": null,
						"failed_keys": []
					}
					*/
				}
			return {
				loadFiles: loadFiles,
				deleteFiles:deleteFiles
			}
		})();

		var loadFileList = function (data) {
			var dfd = $.Deferred();
			webApi.loadFiles(data).done(function (res) {
				if(res&&res.items) {
					dfd.resolve(res);
				}else{
					dfd.reject("返回类型错误！");
				}
			}).fail(function(){
				dfd.reject("获取文件列表请求失败");
			})
			return dfd.promise();
			}, loadAllFiles = function () {
				var da = [],dfd = $.Deferred();
				var pushData = function(data){
					var temp = [];
					data.forEach(function(d,i){
						var name = d.key;
						if(filter(name)){
							//temp.push(d);
							temp.push(name);
						}
					})
					da = da.concat(temp);
					},loadData = function(data){
					data = data||{};
					loadFileList(data).done(function(res){
						pushData(res.items);
						data.marker = res.marker;
						if(res.hasMore) {
							loadData(data);
						}else{
							dfd.resolve(da);
						}
					}).fail(function(res){
						dfd.reject(res);
					})

				}
				loadData({});
				return dfd.promise();
			},
			refresh = function () {
				$("#refresh").click();
			}, filter = function (fileName) {
				return config.reg.test(fileName);
			},
			deleteAllFiles=function(arr){
				var dfd = $.Deferred(),failArr=[],delArr = [];
				var len = arr.length-1,step = 100,start = 0,end = 0;
				while(end<len) {
					end+=step;
					if(end>len)end = len;
					//console.log(start,end,len);
					delArr.push(arr.slice(start,end));
					start = end;
				};

				var del = function(data){

					if(!data||!data.length){
						dfd.resolve(failArr);
						return;
					}
					webApi.deleteFiles(data).done(function(res){
						//if(res.error!="null"){
						//
						//}
						if(res.failed_keys.length){
							failArr = failArr.concat(res.failed_keys);
						}else{

						}
						del(delArr.pop());
					}).fail(function(res){
						dfd.reject("删除出错了");
					})
				}
				del(delArr.pop());
				return dfd.promise();
			},
		main = function(){
			loadAllFiles().done(function(arr){
				deleteAllFiles(arr).done(function(res){
					if(res&&res.length){
						res.forEach(function(d,i){
							console.log("删除失败文件： "+d);
						})
					}
					refresh();
				})
			})
		}
		return {
			run:main,
			setFilter: function(fun){
				filter = fun;
			},
			setBucket:function(bucket){
				config.bucket = bucket;
			}
		}
	})()