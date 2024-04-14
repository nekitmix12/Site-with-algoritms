function dbscan_naive(P, eps, m, distance) {
    let NOISE = 0
    let C = 0

    let visited_points = new Set();
    let clustered_points = new Set();
    let clusters = {};

    clusters[NOISE]=[];

    function region_query(p) {

        let array = [];

        for(let i =0;i<P.length;i++) {
            if (distance(P[i], p) < eps)
                array[array.length] = P[i];
        }
        return array;
    }

    function expand_cluster(p, neighbours) {
        console.log(clusters[C]===undefined);
        if (clusters[C]===undefined)
            clusters[C] = [];

        clusters[C][clusters[C].length]=p
        clustered_points.add(p)
        while (neighbours.length!==0) {
            let q = neighbours.pop();
            for(let i = 0 ;i<visited_points.length;i++)
                console.log(visited_points[i]);
            if (!(visited_points.has(q))) {
                visited_points.add(q);
                let neighbourz = region_query(q);
                if (neighbourz.length > m)
                    neighbours= concatForMatrix(neighbourz, neighbours);
                console.log(neighbours);
            }
            if (!(clustered_points.has(q))) {
                clustered_points.add(q);
                clusters[C][clusters[C].length] =q;
                if (clusters[NOISE].indexOf(q)!==-1)
                    clusters[NOISE].splice(clusters[NOISE].indexOf(q),clusters[NOISE].indexOf(q));
                console.log(clusters[NOISE]);
            }
        }
    }

    for (let i = 0;i<P.length;i++) {
        let p = P[i];

        if (visited_points.has(p)) {
            continue;
        }

        visited_points.add(p);

        let neighbours = region_query(p);

        if (neighbours.length < m)
            clusters[NOISE][clusters[NOISE].length]=p;
        else {
            C += 1;

            expand_cluster(p, neighbours);
        }


    }


   drawByDictionaryWithRandomColor(clusters,0,0.5,1,0.5)
//    drawByDictionaryWithRandomColor(clusters)
    console.log('===========')
    console.log(clusters);
    return clusters;
}


function concatForMatrix(firstMatrix,secondMatrix){
    let newMatrix = firstMatrix;

    for(let i = 0;i<secondMatrix.length;i++){
        newMatrix[newMatrix.length] = secondMatrix[i];
    }

    return newMatrix;
}
