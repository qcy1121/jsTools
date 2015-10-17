# jsTools
my js tools,平常自己写的一些前端的js工具
--------------
1. imgToDataUrl 将图片文件转为DataUrl。仅现代浏览器支持
    一般用于将一下小的图标文件转成DataUrl，然后放入css文件，以减少请求量。
    
2. imgCompressByJs 上传图片前将图片压缩。移动端适用。//未完成
    将本地图片上传到服务器时，将图片压缩成指定大小（只能大概，不能精确）。
    
3. qiniuDelete 批量删除七牛Bucket里的文件.
    将七牛网页打开，打开相应的bucket，打开页面调试控制开console。配置代码中config里的bucket的值为要批量删除的bucket。将代码复制粘贴到控制台，回车。执行QTools.run()；以后可以修改其他参数，批量删除。