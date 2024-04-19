function getAverage(pointArray) {

    let data = [0, 0];
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < pointArray.length; j++) {
            data[i] += pointArray[j][i];
        }
        data[i] /= pointArray.length;
    }
    return data;
}

function randomInt(min, max) {
    return Math.floor(min + Math.floor(Math.random() * (max - min)));
}

function getMax(pointArray) {
    let data = [0, 0];

    for (let i = 0; i < 2; i++)
        for (let j = 0; j < pointArray.length; j++)
            if (data[i] < pointArray[j][i]) data[i] = pointArray[j][i];

    return data;
}

function randomInteger(min, max) {
    // случайное число от min до max
    let rand = [];
    for (let i = 0; i < 2; i++) {
        rand[i] = Math.floor(min[i] + Math.floor(Math.random() * (max[i] - min[i])));
    }

    return rand;
}

function getMin(pointArray) {
    const bigVar = 1.0e+35;
    let data = [bigVar, bigVar];

    for (let i = 0; i < 2; i++)
        for (let j = 0; j < pointArray.length; j++)
            if (data[i] > pointArray[j][i]) data[i] = pointArray[j][i];

    return data;
}

function createVector(countClusters, pointArray) {
    let array = new Array(countClusters);

    let min = getMin(pointArray);
    let max = getMax(pointArray);

    for (let i = 0; i < countClusters; i++) {
        array[i] = randomInteger(min, max);
    }

    return array;
}

function getEuclideanDistance(firstPoint, secondPoint) {
    return ((secondPoint[0] - firstPoint[0]) ** 2 + (secondPoint[1] - firstPoint[1]) ** 2) ** (1 / 2);
}

function createClusters(centroids, pointArray) {
    let clusters = [];
    for (let i = 0; i < centroids.length; i++)
        clusters[i] = [];

    const bigVar = 1.0e+35;

    for (let i = 0; i < pointArray.length; i++) {
        let temp = [bigVar];

        for (let j = 0; j < centroids.length; j++) {
            const tempSecond = getEuclideanDistance(pointArray[i], centroids[j]);
            if (tempSecond < temp[0]) {
                temp[0] = tempSecond;
                temp[1] = j;
            }

        }

        let temp1 = temp[1];
        let temp2 = clusters[temp[1]].length
        clusters[temp1][temp2] = pointArray[i];


    }

    return clusters;
}

function getNewCentroids(clusters) {

    let centroids = [];
    for (let i = 0; i < clusters.length; i++)
        centroids[i] = [];

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < clusters.length; j++) {
            let temp = 0;
            for (let n = 0; n < clusters[j].length; n++) {
                temp += clusters[j][n][i];
            }
            temp /= clusters[j].length;
            centroids[j][i] = temp;
        }
    }

    return centroids;
}

function createMatrixBySize(cols, rows) {
    let matrix = [];
    for (let i = 0; i < rows; i++) {

        matrix[i] = [];
        for (let j = 0; j < cols; j++) {
            matrix[i][j] = 0;
        }


    }

    return matrix;
}

function createDotsByMatrix(matrixClusters, matrixColor) {
    let canvas = document.getElementById('fieldCanvas');
    let slider = document.getElementById('slider');
    let canvasField = canvas.getContext('2d');
    for (let j = 0; j < matrixClusters.length; j++) {
        canvasField.fillStyle = `rgb(${matrixColor[j][0]},
                                     ${matrixColor[j][1]},
                                     ${matrixColor[j][2]})`;
        for (let i = 0; i < matrixClusters[j].length; i++) {
            canvasField.fillRect(matrixClusters[j][i][0] * slider.value,
                matrixClusters[j][i][1] * slider.value, slider.value * 0.5, (slider.value * 0.5));

        }
    }
}

function getNewCluster(centroids, clusters, pointArray, colorsClusters, counter = 0) {
    //createPointWithDeleteLate(centroids);
    createDotsByMatrix(clusters, colorsClusters)
    clusters = createClusters(centroids, pointArray);
    let newCentroids = getNewCentroids(clusters);

    counter++;
    let bool = false;
    for (let i = 0; i < centroids.length; i++) {

        if (isNaN(newCentroids[i][0])) return false;
        if (newCentroids[i][0] !== centroids[i][0] ||
            newCentroids[i][1] !== centroids[i][1]) {
            bool = true;
        }
    }

    if (bool) return setTimeout(getNewCluster, 800, newCentroids, clusters, pointArray, colorsClusters, counter);


    return newCentroids;
}

function KMean(countClusters, pointArray) {
    let centroids = createVector(countClusters, pointArray);
    let clusters = createClusters(centroids, pointArray);

    let colorsClusters = createMatrixBySize(countClusters, 3);

    colorsClusters = generateColor(clusters, colorsClusters);

    let bool = true;
    while (bool) {

        bool = false;
        let newCentroids = getNewCluster(centroids, clusters, pointArray, colorsClusters);
        if (newCentroids === false) {
            bool = true;
            centroids = createVector(countClusters, pointArray);
            newCentroids = getNewCluster(centroids, clusters, pointArray, colorsClusters);
        }

    }

}

function generateColor(matrix) {
    let newMatrix = matrix;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < 3; j++) {
            newMatrix[i][j] = randomInt(0, 255);
        }
    }
    return newMatrix;
}

//let x = [[126, 63], [101, 100], [80, 160], [88, 208], [89, 282], [88, 362], [94, 406], [149, 377], [147, 304], [147, 235], [146, 152], [160, 103], [174, 142], [169, 184], [170, 241], [169, 293], [185, 376], [178, 422], [116, 353], [124, 194], [273, 69], [277, 112], [260, 150], [265, 185], [270, 235], [265, 295], [281, 351], [285, 416], [321, 404], [316, 366], [306, 304], [309, 254], [309, 207], [327, 161], [318, 108], [306, 66], [425, 66], [418, 135], [411, 183], [413, 243], [414, 285], [407, 333], [411, 385], [443, 387], [455, 330], [441, 252], [457, 207], [453, 149], [455, 90], [455, 56], [439, 102], [431, 162], [431, 193], [426, 236], [427, 281], [438, 323], [419, 379], [425, 389], [422, 349], [451, 275], [441, 222], [297, 145], [284, 195], [288, 237], [292, 282], [288, 313], [303, 356], [293, 395], [274, 268], [280, 344], [303, 187], [114, 247], [131, 270], [144, 215], [124, 219], [98, 240], [96, 281], [146, 267], [136, 221],[123, 166], [101, 185], [152, 184], [104, 283], [74, 239], [107, 287], [118, 335], [89, 336], [91, 315], [151, 340], [131, 373], [108, 133], [134, 130], [94, 260], [113, 193]]
function matrixResemblance(matrix) {
    let resemblanceMatrix = createMatrixBySize(matrix.length, matrix.length);
    let temp = 1e100;
    for (let i = 0; i < 2; i++)
        for (let j = 0; j < matrix.length; j++) {
            for (let n = 0; n < matrix.length; n++) {
                if (j === n) continue;
                resemblanceMatrix[j][n] = -getEuclideanDistance(matrix[j], matrix[n]);
                if (resemblanceMatrix[j][n] < temp) temp = resemblanceMatrix[j][n];
            }
            resemblanceMatrix[j][j] = temp;
        }
    return resemblanceMatrix;
}

function getMaxArray(array) {
    let temp = 0;
    for (let i = 0; i < array.length; i++)
        if (array[i] > temp) temp = array[i];

    return temp;
}

function affinitPropagation(matrix) {
    let resemblanceMatrix = matrixResemblance(matrix);
    let availabilityMatrix = createMatrixBySize(matrix.length, matrix.length);
    let responsibilityMatrix = createMatrixBySize(matrix.length, matrix.length);
    let newR = createMatrixBySize(matrix.length, matrix.length);
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < matrix.length; j++)
            for (let n = 0; n < matrix.length; n++) {
                newR[j][n] = resemblanceMatrix[j][n] - (getMaxArray(availabilityMatrix[j]) + getMaxArray(resemblanceMatrix[j]));
            }

    }
}