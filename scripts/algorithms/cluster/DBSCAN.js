function dbscan_naive(Points, epsilon, numPointInR, distance) {
    let Noise = 0
    let ClusterNumber = 0

    let visitedPoints = new Set();
    let clusteredPoints = new Set();
    let clusters = {};

    clusters[Noise]=[];

    function region_query(tempPoint) {

        let array = [];

        for(let i =0;i<Points.length;i++) {
            if (distance(Points[i], tempPoint) < epsilon)
                array[array.length] = Points[i];
        }
        return array;
    }

    function expand_cluster(p, neighbours) {
        console.log(clusters[ClusterNumber]===undefined);
        if (clusters[ClusterNumber]===undefined)
            clusters[ClusterNumber] = [];

        clusters[ClusterNumber][clusters[ClusterNumber].length]=p
        clusteredPoints.add(p)
        while (neighbours.length!==0) {
            let q = neighbours.pop();
            for(let i = 0 ;i<visitedPoints.length;i++)
                console.log(visitedPoints[i]);
            if (!(visitedPoints.has(q))) {
                visitedPoints.add(q);
                let neighbourz = region_query(q);
                if (neighbourz.length > numPointInR)
                    neighbours= concatForMatrix(neighbourz, neighbours);
                console.log(neighbours);
            }
            if (!(clusteredPoints.has(q))) {
                clusteredPoints.add(q);
                clusters[ClusterNumber][clusters[ClusterNumber].length] =q;
                if (clusters[Noise].indexOf(q)!==-1)
                    clusters[Noise].splice(clusters[Noise].indexOf(q),clusters[Noise].indexOf(q));
                console.log(clusters[Noise]);
            }
        }
    }

    for (let i = 0;i<Points.length;i++) {
        let tempPoint = Points[i];

        if (visitedPoints.has(tempPoint)) {
            continue;
        }

        visitedPoints.add(tempPoint);

        let neighbours = region_query(tempPoint);

        if (neighbours.length < numPointInR)
            clusters[Noise][clusters[Noise].length]=tempPoint;
        else {
            ClusterNumber += 1;

            expand_cluster(tempPoint, neighbours);
        }


    }


   drawByDictionaryWithRandomColor(clusters,0,0.5,1,0.5)
//    drawByDictionaryWithRandomColor(clusters)
    return clusters;
}


function concatForMatrix(firstMatrix,secondMatrix){
    let newMatrix = firstMatrix;

    for(let i = 0;i<secondMatrix.length;i++){
        newMatrix[newMatrix.length] = secondMatrix[i];
    }

    return newMatrix;
}
