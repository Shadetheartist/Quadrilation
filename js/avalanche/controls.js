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
    if (allowControls || e.keyCode == 13 || e.keyCode == 27)
        pressed[e.keyCode] = true;
}

function Up(e) {
    pressed[e.keyCode] = false;
}