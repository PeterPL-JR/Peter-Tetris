const MAP_WIDTH = 10;
const MAP_HEIGHT = 20;

const fields = [];
const FIELD_SIZE = 34;
const __EMPTY = -1;

const WIDTH = MAP_WIDTH * FIELD_SIZE;
const HEIGHT = MAP_HEIGHT * FIELD_SIZE;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

class BlockType {
    constructor(coordinates, color) {
        this.coordinates = coordinates;
        this.color = color;
    }
}


class Block {
    constructor(blockType) {
        this.blockType = blockType;
    }
    render(x, y) {
        
    }
}

const blockTypes = [
    new BlockType([[0,0],[0,1],[0,2],[0,3]], "red"),
    new BlockType([[0,0],[1,0],[0,1],[1,1]], "aqua"),
    new BlockType([[0,0],[0,1],[0,2],[1,2]], "yellow"),
    new BlockType([[0,0],[1,0],[2,0],[1,1]], "gray"),
    
    new BlockType([[1,0],[1,1],[1,2],[0,2]], "magenta"),
    new BlockType([[1,0],[2,0],[0,1],[1,1]], "blue"),
    new BlockType([[0,0],[1,0],[1,1],[2,1]], "lime")
];
const block = new Block(blockTypes[0]);

function init() {
    canvas.width = WIDTH + 1;
    canvas.height = HEIGHT + 1;

    for(var x = 0; x < MAP_WIDTH; x++) {
        for(var y = 0; y < MAP_HEIGHT; y++) {
            fields.push({x, y, type: __EMPTY});
        }
    }
    fields[21].type = 0;
    fields[22].type = 1;

    randomBlock();
    render();
}

const COLOR_BACKGROUND = "black";
const COLOR_LINES = "#404040";
const COLOR_CIRCLES = COLOR_LINES;

function render() {
    requestAnimationFrame(render);
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    renderLines();
    renderCircles();

    renderField(fields[21]);
    renderField(fields[22]);
}

function renderLines() {
    for(var x = 0; x < MAP_WIDTH + 1; x++)
        drawLine(x * FIELD_SIZE, 0, x * FIELD_SIZE, HEIGHT, COLOR_LINES);
    for(var y = 0; y < MAP_HEIGHT + 1; y++)
        drawLine(0, y * FIELD_SIZE, WIDTH, y * FIELD_SIZE, COLOR_LINES);
}

const CIRCLE_RADIUS = 3;
function renderCircles() {
    for(var x = 0; x < MAP_WIDTH + 1; x++) {
        for(var y = 0; y < MAP_HEIGHT + 1; y++) {
            drawCircle(x * FIELD_SIZE, y * FIELD_SIZE, CIRCLE_RADIUS, COLOR_CIRCLES);
        }
    }
}

function renderBlock(block) {

}

function renderField(field) {
}

function getRand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBlock() {

}