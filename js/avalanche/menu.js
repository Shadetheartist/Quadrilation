
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