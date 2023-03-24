const _COLOR_RED = 0;
const _COLOR_GRAY = 1;
const _COLOR_AQUA = 2;
const _COLOR_YELLOW = 3;

const _COLOR_MAGENTA = 4;
const _COLOR_BLUE = 5;
const _COLOR_GREEN = 6;

const _BLOCKS_TYPES = 7;
const colors = [];

colors[_COLOR_RED] = "red";
colors[_COLOR_GRAY] = "gray";
colors[_COLOR_AQUA] = "aqua";
colors[_COLOR_YELLOW] = "yellow";

colors[_COLOR_MAGENTA] = "magenta";
colors[_COLOR_BLUE] = "royalblue";
colors[_COLOR_GREEN] = "green";

class BlockType {
    constructor(coordinates, index) {
        this.coordinates = coordinates;
        this.index = index;
    }
}

const blockTypes = [
    new BlockType([[0,0],[0,1],[0,2],[0,3]], _COLOR_RED),
    new BlockType([[0,0],[1,0],[0,1],[1,1]], _COLOR_GRAY),
    new BlockType([[0,0],[0,1],[0,2],[1,2]], _COLOR_AQUA),
    new BlockType([[0,0],[1,0],[2,0],[1,1]], _COLOR_YELLOW),
    
    new BlockType([[1,0],[1,1],[1,2],[0,2]], _COLOR_MAGENTA),
    new BlockType([[1,0],[2,0],[0,1],[1,1]], _COLOR_BLUE),
    new BlockType([[0,0],[1,0],[1,1],[2,1]], _COLOR_GREEN)
];

class Block {
    constructor(blockType) {
        this.blockType = blockType;
        this.fields = [];
        this.destroyed = false;

        this.init();
        this.initInterval();
    }
    init() {
        const coords = this.blockType.coordinates;
        var maxX = coords[0][_X];
        var maxY = coords[0][_Y];

        for(var i = 1; i < coords.length; i++) {
            const coord = coords[i];
            if(coord[_X] > maxX) maxX = coord[_X];
            if(coord[_Y] > maxY) maxY = coord[_Y];
        }

        this.width = maxX + 1;
        this.height = maxY + 1;

        this.x = Math.floor(MAP_WIDTH / 2 - this.width / 2);
        this.y = 0;

        for(var x = 0; x < this.width; x++) {
            this.fields[x] = [];
            for(var y = 0; y < this.height; y++) {
                this.fields[x][y] = __EMPTY;
            }
        }
        for(var coord of coords) {
            this.fields[coord[_X]][coord[_Y]] = __FILLED;
        }
    }
    initInterval() {
        const BLOCK_FALLING_SPEED = 700;
        const fall = this.fall.bind(this);

        this.interval = setInterval(function() {
            fall();
        }, BLOCK_FALLING_SPEED);
    }

    render() {
        for(var x = 0; x < this.width; x++) {
            for(var y = 0; y < this.height; y++) {
                const renderX = x + this.x;
                const renderY = y + this.y;

                if(this.fields[x][y] != __EMPTY) {
                    renderField(renderX, renderY, this.blockType.index);
                }
            }
        }
    }
    move(xMove, yMove) {
        const newX = this.x + xMove;
        const newY = this.y + yMove;

        if(this.isCollision(newX, newY) || this.isFallen()) {
            this.put();
        }

        if(newX >= 0 && newX + this.width <= MAP_WIDTH) this.x = newX;
        this.y = newY;
    }
    fall() {
        this.move(0, FALLING_SPEED);
    }
    rotate() {
        let oldFields = this.fields;
        let oldWidth = this.width;
        let oldHeight = this.height;

        const newFields = [];

        for(var x = 0; x < this.height; x++) {
            newFields[x] = [];
            for(var y = 0; y < this.width; y++) {
                newFields[x][this.width - y - 1] = this.fields[y][x];
            }
        }
        this.fields = newFields;
        
        var buffer = this.width;
        this.width = this.height;
        this.height = buffer;

        checkPosition(this);

        if(this.isCollision(this.x, this.y)) {
            this.fields = oldFields;
            this.width = oldWidth;
            this.height = oldHeight;
        }
    }
    put() {
        for(var x = 0; x < this.width; x++) {
            for(var y = 0; y < this.height; y++) {
                const putX = x + this.x;
                const putY = y + this.y;

                const field = fields.find(function(field) {
                    return field.x == putX && field.y == putY;
                });
                if(this.fields[x][y] != __EMPTY && field && this.blockType) {
                    field.type = this.blockType.index;
                }
            }
        }
        this.destroy();
        putBlock();
    }
    destroy() {
        this.destroyed = true;
        clearInterval(this.interval);
    }
    isFallen() {
        return this.y + this.height >= MAP_HEIGHT;
    }

    isCollision(xPos, yPos) {
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                let blockX = x + xPos;
                let blockY = y + yPos;

                let index = fields.findIndex(function(field) {
                    return field.x == blockX && field.y == blockY && field.type != __EMPTY;
                });
                if(index != -1 && this.fields[x][y] != __EMPTY) return true;
            }
        }
        return false;
    }
}

function tryRenderBlockOutline(block) {
    if(block == null) return;
    
    for(let y = 0; y < MAP_HEIGHT - block.height + 1; y++) {
        if(block.isCollision(block.x, y)) {
            let yOffset = y + 1;
            if(block.height > block.width) yOffset += 1;

            if(block.width == 1) yOffset += 1;
            if(block.height == 1) yOffset -= 1;
            
            renderBlockOutline(block, yOffset);
            return;
        }
    }

    renderBlockOutline(block, MAP_HEIGHT);
}
function renderBlockOutline(block, yOffset) {
    if(block == null) return;

    for(var x = 0; x < block.width; x++) {
        for(var y = 0; y < block.height; y++) {

            if(block.fields[x][y] != __EMPTY) {
                const renderX = (x + block.x) * FIELD_SIZE;
                const renderY = (y + yOffset - block.height) * FIELD_SIZE;
                drawRect(renderX + 1, renderY + 1, FIELD_SIZE - 2, FIELD_SIZE - 2, colors[block.blockType.index]);
            }
        }
    }
}

function checkPosition(block) {
    let rightSide = getRect(block).right;
    let bottomSide = getRect(block).bottom;

    if(rightSide > MAP_WIDTH) correctPosition(block, MAP_WIDTH - rightSide, 0);
    if(bottomSide > MAP_HEIGHT) correctPosition(block, 0, MAP_HEIGHT - bottomSide);
}
function correctPosition(block, xOffset, yOffset) {
    block.x += xOffset;
    block.y += yOffset;
}