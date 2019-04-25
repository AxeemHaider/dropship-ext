// Popup.js
var productList = [];
var selectedCategory;
var message;

var categoryURL = "https://octabyte-projects.appspot.com/categories";
var pushProductURL = "https://octabyte-projects.appspot.com/push_product";

$(document).ready(function(){
	showProductList();
	//showProductCategories();
	message = $('#message');
});

function showProductList(){

	var totalProducts = $('#total-products');
	var productListContainer = $('#products');
	var listLen;
	var html='';
	
	chrome.storage.local.get(null,function (obj){
		
		if(obj.extProductList != undefined){
			productList = JSON.parse(obj.extProductList);
			listLen = productList.length;
				
			for(var i=0; i<listLen; i++){
				html += productList[i]+'<br>';
			}
		}
		productListContainer.html(html);
		
		totalProducts.html(listLen);
		
	});
	
}

function showProductCategories(){
	
	var categoriesList = $('#categories-list');
	var html = '';
	
	chrome.storage.local.get(null,function (obj){

		if(obj.extProductcategories != undefined){
			
			var r = JSON.parse(obj.extProductcategories);
			
			for(var i=0; i<r.length; i++){
				html += '<option value="'+r[i].id+'" >'+r[i].name+'</option>';
			}	
			
			categoriesList.html(html);
		}
			
	});
}

$(document).on('click', '#sync-categories', function(){
	
	message.html('Sync categories...');
	var categoriesList = $('#categories-list');
	var html = '';
	
	$.get(categoryURL, function(r){
		
		chrome.storage.local.set({"extProductcategories": JSON.stringify(r)});
		
		for(var i=0; i<r.length; i++){
			
			html += '<option value="'+r[i].id+'" >'+r[i].name+'</option>';
			
		}
		
		categoriesList.html(html);
		
		message.html('Sync categories complet!!!');
	});
});

$(document).on('click', '#push-button', function(){
	pushProducts();
});

function pushProducts(){
	
	message.html('Sending...');
	
	selectedCategory = $('#category').val();
	
	var products = [];
	
	for(var i=0; i<productList.length; i++){
		products.push({
			productId: productList[i],
			category: selectedCategory
		});
	}
	
	$.ajax({
		type: 'POST',
		url: pushProductURL,
		data: JSON.stringify(products),
		success: function(response) { 
			console.log(response);
			message.html(response.task_complete);
			//chrome.storage.local.set({"extProductList": '[]'});
		},
		contentType: "application/json",
		dataType: 'json'
	});
	
	//chrome.storage.local.set({"extProductList": '[]'});
	
}

$(document).on('click', '#clear-push-product', function(){
	chrome.storage.local.set({"extProductList": '[]'});
	message.html('Cleared!');
});