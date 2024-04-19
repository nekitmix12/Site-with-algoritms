window.onload = function () {
    let A_starButton = document.getElementById('AStarButton');
    A_starButton.addEventListener('click', () => {
        manage('AStar')
    });

    let antButton = document.getElementById('antButton');
    antButton.addEventListener('click', () => {
        manage('ant')
    });

    let clusterButton = document.getElementById('clusterButton');
    clusterButton.addEventListener('click', () => manage('cluster'));
    document.getElementById('neuralNetworkButton').addEventListener('click', function () {

        location.replace('./nnAlgo.html');
    });
    document.getElementById('treeButton').addEventListener('click', function () {

        location.replace('./treeAlgo.html');
    });
    document.getElementById('centered-button').addEventListener('click', function () {
        const projectInfo = document.getElementById('project-info');
        const centeredButton = document.getElementById('centered-button');
        const centeredText = document.getElementById('centered-text');
        if (projectInfo.style.display === 'none') {
            projectInfo.style.display = 'block';
            centeredButton.style.display = 'none';
            centeredText.style.display = 'none';
        } else {
            projectInfo.style.display = 'none';
            centeredButton.style.display = 'block';
            centeredText.style.display = 'block';
        }
    });

    document.getElementById('project-info').addEventListener('click', function () {
        this.style.display = 'none';
        document.getElementById('centered-button').style.display = 'block';
        document.getElementById('centered-text').style.display = 'block';
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
    buttonStart.style.right = '0';
    buttonStart.style.backgroundColor = '#1D1F20';
    buttonStart.style.color = '#FFFFFF';
    buttonStart.style.border = 'none';
    buttonStart.style.borderRadius = '20px';
    buttonStart.style.boxShadow = '0px 8px 15px rgba(0, 0, 0, 0.1)';
    buttonStart.style.transition = 'all 0.3s ease 0s';
    buttonStart.style.cursor = 'pointer';
    buttonStart.style.textAlign = 'center';
    buttonStart.style.margin = 'auto'
    buttonStart.textContent = 'Start';
    buttonStart.onmouseover = function () {
        this.style.backgroundColor = '#ff4757';
    };
    buttonStart.onmouseout = function () {
        this.style.backgroundColor = '#1D1F20';
    };
    document.body.append(buttonStart);
}

function createButtonClear() {
    let buttonClear = document.createElement('button');
    buttonClear.id = 'clearButton';
    buttonClear.title = 'Clear';
    buttonClear.textContent = 'Clear';
    buttonClear.style.zIndex = '2';
    buttonClear.style.height = '40px';
    buttonClear.style.width = '100px';
    buttonClear.style.position = 'absolute';
    buttonClear.style.top = '30%';
    buttonClear.style.right = '0';
    buttonClear.style.backgroundColor = '#1D1F20';
    buttonClear.style.color = '#FFFFFF';
    buttonClear.style.border = 'none';
    buttonClear.style.borderRadius = '20px';
    buttonClear.style.boxShadow = '0px 8px 15px rgba(0, 0, 0, 0.1)';
    buttonClear.style.transition = 'all 0.3s ease 0s';
    buttonClear.style.cursor = 'pointer';
    buttonClear.style.textAlign = 'center';
    buttonClear.onmouseover = function () {
        this.style.backgroundColor = '#ff4757';
    };
    buttonClear.onmouseout = function () {
        this.style.backgroundColor = '#1D1F20';
    };
    document.body.append(buttonClear);
}

function createField() {
    let field = document.createElement('canvas');
    field.id = 'fieldCanvas';
    field.style.zIndex = '2';
    field.style.position = 'absolute';
    field.style.top = '25%';

    //значени для изменения размера поля
    let xOffset = 600;
    let yOffset = 100;// header height

    //200 для того чтоб одинакого хорошо работал и с
    field.width = Math.ceil((window.innerWidth - xOffset) / 10) * 10;
    field.height = Math.ceil((window.innerHeight - yOffset) / 10) * 10;
    field.style.left = '20%   ';
    field.style.right = '20%';
    document.body.append(field);

}

function createCanvasForNumbers() {
    let fieldCanvasForForNumbers = document.createElement('canvas');
    fieldCanvasForForNumbers.id = 'fieldCanvasForForNumbers';
    fieldCanvasForForNumbers.style.zIndex = '2';
    fieldCanvasForForNumbers.style.position = 'absolute';
    fieldCanvasForForNumbers.style.backgroundColor = '#f5b475';
    fieldCanvasForForNumbers.style.color = '#f5b475';

    //значени для изменения размера поля
    let xOffset = 600;
    let yOffset = 100;// header height

    //200 для того чтоб одинакого хорошо работал и с

    fieldCanvasForForNumbers.style.left = '80%   ';
    fieldCanvasForForNumbers.style.right = '80%';
    fieldCanvasForForNumbers.style.bottom = '5%';
    fieldCanvasForForNumbers.style.top = '5%';
    document.body.append(fieldCanvasForForNumbers);
}

function createColorUser() {
    let colorBolder = document.createElement("input");
    colorBolder.id = 'colorUser';
    colorBolder.type = 'color';
    colorBolder.style.position = 'absolute';
    colorBolder.style.top = '50%';
    colorBolder.style.right = '0';
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
    sliderSize.style.top = '40%';
    sliderSize.style.right = '0';
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
    sliderSize.oninput = function () {
        this.style.background = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + this.value + '%, #d3d3d3 ' + this.value + '%, #d3d3d3 100%)';
    };
    document.body.append(sliderSize);
}

function createImgStart() {
    let imgStart = document.createElement('img');
    imgStart.id = 'startImg';
    imgStart.src = '../resources/russia-svgrepo-com.svg'
    imgStart.style.width = '10px';
    imgStart.style.position = 'absolute';
    imgStart.style.top = '35%';
    imgStart.textContent = 'startImg';
    imgStart.style.right = '10%';
    imgStart.style.zIndex = '2';
    document.body.append(imgStart);
}

function createImgFinish() {
    let imgFinish = document.createElement('img');
    imgFinish.id = 'finishImg';
    imgFinish.src = '../resources/china-svgrepo-com.svg'
    imgFinish.style.width = '10px';
    imgFinish.style.position = 'absolute';
    imgFinish.style.top = '35%';
    imgFinish.textContent = 'finishImg';
    imgFinish.style.right = '12%';
    imgFinish.style.zIndex = '2';
    document.body.append(imgFinish);
}

function createColorBorder() {
    let borderColor = document.createElement('input');
    borderColor.type = 'color';
    borderColor.id = 'borderColor';
    borderColor.value = '#000000'
    borderColor.style.position = 'absolute';
    borderColor.style.top = '55%';
    borderColor.style.right = '10%';
    document.body.append(borderColor);
}

function createColorTrace() {
    let traceColor = document.createElement('input');
    traceColor.type = 'color';
    traceColor.id = 'traceColor';
    traceColor.value = '#08b6b0'
    traceColor.style.position = 'absolute';
    traceColor.style.top = '45%';
    traceColor.style.right = '10%';
    document.body.append(traceColor);

}

function createGenerationMapButton() {
    let generationMap = document.createElement('button');
    generationMap.id = 'generationMap';
    generationMap.style.width = '50px';
    generationMap.style.height = '20px';
    generationMap.style.backgroundColor = '#022cab';
    generationMap.textContent = 'generationMap';
    generationMap.style.position = 'absolute';
    generationMap.style.top = '45%';
    generationMap.style.right = '0';
    document.body.append(generationMap);
}

function createNumInput() {
    let num = document.createElement('input');
    num.style.backgroundColor = '#778edc';
    num.id = 'numField';
    num.type = 'text';
    num.placeholder = 'Count clusters';
    num.style.left = '5%';
    num.style.top = '45%';
    num.style.position = 'absolute';
    document.body.append(num);

}

function createEpsilonInput() {
    let num = document.createElement('input');
    num.style.backgroundColor = '#778edc';
    num.id = 'epsilon';
    num.type = 'text';
    num.placeholder = 'Epsilon';
    num.style.left = '5%';
    num.style.top = '50%';
    num.style.position = 'absolute';
    document.body.append(num);

}

function createPointInNeighborhoodInput() {
    let num = document.createElement('input');
    num.style.backgroundColor = '#778edc';
    num.id = 'pointInNeighborhood';
    num.type = 'text';
    num.placeholder = 'Neighborhood';
    num.style.left = '5%';
    num.style.top = '55%';
    num.style.position = 'absolute';
    document.body.append(num);

}

function createTower() {
    let tower = document.createElement('img');

}

function deleteEpsilonInput() {
    document.getElementById('epsilon').remove();
}

function deletePointInNeighborhoodInput() {
    document.getElementById('pointInNeighborhood').remove();
}

function deleteNumInput() {
    document.getElementById('numField').remove();
}

function deleteColorBorder() {
    document.getElementById('borderColor').remove();
}

function deleteColorTrace() {
    document.getElementById('traceColor').remove();
}

function deleteGenerationMapButton() {
    document.getElementById('generationMap').remove();
}

function deleteField() {
    document.getElementById('fieldCanvas').remove();
}

function deleteButtonClear() {
    document.getElementById('clearButton').remove();
}

function deleteButtonStart() {
    document.getElementById('startButton').remove();
}

function deleteSliderSize() {
    document.getElementById('slider').remove();
}

function deleteImgFinish() {
    document.getElementById('finishImg').remove();
}

function deleteImgStart() {
    document.getElementById('startImg').remove();
}

function deleteColorUser() {
    document.getElementById('colorUser').remove();
}

function deleteCanvasForNeuralNetwork() {
    document.getElementById('fieldCanvasForNeuralNetwork').remove();
}

function deleteCanvasForNumbers() {
    document.getElementById('fieldCanvasForNumbers').remove();
}

function returnCoordinate() {
    startCoordinate = [];
    finishCoordinate = [];
}

function createVisualizationA_star(functionName) {
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

function createVisualizationCluster(functionName) {
    createField();
    createButtonClear();
    createButtonStart(functionName);
    createSliderSize();
    createColorUser();
    createColorTrace();
    createNumInput();
    createEpsilonInput();
    createPointInNeighborhoodInput();
    creatArea(functionName);
}

function createVisualizationAnt(functionName) {
    createField();
    createButtonClear();
    createButtonStart(functionName);
    createSliderSize();
    createColorTrace();
    createColorUser();
    creatArea(functionName);
}

function createVisualizationNeuralNetwork(functionName) {
    createCanvasForNeuralNetwork();
    createCanvasForNumbers();

    creatArea(functionName);
}

function deleteVisualizationA_star() {
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

function deleteVisualizationAnt() {
    deleteField();
    deleteButtonClear();
    deleteButtonStart();
    deleteSliderSize();
    returnCoordinate();
    deleteColorTrace();
    deleteColorUser();

}

function deleteVisualizationCluster() {
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


function deleteVisualizationNeuralNetwork() {
    deleteCanvasForNeuralNetwork();
    deleteCanvasForNumbers();
}


function manage(functionName) {
    if (!use) {
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
            case ('hits'):

                createVisualizationNeuralNetwork(functionName);
                lastFunction = deleteVisualizationNeuralNetwork;
                break;
        }
        use = true;
        lastId = functionName;
        console.log(lastFunction + ' ' + use + ' ' + lastId + ';')
    } else if (use && lastId === functionName) {
        lastFunction();
        use = false;
        lastId = undefined;

        console.log(lastFunction + ' ' + use + ' ' + lastId + ';')
    } else if (use && lastId !== functionName) {

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
            case ('hits'):
                createVisualizationNeuralNetwork(functionName);
                lastFunction = deleteVisualizationNeuralNetwork;
                break;
        }
        lastId = functionName;

    }

}


function launch(functionName) {
    switch (functionName) {
        case ('AStar'):
            if (startCoordinate[0] === undefined && finishCoordinate[0] === undefined)
                alert('Вы не установили старт и финиш');
            else if (startCoordinate[0] === undefined)
                alert('Вы не установили старт');
            else if (finishCoordinate[0] === undefined)
                alert('Вы не установили финиш' + finishCoordinate[0]);
            else if (startCoordinate[0] > row - 1 || startCoordinate[1] > col - 1 || startCoordinate[0] < 0
                || startCoordinate[1] < 0)
                alert('установите старт на поле');

            else if (finishCoordinate[0] > row - 1 || finishCoordinate[1] > col - 1 || finishCoordinate[0] < 0
                || finishCoordinate[1] < 0)
                alert('установите финиш на поле');
            else {
                let result = aStarSearch(matrixA_star, [startCoordinate[1], startCoordinate[0]], [finishCoordinate[1], finishCoordinate[0]]);
                if (result[0][0] !== startCoordinate [0]
                    || result[0][1] !== startCoordinate [1]
                    || result[result.length - 1][0] !== finishCoordinate[0]
                    || result[result.length - 1][1] !== finishCoordinate[1])
                    alert("незля простороить путь");
                else managePath(result);

            }
            break;
        case('ant'):

            if (points.length === 0)
                alert('Добавьте города');
            else if (points.length === 1)
                alert('Вы добавили слишком мало городов');
            else {
                const {bestPath, shortestDistance} = antColonyOptimization(points, 5, 100, 1, 0.5, 100);
                let array = bestPath.map(index => points[index]);
                console.log("Shortest Path:", array);
                console.log("Shortest Distance:", shortestDistance);
                createPath(array);
            }
            break;
        case ('cluster'):
            let num = document.getElementById('numField').value;
            let eps = document.getElementById('epsilon').value;
            let neighborhood = document.getElementById('pointInNeighborhood').value;
            KMean(num, points);
            dbscan_naive(points, eps, neighborhood, getEuclideanDistance);
            hierarchicalClustering(points, num, getEuclideanDistance);
            break;
        case ('hits'):
            setup();
            main();
            break;
    }
}