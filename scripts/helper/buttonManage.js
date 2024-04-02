// Когда страница загружена, добавляем обработчики событий для кнопок
window.onload = function () {
    let A_starButton = document.getElementById('AStarButton');
    // При нажатии на кнопку A_starButton вызываем функцию manage с аргументом 'AStar'
    A_starButton.addEventListener('click', () => {
        manage('AStar')
    });
    let antButton = document.getElementById('antButton');
    // При нажатии на кнопку antButton вызываем функцию manage с аргументом 'ant'
    antButton.addEventListener('click', () => {
        manage('ant')
    });
}

// Инициализация переменных
let use = false; // Флаг использования
let lastFunction; // Последняя функция
let lastId; // Последний идентификатор

// Функция создания кнопки "Старт"
function createButtonStart(functionName) {
    let buttonStart = document.createElement('button');
    buttonStart.id = 'startButton';
    buttonStart.value = functionName;
    buttonStart.style.zIndex = '2';
    buttonStart.style.height = '40px';
    buttonStart.style.width = '100px';
    buttonStart.style.position = 'absolute';
    buttonStart.style.top = '20%';
    buttonStart.style.right = '15%';
    buttonStart.style.backgroundColor = '#1D1F20';
    buttonStart.style.color = '#FFFFFF';
    buttonStart.style.border = 'none';
    buttonStart.style.borderRadius = '20px';
    buttonStart.style.boxShadow = '0px 8px 15px rgba(0, 0, 0, 0.1)';
    buttonStart.style.transition = 'all 0.3s ease 0s';
    buttonStart.style.cursor = 'pointer';
    buttonStart.style.textAlign = 'center';
    buttonStart.textContent = 'Start';
    buttonStart.onmouseover = function() { this.style.backgroundColor = '#ff4757'; };
    buttonStart.onmouseout = function() { this.style.backgroundColor = '#1D1F20'; };
    document.body.append(buttonStart);
}
// Функция создания кнопки "Очистить"
function createButtonClear() {
    let buttonClear = document.createElement('button');
    buttonClear.id = 'clearButton';
    buttonClear.title = 'Clear';
    buttonClear.textContent = 'Clear';
    buttonClear.style.zIndex = '2';
    buttonClear.style.height = '40px';
    buttonClear.style.width = '100px';
    buttonClear.style.position = 'absolute';
    buttonClear.style.top = '20%';
    buttonClear.style.right = '10%';
    buttonClear.style.backgroundColor = '#1D1F20';
    buttonClear.style.color = '#FFFFFF';
    buttonClear.style.border = 'none';
    buttonClear.style.borderRadius = '20px';
    buttonClear.style.boxShadow = '0px 8px 15px rgba(0, 0, 0, 0.1)';
    buttonClear.style.transition = 'all 0.3s ease 0s';
    buttonClear.style.cursor = 'pointer';
    buttonClear.style.textAlign = 'center';
    buttonClear.onmouseover = function() { this.style.backgroundColor = '#ff4757'; };
    buttonClear.onmouseout = function() { this.style.backgroundColor = '#1D1F20'; };
    document.body.append(buttonClear);
}

// Функция создания поля
function createField() {
    let field = document.createElement('canvas');
    field.id = 'fieldCanvas';
    field.style.zIndex = '2';
    field.style.position = 'absolute';

    // Значения для изменения размера поля
    let xOffset = 600;
    let yOffset = 100; // Высота заголовка

    // 200 для того, чтобы одинаково хорошо работал и с
    field.width = Math.ceil((window.innerWidth - xOffset) / 10) * 10;
    field.height = Math.ceil((window.innerHeight - yOffset) / 10) * 10;
    field.style.left = '20%   ';
    field.style.right = '20%';
    field.style.bottom = '5%';
    field.style.top = '5%';
    document.body.append(field);
}

// Функция создания выбора цвета пользователя
function createColorUser() {
    let colorBolder = document.createElement("input");
    colorBolder.id = 'colorUser';
    colorBolder.type = 'color';
    colorBolder.style.position = 'absolute';
    colorBolder.style.right = '10%';
    colorBolder.style.top = '25%';
    colorBolder.value = '#173cd0';
    colorBolder.style.border = 'none';
    colorBolder.style.height = '40px';
    colorBolder.style.width = '40px';
    colorBolder.style.borderRadius = '50%';
    colorBolder.style.cursor = 'pointer';
    colorBolder.style.transition = 'all 0.3s ease 0s';

    document.body.append(colorBolder);
}
// Функция создания слайдера размера
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
// Функция создания изображения "Старт"
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

// Функция создания изображения "Финиш"
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

// Функция создания цвета границы
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

// Функция создания цвета следа
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

// Функция создания кнопки генерации карты
function createGenerationMapButton() {
    let generationMap = document.createElement('button');
    generationMap.id = 'generationMap';
    generationMap.style.width = '50px';
    generationMap.style.height = '20px';
    generationMap.style.backgroundColor = '#032cc5';
    generationMap.textContent = 'generationMap';
    generationMap.style.position = 'absolute';
    generationMap.style.top = '45%';
    generationMap.style.right = '20%';
    document.body.append(generationMap);
}

// Функция создания башни
function createTower() {
    let tower = document.createElement('img');
}

// Функция удаления цвета границы
function deleteColorBorder() {
    document.getElementById('borderColor').remove();
}

// Функция удаления цвета следа
function deleteColorTrace() {
    document.getElementById('traceColor').remove();
}

// Функция удаления кнопки генерации карты
function deleteGenerationMapButton() {
    document.getElementById('generationMap').remove();
}

// Функция удаления поля
function deleteField() {
    document.getElementById('fieldCanvas').remove();
}

// Функция удаления кнопки "Очистить"
function deleteButtonClear() {
    document.getElementById('clearButton').remove();
}

// Функция удаления кнопки "Старт"
function deleteButtonStart() {
    document.getElementById('startButton').remove();
}

// Функция удаления слайдера размера
function deleteSliderSize() {
    document.getElementById('slider').remove();
}

// Функция удаления изображения "Финиш"
function deleteImgFinish() {
    document.getElementById('finishImg').remove();
}

// Функция удаления изображения "Старт"
function deleteImgStart() {
    document.getElementById('startImg').remove();
}

// Функция удаления цвета пользователя
function deleteColorUser() {
    document.getElementById('colorUser').remove();
}

// Функция создания визуализации A_star
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

// Функция возврата координат
function returnCoordinate() {
    startCoordinate = [];
    finishCoordinate = [];
}

// Функция удаления визуализации A_star
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

// Функция создания визуализации Ant
function createVisualizationAnt(functionName) {
    createField();
    createButtonClear();
    createButtonStart(functionName);
    createSliderSize();
    createColorTrace();
    createColorUser();
    creatArea(functionName);
}

// Функция удаления визуализации Ant
function deleteVisualizationAnt() {
    deleteField();
    deleteButtonClear();
    deleteButtonStart();
    deleteSliderSize();
    returnCoordinate();
    deleteColorTrace();
    deleteColorUser();
}

// Функция управления
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
        }
        lastId = functionName;
        console.log(lastFunction + ' ' + use + ' ' + lastId + ';')
    }
}


function launch(functionName) {
    switch (functionName) {
        case ('AStar'):
            // Проверяем, установлены ли старт и финиш
            if (startCoordinate[0] === undefined && finishCoordinate[0] === undefined)
                alert('Вы не установили старт и финиш');
            // Проверяем, установлен ли старт
            else if (startCoordinate[0] === undefined)
                alert('Вы не установили старт');
            // Проверяем, установлен ли финиш
            else if (finishCoordinate[0] === undefined)
                alert('Вы не установили финиш' + finishCoordinate[0]);
            // Проверяем, находится ли старт в пределах поля
            else if (startCoordinate[0] > row - 1 || startCoordinate[1] > col - 1 || startCoordinate[0] < 0
                || startCoordinate[1] < 0)
                alert('установите старт на поле');
            // Проверяем, находится ли финиш в пределах поля
            else if (finishCoordinate[0] > row - 1 || finishCoordinate[1] > col - 1 || finishCoordinate[0] < 0
                || finishCoordinate[1] < 0)
                alert('установите финиш на поле');
            else {
                // Запускаем алгоритм A* и получаем результат
                let result = aStarSearch(matrixA_star, [startCoordinate[1], startCoordinate[0]], [finishCoordinate[1], finishCoordinate[0]]);
                // Проверяем, совпадают ли начальная и конечная точки с установленными
                if (result[0][0] !== startCoordinate [0]
                    || result[0][1] !== startCoordinate [1]
                    || result[result.length - 1][0] !== finishCoordinate[0]
                    || result[result.length - 1][1] !== finishCoordinate[1])
                    alert("нельзя простроить путь");
                else managePath(result); // Управляем путем

            }
            break;
        case('ant'):
            // Проверяем, добавлены ли города
            if (points.length === 0)
                alert('Добавьте города');
            // Проверяем, добавлено ли достаточное количество городов
            else if (points.length === 1)
                alert('Вы добавили слишком мало городов');
            else {
                // Запускаем алгоритм муравьиной колонии и получаем результат
                const {bestPath, shortestDistance} = antColonyOptimization(points, 5, 100, 1, 0.5, 100);
                // Преобразуем индексы в координаты
                let array = bestPath.map(index => points[index]);
                console.log("Shortest Path:", array); // Выводим кратчайший путь
                console.log("Shortest Distance:", shortestDistance); // Выводим кратчайшее расстояние
                createPath(array); // Создаем путь
            }
            break;

    }
}