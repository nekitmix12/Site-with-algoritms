
let pheromoneMatrix = [];

async function ACO(pointMatrix, numIterations = 100, evaporationRate =1, Alpha = 1, Beta = 1, q=0.6) {
    //задаем количество "муравьев"
    let numAnts = pointMatrix.length;

    //изменяем точки в матрицу смежности
    let distanceMatrix = createMatrixAdjacencies(pointMatrix);
    pheromoneMatrix = [];
    //создаем матрицу ферамонов
    const initialPheromone = 1 / (distanceMatrix.length * numAnts);
    for (let i = 0; i < distanceMatrix.length; i++) {
        const arr = [];
        for (let j = 0; j < distanceMatrix.length; j++) {
            arr.push(initialPheromone);
        }
        pheromoneMatrix.push(arr);
    }

    //лучший путь и его длина
    let bestTour;
    let bestTourLength = Infinity;

    //находим лучший путь благодаря итерациям
    for (let iter = 0; iter < numIterations; iter++) {
        if(!work)return ;
        //создание матрицы ферамонов для каждого муравья
        const antPheromoneMatrix = [];
        for (let i = 0; i < numAnts; i++) {
            antPheromoneMatrix.push(pheromoneMatrix.slice());
        }

        // поиск муравьями, каждый мураве стартует с новой точки
        for (let ant = 0; ant < numAnts; ant++) {
            if(!work)return ;
            const path = [];
            const visited = new Set();
            let current =ant;
            visited.add(current);
            path.push(current);


            for (let i = 0; i < distanceMatrix.length - 1; i++) {
                if(!work)return ;
                //здесь мы высчитываем вероятность появления события(МКН привет), заводим массив под частные события и вычисляем сначала сумму а потом каждое делим на сумму
                const probabilities = [];
                let denominator = 0;
                for (let j = 0; j < distanceMatrix.length; j++) {
                    if (!visited.has(j)) {
                        const numerator = Math.pow(pheromoneMatrix[current][j], Alpha) * Math.pow(1 / distanceMatrix[current][j], Beta);
                        denominator += numerator;
                        probabilities.push(numerator);
                    } else {
                        probabilities.push(0);
                    }
                }
                probabilities.forEach((_, index) => probabilities[index] /= denominator);


                //здесь мы рандомно выбтраем в какой город пойдем
                const random = Math.random();
                let sum = 0;
                let next;
                for (let j = 0; j < probabilities.length; j++) {
                    sum += probabilities[j];
                    if (random < sum) {
                        next = j;
                        break;
                    }
                }

                //собственно добавляем точки которые посетили,чтоб не посетить их снова
                visited.add(next);
                path.push(next);

                // обнавляем значения ферамонов
                antPheromoneMatrix[ant][current][next] += q / distanceMatrix[current][next];
                antPheromoneMatrix[ant][next][current] += q / distanceMatrix[current][next];

                //двигаемся в следующий город
                current = next;
            }

            // добавляем растояние для последнего города
            let tourLength = 0;
            for (let i = 0; i < path.length - 1; i++) {
                tourLength += distanceMatrix[path[i]][path[i + 1]];
            }
            tourLength += distanceMatrix[path[path.length - 1]][path[0]];

            // обновляем ферамоны для последних точек
            antPheromoneMatrix[ant][path[path.length - 1]][path[0]] += q / distanceMatrix[path[path.length - 1]][path[0]];
            antPheromoneMatrix[ant][path[0]][path[path.length - 1]] += q / distanceMatrix[path[path.length - 1]][path[0]];
            if(!work)return ;
            // добавляем в матрицу испарнение
            for (let i = 0; i < antPheromoneMatrix[ant].length; i++) {
                for (let j = 0; j < antPheromoneMatrix[ant][i].length; j++) {
                    antPheromoneMatrix[ant][i][j] *= 1 - evaporationRate;
                    antPheromoneMatrix[ant][i][j] = Math.max(antPheromoneMatrix[ant][i][j], 0.0001);
                }
            }

            // обновляем путь
            if (tourLength < bestTourLength) {
                bestTour = path;
                bestTourLength = tourLength;
            }
        }

        // обновление глобального ферамонового следа
        for (let i = 0; i < pheromoneMatrix.length; i++) {
            for (let j = 0; j < pheromoneMatrix[i].length; j++) {
                let sum = 0;
                for (let ant = 0; ant < numAnts; ant++) {
                    sum += antPheromoneMatrix[ant][i][j];
                }
                pheromoneMatrix[i][j] = (1 - evaporationRate) * pheromoneMatrix[i][j] + sum;
            }
        }
        if(!work)return ;
    }

    console.log(bestTour);
    console.log(bestTourLength);
    return [bestTour, bestTourLength];
}

function createMatrixAdjacencies(pointMatrix){
    let newMatrix = [];
    for (let i = 0; i < pointMatrix.length; i++) {
        newMatrix[i] = [];
        for (let j = 0; j < pointMatrix.length; j++)
            newMatrix[i][j] = getEuclideanDistance(pointMatrix[i], pointMatrix[j]);
    }
    return newMatrix;
}
async function antAlgorithm(distances, numIterations = 100,evaporationRate =1, Alpha, Beta, q){
    let bestTour;
    let bestTourLength = Infinity;
    work = true;
    for (let iteration = 1; iteration <= numIterations; iteration++) {
        if(!work)return ;
        const [currentBestTour, currentBestTourLength] = await ACO(distances, numIterations,  evaporationRate, Alpha, Beta, q);

        // обновление кратчайшего пути
        if (currentBestTourLength < bestTourLength) {
            bestTour = currentBestTour;
            bestTourLength = currentBestTourLength;
        }

        // отрисовка
        createPath(currentBestTour);

        // вывод информации в логи
        console.log(`Iteration ${iteration}: Best tour length = ${bestTourLength}`);
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    createPath(bestTour, true);
}
