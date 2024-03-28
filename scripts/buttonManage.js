window.onload = function () {
    let A_starButton = document.getElementById('AStarButton');
    A_starButton.addEventListener('click', () => {
        manageA_star('AStar')
    });
}
let use = false;
let firstUse = true;
let buttonContainer = document.createElement('div');
buttonContainer.style.display = 'flex';
buttonContainer.style.justifyContent = 'space-between';
buttonContainer.style.position = 'absolute';
buttonContainer.style.top = '20%';
buttonContainer.style.right = '10%';
buttonContainer.style.width = '15hw';


function createButtonStart(functionName) {
    let buttonStart = document.createElement('button');
    buttonStart.id = 'startButton';
    buttonStart.value = functionName;
    buttonStart.style.zIndex = '2';
    buttonStart.style.height = '40px';
    buttonStart.style.width = '100px';
    buttonStart.style.position = 'static';
    buttonStart.style.top = '20%';
    buttonStart.style.right = '15%';
    buttonStart.style.marginLeft = '20px';
    buttonStart.style.backgroundColor = '#4CAF50';
    buttonStart.style.color = 'white';
    buttonStart.style.border = 'none';
    buttonStart.style.cursor = 'pointer';
    buttonStart.style.borderRadius = '12px';
    buttonStart.style.fontSize = '18px';
    buttonStart.textContent = 'Start';
    buttonStart.style.background = 'linear-gradient(to right, #ff0000, #ff7f7f)';
    buttonStart.style.color = 'white';
    buttonStart.style.border = 'none';
    buttonStart.style.cursor = 'pointer';
    buttonStart.style.borderRadius = '12px';
    buttonStart.style.fontSize = '20px';
    buttonStart.style.padding = '10px 20px';
    buttonStart.style.transition = 'background 0.3s';

    buttonContainer.append(buttonStart);
}

function createButtonClear() {
    let buttonClear = document.createElement('button');
    buttonClear.id = 'clearButton';
    buttonClear.title = 'Clear';
    buttonClear.textContent = 'Clear';
    buttonClear.style.zIndex = '2';
    buttonClear.style.height = '40px';
    buttonClear.style.width = '100px';
    buttonClear.style.position = 'static';
    buttonClear.style.top = '20%';
    buttonClear.style.right = '10%';
    buttonClear.style.background = 'linear-gradient(to right, #008000, #70db70)';
    buttonClear.style.color = 'white';
    buttonClear.style.border = 'none';
    buttonClear.style.cursor = 'pointer';
    buttonClear.style.borderRadius = '12px';
    buttonClear.style.fontSize = '20px';
    buttonClear.style.padding = '10px 20px';
    buttonClear.style.transition = 'background 0.3s';
    buttonClear.style.backgroundColor = '#f44336';
    buttonClear.style.color = 'white';
    buttonClear.style.border = 'none';
    buttonClear.style.cursor = 'pointer';
    buttonClear.style.borderRadius = '12px';
    buttonClear.style.fontSize = '18px';
    buttonClear.style.marginRight = '10px';
    buttonContainer.append(buttonClear);
}

// Функция создания поля
function createField(){
    let field = document.createElement('canvas'); // Создаем холст
    field.id = 'fieldCanvas'; // Устанавливаем id
    field.style.zIndex = '2'; // Устанавливаем z-index
    field.style.position = 'absolute'; // Устанавливаем позиционирование

    adjustFieldSize(field); // Настраиваем размер поля

    document.body.append(field); // Добавляем поле в тело документа

    // Добавляем слушатель событий на изменение размера окна
    window.addEventListener('resize', function() {
        adjustFieldSize(field); // Настраиваем размер поля
    });

}
// Функция настройки размера поля
function adjustFieldSize(field) {
    // Настраиваем ширину поля, чтобы она была 75% от ширины окна
    field.width = window.innerWidth * 0.7;

    // Настраиваем высоту поля, чтобы она соответствовала высоте окна
    var yOffset = 200; // высота заголовка
    field.height = Math.ceil((window.innerHeight - yOffset)/200)*200;

    // Выравниваем поле по левому краю экрана и оставляем место сверху для кнопок
    field.style.left = '5%'; // Отступ слева
    field.style.right = '30%'; // Отступ справа
    field.style.bottom = '15%'; // Увеличиваем отступ снизу
    field.style.top = '20%'; // Отступ сверху
}

function createColor() {
    let colorBolder = document.createElement("input");
    colorBolder.id = 'colorBolder';
    colorBolder.type = 'color';
    colorBolder.style.position = 'absolute';
    colorBolder.style.right = '10%';
    colorBolder.style.top = '25%';
    colorBolder.value = '#f8d703';
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
    document.body.append(sliderSize);
}

function createImgStart() {
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

function createImgFinish() {
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

function createColorTrace() {
    let traceColor = document.createElement('input');
    traceColor.type = 'color';
    traceColor.id = 'traceColor';
    traceColor.value = '#00a6ff';
    traceColor.style.position = 'absolute';
    traceColor.style.top = '45%';
    traceColor.style.right = '10%';
    traceColor.style.margin = '10px'; // Add margin
    document.body.append(traceColor);
}

function createGenerationMapButton() {
    let generationMap = document.createElement('button');
    generationMap.id = 'generationMap';
    generationMap.style.width = '100px';
    generationMap.style.height = '40px';
    generationMap.style.background = 'linear-gradient(to right, #032cc5, #4b6cb7)';
    generationMap.style.color = 'white';
    generationMap.style.border = 'none';
    generationMap.style.cursor = 'pointer';
    generationMap.style.borderRadius = '12px';
    generationMap.style.fontSize = '20px';
    generationMap.style.padding = '10px 20px';
    generationMap.style.transition = 'background 0.3s';
    generationMap.textContent = 'Generate';
    generationMap.style.textAlign = 'center';
    generationMap.style.position = 'absolute';
    generationMap.style.top = '45%';
    generationMap.style.right = '20%';
    generationMap.style.margin = '10px';
    document.body.append(generationMap);

    // Add hover effect
    generationMap.onmouseover = function () {
        this.style.background = 'linear-gradient(to right, #4b6cb7, #032cc5)';
    }
    generationMap.onmouseout = function () {
        this.style.background = 'linear-gradient(to right, #032cc5, #4b6cb7)';
    }
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

function deleteColor() {
    document.getElementById('colorBolder').remove();
}

function createVisualizationA_star(functionName) {
    createField();
    createButtonClear();
    createButtonStart(functionName);

    document.body.append(buttonContainer);
    createSliderSize();
    createImgFinish();
    createImgStart();
    createColor();
    createGenerationMapButton();
    createColorTrace();


    creatArea();


    use = 1;
}

function returnCoordinate() {
    startCoordinate = [];
    finishCoordinate = [];
}

function deleteVisualizationA_star() {
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

function manageA_star(functionName) {
    if (!use && firstUse) {
        createVisualizationA_star(functionName);
        document.getElementById('startButton').addEventListener("click", () => {
            clearField();
            drawMapByMatrix(matrixA_star);
            launch(document.getElementById('startButton').value)
        });
        firstUse = false;
    } else if (!use && !firstUse) {
        deleteVisualizationA_star();
        createVisualizationA_star();
    } else {
        deleteVisualizationA_star();
        firstUse = true;
    }
}

function drawMapByMatrix(matrix) {
    let canvas = document.getElementById('fieldCanvas');
    let canvasField = canvas.getContext('2d');
    let slider = document.getElementById('slider');
    for (let i = 0; i < col; i++)
        for (let j = 0; j < row; j++)
            if (matrix[i][j] === 1) {
                canvasField.fillRect(j * slider.value, i * slider.value, slider.value, slider.value);
            }
}

function clearField() {
    let canvas = document.getElementById('fieldCanvas');
    let canvasField = canvas.getContext('2d');
    canvasField.clearRect(0, 0, canvas.width, canvas.height);
}

function launch(functionName) {
    switch (functionName) {
        case ('AStar'):
            if (startCoordinate[0] === undefined && finishCoordinate[0] === undefined)
                alert('Вы не установили старт и финиш');
            else if (startCoordinate[0] === undefined)
                alert('Вы не установили старт');
            else if (finishCoordinate[0] === undefined)
                alert('Вы не установили финиш');
            else if (startCoordinate[0] > row - 1 || startCoordinate[1] > col - 1 || startCoordinate[0] < 0
                || startCoordinate[1] < 0)
                alert('установите старт на поле' + col + ' : ' + row);

            else if (finishCoordinate[0] > row - 1 || finishCoordinate[1] > col - 1 || finishCoordinate[0] < 0
                || finishCoordinate[1] < 0)
                alert('установите финиш на поле');
            else {
                let result = aStarSearch(matrixA_star, [startCoordinate[1], startCoordinate[0]], [finishCoordinate[1], finishCoordinate[0]]);
                console.log(matrixA_star);
                console.log(result);
                managePath(result);
            }

    }
}