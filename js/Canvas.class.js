


var Canvas = function(pen){
	// mes propriétés
	this.canvas 			 = document.querySelector('canvas#slate');
	this.context 			 = this.canvas.getContext('2d');
	this.pen           = pen;
  this.lastPoint     = [];
  this.points        = [];
	this.mouseLocation = null;
	this.isDrawing 		 = false;

    $(this.canvas).mousemove(this.onMouseMoveDraw.bind(this));
    $(this.canvas).mousedown(this.onMouseDownStartDraw.bind(this));
/*    $(this.canvas).click(this.onClickDrawCircle.bind(this));*/
    $(this.canvas).mouseup(this.onMouseUpStopDraw.bind(this));
};


Canvas.prototype.toggleColorsIfBrush = function(penType){
  if (penType == BRUSH){
    $('.pen-color:not(.black), .pen-size, li:first-of-type label, li:nth-of-type(2) label, p.displaySize').css('opacity','0.2');
    $('input').attr('disabled', true);
    var text="20 px";
    $('.displaySize').text(text);
    return 'false';

  } else if (this.pen.penType == BRUSH && penType != BRUSH){
    $('.pen-color:not(.black), .pen-size, li:first-of-type label, li:nth-of-type(2) label, p.displaySize').css('opacity','1');
    $('input').attr('disabled', false);
    $('.displaySize').text(this.pen.lineWidth+' px');
    return 'true';
  } else {
    return 'nothing mate';
  }
};


Canvas.prototype.fillColor = function(color){
  this.context.fillStyle = color;
  this.context.fillRect(0,0,this.context.canvas.width, this.context.canvas.height);
}



Canvas.prototype.drawStar = function(options) {
  var length = this.pen.lineWidth;
  this.context.save();
  this.context.translate(options.x, options.y);
  this.context.beginPath();
  this.context.globalAlpha = options.opacity;
  this.context.rotate(Math.PI / 180 * options.angle);
  this.context.scale(options.scale, options.scale);
  
  //Les étoiles sont multicolores si la couleur est noire.
  if (this.pen.lineColor == 'black'){
    this.context.strokeStyle = options.color;
  } else {
    this.context.strokeStyle = this.pen.lineColor;
  }
  this.context.lineWidth = options.width;
  for (var i = 5; i--;) {
    this.context.lineTo(0, length);
    this.context.translate(0, length);
    this.context.rotate((Math.PI * 2 / 10));
    this.context.lineTo(0, -length);
    this.context.translate(0, -length);
    this.context.rotate(-(Math.PI * 6 / 10));
  }
  this.context.lineTo(0, length);
  this.context.closePath();
  this.context.stroke();
  this.context.restore();
}

Canvas.prototype.addRandomPoint = function(event) {
  this.points.push({ 
  x: event.offsetX, 
  y: event.offsetY, 
  angle: getRandomInt(0, 180),
  width: ((getRandomInt(1,10)/3*this.pen.lineWidth)/8),
  opacity: Math.random(),
  scale: getRandomInt(1, 20) / 10,
  color: ('rgb('+getRandomInt(0,255)+','+getRandomInt(0,255)+','+getRandomInt(0,255)+')')
  });
}



Canvas.prototype.drawPixels = function(x, y) {
  for (var i = -10; i < 10; i+= 4) {
    for (var j = -10; j < 10; j+= 4) {
      if (Math.random() > 0.5) {
        this.context.fillStyle = ['red', 'orange', 'yellow', 'green', 
                         'light-blue', 'blue', 'purple'][getRandomInt(0,6)];
        this.context.fillRect(x+i, y+j, this.pen.lineWidth, this.pen.lineWidth);
      }
    }
  }
}

/*onmousedown*/
Canvas.prototype.onMouseDownStartDraw = function(event) {
  this.isDrawing = true;
  
  this.context.lineCap     = this.pen.lineCap;
  this.context.lineJoin    = this.pen.lineJoin;
  this.context.globalAlpha = this.pen.lineOpacity;
  this.context.strokeStyle = this.pen.lineColor;
  this.lastPoint = {x: event.offsetX, y: event.offsetY};
  // petite épaisseur pour le mode LINK
  if(this.pen.penType == LINK){
    this.context.lineWidth = 1;
    this.points.push({ x: event.offsetX, y: event.offsetY });
  } else {
    this.context.lineWidth   = this.pen.lineWidth;
  }
  if (this.pen.penType == STAR){
    this.addRandomPoint(event);
  }

};


/*onmouseup*/
Canvas.prototype.onMouseUpStopDraw = function(event) {
  this.isDrawing = false;
  this.points.length = 0;
};


/*onmousemove*/
Canvas.prototype.onMouseMoveDraw = function(event) {
  if (!this.isDrawing) return;

  var currentPoint = {x: event.offsetX, y: event.offsetY };
  var dist = distanceBetween(this.lastPoint, currentPoint);
  var angle = angleBetween(this.lastPoint, currentPoint);

  if(this.pen.penType == STAR){
    this.addRandomPoint(event);
    for (var i = 0; i < this.points.length; i++) {
      this.drawStar(this.points[i]);
    }
  } else if (this.pen.penType == LINK){
    this.points.push({ x: event.offsetX, y: event.offsetY });
    this.context.beginPath();
    this.context.moveTo(this.points[this.points.length - 2].x, this.points[this.points.length - 2].y);
    this.context.lineTo(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);
    this.context.stroke();
  
    for (var i = 0, len = this.points.length; i < len; i++) {
      dx = this.points[i].x - this.points[this.points.length-1].x;
      dy = this.points[i].y - this.points[this.points.length-1].y;
      d = dx * dx + dy * dy;

      if (d < this.pen.lineWidth*500) {
        this.context.beginPath();
        this.context.moveTo( this.points[this.points.length-1].x + (dx * 0.2), this.points[this.points.length-1].y + (dy * 0.2));
        this.context.lineTo( this.points[i].x - (dx * 0.2), this.points[i].y - (dy * 0.2));
        this.context.stroke();
        this.context.globalAlpha = 0.2;
      }
    }
  } else {
      for (var i = 0; i < dist; i++) {
        x = this.lastPoint.x + (Math.sin(angle) * i) - 25;
        y = this.lastPoint.y + (Math.cos(angle) * i) - 25;

        switch(this.pen.penType){
          case PEN:
          default:
            this.context.beginPath();
            this.context.moveTo(this.lastPoint.x, this.lastPoint.y);
            this.context.lineTo(currentPoint.x, currentPoint.y);
            this.context.stroke();
            break;
          case BRUSH:
            var img = new Image();
            img.src = 'img/brush/brush.png';
            this.context.drawImage(img, x, y);
            break;
          case DOTS:
            this.drawPixels(event.offsetX, event.offsetY);
            break;
        }
      }
      this.lastPoint = currentPoint;
    }
  };

  /*var p1 = this.points[0];
  var p2 = this.points[1];
  this.context.beginPath();
  this.context.moveTo(p1.x, p1.y);
  for (var i = 1, len = this.points.length; i < len; i++) {
    // we pick the point between pi+1 & pi+2 as the
    // end point and p1 as our control point
    var midPoint = midPointBtw(p1, p2);
    this.context.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
    p1 = this.points[i];
    p2 = this.points[i+1];*/
  
  // Draw last line as a straight line while
  // we wait for the next point to be able to calculate
  // the bezier control point
/*  this.context.lineTo(p1.x, p1.y);
  this.context.stroke();
};*/


/******************CLEAR & LOAD****************************/

Canvas.prototype.clear = function(){
  //Effacement de tout le contenu de l'ardoise
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  window.localStorage.removeItem('imagesaved');
};

Canvas.prototype.loadSavedImage = function(){
  if (window.localStorage.getItem('imagesaved') !== null) {
    var img = new Image;
    var img64=window.localStorage.getItem('imagesaved');
    img.src = img64;
    this.context.drawImage(img,0,0);
  } 
}




/************************ CODE DE DESSIN V1 *******************************/
/*

Canvas.prototype.onClickDrawCircle = function(event) {
  var location = this.getMouseLocation(event);
  this.context.beginPath();
  this.context.arc(location.x, location.y, this.pen.lineWidth/2, 0, 2*Math.PI);
  this.context.fillStyle = this.pen.lineColor;
  this.context.closePath()
; this.context.fill();
}

Canvas.prototype.onMouseDownStartDraw = function(event){
    this.mouseLocation = this.getMouseLocation(event);
    this.isDrawing = true;

}

Canvas.prototype.onMouseUpStopDraw = function(event){
    this.isDrawing = false;
}

Canvas.prototype.onMouseMoveDraw = function(event){


  if(!this.isDrawing) return;
  var location = this.getMouseLocation(event);

  this.context.lineWidth   = this.pen.lineWidth;
  this.context.lineCap     = this.pen.lineCap;
  this.context.lineJoin    = this.pen.lineJoin;
  this.context.globalAlpha = this.pen.lineOpacity;
  this.context.strokeStyle = this.pen.lineColor;


  this.context.beginPath();
  this.context.moveTo(this.mouseLocation.x, this.mouseLocation.y);
  this.context.lineTo(location.x, location.y);
  this.context.closePath();
  this.context.stroke();
  this.mouseLocation = this.getMouseLocation(event);
 };
 *****************************FIN CODE DESSIN V1*****************************************************/




/********************FUNCTION TO FLASH ON SAVE, DOESNT WORK***************/
/* Canvas.prototype.onSaveFlash = function(){
  $(this.canevas).fadeOut('fast', function(){
    $(this.canevas).fadeIn(400);
  })

  ;}*/

 
