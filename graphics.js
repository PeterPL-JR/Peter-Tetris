const POS_CORRECT = 0.5;

const COLOR_BACKGROUND = "black";
const COLOR_LINES = "#404040";
const COLOR_CIRCLES = COLOR_LINES;

function renderLines() {
    for(var x = 0; x < MAP_WIDTH + 1; x++)
        drawLine(x * FIELD_SIZE, 0, x * FIELD_SIZE, HEIGHT, COLOR_LINES);
    for(var y = 0; y < MAP_HEIGHT + 1; y++)
        drawLine(0, y * FIELD_SIZE, WIDTH, y * FIELD_SIZE, COLOR_LINES);
}

const CIRCLE_RADIUS = 2;
function renderCircles() {
    for(var x = 0; x < MAP_WIDTH + 1; x++) {
        for(var y = 0; y < MAP_HEIGHT + 1; y++) {
            drawCircle(x * FIELD_SIZE, y * FIELD_SIZE, CIRCLE_RADIUS, COLOR_CIRCLES);
        }
    }
}

function renderField(fieldX, fieldY, type) {
    const renderX = fieldX * FIELD_SIZE;
    const renderY = fieldY * FIELD_SIZE;

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(blocksImage, type * IMAGE_SIZE, 0, IMAGE_SIZE, IMAGE_SIZE, renderX, renderY, FIELD_SIZE, FIELD_SIZE);
}

function drawLine(xBegin, yBegin, xEnd, yEnd, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();

    ctx.moveTo(xBegin + POS_CORRECT, yBegin + POS_CORRECT);
    ctx.lineTo(xEnd + POS_CORRECT, yEnd + POS_CORRECT);

    ctx.stroke();
    ctx.closePath();
}

function drawCircle(xCenter, yCenter, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();

    ctx.arc(xCenter + POS_CORRECT, yCenter + POS_CORRECT, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function drawRect(x, y, width, height, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();

    ctx.rect(x + POS_CORRECT, y + POS_CORRECT, width, height);
    ctx.stroke();
    ctx.closePath();
}

function loadImage(path) {
    const img = document.createElement("img");
    img.src = path;
    return img;
}