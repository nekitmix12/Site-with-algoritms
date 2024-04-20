window.onload=function() {
    let A_starButton = document.getElementById('AStarButton');
    A_starButton.addEventListener('click',()=>{ manage('AStar')});

    let antButton = document.getElementById('antButton');
    antButton.addEventListener('click',()=>{ manage('ant')});

    let clusterButton = document.getElementById('clusterButton');
    clusterButton.addEventListener('click',()=>manage('cluster'));

    let geneticButton = document.getElementById('geneticButton');
    geneticButton.addEventListener('click',()=>manage('genetic'));

    document.getElementById('neuralNetworkButton').addEventListener('click', function () {

        location.replace('./nnAlgo.html');
    });
    document.getElementById('treeButton').addEventListener('click', function () {

        location.replace('./treeAlgo.html');
    });


}


let use = false;
let lastFunction;
let lastId;


function createButtonStart(functionName) {
    let buttonStart = document.createElement('button');
    buttonStart.id = 'startButton';
    buttonStart.value = functionName;
    buttonStart.style.zIndex = '2';
    buttonStart.style.height = '40px';
    buttonStart.style.width = '100px';
    buttonStart.style.position = 'absolute';
    buttonStart.style.top = '20%';
    buttonStart.style.right = '5%';
    buttonStart.style.backgroundColor = '#1D1F20';
    buttonStart.style.color = '#FFFFFF';
    buttonStart.style.border = 'none';
    buttonStart.style.borderRadius = '20px';
    buttonStart.style.boxShadow = '0px 8px 15px rgba(0, 0, 0, 0.1)';
    buttonStart.style.transition = 'all 0.3s ease 0s';
    buttonStart.style.cursor = 'pointer';
    buttonStart.style.textAlign = 'center';
    buttonStart.textContent = 'Старт';
    buttonStart.onmouseover = function() { this.style.backgroundColor = '#ff4757'; };
    buttonStart.onmouseout = function() { this.style.backgroundColor = '#1D1F20'; };
    document.body.append(buttonStart);
}
function createButtonClear() {
    let buttonClear = document.createElement('button');
    buttonClear.id = 'clearButton';
    buttonClear.title = 'Очистить';
    buttonClear.textContent = 'Очистить';
    buttonClear.style.zIndex = '2';
    buttonClear.style.height = '40px';
    buttonClear.style.width = '100px';
    buttonClear.style.position = 'absolute';
    buttonClear.style.top = '30%';
    buttonClear.style.right = '5%';
    buttonClear.style.backgroundColor = '#1D1F20';
    buttonClear.style.color = '#FFFFFF';
    buttonClear.style.border = 'none';
    buttonClear.style.borderRadius = '20px';
    buttonClear.style.boxShadow = '0px 8px 15px rgba(0, 0, 0, 0.1)';
    buttonClear.style.transition = 'all 0.3s ease 0s';
    buttonClear.style.cursor = 'pointer';
    buttonClear.style.textAlign = 'center';
    buttonClear.onmouseover = function () {
        this.style.backgroundColor = 'blue';
    };
    buttonClear.onmouseout = function () {
        this.style.backgroundColor = '#1D1F20';
    };
    document.body.append(buttonClear);
}

function createButtonBlock() {
    let buttonClear = document.createElement('button');
    buttonClear.id = 'buttonBlock';
    buttonClear.title = 'Блок';
    buttonClear.textContent = 'Блок';
    buttonClear.style.zIndex = '2';
    buttonClear.style.height = '40px';
    buttonClear.style.width = '100px';
    buttonClear.style.position = 'absolute';
    buttonClear.style.top = '70%';
    buttonClear.style.right = '5%';
    buttonClear.style.backgroundColor = '#1D1F20';
    buttonClear.style.color = '#FFFFFF';
    buttonClear.style.border = 'none';
    buttonClear.style.borderRadius = '20px';
    buttonClear.style.boxShadow = '0px 8px 15px rgba(0, 0, 0, 0.1)';
    buttonClear.style.transition = 'all 0.3s ease 0s';
    buttonClear.style.cursor = 'pointer';
    buttonClear.style.textAlign = 'center';
    buttonClear.onmouseover = function () {
        this.style.backgroundColor = 'blue';
    };
    buttonClear.onmouseout = function () {
        this.style.backgroundColor = '#1D1F20';
    };
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
    field.style.top='20%';
    document.body.append(field);

}

function createColorUser() {
    let colorBolder = document.createElement("input");
    colorBolder.id = 'colorUser';
    colorBolder.type = 'color';
    colorBolder.style.position = 'absolute';
    colorBolder.style.right = '10%';
    colorBolder.style.top = '25%';
    colorBolder.value = '#645117';
    colorBolder.style.border = 'none';
    colorBolder.style.height = '40px';
    colorBolder.style.width = '40px';
    colorBolder.style.borderRadius = '50%';
    colorBolder.style.cursor = 'pointer';
    colorBolder.style.transition = 'all 0.3s ease 0s';

    document.body.append(colorBolder);
}
function createSliderSize() {
    let sliderSize = document.createElement('input');
    sliderSize.type = 'range';
    sliderSize.min = '10';
    sliderSize.max = '50';
    sliderSize.step = '10';
    sliderSize.id = 'slider';
    sliderSize.value = '10';
    sliderSize.style.position = 'absolute';
    sliderSize.style.right = '10%';
    sliderSize.style.top = '30%';
    sliderSize.style.zIndex = '2';
    sliderSize.style.width = '200px';
    sliderSize.style.height = '25px';
    sliderSize.style.background = '#d3d3d3';
    sliderSize.style.outline = 'none';
    sliderSize.style.opacity = '0.7';
    sliderSize.style.borderRadius = '12px';
    sliderSize.style.boxShadow = 'inset 0 0 5px #000';
    sliderSize.style.cursor = 'pointer';
    sliderSize.style.transition = 'all 0.3s ease 0s';
    sliderSize.oninput = function() { this.style.background = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + this.value + '%, #d3d3d3 ' + this.value + '%, #d3d3d3 100%)'; };
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
    generationMap.style.width = '10vh';
    generationMap.style.height='5vh';
    generationMap.style.backgroundColor =  '#022cab';
    generationMap.textContent = 'Генерировать';
    generationMap.style.position = 'absolute';
    generationMap.style.top = '45%';
    generationMap.style.right = '5%';
    document.body.append(generationMap);
}

function createNumInput(){
    let num = document.createElement('input');
    num.style.backgroundColor='#778edc';
    num.id='numField';
    num.type='text';
    num.placeholder ='Count clusters';
    num.style.left = '5%';
    num.style.top='45%';
    num.style.position = 'absolute';
    document.body.append(num);

}function createEpsilonInput(){
    let num = document.createElement('input');
    num.style.backgroundColor='#778edc';
    num.id='epsilon';
    num.type='text';
    num.placeholder ='Epsilon';
    num.style.left = '5%';
    num.style.top='50%';
    num.style.position = 'absolute';
    document.body.append(num);

}function createPointInNeighborhoodInput(){
    let num = document.createElement('input');
    num.style.backgroundColor='#778edc';
    num.id='pointInNeighborhood';
    num.type='text';
    num.placeholder ='Neighborhood';
    num.style.left = '5%';
    num.style.top='55%';
    num.style.position = 'absolute';
    document.body.append(num);

}

function deleteEpsilonInput(){
    document.getElementById('epsilon').remove();
}
function deletePointInNeighborhoodInput() {
    document.getElementById('pointInNeighborhood').remove();
}
function deleteNumInput(){
    document.getElementById('numField').remove();
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
function deleteButtonBlock(){
    document.getElementById('buttonBlock').remove();
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

function deleteCanvasForNeuralNetwork(){
    document.getElementById('fieldCanvasForNeuralNetwork').remove();
}
function deleteCanvasForNumbers(){
    document.getElementById('fieldCanvasForNumbers').remove();
}
function returnCoordinate(){
    startCoordinate = [];
    finishCoordinate=[];
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
    createButtonBlock();

    creatArea(functionName);

    use = true;
}

function createVisualizationCluster(functionName){
    createField();
    createButtonClear();
    createButtonStart(functionName);
    createSliderSize();
    createColorUser();
    createColorTrace();
    createNumInput();
    createEpsilonInput();
    createPointInNeighborhoodInput();
    createButtonBlock()
    creatArea(functionName);
}

function createVisualizationAnt(functionName){
    createField();
    createButtonClear();
    createButtonStart(functionName);
    createSliderSize();
    createColorTrace();
    createColorUser();
    createButtonBlock()
    creatArea(functionName);
}

function createVisualizationGenetic(functionName){

    createField();
    createButtonClear();
    createButtonStart(functionName);
    creatArea(functionName);
}
function deleteVisualizationGenetic(){
    deleteField();
    deleteButtonClear();
    deleteButtonStart();
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
    deleteButtonBlock();

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
function deleteVisualizationCluster(){
    deleteField();
    deleteButtonClear();
    deleteButtonStart();
    deleteSliderSize();
    returnCoordinate();
    deleteColorUser();
    deleteNumInput();
    deleteEpsilonInput();
    deletePointInNeighborhoodInput();
    deleteColorTrace();
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
                break;
            case ('cluster'):
                createVisualizationCluster(functionName);
                lastFunction = deleteVisualizationCluster;
                break;

            case("genetic"):
                createVisualizationGenetic(functionName);
                lastFunction = deleteVisualizationGenetic;
                break;
        }
        use = true;
        lastId = functionName;

    } else if (use && lastId===functionName){
        lastFunction();
        use = false;
        lastId = undefined;


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
            case ('cluster') :
                createVisualizationCluster(functionName);
                lastFunction = deleteVisualizationCluster;
                break;
            case ('genetic'):
                createVisualizationGenetic(functionName);
                lastFunction = deleteVisualizationGenetic;
                break;
        }
        lastId = functionName;

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
                antAlgorithm(points);
            }
            break;
        case ('cluster'):
            let num = document.getElementById('numField').value;
            let eps = document.getElementById('epsilon').value;
            let neighborhood = document.getElementById('pointInNeighborhood').value;
            KMean(num,points);
            dbscan_naive(points,eps,neighborhood,getEuclideanDistance);
            hierarchicalClustering(points,num,getEuclideanDistance);
            break;
        case ('genetic'):

            deletePath();
            geneticAlgorithm();
            break;
    }
}