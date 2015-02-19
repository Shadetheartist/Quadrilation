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
        color: "red",
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







