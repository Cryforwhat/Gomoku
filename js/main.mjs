const BOARD_SIZE = 19;

// Board state
const WHITE = "WHITE";
const BLACK = "BLACK";
const OUTSIDE = "OUTSIDE";
const EMPTY = "EMPTY";

// Only for checking open three
const NONE = "NONE";

const OPEN_STATES = [
	[NONE, EMPTY, BLACK, BLACK, EMPTY, EMPTY, NONE, NONE, NONE],
	[EMPTY, BLACK, BLACK, BLACK, EMPTY, EMPTY, NONE, NONE, NONE],
	[NONE, EMPTY, BLACK, BLACK, EMPTY, BLACK, EMPTY, NONE, NONE],
	[NONE, NONE, EMPTY, BLACK, EMPTY, BLACK, EMPTY, NONE, NONE],
	[NONE, NONE, EMPTY, BLACK, EMPTY, BLACK, BLACK, EMPTY, NONE],
	[NONE, NONE, NONE, EMPTY, EMPTY, BLACK, BLACK, BLACK, EMPTY],
	[NONE, NONE, NONE, EMPTY, EMPTY, BLACK, BLACK, EMPTY, NONE],
];

const canvas = document.querySelector(".canvas");

function setup() {
	createBox(BOARD_SIZE);
}

function createBox(size) {
	for (let i = 0; i < size; i++) {
		let row = document.createElement("div");
		canvas.appendChild(row);
		row.id = "row";
		for (let j = 0; j < size; j++) {
			let tile = document.createElement("div");
			tile.classList.add("tile");
			row.appendChild(tile);
			tile.id = createTileID(j, i);
			for (let g = 0; g < 4; g++) {
				let grid = document.createElement("div");
				grid.classList.add("grid");
				tile.appendChild(grid);
			}
			let stone = document.createElement("div");
			stone.classList.add("stone");
			tile.appendChild(stone);
		}
	}
}

function createTileID(x, y) {
	return "tile-" + x + "-" + y;
}

function createBaseBoardState() {
	return new Array(BOARD_SIZE).fill(0).map((value) => new Array(BOARD_SIZE).fill(EMPTY));
}
function render(board) {
	for (let y = 0; y < board.length; y++) {
		for (let x = 0; x < board[y].length; x++) {
			const id = createTileID(x, y);
			const tile = document.getElementById(id);
			const stone = tile.querySelector(".stone");
			switch (board[y][x]) {
				case EMPTY:
					stone.classList.remove("black");
					stone.classList.remove("white");
					break;
				case BLACK:
					stone.classList.add("black");
					break;
				case WHITE:
					stone.classList.add("white");
					break;
			}
		}
	}
}

function initializeClickHandlers() {
	const rows = document.querySelectorAll("#row");
	rows.forEach((row) => {
		const tiles = row.querySelectorAll(".tile");
		for (let tile of tiles) {
			tile.addEventListener("click", clickHandler);
		}
	});
}

function getTileCoordinate(tileID) {
	const list = tileID.split("-");
	return {
		x: Number(list[1]),
		y: Number(list[2]),
	};
}

function clickHandler(event) {
	const tile = event.currentTarget;
	const coordinate = getTileCoordinate(tile.id);

	if (board[coordinate.y][coordinate.x] != EMPTY) return;

	if (blackTurn && isOpenThree(board, coordinate.x, coordinate.y)) {
		alert("OPEN THREE!");
		return;
	}

	if (blackTurn == true && tile.classList == "tile") {
		placeStone(board, coordinate.x, coordinate.y, BLACK);
	} else if (blackTurn == false && tile.classList == "tile") {
		placeStone(board, coordinate.x, coordinate.y, WHITE);
	}

	render(board);

	const isWin = checkWin(board, blackTurn ? BLACK : WHITE);

	if (isWin) {
		setTimeout(() => {
			if (blackTurn == false) {
				window.alert("BLACK WIN");
				reset();
				render(board);
			} else {
				window.alert("WHITE WIN");
				reset();
				render(board);
			}
		}, 500);
	}

	blackTurn = !blackTurn;
}

function reset() {
	board = createBaseBoardState();
	blackTurn = true;
}

function checkWin(board, stoneType) {
	for (let x = 0; x < BOARD_SIZE; x++) {
		for (let y = 0; y < BOARD_SIZE; y++) {
			if (
				checkWinState(board, x, y, 1, 0, stoneType) ||
				checkWinState(board, x, y, 0, 1, stoneType) ||
				checkWinState(board, x, y, 1, 1, stoneType) ||
				checkWinState(board, x, y, 1, -1, stoneType)
			)
				return true;
		}
	}

	return false;
}

function checkWinState(board, x, y, dx, dy, stoneType) {
	if (getStone(board, x - dx, y - dy) == stoneType) return false;

	for (let i = 0; i < 5; i++) {
		if (getStone(board, x + i * dx, y + i * dy) != stoneType) return false;
	}

	if (getStone(board, x + dx * 5, y + dy * 5) == stoneType) return false;

	return true;
}

function isOpenThree(board, x, y) {
	let count = 0;
	if (isOpenThreeForAllStates(board, x, y, 1, 0)) count++; // Horizontal
	if (isOpenThreeForAllStates(board, x, y, 0, 1)) count++; // Vertical
	if (isOpenThreeForAllStates(board, x, y, 1, 1)) count++; // Diagonal
	if (isOpenThreeForAllStates(board, x, y, 1, -1)) count++; // Reverse Diagonal

	if (count >= 2) {
		return true;
	}
	return false;
}

function isOpenThreeForOneState(board, openState, x, y, dx, dy) {
	for (let i = 0; i < 9; i++) {
		if (openState[i] == NONE) continue;
		if (openState[i] != getStone(board, x - 4 * dx + i * dx, y - 4 * dy + i * dy)) {
			return false;
		}
	}
	return true;
}

function isOpenThreeForAllStates(board, x, y, dx, dy) {
	for (let openState of OPEN_STATES) {
		if (isOpenThreeForOneState(board, openState, x, y, dx, dy)) {
			return true;
		}
	}

	return false;
}

function placeStone(board, x, y, stoneType) {
	board[y][x] = stoneType;
}

function getStone(board, x, y) {
	if (x < 0 || y < 0 || x >= BOARD_SIZE || y >= BOARD_SIZE) return OUTSIDE;
	return board[y][x];
}

// Game Start
function main() {
	setup();
	reset();

	initializeClickHandlers();
	//for
	render(board);
}

main();
