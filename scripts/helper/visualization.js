let matrixA_star;
let startCoordinate = [];
let finishCoordinate = [];
let row;
let col;
let points;
let work = true;

function creatArea(functionName) {

    let canvas;
    let buttonClear;
    let startButton;
    let imgStart;
    let imgFinish;
    let slider;
    let borderColor;
    let borderGeneration;
    let canvasField;
    let traceColor;
    let colorUser;
    let buttonBlock;
    console.log('do');
    switch (functionName) {
        case ('AStar'):

            canvas = document.getElementById('fieldCanvas');
            buttonClear = document.getElementById('clearButton');
            startButton = document.getElementById('startButton');
            imgStart = document.getElementById('startImg');
            imgFinish = document.getElementById('finishImg');
            slider = document.getElementById('slider');
            borderColor = document.getElementById('borderColor');
            traceColor = document.getElementById('traceColor');
            colorUser = document.getElementById('colorUser');
            borderGeneration = document.getElementById('generationMap');
            canvasField = canvas.getContext('2d');

            borderColor.addEventListener('input', changeColorBorder);

            borderColor.addEventListener('input', () =>
                matrixUpdate(canvas, canvasField, slider, borderColor.value));

            traceColor.addEventListener('input', changeTraceColor);

            colorUser.addEventListener('input', changeColorUser);


            startButton.addEventListener("click", () => {
                manageStartAStar(canvasField, canvas, slider, borderColor.value);
            });

            slider.addEventListener('input', () => {
                sliderManegeAStar(slider, canvasField, canvas, imgFinish, imgStart)
            });

            buttonClear.addEventListener("click", () => {
                buttonClearManege(canvas, slider, canvasField)
            });

            borderGeneration.addEventListener('click', () => {
                borderGenerationManege(canvas, slider, canvasField, borderColor.value)
            });

            canvas.addEventListener('mousedown', (event) =>
                draw(event, canvas, canvasField, slider, colorUser.value));

            createMatrix(canvas, slider);

            imgStart.addEventListener('mousedown', (event) =>
                dragAndDrop(event, imgStart, canvas, slider, 1));

            imgStart.ondragstart = function () {
                return false;
            };

            imgFinish.addEventListener('mousedown', (event) =>
                dragAndDrop(event, imgFinish, canvas, slider, 2));

            imgFinish.ondragstart = function () {
                return false;
            };
            break;
        case ('ant'):
            canvas = document.getElementById('fieldCanvas');
            buttonClear = document.getElementById('clearButton');
            startButton = document.getElementById('startButton');
            buttonBlock = document.getElementById('buttonBlock');
            slider = document.getElementById('slider');
            colorUser = document.getElementById('colorUser');
            traceColor = document.getElementById('traceColor');
            canvasField = canvas.getContext('2d');

            buttonBlock.addEventListener("click",()=>work = false)

            traceColor.addEventListener('input',()=> {
                traceColor = this.value;}) ;
            console.log(traceColor.value);
            startButton.addEventListener("click", () => {
                manageStartAnt(canvas,canvasField,slider,colorUser.value);});

            slider.addEventListener('input', ()=>{
                sliderManegeAnt(slider,canvasField,canvas)});

            buttonClear.addEventListener("click",()=>{
                buttonClearManege(canvas,slider,canvasField)});

            createMatrix(canvas,slider);

            canvas.addEventListener('mousedown',(event)=>
                draw(event,canvas,canvasField,slider,colorUser.value));
            break;
        case ('cluster'):
            canvas = document.getElementById('fieldCanvas');
            buttonClear = document.getElementById('clearButton');
            startButton = document.getElementById('startButton');
            slider = document.getElementById('slider');
            colorUser = document.getElementById('colorUser');
            buttonBlock = document.getElementById('buttonBlock');
            canvasField = canvas.getContext('2d');

            buttonBlock.addEventListener("click",()=>work = false)

            startButton.addEventListener("click", () => {
                manageCluster(canvas, canvasField, slider, colorUser.value);
            });

            slider.addEventListener('input', () => {
                sliderManegeAnt(slider, canvasField, canvas)
            });

            buttonClear.addEventListener("click", () => {
                buttonClearManege(canvas, slider, canvasField)
            });

            createMatrix(canvas, slider);

            canvas.addEventListener('mousedown', (event) =>
                draw(event, canvas, canvasField, slider, colorUser.value));
            break;
        case ('hits'):
            canvas = document.getElementById('fieldCanvasForNeuralNetwork');
            buttonClear = document.getElementById('clearButton');
            startButton = document.getElementById('startButton');
            const s_canvas = document.getElementById("scaled_canvas");
            const resetButton = document.getElementById("reset");

            const CELL_COUNT = 50;
            const CELL_SIZE = 10;
            const width = CELL_SIZE * CELL_COUNT;
            const height = CELL_SIZE * CELL_COUNT;
            const PEN_SIZE = 30;
            canvas.height = height;
            canvas.width = width;
            s_canvas.width = 50;
            s_canvas.height = 50;
            const scaledContext = s_canvas.getContext("2d");


            canvas.addEventListener("mousedown", (el) =>
                startDrawing(el));
            canvas.addEventListener("mouseup", () =>
                endDrawing(scaledContext, canvas));
            canvas.addEventListener("mousemove", (el) =>
                drawNum(el, context));


            document.getElementById("reset").addEventListener("click", () => {
                reset_canvas(context);
            });

            const context = canvas.getContext("2d", {willReadFrequently: true});
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "high";


    }


    function changeColorBorder() {
        borderColor.value = this.value;
    }

    function changeColorUser() {
        console.log(colorUser.value);
        colorUser.value = this.value;
    }

    function changeTraceColor() {
        //console.log(traceColor.value);
        traceColor.value = this.value;
    }


}

function manageCluster(canvas, canvasField, slider, color) {
    matrixUpdate(canvas, canvasField, slider, color);
    getPoint();
    launch(document.getElementById('startButton').value);
}

function manageStartAStar(canvasField, canvas, slider, color) {
    matrixUpdate(canvas, canvasField, slider, color);
    launch(document.getElementById('startButton').value);
}

function getCountPoint() {
    let countPoint = 0;
    for (let i = 0; i < col; i++)
        for (let j = 0; j < row; j++)
            if (matrixA_star[i][j] === 1) countPoint++;
    return countPoint;
}

function drawNum(elem, context) {

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

                    fillCell(cellX, cellY, color, context);

                }
            }
        }
    }
}

function startDrawing(elem) {
    drawing = true;
    drawNum(elem);
}

function endDrawing(scaledContext, canvas) {
    drawing = false;
    scale(scaledContext, canvas);
    main();
}

function fillCell(cellX, cellY, color, context) {
    const startX = cellX * CELL_SIZE;
    const startY = cellY * CELL_SIZE;

    context.fillStyle = color;
    context.fillRect(startX, startY, CELL_SIZE, CELL_SIZE);
}

function scale(scaledContext, canvas) {
    scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 50, 50);
}

function getImageData(scaledContext, s_canvas) {
    return scaledContext.getImageData(0, 0, s_canvas.width, s_canvas.height);
}

function getPoint() {
    let colLocal = getCountPoint();
    points = new Array(colLocal);
    for (let i = 0; i < colLocal; i++) {
        points[i] = new Array(2);
        for (let j = 0; j < 2; j++) {
            points[i][j] = 0;
        }
    }

    let localCounter = 0;
    for (let i = 0; i < col; i++)
        for (let j = 0; j < row; j++)
            if (matrixA_star[i][j] === 1) {
                points[localCounter][0] = j;
                points[localCounter][1] = i;
                localCounter++;
            }
}

function manageStartAnt(canvas, canvasField, slider, color) {
    matrixUpdate(canvas, canvasField, slider, color);
    getPoint();
    console.log(color);
    launch(document.getElementById('startButton').value)
}

function matrixUpdate(canvas, canvasField, slider, color) {
    clearField(canvasField, canvas);
    console.log(color + 'matrixUpdate');
    drawMapByMatrix(matrixA_star, canvas, canvasField, slider, color);
}

function drawMapByMatrix(matrix, canvas, canvasField, slider, color) {
    canvasField.fillStyle = color;
    for (let i = 0; i < col; i++)
        for (let j = 0; j < row; j++)
            if (matrix[i][j] === 1) {
                canvasField.fillRect(j * slider.value, i * slider.value, slider.value, slider.value);
            }
}

function borderGenerationManege(canvas, slider, canvasField, userColor) {
    clearField(canvasField, canvas);
    updateMatrix(canvas, slider);
    matrixA_star = generateMaze(row, col, 0.6);
    drawMapByMatrix(matrixA_star, canvas, canvasField, slider, userColor);
}

function sliderManegeAStar(slider, canvasField, canvas, imgFinish, imgStart) {
    changeField(slider);
    clearField(canvasField, canvas);
    updateMatrix(canvas, slider);
    createMatrix(canvas, slider);
    changeSizeIcons(slider);
    updateCoordinate(imgFinish, imgStart, canvas, slider);
    magnetizationButton(imgStart, canvas, slider);
    magnetizationButton(imgFinish, canvas, slider);
}

function sliderManegeAnt(slider, canvasField, canvas) {
    changeField(slider);
    clearField(canvasField, canvas);
    updateMatrix(canvas, slider);
    createMatrix(canvas, slider);
}

function buttonClearManege(canvas, slider, canvasField) {
    updateMatrix(canvas, slider);
    clearField(canvasField, canvas);
}

function updateMatrix(canvas, slider) {
    createMatrix(canvas, slider);
}

function clearField(canvasField, canvas) {
    canvasField.clearRect(0, 0, canvas.width, canvas.height);
}

function draw(event, canvas, canvasField, slider, userColor) {

    createBlock(event, canvasField, slider, userColor);
    canvas.onmousemove = function (event) {
        createBlock(event, canvasField, slider, userColor);
    }
    canvas.onmouseup = function () {
        canvas.onmousemove = null;
    }
    canvas.onmouseover = function () {
        canvas.onmousemove = null;
    }
}

function createPointWithDeleteLate(array) {
    let canvas = document.getElementById('fieldCanvas');
    let slider = document.getElementById('slider');
    let img = new Image();
    let traceColor = document.getElementById('traceColor').value;
    console.log(traceColor);
    let borderColor = document.getElementById('colorUser').value;
    let canvasField = canvas.getContext('2d');
    img.src = 'resources/penguin-svgrepo-com.svg';
    img.style.position = 'absolute';
    img.style.zIndex = '10';

    matrixUpdate(canvas, canvasField, slider, borderColor);
    canvasField.beginPath();


    img.onload = () => {
        for (let i = 0; i < array.length; i++) {
            canvasField.fillStyle = traceColor;
            canvasField.fillRect(array[i][0] * slider.value, array[i][1] * slider.value, slider.value, slider.value);
            createPicture(img, array[i][0] * slider.value, array[i][1] * slider.value, canvasField, slider.value);

        }
    }

    canvasField.closePath();
}

function managePath(array) {
    let canvas = document.getElementById('fieldCanvas');
    let traceColor = document.getElementById('traceColor');
    let slider = document.getElementById('slider');
    let img = document.createElement('img');
    let canvasField = canvas.getContext('2d');
    img.src = 'resources/penguin-svgrepo-com.svg';
    img.style.position = 'absolute';
    canvasField.fillStyle = traceColor.value;


    img.onload = () => {
        for (let i = 0; i < array.length - 1; i++) {
            canvasField.fillRect(array[i][0] * slider.value, array[i][1] * slider.value, slider.value, slider.value);
            createPicture(img, array[i][0] * slider.value, array[i][1] * slider.value, canvasField, slider.value);
            console.log(array);
        }
    }
}

function createPath(array,isBestRoute = false){
    let canvas = document.getElementById('fieldCanvas');
    let canvasField = canvas.getContext('2d');
    let slider = document.getElementById('slider');
    let traceColor = document.getElementById('traceColor');

    canvasField.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < array.length - 1; i++) {
        let startX = points[array[i]][0]*slider.value + slider.value/2;
        let startY = points[array[i]][1]*slider.value + slider.value/2;
        let endX = points[array[i + 1]][0]*slider.value + slider.value/2;
        let endY = points[array[i + 1]][1]*slider.value + slider.value/2;
        canvasField.beginPath();
        canvasField.strokeStyle = traceColor.value;
        canvasField.lineCap = 'round';
        canvasField.lineWidth = slider.value/2;
        canvasField.moveTo(startX, startY);
        canvasField.lineTo(endX, endY);
        canvasField.stroke();
    }

    if (isBestRoute) {

        canvasField.strokeStyle = '#11ff00';
        canvasField.lineCap = 'round';
        canvasField.lineWidth = slider.value/2;
        canvasField.beginPath();
        canvasField.moveTo(points[array[0]][0]*slider.value + slider.value/2,
            points[array[0]][1]*slider.value + slider.value/2);
        for (let i = 1; i < array.length; i++) {
            canvasField.lineTo(points[array[i]][0]*slider.value + slider.value/2,
                points[array[i]][1]*slider.value + slider.value/2);
        }
        canvasField.closePath();
        canvasField.stroke();
    }


}

function createPicture(img, x, y, field, size) {
    field.drawImage(img, x, y, size, size);
}

function reset_canvas(context) {
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    main();
}

function updateCoordinate(imgFinish, imgStart, canvas, slider) {
    finishCoordinate[0] = Math.floor((parseFloat(imgFinish.style.left) - canvas.getBoundingClientRect().x) / slider.value);
    finishCoordinate[1] = Math.floor((parseFloat(imgFinish.style.top) - canvas.getBoundingClientRect().y) / slider.value);
    startCoordinate[0] = Math.floor((parseFloat(imgStart.style.left) - canvas.getBoundingClientRect().x) / slider.value);
    startCoordinate[1] = Math.floor((parseFloat(imgStart.style.top) - canvas.getBoundingClientRect().y) / slider.value);

    if (finishCoordinate[0] < 0) finishCoordinate[0] = 0;
    if (finishCoordinate[1] < 0) finishCoordinate[1] = 0;
    if (finishCoordinate[0] > matrixA_star[0].length) finishCoordinate[0] = matrixA_star[0].length;
    if (finishCoordinate[1] > matrixA_star.length) finishCoordinate[1] = matrixA_star.length;

    if (startCoordinate[0] > matrixA_star[0].length) startCoordinate[0] = matrixA_star[0].length;
    if (startCoordinate[1] > matrixA_star.length) startCoordinate[1] = matrixA_star.length;
    if (startCoordinate[0] < 0) startCoordinate[0] = 0;
    if (startCoordinate[1] < 0) startCoordinate[1] = 0;

}

function magnetizationButton(img, canvas, slider, numButton) {
    let coordinate = [];
    switch (numButton) {
        case 1:
            coordinate[0] = startCoordinate[0];
            coordinate[1] = startCoordinate[1];
            break;
        case 2:
            coordinate[0] = finishCoordinate[0];
            coordinate[1] = finishCoordinate[1];
            break;
    }
    img.style.left = canvas.getBoundingClientRect().left + coordinate[0] * slider.value + 'px';
    img.style.top = canvas.getBoundingClientRect().top + coordinate[1] * slider.value + 'px';
}

function deleteBlock(event, canvasField, slider, canvas) {
    let matrixX = Math.floor(event.offsetX / slider.value);
    let matrixY = Math.floor(event.offsetY / slider.value);

    let correctX = matrixX * slider.value;
    let correctY = matrixY * slider.value;
    canvasField.fillStyle = '#7c0518';
    console.log(canvas.style.backgroundColor + " event");
    canvasField.fillRect(correctX, correctY, slider.value, slider.value);
    matrixA_star[matrixY][matrixX] = 0;
    console.log(matrixA_star);
}

function changeField(slider) {
    let field = document.getElementById('fieldCanvas');
    //значени для изменения размера поля
    let xOffset = 600;
    let yOffset = 100; // header height
    field.width = Math.ceil((window.innerWidth - xOffset) / slider.value) * slider.value;
    field.height = Math.ceil((window.innerHeight - yOffset) / slider.value) * slider.value;
}

function createBlock(event, canvasField, slider, colorUser) {
    let matrixX = Math.floor(event.offsetX / slider.value);
    let matrixY = Math.floor(event.offsetY / slider.value);

    let correctX = matrixX * slider.value;
    let correctY = matrixY * slider.value;

    canvasField.fillStyle = colorUser;
    canvasField.fillRect(correctX, correctY, slider.value, slider.value);

    matrixA_star[matrixY][matrixX] = 1;
    console.log(matrixA_star);
}

function dragAndDrop(event, img, canvas, slider, numElement) {

    let shiftX = event.clientX - img.getBoundingClientRect().left;
    let shiftY = event.clientY - img.getBoundingClientRect().top;

    document.body.append(img);

    moveAt(event.pageX, event.pageY);

    // переносит мяч на координаты (pageX, pageY),
    // дополнительно учитывая изначальный сдвиг относительно указателя мыши
    function moveAt(pageX, pageY) {
        img.style.left = pageX - shiftX + 'px';
        img.style.top = pageY - shiftY + 'px';
    }


    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
        switch (numElement) {
            case 1:
                startCoordinate[0] = Math.floor((event.pageX - canvas.getBoundingClientRect().x) / slider.value);
                startCoordinate[1] = Math.floor((event.pageY - canvas.getBoundingClientRect().y) / slider.value);
                console.log(startCoordinate);
                break;
            case 2:
                finishCoordinate[0] = Math.floor((event.pageX - canvas.getBoundingClientRect().x) / slider.value);
                finishCoordinate[1] = Math.floor((event.pageY - canvas.getBoundingClientRect().y) / slider.value);
                console.log(finishCoordinate);
        }
    }

    // передвигаем мяч при событии mousemove
    document.addEventListener('mousemove', onMouseMove);

    // отпустить мяч, удалить ненужные обработчики
    img.onmouseup = function () {

        magnetizationButton(img, canvas, slider, numElement);
        document.removeEventListener('mousemove', onMouseMove);
        img.onmouseup = null;
    };

}

function changeSizeIcons(slider) {
    document.getElementById('startImg').style.width = slider.value + 'px';
    document.getElementById('finishImg').style.width = slider.value + 'px';
}

function createMatrix(canvas, slider) {
    row = Math.ceil(canvas.width / slider.value);
    col = Math.ceil(canvas.height / slider.value);

    matrixA_star = new Array(col);
    for (let i = 0; i < col; i++) {
        matrixA_star[i] = new Array(row);
        for (let j = 0; j < row; j++) {
            matrixA_star[i][j] = 0;
        }
    }

}

function managePathOfClustering(array, color = "#88d915", offsetOfX = 0, offsetOfY = 0, ratioX = 1, ratioY = 1) {
    let canvas = document.getElementById('fieldCanvas');
    let slider = document.getElementById('slider');
    let canvasField = canvas.getContext('2d');
    canvasField.fillStyle = color;
    for (let i = 0; i < array.length; i++)
        canvasField.fillRect(array[i][0] * slider.value + offsetOfX * slider.value,
            array[i][1] * slider.value + offsetOfY * slider.value,
            slider.value * ratioX, slider.value * ratioY);
}

function getEuclideanDistance(firstPoint, secondPoint) {
    return ((secondPoint[0] - firstPoint[0]) ** 2 + (secondPoint[1] - firstPoint[1]) ** 2) ** (1 / 2);
}