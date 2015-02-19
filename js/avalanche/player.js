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

        if (pressed[17])
            droppingBox.slomo = 0.5;
        else
            droppingBox.slomo = 1;

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

    //APPLY MOVEMENT
    if (this.jumping && !(pressed[87] || pressed[38]) && this.vex.y < 0.1)
        this.vex.y += 0.12;


    this.rect.x += this.vex.x + this.contacting.vex.x * this.speedMod;
    this.rect.y += this.vex.y + (this.contacting.vex.y * droppingBox.slomo);

    if (this.rect.y < this.highestHeight) {
        this.onAscend();
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
    ctx.fillRect(this.rect.x, this.rect.y - cameraOffset, this.rect.w, this.rect.h);

    ctx.restore();
}
var playerJumpRender = function () {
        ctx.fillStyle = this.color;

        ctx.save();
        ctx.translate(this.rect.x + this.rect.w / 2, this.rect.y + this.rect.h / 2 - cameraOffset);
        ctx.rotate(this.tilt * Math.PI / 180);
        ctx.translate(-(this.rect.x + this.rect.w / 2), -(this.rect.y + this.rect.h / 2 - cameraOffset));
        ctx.fillRect(this.rect.x - 2, this.rect.y - cameraOffset + 2, this.rect.w + 4, this.rect.h - 2);

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
    document.getElementById("form_score").value = Math.round(this.score);
    document.getElementById("form_height").value = Math.round(-Math.floor(this.highestHeight + heightZero) / 100);
    document.getElementById("form_highest_height").value = Math.round(_highestHeight);
}
