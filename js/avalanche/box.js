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
    droppingBox.slomo = 1;
}
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
    stoppedBoxes.push(new GameObject(this.GO.rect, this.GO.color, this.GO.friction));
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