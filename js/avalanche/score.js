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