class PriorityQueue {
    // конструктор для инициализации очереди с приоритетом
    constructor() {
        this.elements = [];
    }

    // метод для добавления элемента в очередь с приоритетом
    put(item, priority) {
        this.elements.push({ item, priority });
        // сортировка элементов по приоритету
        this.elements.sort((a, b) => a.priority - b.priority);
    }

    // метод для извлечения элемента из очереди с приоритетом
    get() {
        return this.elements.length > 0 ? this.elements.shift().item : null;
    }

    // метод проверки очереди на пустоту
    empty() {
        return this.elements.length === 0;
    }
}

function aStarSearch(grid, start, goal) {
    // получение количества строк и столбцов из матрицы
    const rows = grid.length;
    const cols = grid[0].length;

    // определение возможных направлений движения
    const directions = [
        [-1, 0], // вверх
        [0, 1], // вправо
        [1, 0], // вниз
        [0, -1] // влево
    ];

    // функция для создания ноды
    const node = (x, y) => ({ x, y });

    // функция для создания ключа ноды
    const nodeKey = ({ x, y }) => `${x}-${y}`;

    // функция для проверки возможности прохода через клетку
    const isWalkable = (x, y) => grid[x][y] === 0 || grid[x][y] === 3;

    // инициализация начальной и конечной ноды
    const startNode = node(...start);
    var goalNode = node(...goal);

    // инициализация очереди с приоритетом
    const frontier = new PriorityQueue();
    frontier.put(startNode, 0);

    // инициализация мап для хранения предыдущих нод и стоимости пути
    const cameFrom = new Map();
    const costSoFar = new Map();
    cameFrom.set(nodeKey(startNode), null);
    costSoFar.set(nodeKey(startNode), 0);

    // иннициализация переменных для хранения ближайшей ноды и расстояния до нее
    let closest = startNode;
    let closestDistance = heuristic(startNode, goalNode);

    // цикл поиска пути
    while (!frontier.empty()) {
        // получение текущей ноды из очереди с приоритетом
        const current = frontier.get();

        // просчет расстояния до конечной ноды
        let distance = heuristic(current, goalNode);

        // обновление ближайшей ноды и расстояния до нее
        if (distance < closestDistance) {
            closest = current;
            closestDistance = distance;
        }

        // остановка поиска, если достигнута конечная нода
        if (current.x === goalNode.x && current.y === goalNode.y) {
            break;
        }

        // исследование соседних нод
        directions.forEach(([dx, dy]) => {
            const nextX = current.x + dx;
            const nextY = current.y + dy;

            // проверка на выход за границы матрицы и проходимость клетки
            if (nextX >= 0 && nextX < rows && nextY >= 0 && nextY < cols && isWalkable(nextX, nextY)) {
                // просчет стоимости пути до соседней ноды
                const newCost = costSoFar.get(nodeKey(current)) + 1;
                const nextNode = node(nextX, nextY);

                // обновление стоимости пути и добавление ноды в очередь с приоритетом
                if (!costSoFar.has(nodeKey(nextNode)) || newCost < costSoFar.get(nodeKey(nextNode))) {
                    costSoFar.set(nodeKey(nextNode), newCost);
                    const priority = newCost + heuristic(nextNode, goalNode);
                    frontier.put(nextNode, priority);
                    cameFrom.set(nodeKey(nextNode), current);
                }
            }
        });
    }

    // обновление конечной ноды, если путь не найден
    if (!(closest.x === goalNode.x && closest.y === goalNode.y)) {
        goalNode = closest;
    }

    // создание пути
    const path = [];
    let current = goalNode;
    while (current !== null && cameFrom.has(nodeKey(current))) {
        path.push([current.y, current.x]);
        current = cameFrom.get(nodeKey(current));
    }
    path.reverse();

    // возврат пути
    return path;
}

// функция для просчета эвристики (расстояния) между двумя нодами
function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
