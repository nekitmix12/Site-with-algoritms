/* Пример использования

 alpha: Параметр, который определяет влияние количества феромона на вероятность выбора пути муравьем.
 Большее значение alpha увеличивает роль следа феромона в поведении муравья.

 beta: Параметр, который определяет влияние видимости (обратное значение расстояния) на вероятность выбора пути
 муравьем. Большее значение beta увеличивает роль расстояния до следующей точки при выборе пути.

evaporationRate: Скорость испарения феромона. Это значение между 0 и 1 и определяет, как быстро следы феромона
 исчезают со временем. Меньшее значение приводит к более быстрому исчезновению феромона, что может помочь избежать
 локальных оптимумов. (Уменьшает шанс выбора неверного пути)

 iterations: Количество итераций алгоритма. Это число определяет, сколько раз колония муравьев будет исследовать
 возможные пути, прежде чем будет выбран окончательный путь.

 numberOfAnts: Количество муравьев, используемых в алгоритме. Каждый муравей независимо исследует пути, и их
 коллективное поведение используется для определения оптимального пути.
*/
// функция для вычисления расстояния между двумя точками методом Мура
function calculateDistance(pointA, pointB) {
    return Math.max(Math.abs(pointA.x - pointB.x), Math.abs(pointA.y - pointB.y));
}

function initializePheromones(numberOfPoints, initialValue) {
    // Создание матрицы феромонов с начальным значением
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
    // инициализация матрицы феромонов
    const numberOfPoints = points.length;
    let pheromoneMatrix = initializePheromones(numberOfPoints, 1);
    let bestPath = [];
    let bestPathLength = Infinity;

    // цикл для итераций алгоритма (каждая итерация - это один проход колонии муравьев)
    for (let iter = 0; iter < iterations; ++iter) {
        let antsPaths = [];
        let antsPathLengths = [];

        // цикл для каждого муравья
        for (let i = 0; i < numberOfAnts; ++i) {
            // инициализация пути для текущего муравья
            let path = [];
            let visited = new Set();
            // Выбор случайной начальной точки
            let current = i % numberOfPoints;
            // Добавление начальной точки в путь и список посещенных точек
            path.push(current);
            visited.add(current);

            // цикл для посещения всех точек
            for (let step = 0; step < numberOfPoints - 1; ++step) {
                // Выбор следующей точки для посещения
                let next = selectNextPoint(current, points, visited, pheromoneMatrix, alpha, beta);
                // Добавление следующей точки в путь и список посещенных точек
                path.push(next);
                visited.add(next);
                current = next;
            }
            // Вычисление длины пути и добавление пути и его длины в соответствующие списки
            let pathLength = getPathLength(path, points);
            antsPaths.push(path);
            antsPathLengths.push(pathLength);

            // обновление лучшего пути, если текущий путь короче
            if (pathLength < bestPathLength) {
                bestPath = path;
                bestPathLength = pathLength;
            }
        }

        // обновление матрицы феромонов
        pheromoneMatrix = evaporatePheromones(pheromoneMatrix, evaporationRate);
        pheromoneMatrix = updatePheromones(pheromoneMatrix, antsPaths, antsPathLengths, alpha);
    }

    return { bestPath, bestPathLength };
}

// функция для выбора следующей точки для посещения муравьем
function selectNextPoint(current, points, visited, pheromoneMatrix, alpha, beta) {
    // список вероятностей для каждой непосещенной точки
    let probabilities = [];
    let total = 0;

    // вычисление общей суммы вероятностей для непосещенных точек
    points.forEach((point, index) => {
        if (!visited.has(index)) {
            // Расчет вероятности для текущей точки
            let tau = Math.pow(pheromoneMatrix[current][index], alpha);
            // Расчет видимости (обратное расстояние) для текущей точки
            let eta = Math.pow(1 / calculateDistance(points[current], point), beta);
            // Общая вероятность для текущей точки
            total += tau * eta;
            // Добавление вероятности в список вероятностей
            probabilities[index] = { index, probability: tau * eta };
        }
    });
    // Нормализация вероятностей
    probabilities = probabilities.filter(p => p);
    probabilities.forEach(p => p.probability /= total);

    let random = Math.random();
    let sum = 0;

    // выбор следующей точки на основе вероятностей
    for (let i = 0; i < probabilities.length; ++i) {
        sum += probabilities[i].probability;
        // Если сумма вероятностей превышает случайное число, выбираем эту точку
        if (random <= sum) {
            return probabilities[i].index;
        }
    }
    // Если случайное число больше всех вероятностей, выбираем последнюю точку
    return probabilities[probabilities.length - 1].index;
}


function getPathLength(path, points) {
    let length = 0;
    // Вычисление длины пути, суммируя расстояния между точками
    for (let i = 0; i < path.length - 1; ++i) {
        length += calculateDistance(points[path[i]], points[path[i + 1]]);
    }
    // Добавление расстояния от последней точки к первой
    length += calculateDistance(points[path[0]], points[path[path.length - 1]]);
    return length;
}


function evaporatePheromones(pheromoneMatrix, evaporationRate) {
    return pheromoneMatrix.map(row => row.map(p => p * (1 - evaporationRate)));
}

// функция для обновления феромонов в матрице феромонов на основе путей, пройденных муравьями
function updatePheromones(pheromoneMatrix, antsPaths, antsPathLengths, alpha) {
    // Обновление феромонов на основе длины пути, пройденного муравьем
    antsPaths.forEach((path, index) => {
        // Вклад муравья в феромоны
        let contribution = Math.pow(1 / antsPathLengths[index], alpha);
        // Обновление феромонов для каждой пары точек в пути
        for (let i = 0; i < path.length - 1; ++i) {
            // Обновление феромонов для двух направлений
            pheromoneMatrix[path[i]][path[i + 1]] += contribution;
            pheromoneMatrix[path[i + 1]][path[i]] += contribution;
        }
        // Обновление феромонов для последней и первой точек
        pheromoneMatrix[path[path.length - 1]][path[0]] += contribution;
    });
    return pheromoneMatrix;
}


const points = [
    { x: 0, y: 0 }, // Точка 0
    { x: 1, y: 2 }, // Точка 1
    { x: -1, y: 2 }, // Точка 2
];
const alpha = 1;
const beta = 5;
const evaporationRate = 0.5;
const iterations = 100;
const numberOfAnts = 10;

// Результат вычислений
const result = antColonyOptimization(points, alpha, beta, evaporationRate, iterations, numberOfAnts);

// Проверка значений в консоли
console.log(result.bestPath); // Выводит кратчайший путь, последовательность из индексов точек, которые по порядку нужно соединить путями
console.log(result.bestPathLength); // Выводит длину кратчайшего пути (вычисляется методом Мура)