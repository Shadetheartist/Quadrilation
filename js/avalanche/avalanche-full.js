var pressed = [];
var allowControls = true;
pressed[87] = false; //W
pressed[65] = false; //A
pressed[83] = false; //S
pressed[68] = false; //D

pressed[38] = false; // Up
pressed[40] = false; // Down
pressed[37] = false; // Left
pressed[39] = false; // Right

pressed[32] = false; //Space
pressed[13] = false; //Enter
pressed[16] = false; //Shift
pressed[17] = false; //ctrl
pressed[85] = false; //U

pressed[27] = false; //Escape

function Key(value, index) {
    this.value = value;
    this.index = index;
}

function Down(e) {
    if (allowControls || e.keyCode == 13 || e.keyCode == 27 ||  e.keyCode == 32)
        pressed[e.keyCode] = true;
}

function Up(e) {
    pressed[e.keyCode] = false;
}

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
    ctx.fillStyle = "#d6d6d6";
    var bordersize = 1;
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
    droppingBox.slomo = 0.2;
    p.render = function () {}
    var size = 1;
    for (var i = 0; i < p.rect.w; i += size) {
        for (var o = 0; o < p.rect.h; o += size) {
            var tempSize = size + Math.random() * 3;
            particles.push(new Particle(
                new Rectangle(p.rect.x + i, p.rect.y + o, tempSize, tempSize),
                new Point(Math.random() * ((i + Math.random() / 2) - p.rect.w / 2) / 4, Math.sin(i) + Math.random() / 2),
                ( Math.random() > 0.90)?"#000":"#FFF", -1
            ));
        }
    }
	p.speedMod = 1;
}

function aReset() {
    allowControls = true;
    players.length = 0;
    boxes.length = 0;
    droppingBox.slomo = 1;
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
    //var form = document.getElementById('scoreform');
    //form.className = "submit_score shown";
    //formIsShowing = true;
}

function hideform(){
    //var form = document.getElementById('scoreform');
    //form.className = "submit_score";
    //formIsShowing = false; 
    //focusTimout = null;
    //document.getElementById('form_name_input').blur();
    //aReset();
}

function onsubmitform(){
    //if(document.getElementById('form_name_input').value == "") return false;
    //hideform();
    //aReset();
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




var players = [];
var formIsShowing = false;
var _highestHeight = 600;
function Player() {
    this.rect = new Rectangle(floor.rect.x + players.length * 25 + floor.rect.w / 2, floor.rect.y - 100, 20, 30);
    this.vex = new Vector2(0, 0);
    this.jcd = new coolDown(120);
    this.color = "#FFF";
    this.jumping = false;
    this.contacting = new GameObject();
    this.maxspeed = 11.5;
    this.jumpheight = 12.8;
    this.onWall = false;
    this.onWall2 = false;
    this.wallDirection = 0;
    this.maxHeight = 0;
    this.d = 0;
    this.tilt = 0;
    this.tiltAmount = 4;
    //Stuff for determining score

    this.highestHeight = 600;
    this.speedMod = 1;
    this.speedmodresetter = [];
    //Pop up score bits
    this.score = 0;
    this.prevScore = 0;
    this.previousHighScore = 0;
    this.scoreColor = "lightblue";

    //A collection of 6 (0-5) previous contacting
    this.previouslyOn = [];
    this.wallSides = [];

    //Long jump
    this.jumpTime = 0;
    this.jumping2 = false;
    this.jumpCombo = 0;

    this.crossed = false;

    //strings of stuff
    this.listOfThingsThatHappened = [];
    var renderTimeout = null;
    this.render = playerRender;

}
Player.prototype.renderListOfThingsThatHappened = function (amount) {
    for (var i = 0; i < Math.min(this.listOfThingsThatHappened.length, amount); i++) {
        ctx.fillText(this.listOfThingsThatHappened[i], 10, (canvas.height - 30 * i) - 10);
    }
}

Player.prototype.update = function () {

    //reset
    if (pressed[13] || pressed[32] || pressed[27]) {
        aReset();
    }
    //************** EDGE CHANGE *******************************************

    //Flash score
    if (this.score != this.prevScore) {
        this.scoreColor = "#FFFFFF";
    }
    this.prevScore = this.score;
    this.scoreColor = ColorGen.addSaturation(this.scoreColor, -1);


    if (this.contacting != this.previouslyOn[0]) {
        this.onChangeContact();
        this.previouslyOn.unshift(this.contacting);
    }
    this.previouslyOn.length = 5;

    if (this.jumping) {
        this.jumpTime++;
    }

    if (this.jumping != this.jumping2 && !this.jumping) {
        this.onLand();
    }
    this.jumping2 = this.jumping;

    if (this.rect.y >= theTop)
    //*********************************************************************

    if (this.rect.y + heightZero < this.maxHeight) {
        this.maxHeight = Math.floor(this.rect.y + heightZero);
        if (this.maxHeight < highScore)
            highScore = this.maxHeight;
    }
    this.vex.y += environmentalVariables.gravity * environmentalVariables.gravityMod;

    if (this.vex.y > 120)
        this.vex.y = 120;

    //Jumping
    if ((pressed[87] || pressed[38]) && this.jcd.isCool()) {
        if (this.onWall && ((pressed[68] || pressed[39]) || (pressed[65] || pressed[37]))) {
            this.render = playerJumpRender;
            this.renderTimeout = setTimeout(this.wallJump.bind(this), 90);
        } else if (!this.jumping) {
            this.render = playerJumpRender;
            this.renderTimeout = setTimeout(this.jump.bind(this), 100);
        }
    }

    //Wall Scrolling
    if (this.rect.x + this.rect.w < 0) {
        this.rect.x = canvas.width;
        if (this.jumping) this.onCross();
    } else if (this.rect.x > canvas.width) {
        this.rect.x = -this.rect.w;
        if (this.jumping) this.onCross();
    }

    //Left/Right Controls
    if ((pressed[65] || pressed[37]) && this.vex.x > -this.maxspeed) {
        var x = .4 + (this.maxspeed - this.vex.x) / 40;
        this.vex.x -= x;
        this.tilt = -this.tiltAmount;
        if (this.vex.x > 0)
            this.vex.x -= x;
    } else if ((pressed[68] || pressed[39]) && this.vex.x < this.maxspeed) {
        var x = .4 + (this.maxspeed - this.vex.x) / 40;
        this.vex.x += x;
        this.tilt = this.tiltAmount;
        if (this.vex.x < 0)
            this.vex.x += x;
    } else if (!this.jumping) {
        this.vex.x *= this.contacting.friction;
        this.tilt = 0;
    } else {
        this.vex.x *= environmentalVariables.airFriction;
        this.tilt = 0;
    }
    if (this.vex.y != 0)
        this.jumping = true;


    //Calculate Camera Pos
    if (pressed[83] || pressed[40]) {
        cameraOffset = this.rect.y - 100;
    } else {
        cameraOffset = this.rect.y - 400;
    }
    //Floor Collision
    if (this.rect.y + this.rect.h + (this.vex.y) >= floor.rect.y) {
        this.vex.y = 0;
        this.rect.y = floor.rect.y - this.rect.h;
        this.contacting = floor;
        this.jumping = false;
    }

    if (isCollide(this.rect, new Rectangle(lava.x, lava.y, lava.w, lava.h))) {
        this.onLava();
        reset(this);
    }
    //APPLY MOVEMENT
    if (this.jumping && !(pressed[87] || pressed[38]) && this.vex.y < 0.1)
        this.vex.y += 0.12;


    this.rect.x += this.vex.x + this.contacting.vex.x * this.speedMod;
    this.rect.y += this.vex.y + (this.contacting.vex.y * droppingBox.slomo);

    if (this.rect.y < this.highestHeight) {
        this.onAscend();
    }



    //Important
    this.onWall = false;

    for (var i = 0; i < stoppedBoxes.length; i++)
        this.shitDetection(stoppedBoxes[i]);

    for (var i = 0; i < boxes.length; i++)
        this.hitDetection(boxes[i]);

    if (this.onWall != this.onWall2) {
        this.onLand(true);
    }
    this.onWall2 = this.onWall;

    //Wall Friction
    if (this.onWall && ((pressed[68] || pressed[39]) || (pressed[65] || pressed[37]))) {
        this.vex.y *= this.contacting.friction * .8;
        this.onHoldWall();
    }
    
    this.updateForm();
}

Player.prototype.deadUpdate = function () {
    if (!formIsShowing && (pressed[13] || pressed[32] || pressed[27]))
        aReset();
		
	clearTimeout(this.renderTimeout);
    for(var i = 0; i<this.speedmodresetter.length; i++){
        clearTimeout(this.speedmodresetter[i]);
    }
    if(this.speedMod > 1) this.speedMod = 1;
}

Player.prototype.jump = function (isOnWall) {
    if (!isOnWall) this.onJump();
    this.jumping = true;
    if(this.speedMod > 1) this.speedMod = 1;
    this.vex.y -= (this.jumpheight + this.contacting.vex.y / 2) * this.speedMod;
    this.render = playerRender;
}

Player.prototype.wallJump = function () {
    this.onWallJump();
    this.vex.y = 0;
    this.vex.x += 10 * this.wallDirection * this.speedMod;
    this.jump(true);
}
var playerRender = function () {
    ctx.fillStyle = this.color;

    ctx.save();
    ctx.translate(this.rect.x + this.rect.w / 2, this.rect.y + this.rect.h / 2 - cameraOffset);
    ctx.rotate(this.tilt * Math.PI / 180);
    ctx.translate(-(this.rect.x + this.rect.w / 2), -(this.rect.y + this.rect.h / 2 - cameraOffset));
    ctx.fillStyle = "#000";
    ctx.fillRect(this.rect.x, this.rect.y - cameraOffset, this.rect.w, this.rect.h);
    ctx.fillStyle = this.color;
    ctx.fillRect(this.rect.x + 1, this.rect.y + 1 - cameraOffset, this.rect.w - 2, this.rect.h - 2);

    ctx.restore();
}
var playerJumpRender = function () {
        ctx.fillStyle = this.color;

        ctx.save();
        ctx.translate(this.rect.x + this.rect.w / 2, this.rect.y + this.rect.h / 2 - cameraOffset);
        ctx.rotate(this.tilt * Math.PI / 180);
        ctx.translate(-(this.rect.x + this.rect.w / 2), -(this.rect.y + this.rect.h / 2 - cameraOffset));
        ctx.fillStyle = "#000";
        ctx.fillRect(this.rect.x - 2, this.rect.y - cameraOffset + 2, this.rect.w + 4, this.rect.h - 2);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.rect.x - 1, this.rect.y - cameraOffset + 3, this.rect.w + 2, this.rect.h - 4);
        ctx.restore();
    }
    //Moving

Player.prototype.hitDetection = function (box) {
    var a = this.rect;
    var b = box.GO.rect;

    if (isCollide(a, b)) {
        var distance = new Vector2(0, 0);
        this.contacting = box.GO;
        var centerA = new Vector2(a.x + a.w / 2, a.y + a.h / 2);
        var centerB = new Vector2(b.x + b.w / 2, b.y + b.h / 2);
        var temp = new Vector2(0, 0);

        if (centerA.x > centerB.x) {
            temp.x = a.x;
        } else {
            temp.x = a.x + a.w;
        }
        if (centerA.y > centerB.y) {
            temp.y = a.y;
        } else {
            temp.y = a.y + a.h;
        }
        centerA = temp;

        distance = new Vector2(centerB.x - centerA.x, centerB.y - centerA.y);
        distance.normalize();

        if (Math.abs(distance.x) / (b.w / b.h) > Math.abs(distance.y)) {
            if (!this.jumping) this.onLandOnWall();
            this.onWall = true;
            this.vex.x = 0;
            if (distance.x > 0) {
                this.wallDirection = -1;
                a.x = b.x - a.w;
            } else {
                this.wallDirection = 1;
                a.x = b.x + b.w;
            }
        } else {
            if (distance.y > 0) {
                if (this.vex.y > 0) {
                    this.vex.y = 0;
                    this.jumping = false;
                    a.y = b.y - a.h;
                }
            } else {
                if (this.vex.y < 0) {
                    this.onHitBottom();
                    this.rect.y -= this.vex.y;
                    this.vex.y = 0;
                }
                //Squished
                if (!this.jumping) {
                    this.onSquished();
                    reset(this);
                    return;
                }
            }
        }
    }


}

//Stopped
Player.prototype.shitDetection = function (box) {
    var a = this.rect;
    var b = box.rect;

    if (isCollide(a, b)) {
        var distance = new Vector2(0, 0);
        this.contacting = box;

        var centerA = new Vector2(a.x + a.w / 2, a.y + a.h / 2);
        var centerB = new Vector2(b.x + b.w / 2, b.y + b.h / 2);
        var temp = new Vector2(0, 0);

        //Nearest corner
        if (centerA.x > centerB.x) {
            centerA.x = a.x;
        } else {
            centerA.x = a.x + a.w;
        }
        if (centerA.y > centerB.y) {
            centerA.y = a.y;
        } else {
            centerA.y = a.y + a.h;
        }
        distance = new Vector2(centerB.x - centerA.x, centerB.y - centerA.y);
        distance.normalize();

        if (Math.abs(distance.x) / (b.w / b.h) > Math.abs(distance.y)) {
            this.onWall = true;
            this.vex.x = 0;
            if (distance.x > 0) {
                this.wallDirection = -1;
                a.x = b.x - a.w;
            } else {
                this.wallDirection = 1;
                a.x = b.x + b.w;
            }
        } else {
            if (distance.y > 0) {
                if (this.vex.y > 0) {
                    this.vex.y = 0;
                    this.jumping = false;
                    a.y = b.y - a.h;
                }
            } else {
                if (this.vex.y < 0) {
                    this.onHitBottom();
                    this.rect.y -= this.vex.y;
                    this.vex.y = 0;
                }
            }
        }
    }

}

Player.prototype.updateForm = function(){
    //document.getElementById("form_score").value = Math.round(this.score);
    //document.getElementById("form_height").value = Math.round(-Math.floor(this.highestHeight + heightZero) / 100);
    //document.getElementById("form_highest_height").value = Math.round(_highestHeight);
}
var boxes = [];
var stoppedBoxes = [];

var backgroundRects = [];

var maxy = 0;

function spawnQue(size, ratio, friction, vex, T) {
    spawnBox(size, ratio, friction, vex);
    setTimeout(spawnQue, T * 0.7 + (Math.random() * (T * 0.3)), size, ratio, friction, vex, T);
}

function spawnBox(size, ratio, friction, vex) {
    var x = 50 + Math.random() * (canvas.width - 100 - size);
    var y = 600;

    y = newHeight();
    x = checkValidPos(new Rectangle(x, y, size / ratio, size * ratio));

    if (!x)
        return;

    boxes.push(
        new droppingBox(
            new GameObject(
                new Rectangle(x, y, size / ratio, size * ratio),
                ColorGen.random((-0.0015*Math.pow((-(y+floor.rect.y)/100 - 100), 2) +10)),
                friction,
                new Vector2(0, vex)
            )
        )
    );
}

function newHeight() {
    var h = 0;

    if (h > players[0].rect.y - canvas.height * 2.75) {
        h = players[0].rect.y - canvas.height * 2.75;
    }
    return Math.round(h);
}

function checkValidPos(rect) {
    for (var i = 0; i < boxes.length; i++)
        if (isCollide(rect, boxes[i].GO.rect))
            return false;
    for (var i = 0; i < stoppedBoxes.length; i++)
        if (isCollide(rect, stoppedBoxes[i].rect))
            return false;

    return Math.round(rect.x);
}

function deleteBoxes() {
    for (var i = 0; i < boxes.length; i++)
        if (!boxes[i].on || isCollide(boxes[i].GO.rect, new Rectangle(lava.x, lava.y + 1000, lava.w, lava.h)))
            BetterSplice(i, boxes);
    for (var i = 0; i < stoppedBoxes.length; i++)
        if (isCollide(stoppedBoxes[i].rect, new Rectangle(lava.x, lava.y + 1000, lava.w, lava.h)))
            BetterSplice(i, stoppedBoxes);
    for (var i = 0; i < backgroundRects.length; i++)
        if (!backgroundRects[i].on)
            BetterSplice(i, backgroundRects);
    for (var i = 0; i < particles.length; i++)
        if (!particles[i].on)
            BetterSplice(i, particles);
    for (var i = 0; i < scoreNums.length; i++)
        if (!scoreNums[i].on)
            BetterSplice(i, scoreNums);
}

function droppingBox(GO) {
    this.GO = GO;
    this.on = true;
    
}
droppingBox.slomo = 1;
droppingBox.prototype.update = function () {

    if (this.GO.rect.y + this.GO.rect.h + this.GO.vex.y > floor.rect.y) {
        this.GO.rect.y = floor.rect.y - this.GO.rect.h;
        this.stop();
        return;
    }

    for (var i = 0; i < stoppedBoxes.length; i++)
        if (isCollide(this.GO.rect, stoppedBoxes[i].rect)) {
            if (this.on) {
                this.GO.rect.y = stoppedBoxes[i].rect.y - this.GO.rect.h;
                this.stop();
                return;
            }
        }

    for (var i = 0; i < boxes.length; i++)
        if (isCollide(this.GO.rect, boxes[i].GO.rect)) {

            if (this.GO.rect.w >= boxes[i].GO.rect.w)
                boxes[i].GO.vex.y = this.GO.vex.y;
            else
                this.GO.vex.y = boxes[i].GO.vex.y;

            if (!boxes[i].on) {
                this.stop();
                return;
            }
        }

    this.GO.rect.y += this.GO.vex.y * droppingBox.slomo;


}
droppingBox.prototype.stop = function () {
    var go = new GameObject(this.GO.rect, this.GO.color, this.GO.friction);
    go.draw = function(){
        ctx.fillStyle = ColorGen.addSaturation(this.color, -6);
        ctx.fillRect(this.rect.x, this.rect.y - cameraOffset, this.rect.w, this.rect.h);
        ctx.fillStyle = "#e5e5e5";
        var bordersize = 1;
        ctx.fillRect(this.rect.x + bordersize, this.rect.y + bordersize - cameraOffset, this.rect.w - bordersize*2, this.rect.h - bordersize*2);
    };
    stoppedBoxes.push(go);
    this.on = false;
}


var bmaxy = -600;

function bgRect(rect, v) {
    this.rect = rect;
    this.v = v;
    this.color = ColorGen.addSaturation(getRandomColor(), 0);
    this.on = true;
}
bgRect.prototype.draw = function () {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = d = this.v * 5;
    ctx.fillRect(this.rect.x, this.rect.y - cameraOffset * this.v, this.rect.w, this.rect.h);
    ctx.globalAlpha = 1;
}
bgRect.prototype.update = function () {
    this.rect.y += this.v;
    if (this.rect.y - cameraOffset * this.v > lava.y - cameraOffset)
        this.on = false;
}

function BGspawnQue(size, v) {
    spawnBGBox(size, v);
    setTimeout(BGspawnQue, 500, Math.random() * 30 + 4, v * Math.random() * 0.5 + 0.12);
}

function spawnBGBox(size, v) {
    backgroundRects.push(new bgRect(new Rectangle(Math.random() * canvas.width, players[0].rect.y + bmaxy, size, size), v));
    bmaxy -= 10;
}

var yMult = 0.25;

function minimap(rects, fitToRect) {

    var data = [];
    var xScale = fitToRect.w / canvas.width * yMult;
    var yScale = fitToRect.h / canvas.height * yMult;
    for (var i = 0; i < rects.length; i++) {
        var y = 0;
        var cr = new coloredRect(
            new Rectangle(
                fitToRect.x + rects[i].x * xScale,
                y = (fitToRect.y + rects[i].y * yScale) + fitToRect.h * (1 - yMult) - cameraOffset * yScale,
                rects[i].w * xScale,
                rects[i].h * yScale
            ),
            y / (fitToRect.y + fitToRect.h)
        );
        data.push(cr);
    }
    return data;
}

function coloredRect(rect, alpha) {
    this.rect = rect;
    this.alpha = alpha;
}
coloredRect.prototype.draw = function () {
    ctx.fillStyle = "#FFFFFF";
    ctx.globalAlpha = this.alpha;
    ctx.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
    ctx.globalAlpha = 1;
}


//particle Effects

var particles = [];

function Particle(rect, velocity, color, timer) {
    this.rect = rect;
    this.velocity = velocity;
    this.color = color;
    this.timer = (timer != -1) ? new coolDown(timer) : null;
    this.on = true;
    this.lavaHits = 0;
    this.lavaColor = "#FFF";
}
Particle.prototype.update = function () {
    if (this.timer != null && this.timer.isCool()) this.on = false;

    for (var i = 0; i < stoppedBoxes.length; i++) {
        if (isCollide(this.rect, stoppedBoxes[i].rect)) {
            if (this.rect.y < stoppedBoxes[i].rect.y) {
                this.velocity.y *= -0.6;
                this.rect.y = stoppedBoxes[i].rect.y - this.rect.h;
            }
            this.velocity.y *= 0.83;
            this.velocity.x *= 0.9;
        }
    }
    if (isCollide(this.rect, floor.rect)) {
        this.velocity.y *= -Math.random() * .8;
        this.velocity.x *= 0.7;
    }

    this.rect.x += this.velocity.x * droppingBox.slomo;
    this.rect.y += this.velocity.y * droppingBox.slomo;
    this.velocity.y += 0.02;
}
Particle.prototype.render = function () {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.rect.x, this.rect.y - cameraOffset, this.rect.w, this.rect.h);
}
Particle.spawn = function (config) {
    config.amount = config.amount || null;

    config.pos = config.pos || null;
    config.spawnWithin = config.spawnWithin || null;

    config.vex = config.vex || new Vector2();
    config.minSize = config.minSize || 0;
    config.maxSize = config.maxSize || 2;
    if (config.maxSize != null) config.maxSize -= config.minSize;

    config.minVex = config.minVex || 0;
    config.maxVex = config.maxVex || 1;
    if (config.maxVex != null) config.maxVex -= config.minVex;

    config.color = config.color || "#FFF";
    config.timer = config.timer || 2000;

    config.render = config.render || null;
    if (config.amount && config.spawnWithin) {
        for (var i = 0; i < config.amount; i++) {
            var size = config.minSize + Math.random() * config.maxSize;
            var rect = new Rectangle(
                config.spawnWithin.x + Math.random() * config.spawnWithin.w,
                config.spawnWithin.y + Math.random() * config.spawnWithin.h,
                size,
                size
            );
            var vex = new Vector2(
                config.vex.x + (config.minVex + Math.random() * config.maxVex) * randomSign(), config.vex.y + (config.minVex + Math.random() * config.maxVex) * randomSign()
            );
            var p = new Particle(rect, vex, config.color, (Math.random() * config.timer / 2) + config.timer / 2);
            if (config.render != null) p.render = config.render;
            if (config.update != null) p.update = config.update;

            particles.push(p);
        }
    }
}

var scoreNums = [];

function Score(config) {

    this.combinable = (config.combinable == false) ? config.combinable : true;
    this.value = config.value || 0;
    this.pos = config.pos || new Vector2(200, 200);
    this.vex = config.vex || new Vector2(0, -10);
    this.color = config.color || ((this.value >= 0) ? "#FFF" : "#f00");
    timer = config.timer || 1000;
    this.timer = new coolDown(timer);
    this.font = config.font || "25px Verdana, sans-serif Bold";
    this.on = true;
    this.opacity = 1;

    this.subtext = config.subtext || null;

    if (this.subtext instanceof Array) {
        if (this.subtext.length > 0) {
            this.subtext = this.subtext[Math.round(Math.random() * (this.subtext.length - 1))];
        }
    }

    this.subtextFont = config.subtextFont || Math.round(parseInt(this.font) / 1.5) + "px " + this.font.split('px ')[1];
    this.subtextColor = config.subtextColor || this.color;
    this.subtextChance = config.subtextChance || 1;



    this.supertext = config.supertext || null;
    this.supertextFont = config.supertextFont || Math.round(parseInt(this.font) / 2) + "px " + this.font.split('px ')[1];
    this.supertextColor = config.supertextColor || this.color;

    this.showSubtext = true;
    if (this.subtextChance <= Math.random()) {
        this.showSubtext = false;
    }

    this.getRect();

    scoreNums.push(this);
    return this;
}
Score.prototype.render = function () {
    if (this.on) {
        ctx.font = this.font;
        ctx.textAlign = "center";
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;

        if (this.value != 0)
            ctx.fillText(((this.value > 0) ? "+" : "") + this.value, this.pos.x, this.pos.y - cameraOffset);

        if (this.showSubtext) {
            ctx.font = this.subtextFont;
            ctx.fillStyle = this.subtextColor;
            ctx.fillText(this.subtext, this.pos.x, this.pos.y - cameraOffset + (parseInt(this.font) * 1.1));
        }
        if (this.supertext) {
            ctx.font = this.supertextFont;
            ctx.fillStyle = this.supertextColor;
            ctx.fillText(this.supertext, this.pos.x, this.pos.y - cameraOffset - (parseInt(this.font) * 1.1));
        }
        ctx.textAlign = "start";
        ctx.globalAlpha = 1;
    }
}
Score.prototype.update = function () {
    this.pos.x += this.vex.x;
    this.pos.y += this.vex.y;
    this.rect.y = this.pos.y - (parseInt(this.font) * 1.5);
    this.opacity -= 1 / this.timer.time * 16;
    this.vex.y *= .9;
    if (this.timer.isCool()) this.on = false;

    for (var i = scoreNums.length - 1; i > 0; i--) {
        if (scoreNums[i].on && scoreNums[i - 1].on) {
            if (scoreNums[i].combinable && scoreNums[i - 1].combinable) {
                if (isCollide(scoreNums[i].rect, scoreNums[i - 1].rect)) {
                    scoreNums[i - 1].pos.y = scoreNums[i].pos.y - scoreNums[i].rect.h;
                }
            }
        }
    }

}

Score.prototype.getRect = function () {
    var tempFont = ctx.font;

    var x = 0;
    y = 0;
    var width = 0,
        height = 0;

    ctx.font = this.font;
    width = Math.max(ctx.measureText(this.value).width, width);
    height = Math.max(parseInt(this.font), height);

    ctx.font = this.subtextFont;
    if (this.subtext != "" || this.subtext) width = Math.max(ctx.measureText(this.subtext).width, width);
    if (this.subtext != "" || this.subtext ) height = Math.max(parseInt(this.subtextFont), height);

    ctx.font = this.supertextFont;
    if (this.supertext != "" || this.supertext) width = Math.max(ctx.measureText(this.supertext).width, width);
    if (this.supertext != "" || this.supertext) height = Math.max(parseInt(this.supertextFont), height);

    this.rect = new Rectangle(
        this.pos.x - width / 2,
        this.pos.y - height / 2 - (parseInt(this.font)),
        width,
        height + parseInt(this.font) * 2
    );

    ctx.font = tempFont;
}

Player.prototype.onChangeContact = function () {
    this.listOfThingsThatHappened.unshift("changed Contact");
}

Player.prototype.onJump = function () {
    if (this.contacting.vex.y != 0) {
        this.onMovingJump();
    }
    if (this.rect.y > lava.y - 100) {
        this.onCloseCall();
    }
    Particle.spawn({
        amount: 4,
        color: "#000",
        spawnWithin: new Rectangle(this.rect.x, this.rect.y + this.rect.h / 2, this.rect.w, this.rect.h / 2),
        vex: new Vector2(this.vex.x / 8, -1),
        minSize: 1,
        maxSize: 2,
        maxVex: 1,
        minVex: 0
    });
    this.wallSides.length = 0;
}
Player.prototype.onMovingJump = function () {
    this.onComboUp();
    this.score += new Score({
        value: 2 * this.jumpCombo,
        pos: this.rect.center(),
        subtextChance: .4,
        supertext: (this.jumpCombo > 1) ? this.jumpCombo + "X COMBO" : null,
        subtext: ["Nice Jump", "Nice", "Cool", "Wow!", "Jeez", "Well Played", "OH!"]
    }).value;
}
Player.prototype.onHoldWall = function () {
    Particle.spawn({
        color: "#000",
        amount: Math.round(Math.random() * .55),
        spawnWithin: new Rectangle(this.contacting.rect.x + ((this.wallDirection > 0) ? this.contacting.rect.w : 0), this.rect.y, 2, this.rect.h),
        minSize: 1,
        maxSize: 2,
        maxVex: 1,
        minVex: 0
    });
}
Player.prototype.onWallJump = function () {
    if (this.contacting.vex.y != 0) {
        this.onMovingWallJump();
    }
    if (this.rect.y > lava.y - 100) {
        this.onCloseCall();
    }
    Particle.spawn({
        amount: 4,
        color: "#000",
        spawnWithin: new Rectangle(this.contacting.rect.x + ((this.wallDirection > 0) ? this.contacting.rect.w : 0), this.rect.y, 0, this.rect.h),
        minSize: 1,
        maxSize: 2,
        maxVex: 1,
        minVex: 0
    });
}
Player.prototype.onMovingWallJump = function () {
    this.listOfThingsThatHappened.unshift("Wall Jumped off moving");
    this.onComboUp();
    this.score += new Score({
        value: 5 * this.jumpCombo,
        pos: this.rect.center(),
        subtextChance: .4,
        supertext: (this.jumpCombo > 1) ? this.jumpCombo + "X COMBO" : null,
        subtext: ["Wall Jump", "Wall Jump", "Wall Jump", "Wall Jump", "Nice", "Cool", "Wow!", "Jeez", "Crazy Guy", "Happy Feet", "Wombo Combo", "That Aint Falco"]
    }).value;

}
Player.prototype.onLand = function () {
    if (this.onWall)
        this.onLandOnWall();
    else
    if (this.previouslyOn[0].vex.y == 0) {
        this.listOfThingsThatHappened.unshift("Landed after " + this.jumpTime);
        this.jumpTime = 0;
        this.jumpCombo = 0;
    } else {
        this.listOfThingsThatHappened.unshift("Landed on moving block after " + this.jumpTime);
        this.jumpTime = 0;
    }
    this.crossed = false;
}
Player.prototype.onLandOnWall = function () {
    this.wallSides.unshift(this.wallDirection);
    if (this.wallSides.length > 1) {
        if (this.wallSides[0] !== this.wallSides[1]) {
            if (this.crossed) {
                this.score += new Score({
                    value: 2,
                    pos: this.rect.center(),
                    showSubtext: false,
                    subtext: "Wall to wall"
                }).value;
            }
            this.crossed = false;
        }
        if (this.previouslyOn[0].vex.y == 0) {
            this.listOfThingsThatHappened.unshift("Landed on wall after " + this.jumpTime);
            this.jumpTime = 0;
        } else {
            this.onLandOnMovingWall();
        }
        this.wallSides.length = 2;
    }
}
Player.prototype.onLandOnMovingWall = function () {
    this.listOfThingsThatHappened.unshift("Landed on moving wall after " + this.jumpTime);
    if (this.wallSides.length > 1) {
        if (this.wallSides[0] !== this.wallSides[1] && this.jumpCombo != 0) {
            if (
                (this.wallSides[0] == 1 && (pressed[65] || pressed[37])) ||
                (this.wallSides[0] == -1 && (pressed[68] || pressed[39]))) {
                if (!this.crossed) {
                    this.score += new Score({
                        value: 1 * this.jumpCombo,
                        pos: this.rect.center(),
                        showSubtext: false,
                        subtext: "Wall to Wall"
                    }).value;
                } else {
                    this.score += new Score({
                        value: 2 * this.jumpCombo,
                        pos: this.rect.center(),
                        showSubtext: false,
                        subtext: "Wall to Wall + Crossed"
                    }).value;
                }
                this.crossed = false;
            }
        }
    }
}

Player.prototype.onHitBottom = function () {
    this.listOfThingsThatHappened.unshift("Hit Bottom of block");
    var speedmodamount = 0.1;
    this.speedMod -= speedmodamount;
    this.color = ColorGen.addSaturation(this.color, -2);
    this.speedmodresetter.push(setTimeout(function () {
        players[0].speedMod += speedmodamount;
        players[0].color = ColorGen.addSaturation(players[0].color, 2);
    }, 2000));

    this.score += new Score({
        value: -Math.floor((Math.random() * (this.score / 20) + 1)),
        pos: this.rect.center(),
        subtextChance: 0.5,
        subtext: ["OW!", "Ouch!", "My HEAD!", "Concussed"],
        color: "red"
    }).value;

    Particle.spawn({
        amount: 10,
        spawnWithin: new Rectangle(this.rect.x, this.rect.y + this.rect.h / 2 - 20, this.rect.w, this.rect.h / 2),
        vex: new Vector2(this.vex.x / 8, 4),
        color: "#F00",
        minSize: 1,
        maxSize: 2,
        maxVex: 1,
        minVex: 0
    });
}

Player.prototype.onCross = function () {
    if (this.jumping) {
        this.crossed = true;
    }
    this.listOfThingsThatHappened.unshift("Crossed");
}

Player.prototype.onComboUp = function () {
    this.listOfThingsThatHappened.unshift("Combo++");
        this.jumpCombo++;
}
Player.prototype.onDie = function () {
    if(this.score > this.previousHighScore){
        this.onHighScore();
    }    
	clearTimeout(this.renderTimeout);
    for(var i = 0; i<this.speedmodresetter.length; i++){
        clearTimeout(this.speedmodresetter[i]);
    }
	this.speedMod = 1;
    if(this.highestHeight == _highestHeight || this.score > 75) showform();
}
Player.prototype.onSquished = function () {
    this.listOfThingsThatHappened.unshift("Wall Jumped off moving");

    this.score += new Score({
        pos: this.rect.center(),
        timer: 2000,
        font: "40px Verdana, sans-serif Bold",
        subtext: ["Gross!", "Squished!", "Disgusting!", "Absolutely Halal.", "Unbelievable", "BLAM THIS PIECE OF CRAP!"],
        combinable: false
    }).value;
    this.onDie();
}
Player.prototype.onLava = function () {
    this.listOfThingsThatHappened.unshift("Fell In Lava");
    this.score += new Score({
        color: "#000",
        font: "40px Verdana, sans-serif Bold",
        timer: 2000,
        pos: this.rect.center(),
        subtext: ["It BURNS!", "YOLO", "AAUAUUUUUUUGHH!", "Never say 'die'...", "Wasted", "Absolutely Haram.", "Crispy!", "Hours. Literally Hours.", "Do you understand the implications?"],
        combinable: false
    }).value;
    this.onDie();
}
Player.prototype.onCloseCall = function () {
    this.listOfThingsThatHappened.unshift("Close Call");
    this.score += new Score({
        value: 2 * (this.jumpCombo + 1),
        pos: this.rect.center(),
        subtextChance: .75,
        subtext: ["Close Call", "Cutting it close", "Living On the Edge", "Yikes!", "Is that lava!?!"]
    }).value;
}
var avalanchemod = 1;
Player.prototype.onAscend = function () {
    this.highestHeight = this.rect.y;
    
    if(this.highestHeight < _highestHeight)
        _highestHeight = this.rect.y;
    
    if (-this.rect.y >= (10000*avalanchemod) + heightZero) {
        AVALANCHE(this);
    }
}

Player.prototype.onHighScore = function () {
    this.previousHighScore = this.score;
}

function AVALANCHE(player) {
    player.listOfThingsThatHappened.unshift("AVALANCHE");
    player.score += new Score({
        value: 200 * avalanchemod,
        pos: player.rect.center(),
        subtextChance: 1,
        subtext: ["AVALANCHE"],
        color: "White",
        font: "60px Verdana, sans-serif Bold",
        timer: 2000
    }).value;
    avalanchemod++;
}








var menuButtons = [];
var charSelect = function () {
    var menuCenter = canvas.width/2;
    menuButtons.push(new Button("Select Character", new Rectangle(100,100,100,100)));
};

function Button(text, rect, color){
    this.text = text;
    this.rect = rect || new Rectangle(100,100,100,100);
    this.color = color || "blue";    
}
Button.prototype.render = function(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
    ctx.fillStyle = "black";
    ctx.fillText(this.text, this.rect.x - ctx.measureText(this.text)/2, this.rect.y);
}

var menuLoop = function(){
    
}
var menuUpdate = function(){
    
}
var menuRender = function(){
    
}

var canvas, ctx;
var theTop = 200 * -100;
var cameraOffset = -410;
var heightZero = -600;
var highScore = 0;
var d = 0,
    q = 0;
var pausecd,
    holdUpdate, holdRender;
var floor;
var lava;

var MMCD;
var MiniMap;
var MMData;

var bgY2 = -100;
var bgY3 = -100;

var showDebug = false,
    gameOn = true;
var spawns;

var stars = [];

function init() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    floor = new GameObject(new Rectangle(0, 600, 1000, 1), "#5E3630", .66);
    lava = new Rectangle(0, 900, canvas.width, 2);
    pausecd = new coolDown(0);
    MMCD = new coolDown(0);
    MiniMap = new Rectangle(0, 0, 1000, 600);
    MMData = [];

    aReset();
    droppingBox.slomo = 1;
    spawns = [];
    if (gameOn) {
        spawns[0] = spawnQue(50, 1, 0.5, 3.6, 1900);
        spawns[1] = spawnQue(75, 1, 0.5, 3.5, 2100);
        spawns[2] = spawnQue(100, 1, 0.5, 3.4, 2200);
        spawns[3] = spawnQue(125, 1, 0.5, 3.4, 5300);
        spawns[4] = spawnQue(150, 1, 0.5, 3.2, 7600);
        spawns[5] = spawnQue(340, 1, 0.5, 3, 70000);
    } else {
        boxes.push(
            new droppingBox(
                new GameObject(
                    new Rectangle(300, 420, 100, 200),
                    "#000",
                    0.7,
                    new Vector2(0, 0)
                )
            )
        );
        boxes.push(
            new droppingBox(
                new GameObject(
                    new Rectangle(500, 450, 200, 100),
                    "#000",
                    0.7,
                    new Vector2(0, 0)
                )
            )
        );
        boxes.push(
            new droppingBox(
                new GameObject(
                    new Rectangle(740, 450, 200, 500),
                    "#000",
                    0.7,
                    new Vector2(0, 0)
                )
            )
        );
    }
    
    for(var i = 0; i<500; i++){
        var offset = 160*-100;
        stars.push(new Star(Math.random() * canvas.width, offset + Math.random()*canvas.height*16));
    }
    BGspawnQue(20, .5);
    main();
}

function Star(x, y){
    this.x = x;
    this.y = y;
    this.blinkcd = new coolDown(Math.random()*1500 + 300);
    this.blink = false;
    this.parallaxmod = Math.random()/3 + .3;
}
Star.prototype.render = function(){
    ctx.fillStyle = "#FFF";
    if(this.blink) ctx.fillRect(this.x, this.y - (cameraOffset) * this.parallaxmod, 2, 2);
    else ctx.fillRect(this.x, this.y - (cameraOffset) * this.parallaxmod, 1, 1);
    if(this.blinkcd.isCool()) this.blink = !this.blink;
};


///////////////////////////////////////////////////////////////////////////////render/////////////////////////////////////////////

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); - (200 * 100)
    //var backGround = ctx.createLinearGradient(0, 600 - cameraOffset / 2, 0, theTop / 2 - cameraOffset / 2);
    //backGround.addColorStop(1, "#000");
    //backGround.addColorStop(0.7, "#273b95");
    //backGround.addColorStop(0.3, "#455dc9");
    //backGround.addColorStop(0.15, "#901e46");
    //backGround.addColorStop(0, "#600000");
//
    //var bgLavaFilm = ctx.createLinearGradient(0, lava.y - cameraOffset, 0, lava.y - cameraOffset - 550);
    //bgLavaFilm.addColorStop(0, "rgb(223, 0, 0)");
    //bgLavaFilm.addColorStop(1, "rgba(223, 0, 0, 0)");
//
    //var fgLavaFilm = ctx.createLinearGradient(0, lava.y - cameraOffset, 0, lava.y - cameraOffset - 100);
    //fgLavaFilm.addColorStop(0, "rgb(194, 0, 0)");
    //fgLavaFilm.addColorStop(1, "rgba(194, 0, 0, 0)");

    //ctx.globalAlpha = 1;
    //ctx.fillStyle = backGround;
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    //ctx.globalAlpha = 1;

    //backdrop cityline
    //ctx.fillStyle = "#000";
    //ctx.fillRect(0, 600 - cameraOffset / 3, 1000, -120);
    //ctx.drawImage(backdrop, 0, -100 - cameraOffset / 3, 1000, 600);
    //ctx.drawImage(backdrop2, 0, bgY2 - cameraOffset / 4, 1000, 600);
    //ctx.drawImage(backdrop3, 0, bgY3 - cameraOffset / 6, 1000, 600);
    //ctx.fillStyle = "#000000";
    //ctx.fillRect(0, 490 - cameraOffset / 3, canvas.width, 2000);
	//    for (var i = 0; i < backgroundRects.length; i++)
    //    backgroundRects[i].draw();
    //ctx.globalAlpha = 0.5;
    //ctx.fillStyle = backGround;
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    //ctx.globalAlpha = 1;
    //end of city
    
    


    //ctx.fillStyle = bgLavaFilm;
    //ctx.fillRect(0, 600, canvas.width, -100000);


    ctx.fillStyle = "#000";
    ctx.fillRect(floor.rect.x, floor.rect.y - cameraOffset, floor.rect.w, floor.rect.h);
    for (var i = 0; i < stars.length; i++)
        stars[i].render();
    for (var i = 0; i < boxes.length; i++)
        boxes[i].GO.draw();
    for (var i = 0; i < stoppedBoxes.length; i++)
        stoppedBoxes[i].draw();
    for (var i = 0; i < players.length; i++)
        players[i].render();
    for (var i = 0; i < particles.length; i++)
        particles[i].render();
    for (var i = 0; i < menuButtons.length; i++)
        menuButtons[i].render();

    //ctx.fillStyle = fgLavaFilm;
    //ctx.fillRect(0, 600, canvas.width, -100000);

    
    ctx.fillStyle = "#F00";
    ctx.fillRect(lava.x, lava.y - cameraOffset, lava.w, 1);    
    ctx.fillStyle = "#000";
    ctx.fillRect(lava.x, lava.y + 1000 - cameraOffset, lava.w, 1);

    
    
    ctx.fillStyle = "#FFF";
    ctx.font = "30px Arial";
    ctx.fillText("Highest: " + -Math.floor(_highestHeight + heightZero) / 100 + "m", 10, 30);
    ctx.fillText("Current: " + -Math.floor(players[0].highestHeight + heightZero) / 100 + "m", 10, 60);
    
    ctx.fillText("Score: " + players[0].score, 10, 90); //Debug
    
    for (var i = 0; i < scoreNums.length; i++)
        scoreNums[i].render();

    ctx.font = "20px Arial";

    for (var i = 0; i < MMData.length; i++)
        MMData[i].draw();
    if (showDebug) {
        ctx.fillStyle = "lightblue";
        players[0].renderListOfThingsThatHappened(10);
        ctx.fillText(q, 10, 170); //Debug
        ctx.fillText(boxes.length, 10, 200); //Debug
        ctx.fillText(stoppedBoxes.length, 10, 230); //Debug
        ctx.fillText(backgroundRects.length, 10, 260); //Debug
        ctx.fillText(players[0].wallSides, 10, 290); //Debug

    }
}

function update() {
    
    if(formIsShowing && pressed[27]){
        hideform();
    }
    bgY2 += 0.5 / 3;
    bgY3 += 0.5 / 6;
    
    if (pressed[16]) {
        if (MMCD.isCool()) {
            var dataRects = [];
            for (var i = 0; i < boxes.length; i++)
                dataRects.push(new Rectangle(boxes[i].GO.rect.x, boxes[i].GO.rect.y, boxes[i].GO.rect.w, boxes[i].GO.rect.h));
            for (var i = 0; i < stoppedBoxes.length; i++)
                dataRects.push(new Rectangle(stoppedBoxes[i].rect.x, stoppedBoxes[i].rect.y, stoppedBoxes[i].rect.w, stoppedBoxes[i].rect.h));
            for (var i = 0; i < players.length; i++)
                dataRects.push(players[i].rect);
            MMData = minimap(dataRects, MiniMap);
        }
    } else {
        MMData.length = 0;
    }

    for (var i = 0; i < boxes.length; i++)
        boxes[i].update();
    for (var i = 0; i < backgroundRects.length; i++)
        backgroundRects[i].update();
    for (var i = 0; i < players.length; i++)
        players[i].update();
    for (var i = 0; i < particles.length; i++)
        particles[i].update();
    for (var i = 0; i < scoreNums.length; i++)
        scoreNums[i].update();

    if (lava.y > players[0].rect.y + 1500)
        lava.y = players[0].rect.y + 1500;



    if (gameOn)
        lava.y -= 0.63 * droppingBox.slomo;

    if (pressed[80] && pausecd.isCool()) {
        holdUpdate = update;
        holdRender = render;
        render = function () {};
        update = paused;
        pausecd = new coolDown(300);
    }

}

function paused() {
    ctx.fillStyle = "#FFF";
    ctx.font = "30px Arial";
    ctx.fillText("Paused", canvas.width / 2 - 100, canvas.height / 2 + 15);
    if (pressed[80] && pausecd.isCool()) {
        update = holdUpdate;
        render = holdRender;
        pausecd = new coolDown(500);
    }
}

function main() {
    requestAnimationFrame(main);
    update();
    render();
    deleteBoxes();
}

window.requestAnimationFrame = function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function ( /* function */ callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();
