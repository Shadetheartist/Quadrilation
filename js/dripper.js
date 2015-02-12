var canvas = document.getElementById("drip");
var ctx = canvas.getContext("2d");
function scaleCanvas(){
    canvas.width = document.body.offsetWidth;
    canvas.height = document.body.offsetHeight;
    canvas.setAttribute("style", "position:absolute; left:"+ document.body.getBoundingClientRect().left +"; top:0;");
    
    ctx.fillRect(100,100,100,100);

}
window.onresize = scaleCanvas;
window.onload = scaleCanvas;