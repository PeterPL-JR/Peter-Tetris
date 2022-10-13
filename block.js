const _COLOR_RED = 0;
const _COLOR_GRAY = 1;
const _COLOR_AQUA = 2;
const _COLOR_YELLOW = 3;

const _COLOR_MAGENTA = 4;
const _COLOR_BLUE = 5;
const _COLOR_GREEN = 6;

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
        const BLOCK_FALLING_SPEED = 800;
        const fall = this.fall.bind(this);

        this.interval = setInterval(function() {
            fall();
        }, BLOCK_FALLING_SPEED);
    }

    render() {
        for(var x = 0; x < this.width; x++) {
            for(var y = 0; y < this.height; y++) {

                if(this.fields[x][y] != __EMPTY) {
                    const renderX = x + this.x;
                    const renderY = y + this.y;
                    renderField(renderX, renderY, this.blockType.index);
                }
            }
        }
    }
    move(xMove, yMove) {
        this.x += xMove;
        this.y += yMove;
    }
    fall() {
        this.move(0, FALLING_SPEED);
    }
    rotate() {
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
    }
    put() {

    }
}