class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    put(item, priority) {
        this.elements.push({ item, priority });
        this.elements.sort((a, b) => a.priority - b.priority);
    }

    get() {
        return this.elements.length > 0 ? this.elements.shift().item : null;
    }

    empty() {
        return this.elements.length === 0;
    }
}

function aStarSearch(grid, start, goal) {
    const rows = grid.length;
    const cols = grid[0].length;
    const directions = [
        [-1, 0], // вверх
        [0, 1], // вправо
        [1, 0], // вниз
        [0, -1] // влево
    ];

    const node = (x, y) => ({ x, y });
    const nodeKey = ({ x, y }) => `${x}-${y}`;
    const isWalkable = (x, y) => grid[x][y] === 0 || grid[x][y] === 3;

    const startNode = node(...start);
    var goalNode = node(...goal);
    const frontier = new PriorityQueue();
    frontier.put(startNode, 0);

    const cameFrom = new Map();
    const costSoFar = new Map();
    cameFrom.set(nodeKey(startNode), null);
    costSoFar.set(nodeKey(startNode), 0);

    let closest = startNode;
    let closestDistance = heuristic(startNode, goalNode);
    while (!frontier.empty()) {
        const current = frontier.get();

        let distance = heuristic(current, goalNode);
        if (distance < closestDistance) {
            closest = current;
            closestDistance = distance;
        }

        if (current.x === goalNode.x && current.y === goalNode.y) {
            break;
        }

        directions.forEach(([dx, dy]) => {
            const nextX = current.x + dx;
            const nextY = current.y + dy;
            if (nextX >= 0 && nextX < rows && nextY >= 0 && nextY < cols && isWalkable(nextX, nextY)) {
                const newCost = costSoFar.get(nodeKey(current)) + 1;
                const nextNode = node(nextX, nextY);
                if (!costSoFar.has(nodeKey(nextNode)) || newCost < costSoFar.get(nodeKey(nextNode))) {
                    costSoFar.set(nodeKey(nextNode), newCost);
                    const priority = newCost + heuristic(nextNode, goalNode);
                    frontier.put(nextNode, priority);
                    cameFrom.set(nodeKey(nextNode), current);
                }
            }
        });
    }

    if (!(closest.x === goalNode.x && closest.y === goalNode.y)) {
        goalNode = closest;
    }

    const path = [];
    let current = goalNode;
    while (current !== null && cameFrom.has(nodeKey(current))) {
        path.push([current.x, current.y]);
        current = cameFrom.get(nodeKey(current));
    }
    path.reverse();

    return path;
}

function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// Тест
const grid = [
    [0, 0, 0, 0, 1, 1],
    [0, 1, 1, 0, 0, 0],
    [2, 1, 0, 0, 3, 0],
    [0, 1, 0, 1, 0, 0]
];

const start = [2, 0]; // начальная позиция (2)
const goal = [2, 4]; // конечная позиция (3)
const result = aStarSearch(grid, start, goal);
console.log(result);