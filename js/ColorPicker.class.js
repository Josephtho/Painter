var ColorPicker = function(){
	this.canvas = document.querySelector('canvas#colorpicker');
	this.previewer = document.querySelector('div#preview');
	this.context = this.canvas.getContext('2d');
	this.pickedColor = [];
	this.previewColor = [];

	$(this.canvas).click(this.onClick.bind(this));
	$(document).on('picked-color', this.getColorPicked.bind(this), this.pickedColor);
	// $(this.canvas).trigger('this', custom.getColorPicked, [this.pickedColor[0], this.pickedColor[1], this.pickedColor[2], this.pickedColor[3]]);
}

ColorPicker.prototype.getColorPicked = function(){
	return this.pickedColor;
}


ColorPicker.prototype.onClick = function(event){
	var eventColor = new Event('picked-color');
	this.pickedColor = this.context.getImageData(event.offsetX, event.offsetY, 1, 1).data;
    $.event.trigger('magical-slate:pick-color');
}


ColorPicker.prototype.buildGradient = function(){
	var gradientCol = this.context.createLinearGradient(0,0,this.canvas.width,0);
	var gradientBlack = this.context.createLinearGradient(0,this.canvas.height,0,0);

    gradientCol.addColorStop(0,    'rgb(255,   0,   0)');
    gradientCol.addColorStop(0.15, 'rgb(255,   0, 255)');
    gradientCol.addColorStop(0.32, 'rgb(0,     0, 255)');
    gradientCol.addColorStop(0.49, 'rgb(0,   255, 255)');
    gradientCol.addColorStop(0.66, 'rgb(0,   255,   0)');
    gradientCol.addColorStop(0.83, 'rgb(255, 255,   0)');
    gradientCol.addColorStop(1,    'rgb(255,   0,   0)');
	this.context.fillStyle = gradientCol;
	this.context.fillRect(5,5,this.canvas.width-10,this.canvas.height-10);



	gradientBlack.addColorStop(0, 'rgba(0,0,0,1)');
	gradientBlack.addColorStop(0.5, 'rgba(127,127,127,0)');
	gradientBlack.addColorStop(1, 'rgba(255,255,255,1)');

	this.context.fillStyle = gradientBlack;
	this.context.fillRect(5,5,this.canvas.width-10,this.canvas.height-10);
}

