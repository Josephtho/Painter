
var Pen = function(){

	this.isDrawing = false;
	this.lineWidth = 1;
    this.lineColor = 'black';
    this.lastColor = 'black';
	this.lineOpacity = 1;
    this.lineCap   = "round";
    this.lineJoin  = "round";
    this.penType = PEN;
	// Méthode de configuration de la couleur du crayon (valeur HTML hexadécimale ou nom de couleur CSS prédéfini)
	Pen.prototype.setColor = function(color){
		this.lastColor = this.lineColor;
		this.lineColor = color;
		$('.currentcolor').css('background-color',this.lineColor);
		$('.lastcolor').css('background-color',this.lastColor);
		$('.lastcolor').data('penColor', this.lastColor);
	};

	Pen.prototype.setType = function(type){
		this.penType = type;
	}

	Pen.prototype.setSize = function(size){
		this.lineWidth = size;
	};

	Pen.prototype.setOpacity = function(opacity){
		this.lineOpacity = opacity/100;
	}

	Pen.prototype.setColorAsRgb = function(r, g, b){
		this.lastColor = this.lineColor;
		this.lineColor = 'rgb('+r+','+g+','+b+')';
		$('.currentcolor').css('background-color',this.lineColor);
		$('.lastcolor').css('background-color',this.lastColor);
		$('.lastcolor').data('penColor', this.lastColor);
	}
}