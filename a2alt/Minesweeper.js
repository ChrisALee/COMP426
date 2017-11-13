function handleClick() {
    var width = $('#g-width').val();
    var height = $('#g-height').val();
    var numMines = $('#num-mines').val();

    if (width < 8 || width > 40) {
        window.alert('Fix width!');
    }

    if (height < 8 || height > 30) {
        window.alert('Fix height!');
    }

    if (numMines < 1 || numMines > width * height - 1) {
        window.alert('Fix number of mines!');
    }

    if (
        numMines >= 1 &&
        numMines <= width * height - 1 &&
        width >= 8 &&
        width <= 40 &&
        height >= 8 &&
        height <= 30
    ) {
        board = new Board(width, height, numMines);
        board.start();
        $('.tile').click(info => {
            if (info.shiftKey) {
                board.shiftClick(info.target);
            } else {
                board.tileClick(info.target);
            }
            if (
                board.numCleared == board.numPossibleClears &&
                board.notFoundMines == 0
            ) {
                $('#board').empty();
                $('#bombs-left').empty();
                $('#board').append('<h1>You Win!</h1>');
            }
        });
    }
}

function Board(width, height, numMines) {
    this.width = width;
    this.height = height;
    this.numMines = numMines;
    this.grid = [];
    this.tileGrid = [];
    this.bombsNearbyGrid = [];
    this.notFoundMines = numMines;
    this.numCleared = 0;
    this.numPossibleClears = width * height - numMines;

    this.start = () => {
        var toAdd = '';
        var randIndices = [];
        var counter = 0;

        // generate random unique values for mine indices
        while (randIndices.length < this.numMines) {
            var randomNumber =
                Math.ceil(Math.random() * this.width * this.height) - 1;
            if (randIndices.indexOf(randomNumber) > -1) continue;
            randIndices[randIndices.length] = randomNumber;
        }

        // set all values in grid to 0
        // 0 represents a space
        for (i = 0; i < this.width * this.height; i++) {
            this.grid[i] = 0;
        }

        // set random indices to -1
        // -1 represents a bomb
        for (i = 0; i < randIndices.length; i++) {
            this.grid[randIndices[i]] = -1;
        }

        // convert to 2d array
        for (i = 0; i < height; i++) {
            this.tileGrid[i] = [];
            for (j = 0; j < width; j++) {
                this.tileGrid[i][j] = this.grid[counter];
                counter++;
            }
        }

        // find num bombs nearby in each spots
        for (i = 0; i < height; i++) {
            this.bombsNearbyGrid[i] = [];
            for (j = 0; j < width; j++) {
                if (this.tileGrid[i][j] == -1) {
                    this.bombsNearbyGrid[i][j] = -1;
                } else {
                    // check bombs nearby
                    this.bombsNearbyGrid[i][j] =
                        this.isBomb(i, j + 1) +
                        this.isBomb(i, j - 1) +
                        this.isBomb(i + 1, j + 1) +
                        this.isBomb(i + 1, j) +
                        this.isBomb(i + 1, j - 1) +
                        this.isBomb(i - 1, j + 1) +
                        this.isBomb(i - 1, j) +
                        this.isBomb(i - 1, j - 1);
                }
            }
        }

        // generate the board html elements
        for (i = 0; i < height; i++) {
            for (j = 0; j < width; j++) {
                if (this.tileGrid[i][j] == -1) {
                    toAdd = toAdd.concat(
                        '<button class="tile" bomb="true" mark="false" cleared="false" row="' +
                            i +
                            '" col="' +
                            j +
                            '">+</button>',
                    );
                } else {
                    toAdd = toAdd.concat(
                        '<button class="tile" bomb="false" mark="false" cleared="false" row="' +
                            i +
                            '" col="' +
                            j +
                            '">_</button>',
                    );
                }
                counter++;
            }
        }
        let cssWidth = (1 / this.width * 100).toString() + '%';
        let cssHeight = (1 / this.height * 100).toString() + '%';
        $('#board').empty();
        $('#bombs-left').empty();
        $('#board').append(toAdd);
        $('#bombs-left').append('<p>' + this.notFoundMines + '</p');
        $('.tile').css({width: cssWidth});
        $('.tile').css({height: cssHeight});
    };

    this.isBomb = (row, col) => {
        if (col < 0 || col >= this.width || row < 0 || row >= this.height) {
            return 0;
        } else if (this.tileGrid[row][col] == -1) {
            return 1;
        } else {
            return 0;
        }
    };

    this.clearArea = (row, col) => {
        this.checkTile(row, col + 1);
        this.checkTile(row, col - 1);
        this.checkTile(row + 1, col + 1);
        this.checkTile(row + 1, col);
        this.checkTile(row + 1, col - 1);
        this.checkTile(row - 1, col + 1);
        this.checkTile(row - 1, col);
        this.checkTile(row - 1, col - 1);
    };

    this.checkTile = (row, col) => {
        if (
            row >= 0 &&
            row < this.height &&
            col >= 0 &&
            col < this.width &&
            this.tileGrid[row][col] == 0 &&
            this.bombsNearbyGrid[row][col] >= 0
        ) {
            // -5 means the tile has been cleared
            this.tileGrid[row][col] = -5;
            if (this.bombsNearbyGrid[row][col] == 0) {
                this.clearArea(row, col);
            } else {
            }
        }
    };

    this.setButtons = () => {
        for (i = 0; i < this.height; i++) {
            for (j = 0; j < this.width; j++) {
                if (this.tileGrid[i][j] == -1) continue;
                this.numCleared++;
                $("button[row$='" + i + "'][col$='" + j + "']").attr(
                    'cleared',
                    'true',
                );
                $("button[row$='" + i + "'][col$='" + j + "']").html(
                    this.bombsNearbyGrid[i][j],
                );
                $("button[row$='" + i + "'][col$='" + j + "']").attr(
                    'cleared',
                    'true',
                );
            }
        }
    };

    this.tileClick = tile => {
        let row = $(tile).attr('row');
        let col = $(tile).attr('col');
        row = parseInt(row);
        col = parseInt(col);
        if (
            $(tile).attr('mark') == 'true' ||
            $(tile).attr('cleared') == 'true'
        ) {
            return;
        }

        if ($(tile).attr('bomb') == 'true') {
            $('#board').empty();
            $('#bombs-left').empty();
            $('#board').append('<h1>Game Over</h1>');
        } else {
            this.tileGrid[row][col] = -5;
            this.clearArea(row, col);
            this.setButtons();
        }
    };

    this.shiftClick = tile => {
        if ($(tile).attr('cleared') == 'true') {
            return;
        }
        if ($(tile).attr('mark') == 'false') {
            $(tile).html('M');
            $(tile).attr('mark', 'true');
            this.notFoundMines--;
        } else {
            $(tile).html('_');
            $(tile).attr('mark', 'false');
            this.notFoundMines++;
        }
        $('#bombs-left').empty();
        $('#bombs-left').append('<p>' + this.notFoundMines + '</p');
    };
}
