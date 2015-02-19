function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Vector2(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}
Vector2.prototype.normalize = function () {
    var magnitude = Math.abs(Math.sqrt((this.x * this.x) + (this.y * this.y)));
    this.x /= magnitude;
    this.y /= magnitude;
};

function Rectangle(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}
Rectangle.prototype.center = function(){
    return new Vector2(this.x + this.w/2, this.y + this.h/2)
}

function GameObject(rect, color, friction, vex) {
    this.rect = rect || new Rectangle();
    this.color = color || "#FFF";
    this.friction = friction || 0.5;
    this.vex = vex || new Vector2();
};

GameObject.prototype.draw = function () {
    ctx.fillStyle = ColorGen.addSaturation(this.color, -6);
    ctx.fillRect(this.rect.x, this.rect.y - cameraOffset, this.rect.w, this.rect.h);
    ctx.fillStyle = this.color;
    var bordersize = 2;
    ctx.fillRect(this.rect.x + bordersize, this.rect.y + bordersize - cameraOffset, this.rect.w - bordersize*2, this.rect.h - bordersize*2);
}


//Utility Mehods **************************************************************************


function coolDown(time) {
    this.time = time;
    this.timeStarted = Date.now();
}
coolDown.prototype.isCool = function () {
    if (this.time + this.timeStarted <= Date.now()) {
        this.timeStarted = Date.now();
        return true;
    }
    return false;
};
coolDown.prototype.timeLeft = function () {
    return Date.now() - this.timeStarted + this.time;
};

function isCollide(a, b) {
    if ((a.y + a.h) >= (b.y) && (a.y <= (b.y + b.h))) {
        if ((a.x + a.w) >= (b.x) && (a.x <= (b.x + b.w))) return true;
        else return false;
    } else return false;
}

var environmentalVariables = {
    gravity: 0.47,
    airFriction: 0.8,
    gravityMod: 1
}

function getRandomColor(height) {
    height = height || 0;
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * height)];
    }
    return color;
}

function addSaturation(color, amount) {
    color = color.toUpperCase();
    var color = color.replace('#', '').split('');
    var letters = '0123456789ABCDEF'.split('');
    for (var i = 0; i < color.length; i++) {
        var newSaturation = 0;
        if (letters.indexOf(color[i]) + amount > 15) newSaturation = 15;
        else if (letters.indexOf(color[i]) + amount < 0) newSaturation = 0;
        else newSaturation = letters.indexOf(color[i]) + amount;
        color[i] = letters[newSaturation];
    }
    return "#" + color.join('');
}


var BetterSplice = function (index, arr) {
    for (var i = index, len = arr.length - 1; i < len; i++)
        arr[i] = arr[i + 1];
    arr.length = len;
    return arr;
}

function reset(p) {
    allowControls = false;
    pressed[87] = false; //W
    pressed[65] = false; //A
    pressed[83] = false; //S
    pressed[68] = false; //D

    pressed[38] = false; // Up
    pressed[40] = false; // Down
    pressed[37] = false; // Left
    pressed[39] = false; // Right
    p.update = p.deadUpdate;
    p.render = function () {}
    var size = 1;
    for (var i = 0; i < p.rect.w; i += size) {
        for (var o = 0; o < p.rect.h; o += size) {
            var tempSize = size + Math.random() * 3;
            particles.push(new Particle(
                new Rectangle(p.rect.x + i, p.rect.y + o, tempSize, tempSize),
                new Point(Math.random() * ((i + Math.random() / 2) - p.rect.w / 2) / 4, Math.sin(i) + Math.random() / 2),
                "#FFF", -1
            ));
        }
    }
	p.speedMod = 1;
}

function aReset() {
    allowControls = true;
    players.length = 0;
    boxes.length = 0;
    stoppedBoxes.length = 0;
    backgroundRects.length = 0;
    particles.length = 0;
    scoreNums.length = 0;
    maxy = -300;
    bmaxy = -600;
    bgY2 = -100;
    bgY3 = -100;
    frame = 0;
    avalanchemod = 1;
    cameraOffset = -410;
    cameraTarget = -410;
    lava = new Rectangle(0, 1000, canvas.width, canvas.height * 10);

    players.push(new Player());
}



function Difficulty(difficultyLevel) {
    this.lavaSpeed = 1 + (difficultyLevel - 1) / 5;
}

var alphabet = {
    hex: '0123456789ABCDEF'.split('')
}
function ColorGen() {
    
}

ColorGen.random = function (saturation) {
    if(saturation !== 0) saturation = saturation || 16;
    saturation = (saturation > 16) ? 16 : saturation;
    saturation = (saturation < 0) ? 0 : saturation;
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += alphabet.hex[Math.floor(Math.random() * saturation)];
    }
    return color;
}
ColorGen.addSaturation = function (color, amount) {
    var color = color.replace('#', '').split('');
    var letters = '0123456789ABCDEF'.split('');
    for (var i = 0; i < color.length; i++) {
        var newSaturation = 0;
        if (letters.indexOf(color[i]) + amount > 15) newSaturation = 15;
        else if (letters.indexOf(color[i]) + amount < 0) newSaturation = 0;
        else newSaturation = letters.indexOf(color[i]) + amount;
        color[i] = letters[newSaturation];
    }
    return "#" + color.join('');
}

function randomSign() {
    return Math.sign(Math.random() - 0.5);
}
var focusTimout;
function showform(){
    var form = document.getElementById('scoreform');
    form.className = "submit_score shown";
    formIsShowing = true;
}

function hideform(){
    var form = document.getElementById('scoreform');
    form.className = "submit_score";
    formIsShowing = false; 
    focusTimout = null;
    document.getElementById('form_name_input').blur();
    aReset();
}

function onsubmitform(){
    if(document.getElementById('form_name_input').value == "") return false;
    hideform();
    aReset();
}
function oncancelform(){
    hideform();
}

Math.sign = function sign(x) {
    x = +x // convert to a number
    if (x === 0 || isNaN(x))
        return x
    return x > 0 ? 1 : -1
}













