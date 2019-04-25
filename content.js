// Content.js

function init(){
	
	var exportButton = '<button class="ex-export-button">Export</button>';
	
	$('.info-more').prepend(exportButton);
	
}

init();

$(document).on('click', '.ex-export-button', function(){
	var exportButton = $(this);
	
	exportButton.text('OK');
	
	var item = exportButton.parent().parent().parent();
	var itemData = item.attr('qrdata');
	var productId = itemData.substring(itemData.indexOf("|")+1, itemData.lastIndexOf("|"));
	
	addProductId(productId);
});

function addProductId(id) {

	var productList = [];
	
	chrome.storage.local.get(null,function (obj){

		if(obj.extProductList === undefined){
			
			productList.push(id);
		
			chrome.storage.local.set({"extProductList": JSON.stringify(productList)});
			
		}else{
			productList = JSON.parse(obj.extProductList);
			
			if(!productList.includes(id)){
				productList.push(id);
				chrome.storage.local.set({"extProductList": JSON.stringify(productList)});
			}
			
		}
		
	});
	
}