function hierarchicalClustering(point, countCluster, distance) {
    let clusters = {};
    let clustersCenter = {};
    for (let i = 0; i < point.length; i++) {
        clusters[i] = [];
        clusters[i][0] = point[i];
        clustersCenter[i] = point[i];
    }

    function createCluster(clusters, clustersCenter) {
        if (!work) return;
        //отрисока точек
        drawByDictionaryWithRandomColor(clusters, 0.5, 0, 0.5, 0.5);

        if (Object.keys(clusters).length <= countCluster)
            return;
        let tempMax = 1e10;
        let tempCoordinate = [0, 0];
        if (!work) return;
        for (let i = 0; clustersCenter[i] !== undefined; i++)
            for (let j = 0; clustersCenter[j] !== undefined; j++) {
                if (i === j) continue;
                let tempDistance = distance(clustersCenter[i], clustersCenter[j]);
                if (tempDistance < tempMax) {

                    tempMax = tempDistance;
                    tempCoordinate[0] = i;
                    tempCoordinate[1] = j;

                }
                if (!work) return;
            }
        //добавление в кластер элемент который максимально близок
        clusters[tempCoordinate[0]] = concatForMatrix(clusters[tempCoordinate[0]], clusters[tempCoordinate[1]]);
        //удаление из кластра элемента который добавлялил
        clusters = deleteDictionaryByNumber(clusters, tempCoordinate[1]);

        //смещение центров на новые коордирнаты
        clustersCenter[tempCoordinate[0]] = countCenterByTwoPoints(clustersCenter[tempCoordinate[0]], clustersCenter[tempCoordinate[1]]);
        //удаление лишнего центра
        clustersCenter = deleteDictionaryByNumber(clustersCenter, tempCoordinate[1]);

// проблема возникает когда удаляем начальный элемент в словаре
        if (!work) return;
        setTimeout(createCluster, 800, clusters, clustersCenter);
    }

    createCluster(clusters, clustersCenter);
}

function countCenterByTwoPoints(firstPoint, secondPoint) {
    return [(firstPoint[0] + secondPoint[0]) / 2, (firstPoint[1] + secondPoint[1]) / 2];
}

function concatForMatrix(firstMatrix, secondMatrix) {
    let newMatrix = firstMatrix;
    for (let i = 0; i < secondMatrix.length; i++) {
        newMatrix[newMatrix.length] = secondMatrix[i];
    }
    return newMatrix;
}

function drawByDictionaryWithRandomColor(clusters, offsetOfX = 0, offsetOfY = 0, ratioX = 1, ratioY = 1) {
    for (let i = 0; clusters[i] !== undefined; i++) {
        let color = `rgb(${randomInt(0, 255)},
                                     ${randomInt(0, 255)},
                                     ${randomInt(0, 255)})`
        managePathOfClustering(clusters[i], color, offsetOfX, offsetOfY, ratioX, ratioY);
    }
}

function randomInt(min, max) {
    return Math.floor(min + Math.floor(Math.random() * (max - min)));
}

function deleteDictionaryByNumber(dictionary, number) {
    let localDictionary = dictionary;

    for (let i = 0, j = 0; dictionary[i] !== undefined; i++, j++) {
        if (number === i)
            i++;
        localDictionary[j] = dictionary[i];
    }
    delete localDictionary[Object.keys(localDictionary).length - 1];
    return localDictionary;
}