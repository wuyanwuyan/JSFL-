var folderPath = fl.browseForFolderURL("select");

var folderName = folderPath.substring(folderPath.lastIndexOf("/") + 1);

var outFlaPath = folderPath.substring(0,folderPath.lastIndexOf("/")) +　"/" +　folderName　+ ".fla";

FLfile.write(outFlaPath,"");

var flaDom = fl.openDocument(outFlaPath);

importImages(folderPath,flaDom,"",folderName + "_");

flaDom.save();
flaDom.exportSWF(folderPath.substring(0,folderPath.lastIndexOf("/")) +　"/" +　folderName　+ ".swf");
flaDom.close(false);

function importImages(folderPath, dom, folderName,preHex, useLossLess)
{
	if(folderName)
	{
		dom.library.newFolder(folderName);
	}
	
	var fileList = FLfile.listFolder(folderPath, "files");
	for (var i = 0 , len = fileList.length ; i < len ; i++) 
	{
		var image = fileList[i];
		if(image.indexOf(".png") != -1 || image.indexOf(".jpg") != -1 || image.indexOf(".gif") != -1)
		{
			dom.importFile(folderPath + "/" + image, true);
			dom.library.moveToFolder(folderName, image, true);
		
			dom.library.selectItem((folderName ? folderName + "/" : folderName ) + image);
		
			var item = dom.library.getSelectedItems()[0];
		
			generateAsLink(item,preHex + image,useLossLess);
		}
	}
	
	var folders = FLfile.listFolder(folderPath,"directories");
	for(i = 0 , len = folders.length ; i < len ; i++ )
	{
		var subFolderName = folders[i];
		if(subFolderName.indexOf(".svn") == -1)
		{
			var newPreHex = preHex + subFolderName + "_";
			importImages(folderPath + "/" + subFolderName ,dom , (folderName ? folderName + "/" : folderName ) + subFolderName ,newPreHex,useLossLess );
		}
		
	}
}

function generateAsLink(item , linkClassName , useLossLess)
{
	item.linkageExportForAS = true;
	item.linkageExportInFirstFrame = true;
	item.linkageClassName = linkClassName;
	if(useLossLess)
	{
		item.compressionType = "lossless";
	}
}