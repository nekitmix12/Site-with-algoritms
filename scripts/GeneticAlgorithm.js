/**
 * @function geneticAlgorithm - Функция поиска пути на основе генетического алгоритма
 * @param matrix - Матрица с препятствиями
 * @param points - Точки, которые нужно посетить
 * @param startPoint - Старовая точка порождения особей
 * @param populationSize - Размер популяции
 * @param maxGenerations - Максимальное количество поколений
 * @returns {*[]|null} - Возвращает путь, если он найден; иначе null
 */

// Генетический алгоритм
function geneticAlgorithm(matrix, points, startPoint, populationSize, maxGenerations) {
    // Убедимся, что все точки доступны; исключим недостижимые
    points = points.filter(point => getPathSegment(startPoint, point, matrix) !== null);

    // Инициализируем популяцию с доступными точками
    let population = initializePopulation(populationSize, points, startPoint);
    let bestFitness = Infinity;
    let bestIndividual = null;

    for (let generation = 0; generation < maxGenerations; generation++) {
        // Оцениваем приспособленность каждой особи
        let fitnessValues = population.map(individual => calculateFitness(individual, matrix));

        // Находим лучшую особь
        let bestIndex = fitnessValues.indexOf(Math.min(...fitnessValues));
        if (fitnessValues[bestIndex] < bestFitness) {
            bestFitness = fitnessValues[bestIndex];
            bestIndividual = population[bestIndex];
        }

        // Создаем новое поколение через мутацию
        population = population.map((individual, index) => index === bestIndex ? individual : mutate(individual, 0.1));
    }

    // Строим и возвращаем путь для лучшей особи
    return buildFullPath(bestIndividual, matrix);
}

// Функция для генерации начальной популяции
function initializePopulation(populationSize, points, startPoint) {
    let population = [];
    for (let i = 0; i < populationSize; i++) {
        // Стартовая точка добавляется в начало каждой особи
        let individual = [startPoint].concat(shuffle(points));
        population.push(individual);
    }
    return population;
}

// Функция для перемешивания массива (алгоритм Фишера-Йетса)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Функция для оценки приспособленности особи
function calculateFitness(individual, matrix) {
    let fitness = 0;
    for (let i = 0; i < individual.length - 1; i++) {
        let pathSegment = getPathSegment(individual[i], individual[i + 1], matrix);
        if (pathSegment === null) {
            return Infinity; // Если путь невозможен, возвращаем бесконечность
        }
        fitness += pathSegment.length;
    }
    return fitness;
}

// Функция для поиска пути между двумя точками с помощью BFS
function getPathSegment(start, end, matrix) {
    let visited = new Set([start.toString()]);
    let queue = [[start]];

    while (queue.length > 0) {
        let path = queue.shift();
        let [row, col] = path[path.length - 1];

        if (row === end[0] && col === end[1]) {
            return path;
        }

        [[row + 1, col], [row - 1, col], [row, col + 1], [row, col - 1]].forEach(([nextRow, nextCol]) => {
            if (nextRow >= 0 && nextRow < matrix.length && nextCol >= 0 && nextCol < matrix[0].length &&
                matrix[nextRow][nextCol] === 0 && !visited.has(nextRow + ',' + nextCol)) {
                visited.add(nextRow + ',' + nextCol);
                queue.push(path.concat([[nextRow, nextCol]]));
            }
        });
    }

    return null; // Если путь не найден
}

// Функция для построения полного пути
function buildFullPath(individual, matrix) {
    let fullPath = [];
    for (let i = 0; i < individual.length - 1; i++) {
        let segment = getPathSegment(individual[i], individual[i + 1], matrix);
        if (!segment) {
            return null; // Если путь не найден, возвращаем null
        }
        fullPath = fullPath.concat(i === 0 ? segment : segment.slice(1));
    }
    return fullPath;
}

// Функция мутации
function mutate(individual, mutationRate) {
    let startIndex = 1; // Стартовая точка находится в индексе 0 и не должна мутировать
    let mutated = individual.slice(startIndex); // Создаем копию особи без стартовой точки
    for (let i = 0; i < mutated.length; i++) {
        if (Math.random() < mutationRate) {
            let indexA = Math.floor(Math.random() * mutated.length);
            let indexB = (indexA + 1) % mutated.length;
            [mutated[indexA], mutated[indexB]] = [mutated[indexB], mutated[indexA]];
        }
    }
    return [individual[0]].concat(mutated); // Возвращаем стартовую точку обратно
}

// Тестовые данные
const matrix = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0]
];

const pointsToVisit = [[0, 0], [2, 2], [5, 4]];

const bestPath = geneticAlgorithm(matrix, pointsToVisit, [1, 1], 100, 100);
console.log('Best path:', bestPath);