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
const FALLING_SPEED = 1;

const _X = 0;
const _Y = 1;

var block = null;
let gameEnd = false;

let moving = false;
let movingTime = 0;

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
    update();
}

function update() {
    requestAnimationFrame(update);
    updateMoving();

    render();
}
function updateMoving() {
    if(gameEnd || !block) return;

    if(moving !== false) {
        movingTime++;
    }
    if(movingTime % 4 == 0) {
        if(moving === MOVING_LEFT) block.move(LEFT, 0);
        if(moving === MOVING_RIGHT) block.move(RIGHT, 0);
        if(moving === FALLING) block.move(0, FALLING_SPEED);
    }
}

function render() {
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    renderLines();
    renderCircles();

    renderStaticFields();
    
    if(!gameEnd) {
        renderBlockOutline(block);
    }
    
    if(block != null) {
        block.render();
    }
}

function randomBlock() {
    const randomType = blockTypes[getRand(0, blockTypes.length - 1)];
    let newBlock = new Block(randomType);
    block = newBlock;
    
    if(newBlock.isCollision(newBlock.x, newBlock.y)) {
        block.put(false);
        gameOver();
    }
}

function renderStaticFields() {
    for(var field of fields) {
        if(field.type != __EMPTY) {
            renderField(field.x, field.y, field.type);
        }
    }
}

function initKeyboard() {
    document.onkeydown = function(event) {
        let key = event.key.toUpperCase();
        keyDown(key);
    }
    document.onkeyup = function() {
        keyUp();
    }
}
function keyDown(key) {
    if(gameEnd || !block) return;

    if(key == "S" || key == "ARROWDOWN") moving = FALLING;
    if(key == "A" || key == "ARROWLEFT") moving = MOVING_LEFT;
    if(key == "D" || key == "ARROWRIGHT") moving = MOVING_RIGHT;
    
    if(key == "W" || key == "ARROWUP") block.rotate();
    if(key == " ") autoPut();
}
function keyUp() {
    moving = false;
    movingTime = 0;
}

const TIME_CHECK_POINTS = 500;

function putBlock(timeout) {
    block = null;
    if(!gameEnd) {
        if(timeout) setTimeout(checkPoints, TIME_CHECK_POINTS);
        else checkPoints();
    }
}
function autoPut() {
    let yOffset = getBlockOutlineOffset(block);
    
    let x = block.x;
    let y = yOffset - block.height;

    block.setPosition(x, y);
    block.put(false);
}

function checkPoints() {
    let levelsToFall = [];
    for(let y = 0; y < MAP_HEIGHT; y++) {
        if(checkPoint(y)) {
            levelsToFall.push(y);
        }
    }
    
    if(levelsToFall.length != 0) {
        setTimeout(function() {
            for(let level of levelsToFall) {
                getPoint(level);
            }
            randomBlock();
        }, TIME_CHECK_POINTS * 2);
        return;
    }
    randomBlock();
}
function checkPoint(yPos) {
    let filled = 0;
    for(let x = 0; x < MAP_WIDTH; x++) {
        if(getField(x, yPos).type != __EMPTY) {
            filled++;
        }
    }

    let pointsScored = 0;

    if(filled == MAP_WIDTH) {
        pointsScored++;
        setTimeout(function() {
            for(let x = 0; x < MAP_WIDTH; x++) {
                getField(x, yPos).type = __EMPTY;
            }
        }, TIME_CHECK_POINTS);
        return true;
    }
    return false;
}

function getPoint(yPos) {
    for(let y = yPos; y >= 1; y--) {
        for(let x = 0; x < MAP_WIDTH; x++) {
            getField(x, y).type = getField(x, y - 1).type;
        }
    }
}

function gameOver() {
    block = null;
    gameEnd = true;
}