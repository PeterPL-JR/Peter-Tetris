const LEFT = -1;
const RIGHT = 1;

function getField(x, y) {
    let field = fields.find(function(field) {
        return field.x == x && field.y == y;
    });
    return (field) ? field : null;
}

function getRect(block) {
    return {
        left: block.x,
        top: block.y,
        
        right: block.x + block.width,
        bottom: block.y + block.height
    }
}

function getRand(min, max) {
    return Math.floor(Math.random() * (max -min + 1)) + min;
}