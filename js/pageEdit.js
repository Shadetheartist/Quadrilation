//$(document).ready(update);


var bars = [];
var amount = 10;
for(var i = 0; i < amount; i++){
    var temp = document.createElement('div');
    $(temp).attr('id', 'bar-' + i);
    $(temp).css('width', 1000/amount - 6);
    $(temp).css('top', 0);
    $(temp).css('left', i * 1000/amount);
    $(temp).css('height', Math.sin(i/20)*20);
    temp.className = 'bar';
    $("#bars").append(temp);
}

for(var i = 0; i < amount; i++){
    setTimeout(function(i){
        document.getElementById("bar-" + i).className = 'bar-active';
    }, 200 * i, i);
    bars.push($("#bar-" + i));
}
var offset = 0;

HeaderBar.headerBars = [];
function HeaderBar(top, left, width, height){
    var temp = new DomRect();
    $(temp).css('top', top);
    $(temp).css('left', left);
    $(temp).css('width', width);
    $(temp).css('height', height);
    return temp;
}
function DomRect(){
    var div = document.createElement('div');
    $(div).attr('id', 'dr-' + i);
    div.className = 'DomRect';
    return div;
}
function GetDomRect(id){
    return document.getElementById('dr-' + parseInt(id));
}

function update(){
    window.requestAnimationFrame(update);
    
    for(var i=0; i<bars.length; i++){
         $(bars[i]).css('height', Math.cos((i + offset)/10)*100);
    }
    
    offset-=0.25/2;
}

