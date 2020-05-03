// This is the void, welcome.
//
// 02052020 le confinement bat son plein

// A star field class, the void is vast
function Starfield() {
  this.canvas = null;
  this.color = 'black';
  this.fps = 10;
  this.height = 0;
  this.width  = 0;
  this.depth  = 10000;
  this.stars = 300;
  this.speed = 100;
  this.view = Math.PI / 2;
  this.Rview = 0;
};

// A star object, dots of light in emptiness
function Star(x,y,z,r) {
  this.x = x;      // real x
  this.y = y;      // real y
  this.z = z;      // real depth
  this.r = r;      // real radius
  this.ax = 0;     // apparent x coord
  this.ay = 0;     // apparent y coord
  this.ar = 0;     // apparent radius
  this.dist = 0;   // distance observer/star
  this.cdist = 0;  // distance center line/star
  this.cangle = 0; // angle center line/observer-star line
  this.angle = 0;  // radial angle in view plane
};

// Initialize your window to the void 
Starfield.prototype.initialize = function(div) {
  var self = this;
  
  // Store the div
  this.containerDiv = div;
  self.width = window.innerWidth;
  self.height = window.innerHeight;
  self.Rview = Math.sqrt(self.height**2 + self.width**2)/2

  // Manage resize
  window.addEventListener('resize', function resize(event) {
    self.width = window.innerWidth;
    self.height = window.innerHeight
    self.Rview = Math.sqrt(self.height**2 + self.width**2)/2
    self.canvas.width = self.width;
    self.canvas.height = self.height;
    self.draw();
  });

  // Create the canvas
  var canvas = document.createElement("canvas");
  canvas.setAttribute("id",'canvas1')
  div.appendChild(canvas);
  this.canvas = canvas;
  this.canvas.width = this.width;
  this.canvas.height = this.height;
};

// Enter the void
Starfield.prototype.enterthevoid = function() {
  // Add stars
  var stars = [];
  for(var ii=0; ii<this.stars; ii++){
    var star = new Star(this.width * Math.random()*8-4*this.width , this.height*8* Math.random()-4*this.height,this.depth * Math.random(), 20);
    star.cdist = Math.sqrt((this.width/2 - star.x)**2 + (this.height/2 - star.y)**2);
    star.angle = Math.acos((star.x - this.width/2) / star.cdist) * Math.sign(star.y - this.height/2);
    stars[ii] = star
  };
  this.stars = stars;

  // Travel the void
  var self = this;
  this.intervalId = setInterval(function() {
    self.update()
    self.draw()
  }, 100 / this.fps);
};

// Witness the void
Starfield.prototype.draw = function() {
  // Emptiness
  var canvas = document.getElementById("canvas1");
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = this.color;
  ctx.fillRect(0,0,canvas.width,canvas.height);
  
  // Stars
  ctx.fillStyle = "#fffff0";
  for(var ii=0; ii<this.stars.length; ii++) {
    var star = this.stars[ii]
//     ctx.fillRect(star.x,star.y,star.z,star.z);
    ctx.beginPath();
    ctx.arc(star.ax,star.ay,star.ar,0,2*Math.PI);
    ctx.fill();
  };
};

// Travel the void
Starfield.prototype.update = function() {
  var dt = 1 / this.fps;
  for(var ii=0; ii<this.stars.length; ii++) {
    var star = this.stars[ii]
    star.z = star.z - dt * this.speed;
    star.dist = Math.sqrt((this.width/2 - star.x)**2 + (this.height/2 - star.y)**2 + star.z**2);
    star.cangle = Math.atan( star.cdist / star.z );
    star.ar = star.r/star.dist * this.Rview/this.view;
    var a = 2 * this.Rview * star.cangle / this.view
    star.ax = a * Math.cos(star.angle) + this.width/2
    star.ay = a * Math.sin(star.angle) + this.height/2

    if(star.z < 0) {
      star.z = this.depth;
    };
  };
};
