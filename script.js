const ROWS = 12;
const COLS = 12;
const gridElement = document.getElementById('grid-container');
const statusText = document.getElementById('status-text');

let grid = [];
let startPos = { r: 1, c: 1 };
let endPos = { r: 10, c: 10 };
let isRunning = false;

// Initialize Grid Layout
function createGrid() {
    gridElement.innerHTML = '';
    grid = [];
    for (let r = 0; r < ROWS; r++) {
        let row = [];
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            
            if (r === startPos.r && c === startPos.c) cell.classList.add('start');
            else if (r === endPos.r && c === endPos.c) cell.classList.add('end');

            cell.addEventListener('click', () => toggleWall(r, c, cell));
            
            gridElement.appendChild(cell);
            row.push({ r, c, isWall: false, cellElement: cell });
        }
        grid.push(row);
    }
}

function toggleWall(r, c, element) {
    if (isRunning) return;
    if ((r === startPos.r && c === startPos.c) || (r === endPos.r && c === endPos.c)) return;
    
    grid[r][c].isWall = !grid[r][c].isWall;
    element.classList.toggle('wall');
}

// AI BFS Pathfinding Algorithm
async function startPathfinding() {
    if (isRunning) return;
    isRunning = true;
    statusText.innerText = "Status: AI Pathfinding in progress...";

    let queue = [[startPos.r, startPos.c]];
    let visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
    let parent = Array.from({ length: ROWS }, () => Array(COLS).fill(null));

    visited[startPos.r][startPos.c] = true;
    let found = false;

    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Up, Down, Left, Right

    while (queue.length > 0) {
        let [r, c] = queue.shift();

        if (r === endPos.r && c === endPos.c) {
            found = true;
            break;
        }

        for (let [dr, dc] of directions) {
            let nr = r + dr;
            let nc = c + dc;

            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                if (!visited[nr][nc] && !grid[nr][nc].isWall) {
                    visited[nr][nc] = true;
                    parent[nr][nc] = [r, c];
                    queue.push([nr, nc]);

                    if (!(nr === endPos.r && nc === endPos.c)) {
                        grid[nr][nc].cellElement.classList.add('visited');
                    }
                    await new Promise(res => setTimeout(res, 25)); // Visual delay animation
                }
            }
        }
    }

    if (found) {
        statusText.innerText = "Status: Path Found!";
        let curr = parent[endPos.r][endPos.c];
        while (curr && !(curr[0] === startPos.r && curr[1] === startPos.c)) {
            grid[curr[0]][curr[1]].cellElement.classList.add('path');
            curr = parent[curr[0]][curr[1]];
            await new Promise(res => setTimeout(res, 40));
        }
    } else {
        statusText.innerText = "Status: No valid path found!";
    }
    isRunning = false;
}

function resetGrid() {
    if (isRunning) return;
    statusText.innerText = "Status: Ready";
    createGrid();
}

// Build initial grid on boot
createGrid();