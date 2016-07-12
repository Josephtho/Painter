 /*
		http://mrdoob.com/projects/harmony/index.html#longfur
		http://sta.sh/muro/
		http://galacticmilk.com/sketchpad/  
*/
'use strict';

var Program = function(){
	this.pen = new Pen();
	this.canvas = new Canvas(this.pen);
	this.colorpicker = new ColorPicker();
	this.toolbox = new Toolbox(this.pen);
}

Program.prototype.onClickClearCanvas = function(event){
	this.canvas.clear();
};




Program.prototype.onDblClickGetColor = function(event){
  var div, fillColor;
  div = event.currentTarget;
  fillColor = $(div).data('penColor');
  this.canvas.fillColor(fillColor);
}

/*********************PEN EVENTS**************************************/

Program.prototype.onClickPenColor = function(event){
	var div, penColor;
  	div = event.currentTarget;
 	penColor = $(div).data('penColor');
	this.pen.setColor(penColor);
};

Program.prototype.onClickPenStyle = function(event){
	var tool, penType;
	tool = event.currentTarget;
	penType = parseInt($(tool).val());

	var cmdEvent = this.canvas.toggleColorsIfBrush(penType);

		if (cmdEvent == 'false'){
		$('#tool-color-picker').unbind('click');
		$('.pen-color+.pen-color').unbind('click');
		$('.lastcolor.pen-color').unbind('click');
		$('.pen-size').unbind('change');
		$('.pen-size').unbind('change');
	} else if (cmdEvent == 'true'){
		$('#tool-color-picker').click(this.onClickColorPicker.bind(this));
		$('.pen-color+.pen-color').click(this.onClickPenColor.bind(this));
		$('.lastcolor.pen-color').click(this.onClickPenColor.bind(this));
		$('.pen-size').change(this.getThenSetPenSize.bind(this));
		$('.pen-size').change(this.toolbox.displayCurrentSize.bind(this));
	}

	this.pen.setType(penType);

	var newTool = $(tool).html();
	$('.currenttool').html(newTool);
	

}

Program.prototype.getThenSetPenSize = function(event){
  var penSize;
  var input = event.currentTarget;
  penSize = input.value;
	this.pen.setSize(penSize);
};

Program.prototype.getThenSetPenOpacity = function(event){
	var penOpacity;
	var input = event.currentTarget;
	penOpacity = input.value;
	this.pen.setOpacity(penOpacity);
}

/**********************TOOLBOX EVENTS************************************************/


/**************************** COLOR PICKER EVENTS ***********************************/

Program.prototype.onClickColorPicker = function(event){
	$(this.colorpicker.canvas).fadeIn('slow');
	this.colorpicker.buildGradient();
};

Program.prototype.onEnterColorPickerShowPreview = function(event){
	$(this.colorpicker.previewer).fadeIn('slow');
}

Program.prototype.onLeaveColorPickerHidePreview = function(event){
	$(this.colorpicker.previewer).fadeOut('slow');
}
Program.prototype.showHoveringColor = function(event){
	this.previewColor = this.colorpicker.context.getImageData(event.offsetX, event.offsetY, 1, 1).data;
	
	$('#preview').css("background-color", 'rgb('+this.previewColor[0]+','+this.previewColor[1]+','+this.previewColor[2]+')');
}


/***********************Initialisation**********************************/

Program.prototype.start = function(){

	/************Events Image****************************************/
	$('#download').click(onClickDownloadImage);
	$('#save').click(onClickSaveImage);
	$('#save').click(onSaveFlashAndConfirm);
	$('#tool-clear-canvas').click(this.onClickClearCanvas.bind(this));

	/************Events ColorPicker****************************************/
	$('#tool-color-picker').click(this.onClickColorPicker.bind(this));
	$('#colorpicker').click(this.onClick);
	$('#colorpicker').mouseleave(this.onLeaveColorPickerHidePreview.bind(this));
	$('#colorpicker').mousemove(this.showHoveringColor.bind(this));
	$('#colorpicker').mouseenter(this.onEnterColorPickerShowPreview.bind(this));


	/************Events Pen****************************************/
	$('.pen-color+.pen-color').click(this.onClickPenColor.bind(this));
	$('.lastcolor.pen-color').click(this.onClickPenColor.bind(this));
	$('.pen-color+.pen-color').dblclick(this.onDblClickGetColor.bind(this));
	$('.pen-size').change(this.getThenSetPenSize.bind(this));
	$('.pen-size').change(this.toolbox.displayCurrentSize.bind(this));
	$('.pen-opacity').change(this.getThenSetPenOpacity.bind(this));
	$('.pen-opacity').change(this.toolbox.displayCurrentOpacity.bind(this));
	$('.tool').click(this.onClickPenStyle.bind(this));

	
  // Création d'un évènement spécifique à l'application.
   $(document).on('magical-slate:pick-color', this.toolbox.getPickedColor.bind(this));
   this.canvas.loadSavedImage(); 	
}
