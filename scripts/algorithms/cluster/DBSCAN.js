function dbscan_naive(Points, epsilon, numPointInR, distance) {
    work = true;
    let Noise = 0
    let ClusterNumber = 0

    let visitedPoints = new Set();
    let clusteredPoints = new Set();
    let clusters = {};

    clusters[Noise] = [];

    function regionQuery(tempPoint) {
        if (!work) return;
        let array = [];

        for (let i = 0; i < Points.length; i++) {
            if (distance(Points[i], tempPoint) < epsilon)
                array[array.length] = Points[i];
        }
        return array;
    }

    function expandCluster(tempPoint, neighbours) {
        if (!work) return;
        if (clusters[ClusterNumber] === undefined)
            clusters[ClusterNumber] = [];
        if (!work) return;
        clusters[ClusterNumber][clusters[ClusterNumber].length] = tempPoint
        clusteredPoints.add(tempPoint)
        while (neighbours.length !== 0) {
            let q = neighbours.pop();
            if (!work) return;
            if (!(visitedPoints.has(q))) {
                visitedPoints.add(q);
                let neighbourOfNeighbour = regionQuery(q);
                if (neighbourOfNeighbour.length > numPointInR)
                    neighbours = concatForMatrix(neighbourOfNeighbour, neighbours);
                if (!work) return;
            }
            if (!(clusteredPoints.has(q))) {
                clusteredPoints.add(q);
                clusters[ClusterNumber][clusters[ClusterNumber].length] = q;
                if (clusters[Noise].indexOf(q) !== -1)
                    clusters[Noise].splice(clusters[Noise].indexOf(q), clusters[Noise].indexOf(q));
                if (!work) return;
            }
            if (!work) return;
        }
    }

    function loopingFunction(i = 0) {
        if (i >= Points.length) return clusters;
        let tempPoint = Points[i];
        if (!work) return;
        if (visitedPoints.has(tempPoint)) {
            return setTimeout(loopingFunction, 800, i + 1);
        }

        visitedPoints.add(tempPoint);

        let neighbours = regionQuery(tempPoint);
        if (!work) return;
        if (neighbours.length < numPointInR)
            clusters[Noise][clusters[Noise].length] = tempPoint;
        else {
            ClusterNumber += 1;

            expandCluster(tempPoint, neighbours);
        }
        if (!work) return;
        drawByDictionaryWithRandomColor(clusters, 0, 0.5, 1, 0.5)
        return setTimeout(loopingFunction, 800, i + 1);

    }


    loopingFunction();

    return clusters;
}


function concatForMatrix(firstMatrix, secondMatrix) {
    let newMatrix = firstMatrix;

    for (let i = 0; i < secondMatrix.length; i++) {
        newMatrix[newMatrix.length] = secondMatrix[i];
    }

    return newMatrix;
}
