/* Алгоритм начинает со случайной точки и расширяет лабиринт, выбирая стены для преобразования в проходы,
таким образом создавая остовное дерево.

 функция генерации лабиринта generateMaze

 стартовая точка генерации лабиринта выбирается рандомно
 Аргументы: width, height - ширина и длина карты, freeRatio - отношение свободных/всех клеток. */

function generateMaze(width, height, freeRatio) {
    const maze = Array.from({length: height}, () =>
        Array.from({length: width}, () => 1));

    const walls = [];
    const addWalls = (x, y) => {
        if (x > 0 && maze[y][x - 1] === 1) walls.push([x - 1, y]);
        if (x < width - 1 && maze[y][x + 1] === 1) walls.push([x + 1, y]);
        if (y > 0 && maze[y - 1][x] === 1) walls.push([x, y - 1]);
        if (y < height - 1 && maze[y + 1][x] === 1) walls.push([x, y + 1]);
    };

    // Начальная точка
    const start = [Math.floor(Math.random() * width), Math.floor(Math.random() * height)];
    maze[start[1]][start[0]] = 0;
    addWalls(start[0], start[1]);

    let freeCells = 1;
    const totalCells = width * height;
    const targetFreeCells = Math.floor(totalCells * freeRatio);

    while (walls.length > 0 && freeCells < targetFreeCells) {
        const randomWallIndex = Math.floor(Math.random() * walls.length);
        const [x, y] = walls[randomWallIndex];
        walls.splice(randomWallIndex, 1);

        if (maze[y][x] === 1) {
            const neighbors = [];
            if (x > 0) neighbors.push(maze[y][x - 1]);
            if (x < width - 1) neighbors.push(maze[y][x + 1]);
            if (y > 0) neighbors.push(maze[y - 1][x]);
            if (y < height - 1) neighbors.push(maze[y + 1][x]);

            if (neighbors.filter(value => value === 0).length === 1) {
                maze[y][x] = 0;
                freeCells++;
                addWalls(x, y);
            }
        }
    }

    return maze;
}

