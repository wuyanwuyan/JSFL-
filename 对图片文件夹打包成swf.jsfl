var folderPath = fl.browseForFolderURL("select");

var folderName = folderPath.substring(folderPath.lastIndexOf("/") + 1);

var outFlaPath = folderPath +　"/" +　folderName　+ ".fla";
fl.trace(outFlaPath);
FLfile.write(outFlaPath,"");

var flaDom = fl.openDocument(outFlaPath);


importImages(folderName,flaDom,folderPath);

//flaDom.close(false);

//resFoldName 资源文件夹
	//dom 打开的fl.domcument对象
	//imageFolder 资源文件夹下的图片文件夹
	//addAsLink 是否加入as链接
	//foldName 导入图片时放入库中的文件夹
	//useLossLess 使用无损
function importImages(resFoldName, dom, imageFolder, addAsLink, foldName, useLossLess)
{
	var images = FLfile.listFolder(imageFolder);
	if(foldName == "")
	{
		dom.library.newFolder("use")
	}
	//文件夹的URI之后加上"/"
	if(imageFolder[imageFolder.length - 1] != "/")
	{
		imageFolder = imageFolder + "/"
	}
	var imageFile
	var newFoldName
	for (var i = 0; i < images.length; i++)
	{
		imageFile = imageFolder + images[i];
		fl.trace(imageFile);
		if(FLfile.exists(imageFile))
		{
			var imageFileAttr = FLfile.getAttributes(imageFile)
			if(imageFileAttr.indexOf("D") != -1)
			{
				//根据文件夹的文件名，在库中新建对应的文件夹
				newFoldName = (foldName == "" ? "use" : foldName) + "/" + images[i];
				dom.library.newFolder(newFoldName)
				importImages(resFoldName, dom, imageFile, false, newFoldName, useLossLess)
			}
			else
			{
				dom.importFile(imageFile, true);
				dom.library.moveToFolder(foldName == "" ? "use" : foldName, images[i], true)
			}
		}
	}
	//全部导入文件夹中的资源，添加as链接，设置压缩，发布swf
	if(foldName != "")
	{
		return;
	}
	var items = dom.library.items;
	var item;
	var linkUrl;
	var splitName;
	for (var j = 0; j < items.length; j++)
	{
		item = items[j];
		if(item.itemType == "bitmap" && item.name.indexOf("use") == 0)
		{
			//生成as链接
			splitName = item.name.split(".");
			linkUrl = splitName[splitName.length - 1] + "." + resFoldName;
			splitName = splitName[0].split("/");
			for (var k = 1; k < splitName.length; k++)
			{
				linkUrl = linkUrl + "." + splitName[k];
			}
			
			if(useLossLess)
			{
				item.compressionType = "lossless"
			}
			//fl.trace(items[j].name + items[j].itemType)
			item.linkageExportForAS = true;
			item.linkageExportInFirstFrame = true;
			item.linkageClassName = linkUrl;
		}
	}
	dom.save();
	dom.exportSWF(swfFolder + resFoldName + ".swf");
	fl.closeDocument(dom);
}