var Toolbox = function(pen){
	this.canvas = document.querySelector('canvas#slate');
	this.pen = pen;
}

/*********************TOOLBOX EVENTS**************************************/


Toolbox.prototype.displayCurrentSize = function(){
	var text, penSize;
	penSize = $('.pen-size').val();
	text = penSize+" px"
	$('.displaySize').text(text);
}

Toolbox.prototype.displayCurrentOpacity = function(){
	var text, penOpacity;
	penOpacity = $('.pen-opacity').val();
	text = penOpacity+" %"
	$('.displayOpacity').text(text);
}

Toolbox.prototype.getPickedColor = function(event){
    var color;
    color = this.colorpicker.getColorPicked();
    this.pen.setColorAsRgb(color[0], color[1], color[2]);
    $('#colorpicker').fadeOut('slow');
};



/********** Function Save **********/
