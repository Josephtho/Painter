
/******************** Dans le html **********/
//<button id="save">Save image as PNG</button>

/**************** Dans la fonction init **********/
//$('#save').click(onClickSaveImage)

/********** Function Save **********/


function onClickDownloadImage(){
    var canvas = document.querySelector('canvas#slate');
    var image = canvas.toDataURL();
    console.log(image);
    console.log(image.typeOf);
    var aLink = document.createElement('a');
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click");
/*On prompt l'utilisateur pour lui demander le nom du fichier*/
    aLink.download = window.prompt('Quel nom souhaitez-vous donner à votre image ?')+'.png';
    aLink.href = image;
    aLink.dispatchEvent(evt);
}

function onClickSaveImage(){
	var canvas = document.querySelector('canvas#slate');
    var image = canvas.toDataURL();
	if (typeof(Storage) !== "undefined") {
    	window.localStorage.setItem("imagesaved", image);
	} else {
    	window.alert('Sorry ! No web storage support...')
	}
}

function onSaveFlashAndConfirm(){

    var confirm = $('div#confirm');
    

  $('#slate').effect("transfer", { to: $("#save") }, 700, function(){confirm.fadeIn('slow', 'easeOutCubic', setTimeout(function(){
                confirm.fadeOut('slow', 'easeInExpo');}, 2000))});
};