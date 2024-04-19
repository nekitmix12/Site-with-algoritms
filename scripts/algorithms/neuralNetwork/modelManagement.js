"use strict";
//const fs = require("fs");
const IMG_DIMENSIONS = 50 * 50;
const HIDDEN_LAYER_1 = 225;
const HIDDEN_LAYER_2 = 225;

let index = 0;
let t_index = 0;

let fetched_images = undefined;
let fetched_labels = undefined;
let test_images = undefined;
let test_labels = undefined;


class Matrix {

    constructor(rows, cols) {

        this.rows = rows;
        this.cols = cols;
        this.data = [];

        for (let i = 0; i < rows; i++) {

            this.data.push([]);

            for (let j = 0; j < cols; j++) {
                this.data[i][j] = 0;
            }
        }
    }


    static add(m1, m2) {
        let result = new Matrix(m1.rows, m1.cols);
        result.data = result.data.map((row, i) => row.map((val, j) => m1.data[i][j] + m2.data[i][j]));
        return result;
    }

    static subtract(m1, m2) {
        let result = new Matrix(m1.rows, m1.cols);
        result.data = result.data.map((row, i) => row.map((val, j) => m1.data[i][j] - m2.data[i][j]));
        return result;
    }

    static multiply(m1, m2) {
        let result = new Matrix(m1.rows, m2.cols);
        result.data = result.data.map((row, i) => row.map((val, j) => {
            let sum = 0;
            for (let k = 0; k < m1.cols; k++) {
                sum += m1.data[i][k] * m2.data[k][j];
            }
            return sum;
        }));
        return result;
    }

    static transpose(m) {
        let result = new Matrix(m.cols, m.rows);
        result.data = result.data.map((row, i) => row.map((val, j) => m.data[j][i]));
        return result;
    }


    static el_multiply(m1, m2) {
        let result = new Matrix(m1.rows, m1.cols);
        result.data = result.data.map((row, i) => row.map((val, j) => m1.data[i][j] * m2.data[i][j]));
        return result;
    }


    static fromArray(array) {
        let result = new Matrix(array.flat().length, 1);
        result.data = result.data.map((row, i) => [array.flat()[i]]);
        return result;
    }


    static toArray(m) {
        return m.data.flat();
    }


    map(func) {
        this.data = this.data.map(row => row.map(func));
    }


    scale(num) {
        this.data = this.data.map(row => row.map(val => val * num));
    }


    fill(data) {
        this.data = data;
    }


    randomize() {
        this.data = this.data.map(row => row.map(() => Math.random() * 2 - 1));
    }

}

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function dsigmoid(y) {
    return y * (1 - y);
}

function normalize(x) {
    return x / 255;
}

class NeuralNetwork {

    constructor(inputLength, HD1_length, HD2_length, outputLength, data = null) {


        this.weights_IN_HD1 = new Matrix(HD1_length, inputLength);
        this.weights_HD1_HD2 = new Matrix(HD2_length, HD1_length);
        this.weights_HD2_OUT = new Matrix(outputLength, HD2_length);


        this.bias_HD1 = new Matrix(HD1_length, 1);
        this.bias_HD2 = new Matrix(HD2_length, 1);
        this.bias_OUT = new Matrix(outputLength, 1);

        if (data === null) {


            this.weights_IN_HD1.randomize();
            this.weights_HD1_HD2.randomize();
            this.weights_HD2_OUT.randomize();
            this.bias_HD1.randomize();
            this.bias_HD2.randomize();
            this.bias_OUT.randomize();

        } else {


            this.weights_IN_HD1.fill(data[0][0]);
            this.weights_HD1_HD2.fill(data[0][1]);
            this.weights_HD2_OUT.fill(data[0][2]);
            this.bias_HD1.fill(data[1][0]);
            this.bias_HD2.fill(data[1][1]);
            this.bias_OUT.fill(data[1][2]);

        }


        this.lr = 0.01; // Установка скорости обучения
    }

    applyDropout(layer) {
        layer.map(val => Math.random() < this.dropoutRate ? 0 : val); // Применение dropout к слою (уже нет)
        return layer;
    }

    processLayer(weights, inputs, bias) {
        let layer = Matrix.multiply(weights, inputs); // Умножение весов на входы
        layer = Matrix.add(layer, bias); // Добавление сдвигов
        layer.map(sigmoid); // Применение функции активации
        return layer; // Возвращение обработанного слоя
    }

    adjustWeights(weights, errors, outputs, inputs) {
        outputs.map(dsigmoid); // Применение производной функции активации
        let gradient = Matrix.el_multiply(errors, outputs); // Вычисление градиента
        gradient.scale(this.lr); // Масштабирование градиента с учетом скорости обучения
        let inputs_T = Matrix.transpose(inputs); // Транспонирование входов
        let deltas = Matrix.multiply(gradient, inputs_T); // Вычисление дельт
        return Matrix.add(weights, deltas); // Обновление весов
    }

    feedForward(inputsArray) {
        let inputs = Matrix.fromArray(inputsArray); // Преобразование входного массива в матрицу
        inputs.map(normalize); // Нормализация входов

        let HD1 = this.processLayer(this.weights_IN_HD1, inputs, this.bias_HD1); // Обработка первого скрытого слоя

        let HD2 = this.processLayer(this.weights_HD1_HD2, HD1, this.bias_HD2); // Обработка второго скрытого слоя

        let outputs = this.processLayer(this.weights_HD2_OUT, HD2, this.bias_OUT); // Обработка выходного слоя

        return Matrix.toArray(outputs); // Преобразование выходов в массив
    }

    train(inputsArray, desiredArray) {
        let inputs = Matrix.fromArray(inputsArray); // Преобразование входного массива в матрицу
        inputs.map(normalize); // Нормализация входов
        let HD1 = this.processLayer(this.weights_IN_HD1, inputs, this.bias_HD1); // Обработка первого скрытого слоя
        let HD2 = this.processLayer(this.weights_HD1_HD2, HD1, this.bias_HD2); // Обработка второго скрытого слоя
        let outputs = this.processLayer(this.weights_HD2_OUT, HD2, this.bias_OUT); // Обработка выходного слоя

        let desired = Matrix.fromArray(desiredArray); // Преобразование желаемого массива в матрицу
        let outputErrors = Matrix.subtract(desired, outputs); // Вычисление ошибок выходного слоя

        let weights_HD2_OUT_T = Matrix.transpose(this.weights_HD2_OUT); // Транспонирование весов от второго скрытого слоя к выходному слою
        let HD2_errors = Matrix.multiply(weights_HD2_OUT_T, outputErrors); // Вычисление ошибок второго скрытого слоя

        let weights_HD1_HD2_T = Matrix.transpose(this.weights_HD1_HD2); // Транспонирование весов от первого скрытого слоя ко второму скрытому слою
        let HD1_errors = Matrix.multiply(weights_HD1_HD2_T, HD2_errors); // Вычисление ошибок первого скрытого слоя

        this.weights_HD2_OUT = this.adjustWeights(this.weights_HD2_OUT, outputErrors, outputs, HD2); // Обновление весов от второго скрытого слоя к выходному слою
        this.weights_HD1_HD2 = this.adjustWeights(this.weights_HD1_HD2, HD2_errors, HD2, HD1); // Обновление весов от первого скрытого слоя ко второму скрытому слою
        this.weights_IN_HD1 = this.adjustWeights(this.weights_IN_HD1, HD1_errors, HD1, inputs); // Обновление весов от входного слоя к первому скрытому слою
    }

    get data() {
        let weights = [];
        weights.push(
            this.weights_IN_HD1.data,
            this.weights_HD1_HD2.data,
            this.weights_HD2_OUT.data
        ); // Сбор данных о весах

        let biases = [];
        biases.push(this.bias_HD1.data, this.bias_HD2.data, this.bias_OUT.data); // Сбор данных о сдвигах

        let data = [];
        data.push(weights, biases); // Объединение данных о весах и сдвигах

        return JSON.stringify(data); // Преобразование данных в строку JSON
    }
}

function request(req) {
    if (req === 'reset') {
        index = 0; // Сброс индекса
        t_index = 0; // Сброс тестового индекса
        return;
    }

    if (req === 'train') {
        let val = JSON.stringify([fetched_images[index], fetched_labels[index]]); // Получение обучающих данных
        ++index; // Увеличение индекса
        return val;
    }

    if (req === 'test') {
        let val = JSON.stringify([test_images[t_index], test_labels[t_index]]); // Получение тестовых данных
        t_index++; // Увеличение тестового индекса
        return val;
    }
}
function resize(image){

    let newImage = [];

    for (let i = 0; i < 50; ++i){

        let row = [];

        for (let j = 0; j < 50; ++j){

            let srcI = Math.round(28 / 50 * i);
            let srcJ = Math.round(28 / 50 * j);

            row.push(image[srcI][srcJ]);

        }

        newImage.push(row);
    }
    return newImage;
}


function readFile(path) {

    return new Promise(function (resolve, reject) {

        fs.readFile(path, {encoding: "utf-8"}, (err, data) => {

            if (err) reject(err);
            else resolve(data);

        });
    });
}


function inputIntoJson(path, data) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(path, data, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

async function trainModel() {

    const startTime = process.hrtime();

    let images_path = "/Users/nikitaskazutin/Downloads/Site-with-Algorithms-clone/resources/json/train-images.json";
    let labels_path = "/Users/nikitaskazutin/Downloads/Site-with-Algorithms-clone/resources/json/train-labels.json";
    let test_images_path = "/Users/nikitaskazutin/Downloads/Site-with-Algorithms-clone/resources/json/test-images.json";
    let test_labels_path = "/Users/nikitaskazutin/Downloads/Site-with-Algorithms-clone/resources/json/test-labels.json";

    fetched_images = await readFile(images_path);
    fetched_labels = await readFile(labels_path);
    test_images = await readFile(test_images_path);
    test_labels = await readFile(test_labels_path);
    fetched_images = JSON.parse(fetched_images);
    fetched_labels = JSON.parse(fetched_labels);
    test_images = JSON.parse(test_images);
    test_labels = JSON.parse(test_labels);


    let nn = new NeuralNetwork(IMG_DIMENSIONS, HIDDEN_LAYER_1, HIDDEN_LAYER_2, 10);

    for (let i = 0; i < 60000; i++) {

        let data = JSON.parse(request('train'));
        let input = data[0];
        let desired = Array(10).fill(0);
        desired[data[1]] = 1;

        input = resize(input);

        nn.train(input, desired);

        console.log("Epoch: " + (i + 1) + ", " + process.hrtime(startTime)[0] + "s elapsed");

    }

    let correct = 0;

    for (let i = 0; i < 10000; ++i) {

        let data = JSON.parse(request('test'));
        let inputs = data[0];
        let desired = Array(10).fill(0);
        desired[data[1]] = 1;

        inputs = resize(inputs);



        let outputs = nn.feedForward(inputs);

        let temp = outputs[0];
        let guess = 0;

        for (let j = 0; j < outputs.length; j++) {

            if (outputs[j] > temp) {
                temp = outputs[j];
                guess = j;
            }
        }

        let target = desired.indexOf(1);

        if (guess === target) {
            ++correct;
        }


        console.log("Test: " + (i + 1) + ", " + process.hrtime(startTime)[0] + "s elapsed");
    }
    let accuracy = correct / 5000;

    console.log(`Accuracy: ${accuracy * 100}%`);

    await inputIntoJson(
        "/Users/nikitaskazutin/Downloads/Site-with-Algorithms-clone/resources/json/anotherModel3.json",
        JSON.stringify(nn.data)
    );
}

//trainModel();

let modelData = model;


const canvas = document.getElementById("canvas");
const resetButton = document.getElementById("reset");
const CELL_COUNT = 50;
const CELL_SIZE = 10;
const width = CELL_SIZE * CELL_COUNT;
const height = CELL_SIZE * CELL_COUNT;
const PEN_SIZE = 18;

const context = canvas.getContext("2d", {willReadFrequently: true});
context.imageSmoothingEnabled = true;
context.imageSmoothingQuality = "high";
canvas.height = height;
canvas.width = width;

let drawing = false;

function startDrawing(elem) {
    drawing = true;
    draw(elem);
}

function endDrawing() {
    drawing = false;
    scale();
    main();
}

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function draw(elem) {

    if (drawing) {

        if (elem.button !== 0) {
            return;
        }

        const canvasBounding = canvas.getBoundingClientRect();
        const x = elem.clientX - canvasBounding.left;
        const y = elem.clientY - canvasBounding.top;

        for (let currX = x - PEN_SIZE; currX <= x + PEN_SIZE; currX += CELL_SIZE) {
            for (let currY = y - PEN_SIZE; currY <= y + PEN_SIZE; currY += CELL_SIZE) {

                let cellX = currX + CELL_SIZE / 2;
                let cellY = currY + CELL_SIZE / 2;

                const calcX = x + CELL_SIZE / 2;
                const calcY = y + CELL_SIZE / 2;

                const dist = Math.sqrt(Math.pow(cellX - calcX, 2) + Math.pow(cellY - calcY, 2));

                if (dist < PEN_SIZE) {

                    let p = context.getImageData(cellX - CELL_SIZE / 2, cellY - CELL_SIZE / 2, 1, 1);

                    let color = rgbToHex(
                        Math.max(Math.min(Math.floor(255 - (Math.sqrt(dist / PEN_SIZE) * 255)) + p.data[0], 255), p.data[0]),
                        Math.max(Math.min(Math.floor(255 - (Math.sqrt(dist / PEN_SIZE) * 255)) + p.data[1], 255), p.data[1]),
                        Math.max(Math.min(Math.floor(255 - (Math.sqrt(dist / PEN_SIZE) * 255)) + p.data[2], 255), p.data[2])
                    );


                    cellX = Math.min(Math.max(Math.floor(currX / CELL_SIZE), 0), width);
                    cellY = Math.min(Math.max(Math.floor(currY / CELL_SIZE), 0), height);

                    fillCell(cellX, cellY, color);

                }
            }
        }
    }
}

function fillCell(cellX, cellY, color) {
    const startX = cellX * CELL_SIZE;
    const startY = cellY * CELL_SIZE;

    context.fillStyle = color;
    context.fillRect(startX, startY, CELL_SIZE, CELL_SIZE);
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", endDrawing);
canvas.addEventListener("mousemove", draw);

const s_canvas = document.getElementById("scaled_canvas");
s_canvas.width = 50;
s_canvas.height = 50;
const scaledContext = s_canvas.getContext("2d");

function scale() {
    scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 50, 50);
}

function getImageData() {
    return scaledContext.getImageData(0, 0, s_canvas.width, s_canvas.height);
}

document.getElementById("reset").addEventListener("click", () => {
    resetCanvas();
});

function main() {

    let {data} = getImageData();
    let image = [];

    for (let i = 0; i < data.length; i += 4) {
        let value = data[i];
        image.push(value);
    }

    let input = convertTo2D(image,50);
    let inputs = centralizeAndMagnify(input);

    let nn = new NeuralNetwork(IMG_DIMENSIONS, HIDDEN_LAYER_1, HIDDEN_LAYER_2, 10, modelData);
    let outputs = nn.feedForward(inputs);

    for (let i = 0; i < outputs.length; i++) {

        let div = document.getElementById("digitValue" + i.toString());
        div.textContent = `${(outputs[i]*100).toFixed(2)}%`;
    }
    highlightMaxValue();
}

main();
function closerImage(input, flag) {
    let result = {startX: input[0].length, endX: -1, startY: input.length, endY: -1};
    for (let i = 0; i < input.length; ++i) {
        for (let j = 0; j < input[0].length; ++j) {
            if (input[i][j] > flag) {
                result.startX = Math.min(result.startX, j);
                result.startY = Math.min(result.startY, i);
                result.endX = Math.max(result.endX, j);
                result.endY = Math.max(result.endY, i);
            }
        }
    }
    return result;
}

function findCenterMass(input) {
    let result = {x: 0, y: 0};
    let sumX = 0;
    let sumY = 0;
    let sumPixels = 0;

    for (let i = 0; i < input.length; ++i) {
        for (let j = 0; j < input[0].length; ++j) {
            let pixel = input[i][j];
            sumPixels += pixel;
            sumY += i * pixel;
            sumX += j * pixel;
        }
    }
    result.y = Math.round( sumY/sumPixels);
    result.x = Math.round(sumX/sumPixels);
    return result;
}
function convertTo2D(input,size){
    let result = [];
    for(let i = 0 ; i < size;++i){
        result[i] = [];
        for(let j = 0 ; j < size; ++j){
            result[i][j] = input[i*size+j];
        }
    }
    return result;
}

function centralizeAndMagnify(input) {
    let imageEdges = closerImage(input, 0.01);
    let massCenter = findCenterMass(input);

    let canvasCopy = document.createElement("canvas");
    canvasCopy.width = input[0].length;
    canvasCopy.height = input.length;

    let copyContext = canvasCopy.getContext("2d");
    let scaling = 40 / Math.max(imageEdges.endX + 1 - imageEdges.startX, imageEdges.endY + 1 - imageEdges.startY);

    copyContext.translate(s_canvas.width / 2, s_canvas.height / 2);
    copyContext.scale(scaling, scaling);
    copyContext.translate(-s_canvas.width / 2, -s_canvas.height / 2);
    copyContext.translate(25-massCenter.x, 25-massCenter.y);
    copyContext.drawImage(s_canvas, 0, 0);
    let { data } = copyContext.getImageData(0,0,s_canvas.width,s_canvas.height);

    scaledContext.fillStyle = 'black';
    scaledContext.fillRect(0,0,50,50);
    scaledContext.drawImage(canvasCopy,0,0);

    let image = [];
    for(let i = 0 ;i < data.length; i+=4){

        image.push(data[i]);
    }
    canvasCopy.remove();
    return image;
}
function resetCanvas() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    removeHighlight()
    main();
}
