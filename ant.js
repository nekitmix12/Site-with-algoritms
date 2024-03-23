function calculateDistance(pointA, pointB) {
    // Расстояние по методу Мура
    return Math.max(Math.abs(pointA.x - pointB.x), Math.abs(pointA.y - pointB.y));
}

function initializePheromones(numberOfPoints, initialValue) {
    const pheromones = [];
    for (let i = 0; i < numberOfPoints; i++) {
        pheromones[i] = [];
        for (let j = 0; j < numberOfPoints; j++) {
            pheromones[i][j] = initialValue;
        }
    }
    return pheromones;
}

function antColonyOptimization(points, alpha, beta, evaporationRate, iterations, numberOfAnts) {
    const numberOfPoints = points.length;
    let pheromoneMatrix = initializePheromones(numberOfPoints, 1);
    let bestPath = [];
    let bestPathLength = Infinity;

    for (let iter = 0; iter < iterations; iter++) {
        let antsPaths = [];
        let antsPathLengths = [];

        for (let i = 0; i < numberOfAnts; i++) {
            let path = [];
            let visited = new Set();
            let current = i % numberOfPoints;
            path.push(current);
            visited.add(current);

            for (let step = 0; step < numberOfPoints - 1; step++) {
                let next = selectNextPoint(current, points, visited, pheromoneMatrix, alpha, beta);
                path.push(next);
                visited.add(next);
                current = next;
            }

            let pathLength = getPathLength(path, points);
            antsPaths.push(path);
            antsPathLengths.push(pathLength);

            if (pathLength < bestPathLength) {
                bestPath = path;
                bestPathLength = pathLength;
            }
        }

        pheromoneMatrix = evaporatePheromones(pheromoneMatrix, evaporationRate);
        pheromoneMatrix = updatePheromones(pheromoneMatrix, antsPaths, antsPathLengths, alpha);
    }

    return { bestPath, bestPathLength };
}

function selectNextPoint(current, points, visited, pheromoneMatrix, alpha, beta) {
    let probabilities = [];
    let total = 0;

    points.forEach((point, index) => {
        if (!visited.has(index)) {
            let tau = Math.pow(pheromoneMatrix[current][index], alpha);
            let eta = Math.pow(1 / calculateDistance(points[current], point), beta);
            total += tau * eta;
            probabilities[index] = { index, probability: tau * eta };
        }
    });

    probabilities = probabilities.filter(p => p);
    probabilities.forEach(p => p.probability /= total);

    let random = Math.random();
    let sum = 0;

    for (let i = 0; i < probabilities.length; i++) {
        sum += probabilities[i].probability;
        if (random <= sum) {
            return probabilities[i].index;
        }
    }

    return probabilities[probabilities.length - 1].index;
}

function getPathLength(path, points) {
    let length = 0;
    for (let i = 0; i < path.length - 1; i++) {
        length += calculateDistance(points[path[i]], points[path[i + 1]]);
    }
    length += calculateDistance(points[path[0]], points[path[path.length - 1]]);
    return length;
}

function evaporatePheromones(pheromoneMatrix, evaporationRate) {
    return pheromoneMatrix.map(row => row.map(p => p * (1 - evaporationRate)));
}

function updatePheromones(pheromoneMatrix, antsPaths, antsPathLengths, alpha) {
    antsPaths.forEach((path, index) => {
        let contribution = Math.pow(1 / antsPathLengths[index], alpha);
        for (let i = 0; i < path.length - 1; i++) {
            pheromoneMatrix[path[i]][path[i + 1]] += contribution;
            pheromoneMatrix[path[i + 1]][path[i]] += contribution;
        }
        pheromoneMatrix[path[path.length - 1]][path[0]] += contribution;
    });
    return pheromoneMatrix;
}

// Пример использования
// Инициализация данных
const points = [
    { x: 0, y: 0 }, // Точка 0
    { x: 1, y: 2 }, // Точка 1
    { x: -1, y: 2 }, // Точка 2
];
const alpha = 1; // Влияние феромона
const beta = 5; // Влияние видимости (1/длина пути)
const evaporationRate = 0.5; // Скорость испарения феромона, можно задать вводимым параметром
const iterations = 100; // Количество итераций алгоритма
const numberOfAnts = 10; // Количество муравьев

// Результат вычислений
const result = antColonyOptimization(points, alpha, beta, evaporationRate, iterations, numberOfAnts);

// Проверка значений в консоли
console.log(result.bestPath); // Выводит кратчайший путь, последовательность из индексов точек, которые по порядку нужно соединить путями
console.log(result.bestPathLength); // Выводит длину кратчайшего пути (вычисляется методом Мура)