//points: Массив объектов с координатами { x, y }, представляющих вершины графа, которые нужно посетить.

//populationSize: Размер популяции, то есть количество особей (путей) в каждом поколении.

/*generations: Количество поколений, через которые должен пройти алгоритм. Большее количество поколений увеличивает
 шансы на нахождение оптимального пути.*/

/*mutationRate: Вероятность мутации для каждой особи. Мутация — это случайное изменение пути, которое помогает избежать
локальных оптимумов и способствует разнообразию популяции.*/

function calculateDistance(pointA, pointB) {
    return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
}

function createInitialPopulation(points, populationSize) {
    let population = [];
    for (let i = 0; i < populationSize; i++) {
        let individual = points.slice();
        shuffle(individual);
        population.push(individual);
    }
    return population;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function calculateTotalDistance(individual) {
    let totalDistance = 0;
    for (let i = 0; i < individual.length - 1; i++) {
        totalDistance += calculateDistance(individual[i], individual[i + 1]);
    }
    totalDistance += calculateDistance(individual[individual.length - 1], individual[0]);
    return totalDistance;
}

function selectParent(population) {
    return population[Math.floor(Math.random() * population.length)];
}

function crossover(parent1, parent2) {
    let child = [];
    let start = Math.floor(Math.random() * parent1.length);
    let end = Math.floor(Math.random() * (parent1.length - start)) + start;
    let parent1Segment = parent1.slice(start, end);
    child = [...parent1Segment, ...parent2.filter(point => !parent1Segment.includes(point))];
    return child;
}

function mutate(individual, mutationRate) {
    let mutatedIndividual = individual.slice();
    for (let i = 0; i < mutatedIndividual.length; i++) {
        if (Math.random() < mutationRate) {
            let j = Math.floor(Math.random() * mutatedIndividual.length);
            [mutatedIndividual[i], mutatedIndividual[j]] = [mutatedIndividual[j], mutatedIndividual[i]];
        }
    }
    return mutatedIndividual;
}

function geneticAlgorithmForTSP(points, populationSize, generations, mutationRate) {
    let population = createInitialPopulation(points, populationSize);
    let bestIndividual = population[0];
    let bestDistance = calculateTotalDistance(bestIndividual);
    let bestIndividualsPerGeneration = [];

    for (let gen = 0; gen < generations; gen++) {
        let newPopulation = [];
        for (let i = 0; i < population.length; i++) {
            let parent1 = selectParent(population);
            let parent2 = selectParent(population);
            let child = crossover(parent1, parent2);
            child = mutate(child, mutationRate);
            newPopulation.push(child);
            let childDistance = calculateTotalDistance(child);
            if (childDistance < bestDistance) {
                bestDistance = childDistance;
                bestIndividual = child.slice(); // Создаем копию лучшей особи
            }
        }
        population = newPopulation;
        bestIndividualsPerGeneration.push({
            generation: gen,
            individual: bestIndividual.map(p => ({ x: p.x, y: p.y })), // Копируем данные точек
            distance: bestDistance
        });
    }
    return { bestIndividual: bestIndividual.map(p => ({ x: p.x, y: p.y })), bestIndividualsPerGeneration };
}

const points = [
    { x: 0, y: 0 },
    { x: 1, y: 5 },
    { x: 2, y: 2 },
];
const populationSize = 100;
const generations = 200;
const mutationRate = 0.05;

const result = geneticAlgorithmForTSP(points, populationSize, generations, mutationRate);
console.log('Лучший путь:', result.bestIndividual);
console.log('Лучшие особи для каждого поколенияя: ', result.bestIndividualsPerGeneration[0], ' ',result.bestIndividualsPerGeneration[1]);