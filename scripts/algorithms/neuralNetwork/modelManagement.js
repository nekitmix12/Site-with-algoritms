"use strict";

const IMG_DIMENSIONS = 50 * 50;
const HIDDEN_LAYER_1 = 150;
const HIDDEN_LAYER_2 = 150;

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

    //почленное умножение
    static el_multiply(m1, m2) {
        let result = new Matrix(m1.rows, m1.cols);
        result.data = result.data.map((row, i) => row.map((val, j) => m1.data[i][j] * m2.data[i][j]));
        return result;
    }

    //матрица из массива
    static fromArray(array) {
        let result = new Matrix(array.flat().length, 1);
        result.data = result.data.map((row, i) => [array.flat()[i]]);
        return result;
    }

    //массив из матрицы
    static toArray(m) {
        return m.data.flat();
    }

    //кастом, применяющий функцию ко всем элементам матрицы
    map(func) {
        this.data = this.data.map(row => row.map(func));
    }

    //умножение матрицы на число
    scale(num) {
        this.data = this.data.map(row => row.map(val => val * num));
    }


    //присваивает матрицу
    fill(data) {
        this.data = data;
    }


    //рандомизирует матрицу
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

        // веса
        this.weights_IN_HD1 = new Matrix(HD1_length, inputLength);
        this.weights_HD1_HD2 = new Matrix(HD2_length, HD1_length);
        this.weights_HD2_OUT = new Matrix(outputLength, HD2_length);

        // сдвиги
        this.bias_HD1 = new Matrix(HD1_length, 1);
        this.bias_HD2 = new Matrix(HD2_length, 1);
        this.bias_OUT = new Matrix(outputLength, 1);

        if (data === null) {

            // изначальные веса генерируются случайно
            this.weights_IN_HD1.randomize();
            this.weights_HD1_HD2.randomize();
            this.weights_HD2_OUT.randomize();
            this.bias_HD1.randomize();
            this.bias_HD2.randomize();
            this.bias_OUT.randomize();

        } else {

            // посчитанные веса берутся из данных
            this.weights_IN_HD1.fill(data[0][0]);
            this.weights_HD1_HD2.fill(data[0][1]);
            this.weights_HD2_OUT.fill(data[0][2]);
            this.bias_HD1.fill(data[1][0]);
            this.bias_HD2.fill(data[1][1]);
            this.bias_OUT.fill(data[1][2]);

        }

        //скорость обучения
        this.lr = 0.01;
    }

    applyDropout(layer) {
        layer.map(val => Math.random() < this.dropoutRate ? 0 : val);
        return layer;
    }
    processLayer(weights, inputs, bias) {
        let layer = Matrix.multiply(weights, inputs);
        layer = Matrix.add(layer, bias);
        layer.map(sigmoid);
        return layer;
    }

    adjustWeights(weights, errors, outputs, inputs) {
        outputs.map(dsigmoid);
        let gradient = Matrix.el_multiply(errors, outputs);
        gradient.scale(this.lr);
        let inputs_T = Matrix.transpose(inputs);
        let deltas = Matrix.multiply(gradient, inputs_T);
        return Matrix.add(weights, deltas);
    }

    feedForward(inputsArray) {
        let inputs = Matrix.fromArray(inputsArray);
        inputs.map(normalize);

        let HD1 = this.processLayer(this.weights_IN_HD1, inputs, this.bias_HD1);

        let HD2 = this.processLayer(this.weights_HD1_HD2, HD1, this.bias_HD2);

        let outputs = this.processLayer(this.weights_HD2_OUT, HD2, this.bias_OUT);

        return Matrix.toArray(outputs);
    }

    train(inputsArray, desiredArray) {
        let inputs = Matrix.fromArray(inputsArray);
        inputs.map(normalize);
        let HD1 = this.processLayer(this.weights_IN_HD1, inputs, this.bias_HD1);
        let HD2 = this.processLayer(this.weights_HD1_HD2, HD1, this.bias_HD2);
        let outputs = this.processLayer(this.weights_HD2_OUT, HD2, this.bias_OUT);

        let desired = Matrix.fromArray(desiredArray);
        let outputErrors = Matrix.subtract(desired, outputs);

        let weights_HD2_OUT_T = Matrix.transpose(this.weights_HD2_OUT);
        let HD2_errors = Matrix.multiply(weights_HD2_OUT_T, outputErrors);

        let weights_HD1_HD2_T = Matrix.transpose(this.weights_HD1_HD2);
        let HD1_errors = Matrix.multiply(weights_HD1_HD2_T, HD2_errors);

        this.weights_HD2_OUT = this.adjustWeights(this.weights_HD2_OUT, outputErrors, outputs, HD2);
        this.weights_HD1_HD2 = this.adjustWeights(this.weights_HD1_HD2, HD2_errors, HD2, HD1);
        this.weights_IN_HD1 = this.adjustWeights(this.weights_IN_HD1, HD1_errors, HD1, inputs);
    }

    get data() {
        let weights = [];
        weights.push(
            this.weights_IN_HD1.data,
            this.weights_HD1_HD2.data,
            this.weights_HD2_OUT.data
        );

        let biases = [];
        biases.push(this.bias_HD1.data, this.bias_HD2.data, this.bias_OUT.data);

        let data = [];
        data.push(weights, biases);

        return JSON.stringify(data);
    }
}

function request(req) {
    if (req === 'reset') {
        index = 0;
        t_index = 0;
        return;
    }

    if (req === 'train') {
        let val = JSON.stringify([fetched_images[index], fetched_labels[index]]);
        index++;
        return val;
    }

    if (req === 'test') {
        let val = JSON.stringify([test_images[t_index], test_labels[t_index]]);
        t_index++;
        return val;
    }
}

function resize(image){

    let newImage = [];

    for (let i = 0; i < 50; i++){

        let row = [];

        for (let j = 0; j < 50; j++){

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
/*
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
    for (let i = 0; i < 10000; i++) {

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
            correct++;
        }

        console.log("Test: " + (i + 1) + ", " + process.hrtime(startTime)[0] + "s elapsed");
    }

    let accuracy = correct / 10000;

    console.log(`Accuracy: ${accuracy * 100}%`);

    await inputIntoJson(
        "/Users/nikitaskazutin/Downloads/Site-with-Algorithms-clone/resources/json/model.json",
        JSON.stringify(nn.data)
    );
}

trainModel();
*/
/*


 */

let modelData = null;
async function setup(){
    const response = await fetch('http://localhost:3000/getData');
    modelData = await response.json();
    modelData = JSON.parse(modelData);
}

setup();


let drawing = false;

function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function main() {

    const s_canvas = document.getElementById("scaled_canvas");
    s_canvas.width = 50;
    s_canvas.height = 50;
    const scaledContext = s_canvas.getContext("2d");
    let { data } = getImageData(scaledContext,s_canvas);
    let image = [];

    for (let i = 0; i < data.length; i += 4) {
        let value = data[i];
        image.push(value);
    }

    let tempRow = [];
    let inputs = [];
    for (let i = 0; i < image.length; i++) {

        tempRow.push(image[i]);

        if (tempRow.length === 50) {
            inputs.push(tempRow);
            tempRow = [];
        }
    }

    let nn = new NeuralNetwork(IMG_DIMENSIONS, HIDDEN_LAYER_1, HIDDEN_LAYER_2, 10, modelData);
    let outputs = nn.feedForward(inputs);

    for (let i = 0; i < outputs.length; i++) {

        let div = document.getElementById("digval_" + i.toString());
        div.style.width = 400 * outputs[i] + 'px';
    }
}

main();


