"use strict";
//const fs = require("fs");
const IMG_DIMENSIONS = 50 * 50;
const HIDDEN_LAYER_1 = 225;
const HIDDEN_LAYER_2 = 225;

let index = 0;
let tIndex = 0;

let fetchedImages = undefined;
let fetchedLabels = undefined;
let testImages = undefined;
let testLabels = undefined;


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


    static element_multiply(m1, m2) {
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

    constructor(inputLength, firstHDLength, secondHDLength, outputLength, data = null) {


        this.weightsFromInputToFirstHD = new Matrix(firstHDLength, inputLength);
        this.weightsFromFirstHDToSecond = new Matrix(secondHDLength, firstHDLength);
        this.weightsFromSecondHDToOutput = new Matrix(outputLength, secondHDLength);


        this.biasFirstHD = new Matrix(firstHDLength, 1);
        this.biasSecondHD = new Matrix(secondHDLength, 1);
        this.biasOutput = new Matrix(outputLength, 1);

        if (data === null) {
            this.weightsFromInputToFirstHD.randomize();
            this.weightsFromFirstHDToSecond.randomize();
            this.weightsFromSecondHDToOutput.randomize();
            this.biasFirstHD.randomize();
            this.biasSecondHD.randomize();
            this.biasOutput.randomize();
        } else {
            this.weightsFromInputToFirstHD.fill(data[0][0]);
            this.weightsFromFirstHDToSecond.fill(data[0][1]);
            this.weightsFromSecondHDToOutput.fill(data[0][2]);
            this.biasFirstHD.fill(data[1][0]);
            this.biasSecondHD.fill(data[1][1]);
            this.biasOutput.fill(data[1][2]);
        }
        this.lr = 0.01; 
    }

    processLayer(weights, inputs, bias) {
        let layer = Matrix.multiply(weights, inputs); // Умножение весов на входы
        layer = Matrix.add(layer, bias); // Добавление сдвигов
        layer.map(sigmoid); // Применение функции активации
        return layer; // Возвращение обработанного слоя
    }

    adjustWeights(weights, errors, outputs, inputs) {
        outputs.map(dsigmoid); // Применение производной функции активации
        let gradient = Matrix.element_multiply(errors, outputs); // Вычисление градиента
        gradient.scale(this.lr); // Масштабирование градиента с учетом скорости обучения
        let inputs_T = Matrix.transpose(inputs); // Транспонирование входов
        let deltas = Matrix.multiply(gradient, inputs_T); // Вычисление дельт
        return Matrix.add(weights, deltas); // Обновление весов
    }

    feedForward(inputsArray) {
        let inputs = Matrix.fromArray(inputsArray); // Преобразование входного массива в матрицу
        inputs.map(normalize); // Нормализация входов

        let HD1 = this.processLayer(this.weightsFromInputToFirstHD, inputs, this.biasFirstHD); // Обработка первого скрытого слоя

        let HD2 = this.processLayer(this.weightsFromFirstHDToSecond, HD1, this.biasSecondHD); // Обработка второго скрытого слоя

        let outputs = this.processLayer(this.weightsFromSecondHDToOutput, HD2, this.biasOutput); // Обработка выходного слоя

        return Matrix.toArray(outputs); // Преобразование выходов в массив
    }

    train(inputsArray, desiredArray) {
        let inputs = Matrix.fromArray(inputsArray); // Преобразование входного массива в матрицу
        inputs.map(normalize); // Нормализация входов
        let HD1 = this.processLayer(this.weightsFromInputToFirstHD, inputs, this.biasFirstHD); // Обработка первого скрытого слоя
        let HD2 = this.processLayer(this.weightsFromFirstHDToSecond, HD1, this.biasSecondHD); // Обработка второго скрытого слоя
        let outputs = this.processLayer(this.weightsFromSecondHDToOutput, HD2, this.biasOutput); // Обработка выходного слоя

        let desired = Matrix.fromArray(desiredArray); // Преобразование желаемого массива в матрицу
        let outputErrors = Matrix.subtract(desired, outputs); // Вычисление ошибок выходного слоя

        let weights_HD2_OUT_T = Matrix.transpose(this.weightsFromSecondHDToOutput); // Транспонирование весов от второго скрытого слоя к выходному слою
        let HD2_errors = Matrix.multiply(weights_HD2_OUT_T, outputErrors); // Вычисление ошибок второго скрытого слоя

        let weights_HD1_HD2_T = Matrix.transpose(this.weightsFromFirstHDToSecond); // Транспонирование весов от первого скрытого слоя ко второму скрытому слою
        let HD1_errors = Matrix.multiply(weights_HD1_HD2_T, HD2_errors); // Вычисление ошибок первого скрытого слоя

        this.weightsFromSecondHDToOutput = this.adjustWeights(this.weightsFromSecondHDToOutput, outputErrors, outputs, HD2); // Обновление весов от второго скрытого слоя к выходному слою
        this.weightsFromFirstHDToSecond = this.adjustWeights(this.weightsFromFirstHDToSecond, HD2_errors, HD2, HD1); // Обновление весов от первого скрытого слоя ко второму скрытому слою
        this.weightsFromInputToFirstHD = this.adjustWeights(this.weightsFromInputToFirstHD, HD1_errors, HD1, inputs); // Обновление весов от входного слоя к первому скрытому слою
    }

    get data() {
        let weights = [];
        weights.push(
            this.weightsFromInputToFirstHD.data,
            this.weightsFromFirstHDToSecond.data,
            this.weightsFromSecondHDToOutput.data
        ); // Сбор данных о весах

        let biases = [];
        biases.push(this.biasFirstHD.data, this.biasSecondHD.data, this.biasOutput.data); // Сбор данных о сдвигах

        let data = [];
        data.push(weights, biases); // Объединение данных о весах и сдвигах

        return JSON.stringify(data); // Преобразование данных в строку JSON
    }
}

function sendRequest(request) {
    if (request === 'reset') {
        index = 0; // Сброс индекса
        tIndex = 0; // Сброс тестового индекса
        return;
    }

    if (request === 'train') {
        let val = JSON.stringify([fetchedImages[index], fetchedLabels[index]]); // Получение обучающих данных
        ++index;
        return val;
    }

    if (request === 'test') {
        let val = JSON.stringify([testImages[tIndex], testLabels[tIndex]]); // Получение тестовых данных
        ++tIndex;
        return val;
    }
}

function resize(image) { // это плохо, я знаю

    let newImage = [];

    for (let i = 0; i < 50; ++i) {

        let row = [];

        for (let j = 0; j < 50; ++j) {

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

    let trainImagesPath = "/Users/nikitaskazutin/Downloads/Site-with-Algorithms-clone/resources/json/train-images.json";
    let trainLabelsPath = "/Users/nikitaskazutin/Downloads/Site-with-Algorithms-clone/resources/json/train-labels.json";
    let testImagesPath = "/Users/nikitaskazutin/Downloads/Site-with-Algorithms-clone/resources/json/test-images.json";
    let testLabelsPath = "/Users/nikitaskazutin/Downloads/Site-with-Algorithms-clone/resources/json/test-labels.json";

    fetchedImages = await readFile(trainImagesPath);
    fetchedLabels = await readFile(trainLabelsPath);
    testImages = await readFile(testImagesPath);
    testLabels = await readFile(testLabelsPath);
    fetchedImages = JSON.parse(fetchedImages);
    fetchedLabels = JSON.parse(fetchedLabels);
    testImages = JSON.parse(testImages);
    testLabels = JSON.parse(testLabels);


    let neuralNetwork = new NeuralNetwork(IMG_DIMENSIONS, HIDDEN_LAYER_1, HIDDEN_LAYER_2, 10);

    for (let i = 0; i < 60000; i++) {

        let data = JSON.parse(sendRequest('train'));
        let input = data[0];
        let desired = Array(10).fill(0);
        desired[data[1]] = 1;

        input = resize(input);

        neuralNetwork.train(input, desired);

        console.log("Epoch: " + (i + 1) + ", " + process.hrtime(startTime)[0] + "s elapsed");

    }

    let numberOfCorrect = 0;

    for (let i = 0; i < 10000; ++i) {

        let data = JSON.parse(sendRequest('test'));
        let inputs = data[0];
        let desired = Array(10).fill(0);
        desired[data[1]] = 1;

        inputs = resize(inputs);

        let outputs = neuralNetwork.feedForward(inputs);

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
            ++numberOfCorrect;
        }


        console.log("Test: " + (i + 1) + ", " + process.hrtime(startTime)[0] + "s elapsed");
    }
    let accuracy = numberOfCorrect / 5000;

    console.log(`Accuracy: ${accuracy * 100}%`);

    await inputIntoJson(
        "/Users/nikitaskazutin/Downloads/Site-with-Algorithms-clone/resources/json/anotherModel3.json",
        JSON.stringify(neuralNetwork.data)
    );
}

//trainModel();

let modelData = model;


const canvas = document.getElementById("canvas");
document.getElementById("reset");
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
    return c.toString(16).padStart(2, '0');
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function draw(elem) {
    if (!drawing || elem.button !== 0) return;

    const canvasBounding = canvas.getBoundingClientRect();
    const x = elem.clientX - canvasBounding.left;
    const y = elem.clientY - canvasBounding.top;
    const calcX = x + CELL_SIZE / 2;
    const calcY = y + CELL_SIZE / 2;

    for (let currX = x - PEN_SIZE; currX <= x + PEN_SIZE; currX += CELL_SIZE) {
        for (let currY = y - PEN_SIZE; currY <= y + PEN_SIZE; currY += CELL_SIZE) {
            const cellX = currX + CELL_SIZE / 2;
            const cellY = currY + CELL_SIZE / 2;
            const dist = Math.sqrt(Math.pow(cellX - calcX, 2) + Math.pow(cellY - calcY, 2));

            if (dist < PEN_SIZE) {
                const p = context.getImageData(cellX - CELL_SIZE / 2, cellY - CELL_SIZE / 2, 1, 1);
                const color = rgbToHex(
                    Math.max(Math.min(Math.floor(255 - (Math.sqrt(dist / PEN_SIZE) * 255)) + p.data[0], 255), p.data[0]),
                    Math.max(Math.min(Math.floor(255 - (Math.sqrt(dist / PEN_SIZE) * 255)) + p.data[1], 255), p.data[1]),
                    Math.max(Math.min(Math.floor(255 - (Math.sqrt(dist / PEN_SIZE) * 255)) + p.data[2], 255), p.data[2])
                );

                const boundedCellX = Math.min(Math.max(Math.floor(currX / CELL_SIZE), 0), width);
                const boundedCellY = Math.min(Math.max(Math.floor(currY / CELL_SIZE), 0), height);

                fillCell(boundedCellX, boundedCellY, color);
            }
        }
    }
}

function processImageDataAndPredict() {
    const {data} = getImageData();
    const image = Array.from({length: data.length / 4}, (_, i) => data[i * 4]);

    const input = convertTo2D(image, 50);
    const inputs = centralizeAndMagnify(input);

    const nn = new NeuralNetwork(IMG_DIMENSIONS, HIDDEN_LAYER_1, HIDDEN_LAYER_2, 10, modelData);
    const outputs = nn.feedForward(inputs);

    outputs.forEach((output, i) => {
        const div = document.getElementById("digitValue" + i);
        div.textContent = `${(output * 100).toFixed(2)}%`;
    });

    highlightMaxValue();
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

const miniCanvas = document.getElementById("scaled_canvas");
miniCanvas.width = 50;
miniCanvas.height = 50;
const scaledContext = miniCanvas.getContext("2d");

function scale() {
    scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 50, 50);
}

function getImageData() {
    return scaledContext.getImageData(0, 0, miniCanvas.width, miniCanvas.height);
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

    let input = convertTo2D(image, 50);
    let inputs = centralizeAndMagnify(input);

    let nn = new NeuralNetwork(IMG_DIMENSIONS, HIDDEN_LAYER_1, HIDDEN_LAYER_2, 10, modelData);
    let outputs = nn.feedForward(inputs);

    for (let i = 0; i < outputs.length; i++) {

        let div = document.getElementById("digitValue" + i.toString());
        div.textContent = `${(outputs[i] * 100).toFixed(2)}%`;
    }
    highlightMaxValue();
}

main();

function magnifyImage(input, flag) {
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

function calculateCenterOfMass(image) {
    let centerOfMass = {x: 0, y: 0};
    let weightedSumX = 0;
    let weightedSumY = 0;
    let totalPixelValue = 0;


    for (let rowIndex = 0; rowIndex < image.length; ++rowIndex) {
        for (let columnIndex = 0; columnIndex < image[0].length; ++columnIndex) {
            let pixelValue = image[rowIndex][columnIndex];
            totalPixelValue += pixelValue;
            weightedSumY += rowIndex * pixelValue;
            weightedSumX += columnIndex * pixelValue;
        }
    }

    centerOfMass.y = Math.round(weightedSumY / totalPixelValue);
    centerOfMass.x = Math.round(weightedSumX / totalPixelValue);

    return centerOfMass;
}

function convertTo2D(input, size) {
    let result = [];
    for (let i = 0; i < size; ++i) {
        result[i] = [];
        for (let j = 0; j < size; ++j) {
            result[i][j] = input[i * size + j];
        }
    }
    return result;
}

function centralizeAndMagnify(input) {
    let imageEdges = magnifyImage(input, 0.01);
    let massCenter = calculateCenterOfMass(input);

    let canvasCopy = document.createElement("canvas");
    canvasCopy.width = input[0].length;
    canvasCopy.height = input.length;

    let copyContext = canvasCopy.getContext("2d");
    let scaling = 40 / Math.max(imageEdges.endX + 1 - imageEdges.startX, imageEdges.endY + 1 - imageEdges.startY);

    copyContext.translate(miniCanvas.width / 2, miniCanvas.height / 2);
    copyContext.scale(scaling, scaling);
    copyContext.translate(-miniCanvas.width / 2, -miniCanvas.height / 2);
    copyContext.translate(25 - massCenter.x, 25 - massCenter.y);
    copyContext.drawImage(miniCanvas, 0, 0);
    let {data} = copyContext.getImageData(0, 0, miniCanvas.width, miniCanvas.height);

    scaledContext.fillStyle = 'black';
    scaledContext.fillRect(0, 0, 50, 50);
    scaledContext.drawImage(canvasCopy, 0, 0);

    let image = [];
    for (let i = 0; i < data.length; i += 4) {

        image.push(data[i]);
    }
    canvasCopy.remove();
    return image;
}
processImageDataAndPredict();
function resetCanvas() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    removeHighlight()
    main();
}
