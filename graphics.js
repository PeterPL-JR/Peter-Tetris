const POS_CORRECT = 0.5;

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

function loadImage(path) {
    const img = document.createElement("img");
    img.src = path;
    return img;
}