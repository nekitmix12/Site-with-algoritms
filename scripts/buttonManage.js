
window.onload=function() {
    let A_starButton = document.getElementById('AStarButton');
    A_starButton.addEventListener('click',()=>{ manage('AStar')});
    let antButton = document.getElementById('antButton');
    antButton.addEventListener('click',()=>{ manage('ant')});
}
let use = false;
let lastFunction;
let lastId;
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
    let xOffset = 600;
    let yOffset = 100;// header height

    //200 для того чтоб одинакого хорошо работал и с
    field.width  = Math.ceil((window.innerWidth  - xOffset)/10)*10;
    field.height = Math.ceil((window.innerHeight - yOffset)/10)*10;
    field.style.left='20%   ';
    field.style.right='20%';
    field.style.bottom='5%';
    field.style.top='5%';
    document.body.append(field);

}
function createColorUser(){
    let colorBolder = document.createElement("input");
    colorBolder.id='colorUser';
    colorBolder.type='color';
    colorBolder.style.position='absolute';
    colorBolder.style.right = '10%';
    colorBolder.style.top= '25%';
    colorBolder.value = '#173cd0';
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
    imgStart.src = 'resources/russia-svgrepo-com.svg'
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
    imgFinish.src = 'resources/china-svgrepo-com.svg'
    imgFinish.style.width = '10px';
    imgFinish.style.position = 'absolute';
    imgFinish.style.top = '35%';
    imgFinish.textContent = 'finishImg';
    imgFinish.style.right = '12%';
    imgFinish.style.zIndex = '2';
    document.body.append(imgFinish);
}

function  createColorBorder(){
    let borderColor = document.createElement('input');
    borderColor.type = 'color';
    borderColor.id='borderColor';
    borderColor.value = '#000000'
    borderColor.style.position = 'absolute';
    borderColor.style.top = '55%';
    borderColor.style.right = '10%';
    document.body.append(borderColor);
}
function  createColorTrace(){
    let traceColor = document.createElement('input');
    traceColor.type = 'color';
    traceColor.id='traceColor';
    traceColor.value = '#08b6b0'
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

function createTower(){
    let tower = document.createElement('img');

}
function deleteColorBorder(){
    document.getElementById('borderColor').remove();
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
function  deleteColorUser(){
    document.getElementById('colorUser').remove();
}

function createVisualizationA_star(functionName){
    createField();
    createButtonClear();
    createButtonStart(functionName);
    createSliderSize();
    createImgFinish();
    createImgStart();
    createGenerationMapButton();
    createColorUser();
    createColorTrace();
    createColorBorder();

    creatArea(functionName);

    use = true;
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
    deleteGenerationMapButton();
    returnCoordinate();
    deleteColorTrace();
    deleteColorUser();
    deleteColorBorder();

}

function createVisualizationAnt(functionName){
    createField();
    createButtonClear();
    createButtonStart(functionName);
    createSliderSize();
    createColorTrace();
    createColorUser();
    creatArea(functionName);
}
function deleteVisualizationAnt(){
    deleteField();
    deleteButtonClear();
    deleteButtonStart();
    deleteSliderSize();
    returnCoordinate();
    deleteColorTrace();
    deleteColorUser();

}
function manage(functionName){
    if (!use ) {
        switch (functionName) {
            case ('AStar'):
                createVisualizationA_star(functionName);


                lastFunction = deleteVisualizationA_star;
                break;
            case ('ant'):
                createVisualizationAnt(functionName);
                lastFunction = deleteVisualizationAnt;

        }
        use = true;
        lastId = functionName;
        console.log(lastFunction + ' ' + use + ' ' + lastId + ';')
    } else if (use && lastId===functionName){
        lastFunction();
        use = false;
        lastId = undefined;

        console.log(lastFunction + ' ' + use + ' ' + lastId + ';')
    }else if (use && lastId!==functionName){

        lastFunction();

        switch (functionName) {
            case ('AStar'):
                createVisualizationA_star(functionName);

                lastFunction = deleteVisualizationA_star;
                break
            case ('ant'):
                createVisualizationAnt(functionName);
                lastFunction = deleteVisualizationAnt;
                break;
        }
        lastId = functionName;
        console.log(lastFunction + ' ' + use + ' ' + lastId + ';')
    }

}



function launch(functionName){
    switch (functionName){
        case ('AStar'):
            if(startCoordinate[0] === undefined && finishCoordinate[0] === undefined)
                alert('Вы не установили старт и финиш');
            else if(startCoordinate[0] === undefined)
                alert('Вы не установили старт');
            else if(finishCoordinate[0] === undefined)
                alert('Вы не установили финиш'+ finishCoordinate[0]);
            else if (startCoordinate[0]>row-1 || startCoordinate[1]>col-1||startCoordinate[0]<0
                || startCoordinate[1]<0)
                alert('установите старт на поле' );

            else if(finishCoordinate[0]>row-1 || finishCoordinate[1]>col-1||finishCoordinate[0]<0
                || finishCoordinate[1]<0)
                alert('установите финиш на поле');
            else {
                let result = aStarSearch(matrixA_star, [startCoordinate[1],startCoordinate[0]], [finishCoordinate[1],finishCoordinate[0]]);
                if(result[0][0]              !==startCoordinate [0]
                || result[0][1]              !==startCoordinate [1]
                || result[result.length-1][0]!==finishCoordinate[0]
                || result[result.length-1][1]!==finishCoordinate[1])
                    alert("незля простороить путь");
                else managePath(result);

            }
            break;
        case('ant'):

            if(points.length ===0)
                alert('Добавьте города');
            else if (points.length ===1)
                alert('Вы добавили слишком мало городов');
            else {
                const {bestPath, shortestDistance} = antColonyOptimization(points, 5, 100, 1, 0.5, 100);
                let array = bestPath.map(index => points[index]);
                console.log("Shortest Path:", array);
                console.log("Shortest Distance:", shortestDistance);
                createPath(array);
            }
            break;

    }
}