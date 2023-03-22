const MAP_WIDTH = 10;
const MAP_HEIGHT = 20;

const fields = [];
const FIELD_SIZE = 34;

const __FILLED = 0;
const __EMPTY = -1;

const WIDTH = MAP_WIDTH * FIELD_SIZE;
const HEIGHT = MAP_HEIGHT * FIELD_SIZE;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const blocksImage = loadImage("blocks.png");
const IMAGE_SIZE = 8;

const _X = 0;
const _Y = 1;

var block = null;

function init() {
    canvas.width = WIDTH + 1;
    canvas.height = HEIGHT + 1;

    for(var x = 0; x < MAP_WIDTH; x++) {
        for(var y = 0; y < MAP_HEIGHT; y++) {
            fields.push({x, y, type: __EMPTY});
        }
    }
    initKeyboard();

    randomBlock();
    render();
}

function render() {
    requestAnimationFrame(render);
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    renderLines();
    renderCircles();

    renderStaticFields();
    renderBlockOutline(block);
    
    if(block != null) {
        block.render();
    }
    if(block.destroyed) {
        randomBlock();
    }
}

function getRand(min, max) {
    return Math.floor(Math.random() * (max -min + 1)) + min;
}

function randomBlock() {
    const randomType = blockTypes[getRand(0, blockTypes.length - 1)];
    block = new Block(randomType);
}

function renderStaticFields() {
    for(var field of fields) {
        if(field.type != __EMPTY) {
            renderField(field.x, field.y, field.type);
        }
    }
}

const LEFT = -1;
const RIGHT = 1;

const FALLING_SPEED = 1;

function initKeyboard() {
    document.onkeydown = function(event) {
        const key = event.key.toUpperCase();
        if(key == "S") block.move(0, FALLING_SPEED);
        if(key == "A") block.move(LEFT, 0);
        if(key == "D") block.move(RIGHT, 0);

        if(key == "ARROWUP") block.rotate(LEFT);
    }
}