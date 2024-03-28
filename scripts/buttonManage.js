

window.onload=function() {
    let A_starButton = document.getElementById('AStarButton');
    A_starButton.addEventListener('click',()=>{ manageA_star('AStar')});
}
let use = false;
let firstUse = true;
function createButtonStart(functionName){
    let buttonStart = document.createElement('button');
    buttonStart.id = 'startButton';
    buttonStart.value = functionName;
    buttonStart.style.zIndex = '2';
    buttonStart.style.height='20px';
    buttonStart.style.width = '50px';
    buttonStart.style.position='absolute';
    buttonStart.style.top = '20%';
    buttonStart.style.right = '15%';
    buttonStart.style.backgroundColor = 'red';
    buttonStart.textContent = 'startButton';
    document.body.append(buttonStart);
}
function createButtonClear(){
    let buttonClear = document.createElement('button');
    buttonClear.id = 'clearButton';
    buttonClear.title='Clear';
    buttonClear.textContent = 'clearButton';
    buttonClear.style.zIndex = '2';
    buttonClear.style.height='20px';
    buttonClear.style.width = '50px';
    buttonClear.style.position='absolute';
    buttonClear.style.top = '20%';
    buttonClear.style.right = '10%';
    document.body.append(buttonClear);
}
function createField(){
    let field = document.createElement('canvas');
    field.id = 'fieldCanvas';
    field.style.zIndex = '2';
    field.style.position = 'absolute';

    //значени для изменения размера поля
    var xOffset = 700;
    var yOffset = 200; // header height

    //200 для того чтоб одинакого хорошо работал и с
    field.width  = Math.ceil((window.innerWidth  - xOffset)/200)*200;
    field.height = Math.ceil((window.innerHeight - yOffset)/200)*200;
    field.style.left='20%   ';
    field.style.right='20%';
    field.style.bottom='5%';
    field.style.top='5%';
    document.body.append(field);

}
function createColor(){
    let colorBolder = document.createElement("input");
    colorBolder.id='colorBolder';
    colorBolder.type='color';
    colorBolder.style.position='absolute';
    colorBolder.style.right = '10%';
    colorBolder.style.top= '25%';
    colorBolder.value = '#f8d703';
    document.body.append(colorBolder);
}
function createSliderSize(){
    let sliderSize = document.createElement('input');
    sliderSize.type = 'range';
    sliderSize.min = '10';
    sliderSize.max='50';
    sliderSize.step='10';
    sliderSize.id = 'slider';
    sliderSize.value = '10';
    sliderSize.style.position = 'absolute';
    sliderSize.style.right = '10%';
    sliderSize.style.top = '30%';
    sliderSize.style.zIndex='2';
    document.body.append(sliderSize);
}
function createImgStart(){
    let imgStart = document.createElement('img');
    imgStart.id = 'startImg';
    imgStart.src = 'img/russia-svgrepo-com.svg'
    imgStart.style.width = '10px';
    imgStart.style.position = 'absolute';
    imgStart.style.top = '35%';
    imgStart.textContent = 'startImg';
    imgStart.style.right = '10%';
    imgStart.style.zIndex = '2';
    document.body.append(imgStart);
}
function createImgFinish(){
    let imgFinish = document.createElement('img');
    imgFinish.id = 'finishImg';
    imgFinish.src = 'img/china-svgrepo-com.svg'
    imgFinish.style.width = '10px';
    imgFinish.style.position = 'absolute';
    imgFinish.style.top = '35%';
    imgFinish.textContent = 'finishImg';
    imgFinish.style.right = '12%';
    imgFinish.style.zIndex = '2';
    document.body.append(imgFinish);
}

function  createColorTrace(){
    let traceColor = document.createElement('input');
    traceColor.type = 'color';
    traceColor.id='traceColor';
    traceColor.value = '#00a6ff'
    traceColor.style.position = 'absolute';
    traceColor.style.top = '45%';
    traceColor.style.right = '10%';
    document.body.append(traceColor);

}
function createGenerationMapButton(){
    let generationMap = document.createElement('button');
    generationMap.id = 'generationMap';
    generationMap.style.width = '50px';
    generationMap.style.height='20px';
    generationMap.style.backgroundColor =  '#032cc5';
    generationMap.textContent = 'generationMap';
    generationMap.style.position = 'absolute';
    generationMap.style.top = '45%';
    generationMap.style.right = '20%';
    document.body.append(generationMap);
}
function deleteColorTrace(){
    document.getElementById('traceColor').remove();
}
function deleteGenerationMapButton(){
    document.getElementById('generationMap').remove();
}
function deleteField(){
    document.getElementById('fieldCanvas').remove();
}

function deleteButtonClear(){
    document.getElementById('clearButton').remove();
}

function deleteButtonStart(){
    document.getElementById('startButton').remove();
}

function deleteSliderSize(){
    document.getElementById('slider').remove();
}

function deleteImgFinish(){
    document.getElementById('finishImg').remove();
}

function deleteImgStart(){
    document.getElementById('startImg').remove();
}
function  deleteColor(){
    document.getElementById('colorBolder').remove();
}

function createVisualizationA_star(functionName){
    createField();
    createButtonClear();
    createButtonStart(functionName);
    createSliderSize();
    createImgFinish();
    createImgStart();
    createColor();
    createGenerationMapButton();
    createColorTrace();


    creatArea();

    use = 1;
}

function returnCoordinate(){
    startCoordinate = [];
    finishCoordinate=[];
}

function deleteVisualizationA_star(){
    deleteField();
    deleteButtonClear();
    deleteButtonStart();
    deleteSliderSize();
    deleteImgStart();
    deleteImgFinish();
    deleteColor();
    returnCoordinate();
    deleteColorTrace();
    deleteGenerationMapButton();
    use = 0;
}

function manageA_star(functionName){
    if (!use && firstUse) {
        createVisualizationA_star(functionName);
        document.getElementById('startButton').addEventListener("click",()=>
        {
            clearField();
            drawMapByMatrix(matrixA_star);
            launch(document.getElementById('startButton').value)
        });
        firstUse = false;
    } else if (!use && !firstUse){
        deleteVisualizationA_star();
        createVisualizationA_star();
    }else{
        deleteVisualizationA_star();
        firstUse = true;
    }
}
function drawMapByMatrix(matrix){
    let canvas = document.getElementById('fieldCanvas');
    let canvasField = canvas.getContext('2d');
    let slider = document.getElementById('slider');
    for(let i = 0;i<col;i++)
        for(let j = 0;j<row;j++)
            if(matrix[i][j] === 1){
                canvasField.fillRect(j*slider.value,i*slider.value,slider.value,slider.value);
            }
}

function clearField(){
    let canvas = document.getElementById('fieldCanvas');
    let canvasField = canvas.getContext('2d');
    canvasField.clearRect(0, 0, canvas.width, canvas.height);
}

function launch(functionName){
    switch (functionName){
        case ('AStar'):
            if(startCoordinate[0] === undefined && finishCoordinate[0] === undefined)
                alert('Вы не установили старт и финиш');
            else if(startCoordinate[0] === undefined)
                alert('Вы не установили старт');
            else if(finishCoordinate[0] === undefined)
                alert('Вы не установили финиш');
            else if (startCoordinate[0]>row-1 || startCoordinate[1]>col-1||startCoordinate[0]<0
                || startCoordinate[1]<0)
                alert('установите старт на поле' +col + ' : ' + row);

            else if(finishCoordinate[0]>row-1 || finishCoordinate[1]>col-1||finishCoordinate[0]<0
                || finishCoordinate[1]<0)
                alert('установите финиш на поле');
            else {
                let result = aStarSearch(matrixA_star, [startCoordinate[1],startCoordinate[0]], [finishCoordinate[1],finishCoordinate[0]]);
                console.log(matrixA_star);
                console.log(result);
                managePath(result);
            }

    }
}