// Функция для вычисления расстояния между двумя точками
function calculateDistance(point1, point2) {
    const [x1, y1] = point1;
    const [x2, y2] = point2;
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Функция для инициализации матрицы расстояний на основе координат
function initializeDistances(coordinates) {
    const numCities = coordinates.length;
    const distances = [];
    for (let i = 0; i < numCities; i++) {
        distances[i] = [];
        for (let j = 0; j < numCities; j++) {
            distances[i][j] = calculateDistance(coordinates[i], coordinates[j]);
        }
    }
    return distances;
}

// Функция для инициализации матрицы феромонов
function initializePheromones(numCities, initialValue) {
    return Array.from({ length: numCities }, () =>
        Array.from({ length: numCities }, () => initialValue)
    );
}

// Функция для обновления феромонов
function updatePheromones(pheromones, ants, evaporationRate, maxPheromone) {
    for (let i = 0; i < pheromones.length; i++) {
        for (let j = i + 1; j < pheromones[i].length; j++) {
            pheromones[i][j] *= (1 - evaporationRate);
            pheromones[j][i] *= (1 - evaporationRate);
        }
    }

    for (const ant of ants) {
        const pheromoneToAdd = maxPheromone / ant.distance;
        for (let i = 0; i < ant.path.length - 1; i++) {
            const currentCity = ant.path[i];
            const nextCity = ant.path[i + 1];
            pheromones[currentCity][nextCity] += pheromoneToAdd;
            pheromones[nextCity][currentCity] += pheromoneToAdd;
        }
    }
}

// Функция для выбора следующего города для муравья
function selectNextCity(pheromones, visited, currentCity) {
    const pheromoneLevels = pheromones[currentCity].map((pheromone, index) => {
        if (!visited.has(index)) {
            return pheromone;
        }
        return 0;
    });

    const totalPheromone = pheromoneLevels.reduce((acc, val) => acc + val, 0);
    if (totalPheromone === 0) {
        return null; // Возвращаем null, если у текущего города заканчиваются доступные феромоны
    }

    const probabilities = pheromoneLevels.map(pheromone => pheromone / totalPheromone);

    let cumulativeProbability = 0;
    const randomValue = Math.random();

    for (let i = 0; i < probabilities.length; i++) {
        cumulativeProbability += probabilities[i];
        if (randomValue <= cumulativeProbability) {
            return i;
        }
    }
}

// Муравьиный алгоритм
function antColonyOptimization(coordinates, numAnts, numIterations, initialPheromone, evaporationRate, maxPheromone) {
    const numCities = coordinates.length;
    const distances = initializeDistances(coordinates);
    let bestPath;
    let shortestDistance = Infinity;

    for (let iteration = 0; iteration < numIterations; iteration++) {
        const pheromones = initializePheromones(numCities, initialPheromone);
        const ants = Array.from({ length: numAnts }, () => {
            const startCityIndex = Math.floor(Math.random() * numCities);
            const path = [startCityIndex];
            const visited = new Set([startCityIndex]);
            let distance = 0;
            while (visited.size < numCities) {
                const currentCityIndex = path[path.length - 1];
                const nextCityIndex = selectNextCity(pheromones, visited, currentCityIndex);
                if (nextCityIndex === null) {
                    break; // Выходим из цикла, если у текущего города заканчиваются доступные феромоны
                }
                path.push(nextCityIndex);
                distance += distances[currentCityIndex][nextCityIndex];
                visited.add(nextCityIndex);
            }
            distance += distances[path[path.length - 1]][path[0]]; // Добавляем расстояние до начального города
            return { path, distance };
        });

        const bestAnt = ants.reduce((best, current) => current.distance < best.distance ? current : best, ants[0]);

        if (bestAnt.distance < shortestDistance) {
            bestPath = bestAnt.path;
            shortestDistance = bestAnt.distance;
        }

        updatePheromones(pheromones, ants, evaporationRate, maxPheromone);
    }

    return { bestPath, shortestDistance };
}
