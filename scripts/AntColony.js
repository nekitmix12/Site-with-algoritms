/**
 * Решение задачи коммивояжера методом муравьиной оптимизации в лабиринте с препятствиями.
 * @param {number[][]} matrix Матрица с препятствиями, где 0 - свободная клетка, 1 - занятая.
 * @param {{x: number, y: number}} start Стартовая позиция муравьев.
 * @param {{x: number, y: number}[]} targets Массив координат точек, которые нужно достичь.
 * @param {number} numAnts Количество муравьев.
 * @param {number} maxIterations Максимальное количество итераций алгоритма.
 * @param {number} Q Коэффициент феромона
 * @param {number} rho  Коэффициент испарения феромона
 * @param {number} alpha Параметр альфа для влияния феромона
 * @param {number} beta // Параметр бета для влияния видимости
 * @returns {Object[]} Массив всех промежуточных путей между начальной точкой и всеми целевыми точками.
 */
function antColonyOptimization(matrix, start, targets,
                               numAnts, maxIterations, Q, rho, alpha, beta) {
    const numNodes = matrix.length * matrix[0].length;
    const distanceMatrix = calculateDistanceMatrix(matrix);

    function initializeAnts(numAnts, startNode) {
        let ants = [];
        for (let i = 0; i < numAnts; i++) {
            ants.push({
                path: [startNode],
                visited: new Set([startNode]),
                currentPosition: startNode
            });
        }
        return ants;
    }

    function selectNextNode(currentNode, availableNodes, pheromone, alpha, beta) {
        let probabilities = [];
        let totalProbability = 0;

        availableNodes.forEach(node => {
            if (distanceMatrix[currentNode] && distanceMatrix[currentNode][node]) {
                let pheromoneLevel = pheromone[currentNode][node];
                let visibility = 1 / distanceMatrix[currentNode][node];
                let probability = Math.pow(pheromoneLevel, alpha) * Math.pow(visibility, beta);
                probabilities.push({node, probability});
                totalProbability += probability;
            }
        });

        probabilities.forEach(prob => {
            prob.probability /= totalProbability;
        });

        let randomValue = Math.random();
        let cumulativeProbability = 0;
        for (let i = 0; i < probabilities.length; i++) {
            cumulativeProbability += probabilities[i].probability;
            if (randomValue <= cumulativeProbability) {
                return probabilities[i].node;
            }
        }

        return availableNodes[Math.floor(Math.random() * availableNodes.length)];
    }

    function updatePheromone(pheromone, ants, Q, rho) {
        ants.forEach(ant => {
            let pathLength = calculatePathLength(ant.path, distanceMatrix);
            for (let i = 0; i < ant.path.length - 1; i++) {
                let fromNode = ant.path[i];
                let toNode = ant.path[i + 1];
                if (pheromone[fromNode] && pheromone[fromNode][toNode]) {
                    pheromone[fromNode][toNode] += Q / pathLength;
                    pheromone[toNode][fromNode] = pheromone[fromNode][toNode];
                }
            }
        });

        for (let i = 0; i < pheromone.length; i++) {
            if (!pheromone[i]) continue;
            for (let j = 0; j < pheromone[i].length; j++) {
                if (pheromone[i][j]) {
                    pheromone[i][j] *= (1 - rho);
                }
            }
        }
    }

    function calculatePathLength(path, distanceMatrix) {
        let length = 0;
        for (let i = 0; i < path.length - 1; i++) {
            if (distanceMatrix[path[i]] && distanceMatrix[path[i]][path[i + 1]]) {
                length += distanceMatrix[path[i]][path[i + 1]];
            }
        }
        return length;
    }

    function calculateDistanceMatrix(matrix) {
        let distanceMatrix = [];
        for (let i = 0; i < matrix.length; i++) {
            distanceMatrix[i] = [];
            for (let j = 0; j < matrix[i].length; j++) {
                distanceMatrix[i][j] = findPath({x: i, y: j}, targets, matrix);
            }
        }
        return distanceMatrix;
    }

    function findPath(startNode, targets, matrix) {
        let paths = [];
        let queue = [{position: startNode, steps: 0, path: [startNode]}];
        let visited = new Set();
        visited.add(`${startNode.x},${startNode.y}`);

        while (queue.length > 0) {
            let current = queue.shift();

            if (targets.some(target => target.x === current.position.x && target.y === current.position.y)) {
                paths.push(current.path);
            }

            const neighbors = [
                {x: current.position.x + 1, y: current.position.y},
                {x: current.position.x - 1, y: current.position.y},
                {x: current.position.x, y: current.position.y + 1},
                {x: current.position.x, y: current.position.y - 1}
            ];

            neighbors.forEach(neighbor => {
                if (
                    neighbor.x >= 0 &&
                    neighbor.x < matrix.length &&
                    neighbor.y >= 0 &&
                    neighbor.y < matrix[0].length &&
                    matrix[neighbor.x][neighbor.y] === 0 &&
                    !visited.has(`${neighbor.x},${neighbor.y}`)
                ) {
                    visited.add(`${neighbor.x},${neighbor.y}`);
                    queue.push({position: neighbor, steps: current.steps + 1, path: [...current.path, neighbor]});
                }
            });
        }

        return paths;
    }

    let ants = initializeAnts(numAnts, start);
    let pheromone = Array.from({length: numNodes}, () => Array.from({length: numNodes}, () => 1));

    for (let iter = 0; iter < maxIterations; iter++) {
        ants.forEach(ant => {
            let currentNode = ant.currentPosition;
            let availableNodes = [];
            for (let i = 0; i < numNodes; i++) {
                if (!ant.visited.has(i) && i !== currentNode) {
                    availableNodes.push(i);
                }
            }

            let nextNode = selectNextNode(currentNode, availableNodes, pheromone, alpha, beta);
            ant.path.push(nextNode);
            ant.visited.add(nextNode);
            ant.currentPosition = nextNode;
        });

        updatePheromone(pheromone, ants, Q, rho);
    }

    return findPath(start, targets, matrix);
}

// Пример использования
const numAnts = 10;
const maxIterations = 100;
const Q = 100;
const rho = 0.1;
const alpha = 1;
const beta = 2;
let matrix = [
    [0, 0, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0]
];
let start = {x: 0, y: 0};
let targets = [{x: 4, y: 4}, {x: 3, y: 3}, {x: 1, y: 2}, {x: 4, y: 0}];

let paths = antColonyOptimization(matrix, start, targets, numAnts, maxIterations, Q, rho, alpha, beta);
console.log(paths);