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

    if (isCollide(this.rect, lava)) {
        this.velocity.y -= Math.random() * 2 + 1;
        this.velocity.x -= Math.random() - .5;
        this.rect.y = lava.y - this.rect.h - 1;
        this.lavaColor = addSaturation(this.lavaColor, -Math.round(Math.random() * .6));
    }

    this.rect.x += this.velocity.x;
    this.rect.y += this.velocity.y;
    this.velocity.y += 0.056;
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