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