function KMeans(canvas, data, k) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.data = data;
    this.k = k; // Количество кластеров
    this.means = []; // Массив для хранения центров кластеров
    this.assignments = []; // Массив для хранения принадлежности точек к кластерам
    this.iterations = 0; // Счетчик итераций
    this.clusterMatrix = []; // Матрица для хранения точек кластеров
    this.initialize(); // Инициализация начальных значений
}

KMeans.prototype.initialize = function() {
    // Инициализация центров кластеров случайными значениями
    for (let i = 0; i < this.k; i++) {
        let mean = [Math.random() * this.canvas.width, Math.random() * this.canvas.height];
        this.means.push(mean);
    }
};

KMeans.prototype.assignClusterToDataPoints = function() {
    // Назначение каждой точке ближайшего кластера
    this.assignments = [];
    for (let i = 0; i < this.data.length; i++) {
        let point = this.data[i];
        let distances = this.means.map(mean => this.distance(point, mean));
        this.assignments[i] = distances.indexOf(Math.min(...distances));
    }
};

KMeans.prototype.moveMeans = function() {
    // Обновление центров кластеров на основе среднего значения точек, принадлежащих кластеру
    let sums = Array(this.k).fill(0).map(() => [0, 0]);
    let counts = Array(this.k).fill(0);
    for (let i = 0; i < this.data.length; i++) {
        let meanIndex = this.assignments[i];
        sums[meanIndex][0] += this.data[i][0];
        sums[meanIndex][1] += this.data[i][1];
        counts[meanIndex]++;
    }
    for (let i = 0; i < this.k; i++) {
        if (counts[i] > 0) {
            this.means[i] = [sums[i][0] / counts[i], sums[i][1] / counts[i]];
        }
    }
};
KMeans.prototype.generateClusterMatrix = function() {
    // инициализируем матрицу кластеров
    for (let i = 0; i < this.k; i++) {
        this.clusterMatrix[i] = [];
    }

    // Прикрепляем точки к кластерам
    for (let i = 0; i < this.data.length; i++) {
        let clusterIndex = this.assignments[i];
        this.clusterMatrix[clusterIndex].push(this.data[i]);
    }
};

KMeans.prototype.distance = function(pointA, pointB) {
    // Вычисление Евклидова расстояния между двумя точками
    let dx = pointA[0] - pointB[0];
    let dy = pointA[1] - pointB[1];
    return Math.sqrt(dx * dx + dy * dy);
};

KMeans.prototype.run = function() {
    // Запуск алгоритма
    this.assignClusterToDataPoints();
    this.moveMeans();
    this.iterations++;
    this.generateClusterMatrix();
    return this.clusterMatrix;
};

KMeans.prototype.draw = function() {
    // Очистка холста
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // TODO: Реализовать отрисовку точек и центров кластеров, а также добавить возможность нанесения самих точек на канвас
    /*
    как можно сделать отрисовку точек и центров кластеров
    const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    drawPoint(x, y);
});
function drawPoint(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2, true);
    ctx.fill();
}
let points = [];

function drawPoint(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2, true);
    ctx.fillStyle = "#ff2626";
    ctx.fill();

    points.push({x: x, y: y});
}

     */
};