let matrixA_star;
let startCoordinate = [];
let finishCoordinate = [];
let row;
let col;
let points;


function creatArea(functionName) {

    let canvas ;
    let buttonClear;
    let startButton;
    let imgStart;
    let imgFinish ;
    let slider ;
    let borderColor;
    let borderGeneration;
    let canvasField;

    switch (functionName){
        case ('AStar'):
            canvas = document.getElementById('fieldCanvas');
            buttonClear = document.getElementById('clearButton');
            startButton = document.getElementById('startButton');
            imgStart = document.getElementById('startImg');
            imgFinish = document.getElementById('finishImg');
            slider = document.getElementById('slider');
            borderColor = document.getElementById('colorBolder');
            borderGeneration = document.getElementById('generationMap');
            canvasField = canvas.getContext('2d');
            borderColor = borderColor.value;

            document.getElementById('colorBolder').oninput = function () {
                borderColor = this.value;
            }

            startButton.addEventListener("click", () => {
                manageStartAStar(canvasField,canvas,slider,borderColor);});

            slider.addEventListener('input', ()=>{
                sliderManegeAStar(slider,canvasField,canvas,imgFinish,imgStart)});

            buttonClear.addEventListener("click",()=>{
                buttonClearManege(canvas,slider,canvasField)});

            borderGeneration.addEventListener('click', ()=>{
                borderGenerationManege(canvas,slider,canvasField,borderColor)});

            canvas.addEventListener('mousedown',(event)=>
                draw(event,canvas,canvasField,slider,borderColor));

            createMatrix(canvas,slider);

            imgStart.addEventListener('mousedown',(event)=>
                dragAndDrop(event,imgStart,canvas,slider,1));

            imgStart.ondragstart = function () {
                return false;
            };

            imgFinish.addEventListener('mousedown',(event)=>
                dragAndDrop(event,imgFinish,canvas,slider,2));

            imgFinish.ondragstart = function () {
                return false;
            };
            break;
        case ('ant'):
            canvas = document.getElementById('fieldCanvas');
            buttonClear = document.getElementById('clearButton');
            startButton = document.getElementById('startButton');
            slider = document.getElementById('slider');
            borderColor = document.getElementById('traceColor');
            canvasField = canvas.getContext('2d');

            borderColor.addEventListener('input',()=> {
                borderColor = this.value;}) ;

            startButton.addEventListener("click", () => {
                manageStartAnt(canvas,canvasField,slider,borderColor);});

            slider.addEventListener('input', ()=>{
                sliderManegeAnt(slider,canvasField,canvas)});

            buttonClear.addEventListener("click",()=>{
                buttonClearManege(canvas,slider,canvasField)});

            createMatrix(canvas,slider);

            canvas.addEventListener('mousedown',(event)=>
                draw(event,canvas,canvasField,slider,borderColor));

    }

}
function manageStartAStar(canvasField,canvas,slider,borderColor){
    matrixUpdate(canvas,canvasField,slider,borderColor);
    launch(document.getElementById('startButton').value)
}
function getCountPoint(){
    let countPoint = 0;
    for (let i = 0; i < col; i++)
        for (let j = 0; j < row; j++)
            if(matrixA_star[i][j]===1)countPoint++;
    return countPoint;
}
function getPoint(){
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
            if(matrixA_star[i][j]===1){
                points[localCounter][0] = j;
                points[localCounter][1] = i;
                localCounter++;
            }
    console.log(points);
}
function manageStartAnt(canvas,canvasField,slider,borderColor){
    matrixUpdate(canvas,canvasField,slider,borderColor);
    getPoint();
    console.log(document.getElementById('startButton').value);
    launch(document.getElementById('startButton').value)
}
function matrixUpdate(canvas,canvasField,slider,borderColor){
    clearField(canvasField,canvas);
    drawMapByMatrix(matrixA_star,canvas,canvasField,slider,borderColor);
}
function drawMapByMatrix(matrix,canvas,canvasField,slider,borderColor){
    canvasField.fillStyle = borderColor.value;
    for(let i = 0;i<col;i++)
        for(let j = 0;j<row;j++)
            if(matrix[i][j] === 1){
                canvasField.fillRect(j*slider.value,i*slider.value,slider.value,slider.value);
            }
}

function borderGenerationManege(canvas,slider,canvasField,borderColor){
    clearField(canvasField,canvas);
    updateMatrix(canvas,slider);
    matrixA_star = generateMaze(row,col,0.6);
    drawMapByMatrix(matrixA_star,canvas,canvasField,slider,borderColor);
}
function sliderManegeAStar(slider,canvasField,canvas,imgFinish,imgStart) {
    changeField(slider);
    clearField(canvasField,canvas);
    updateMatrix(canvas,slider);
    createMatrix(canvas,slider);
    changeSizeIcons(slider);
    updateCoordinate(imgFinish,imgStart,canvas,slider);
    magnetizationButton(imgStart,canvas,slider);
    magnetizationButton(imgFinish,canvas,slider);
}
function  sliderManegeAnt(slider,canvasField,canvas){
    changeField(slider);
    clearField(canvasField,canvas);
    updateMatrix(canvas,slider);
    createMatrix(canvas,slider);
}
function buttonClearManege(canvas,slider,canvasField) {
    updateMatrix(canvas,slider);
    clearField(canvasField,canvas);
}
function updateMatrix(canvas,slider) {
    createMatrix(canvas,slider);
}
function clearField(canvasField,canvas){
    canvasField.clearRect(0, 0, canvas.width, canvas.height);
}
function draw(event,canvas,canvasField,slider,borderColor){
    createBlock(event,canvasField,slider,borderColor);
    canvas.onmousemove = function (event) {
        createBlock(event,canvasField,slider,borderColor);
    }
    canvas.onmouseup = function () {
        canvas.onmousemove = null;
    }
    canvas.onmouseover = function () {
        canvas.onmousemove = null;
    }
}
function managePath(array){
    let canvas = document.getElementById('fieldCanvas');
    let traceColor = document.getElementById('traceColor');
    let slider = document.getElementById('slider');
    let img =  document.createElement('img');
    let canvasField = canvas.getContext('2d');
    img.src = 'resources/penguin-svgrepo-com.svg';
    img.style.position = 'absolute';
    canvasField.fillStyle = traceColor.value;

    img.onload = ()=>{
        for(let i =0;i<array.length-1;i++){
            canvasField.fillRect(array[i][0]*slider.value, array[i][1]*slider.value, slider.value, slider.value);
            createPicture(img,array[i][0]*slider.value,array[i][1]*slider.value,canvasField,slider.value);
            console.log(array);
        }
    }
}
function createPath(array){
    let canvas = document.getElementById('fieldCanvas');
    let canvasField = canvas.getContext('2d');
    let slider = document.getElementById('slider');
    console.log(array.length);

    canvasField.beginPath();
    canvasField.lineCap = 'round';
    canvasField.lineWidth = slider.value/2;
    canvasField.moveTo(array[0][0]*slider.value + slider.value/2, array[0][1]*slider.value + slider.value/2);

    for(let i =1;i<array.length;i++){
        canvasField.lineTo(array[i][0]*slider.value + slider.value/2 ,array[i][1]*slider.value + slider.value/2);
        console.log(array[i][0] + ' ' + array[i][1]);
    }
    canvasField.stroke();
}
function createPicture(img,x,y,field,size,){
    field.drawImage(img,x,y,size,size);
}

function updateCoordinate(imgFinish,imgStart,canvas,slider){
    finishCoordinate[0]=Math.floor((parseFloat(imgFinish.style.left) - canvas.getBoundingClientRect().x)/slider.value);
    finishCoordinate[1]=Math.floor((parseFloat(imgFinish.style.top)  - canvas.getBoundingClientRect().y)/slider.value);
    startCoordinate[0]=Math.floor((parseFloat(imgStart.style.left) - canvas.getBoundingClientRect().x)/slider.value);
    startCoordinate[1]=Math.floor((parseFloat(imgStart.style.top)  - canvas.getBoundingClientRect().y)/slider.value);

    if (finishCoordinate[0]<0)finishCoordinate[0]=0;
    if(finishCoordinate[1]<0)finishCoordinate[1]=0;
    if(finishCoordinate[0]>matrixA_star[0].length)finishCoordinate[0] = matrixA_star[0].length;
    if(finishCoordinate[1]>matrixA_star.length)finishCoordinate[1] = matrixA_star.length;

    if(startCoordinate[0]>matrixA_star[0].length)startCoordinate[0] = matrixA_star[0].length;
    if(startCoordinate[1]>matrixA_star.length)startCoordinate[1] = matrixA_star.length;
    if (startCoordinate[0]<0)startCoordinate[0]=0;
    if(startCoordinate[1]<0)startCoordinate[1]=0;

}

function magnetizationButton(img,canvas,slider,numButton){
    let coordinate = [];
    switch (numButton){
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
    img.style.top  = canvas.getBoundingClientRect().top + coordinate[1] * slider.value + 'px';
}
function deleteBlock(event,canvasField,slider,canvas){
    let matrixX = Math.floor(event.offsetX / slider.value);
    let matrixY = Math.floor(event.offsetY / slider.value);

    let correctX = matrixX * slider.value;
    let correctY = matrixY * slider.value;
    canvasField.fillStyle = '#fff8dc';
    console.log(canvas.style.backgroundColor + " event");
    canvasField.fillRect(correctX, correctY, slider.value, slider.value);
    matrixA_star[matrixY][matrixX] = 0;
    console.log(matrixA_star);
}

function changeField(slider){
    let field = document.getElementById('fieldCanvas');
    //значени для изменения размера поля
    let xOffset = 600;
    let yOffset = 100; // header height
    field.width  = Math.ceil((window.innerWidth  - xOffset)/slider.value)*slider.value;
    field.height = Math.ceil((window.innerHeight - yOffset)/slider.value)*slider.value;
}
function createBlock(event,canvasField,slider,borderColor) {
    let matrixX = Math.floor(event.offsetX / slider.value);
    let matrixY = Math.floor(event.offsetY / slider.value);

    let correctX = matrixX * slider.value;
    let correctY = matrixY * slider.value;

    canvasField.fillStyle = borderColor;
    canvasField.fillRect(correctX, correctY, slider.value, slider.value);

    matrixA_star[matrixY][matrixX] = 1;
    console.log(matrixA_star);
}

function dragAndDrop(event,img,canvas,slider,numElement) {

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

        magnetizationButton(img,canvas,slider,numElement);
        document.removeEventListener('mousemove', onMouseMove);
        img.onmouseup = null;
    };

}
function  changeSizeIcons(slider){
    document.getElementById('startImg').style.width  = slider.value + 'px';
    document.getElementById('finishImg').style.width = slider.value + 'px';
}
function createMatrix(canvas,slider) {
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