window.onload=function() {
    let A_starButton = document.getElementById('AStarButton');
    A_starButton.addEventListener('click',()=>{ manageA_star('AStar')});
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


function createButtonStart(functionName){
    let buttonStart = document.createElement('button');
    buttonStart.id = 'startButton';
    buttonStart.value = functionName;
    buttonStart.style.zIndex = '2';
    buttonStart.style.height='40px';
    buttonStart.style.width = '100px';
    buttonStart.style.position='static';
    buttonStart.style.top = '20%';
    buttonStart.style.right = '15%';
    buttonStart.style.marginLeft = '20px';
    buttonStart.style.backgroundColor = '#4CAF50'; // Green
    buttonStart.style.color = 'white'; // White text
    buttonStart.style.border = 'none'; // No border
    buttonStart.style.cursor = 'pointer'; // Cursor changes to hand on hover
    buttonStart.style.borderRadius = '12px'; // Rounded corners
    buttonStart.style.fontSize = '18px'; // Larger font size
    buttonStart.textContent = 'Start';
    buttonStart.style.background = 'linear-gradient(to right, #ff0000, #ff7f7f)'; // Gradient background
    buttonStart.style.color = 'white'; // White text
    buttonStart.style.border = 'none'; // No border
    buttonStart.style.cursor = 'pointer'; // Cursor changes to hand on hover
    buttonStart.style.borderRadius = '12px'; // Rounded corners
    buttonStart.style.fontSize = '20px'; // Increase font size
    buttonStart.style.padding = '10px 20px'; // Add padding
    buttonStart.style.transition = 'background 0.3s';

    buttonContainer.append(buttonStart);
}
function createButtonClear(){
    let buttonClear = document.createElement('button');
    buttonClear.id = 'clearButton';
    buttonClear.title='Clear';
    buttonClear.textContent = 'Clear';
    buttonClear.style.zIndex = '2';
    buttonClear.style.height='40px';
    buttonClear.style.width = '100px';
    buttonClear.style.position='static';
    buttonClear.style.top = '20%';
    buttonClear.style.right = '10%';
    buttonClear.style.background = 'linear-gradient(to right, #008000, #70db70)'; // Gradient background
    buttonClear.style.color = 'white'; // White text
    buttonClear.style.border = 'none'; // No border
    buttonClear.style.cursor = 'pointer'; // Cursor changes to hand on hover
    buttonClear.style.borderRadius = '12px'; // Rounded corners
    buttonClear.style.fontSize = '20px'; // Increase font size
    buttonClear.style.padding = '10px 20px'; // Add padding
    buttonClear.style.transition = 'background 0.3s';
    buttonClear.style.backgroundColor = '#f44336'; // Red
    buttonClear.style.color = 'white'; // White text
    buttonClear.style.border = 'none'; // No border
    buttonClear.style.cursor = 'pointer'; // Cursor changes to hand on hover
    buttonClear.style.borderRadius = '12px'; // Rounded corners
    buttonClear.style.fontSize = '18px'; // Larger font size
    buttonClear.style.marginRight = '10px';
    buttonContainer.append(buttonClear);
}
function createField(){
    let field = document.createElement('canvas');
    field.id = 'fieldCanvas';
    field.style.zIndex = '2';
    field.style.position = 'absolute';

    adjustFieldSize(field);

    document.body.append(field);


    window.addEventListener('resize', function() {
        adjustFieldSize(field);
    });

}
function adjustFieldSize(field) {
    // Adjust the size of the field to be 75% of the window width
    field.width = window.innerWidth * 0.7;

    // Adjust the height of the field to fit the window height
    var yOffset = 200; // header height
    field.height = Math.ceil((window.innerHeight - yOffset)/200)*200;

    // Align the field with the left side of the screen and leave space on top for the buttons
    field.style.left = '5%'; // Padding from the left
    field.style.right = '30%'; // Padding from the right
    field.style.bottom = '15%'; // Increase padding from the bottom
    field.style.top = '20%'; // Padding from the top
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

function createColorTrace(){
    let traceColor = document.createElement('input');
    traceColor.type = 'color';
    traceColor.id='traceColor';
    traceColor.value = '#00a6ff';
    traceColor.style.position = 'absolute';
    traceColor.style.top = '45%';
    traceColor.style.right = '10%';
    traceColor.style.margin = '10px'; // Add margin
    document.body.append(traceColor);
}
function createGenerationMapButton(){
    let generationMap = document.createElement('button');
    generationMap.id = 'generationMap';
    generationMap.style.width = '100px'; // Increase width
    generationMap.style.height='40px'; // Increase height
    generationMap.style.background = 'linear-gradient(to right, #032cc5, #4b6cb7)'; // Gradient background
    generationMap.style.color = 'white'; // White text
    generationMap.style.border = 'none'; // No border
    generationMap.style.cursor = 'pointer'; // Cursor changes to hand on hover
    generationMap.style.borderRadius = '12px'; // Rounded corners
    generationMap.style.fontSize = '20px'; // Increase font size
    generationMap.style.padding = '10px 20px'; // Add padding
    generationMap.style.transition = 'background 0.3s'; // Add transition
    generationMap.textContent = 'Generate';
    generationMap.style.textAlign = 'center';
    generationMap.style.position = 'absolute';
    generationMap.style.top = '45%';
    generationMap.style.right = '20%';
    generationMap.style.margin = '10px'; // Add margin
    document.body.append(generationMap);

    // Add hover effect
    generationMap.onmouseover = function() {
        this.style.background = 'linear-gradient(to right, #4b6cb7, #032cc5)'; // Change gradient direction
    }
    generationMap.onmouseout = function() {
        this.style.background = 'linear-gradient(to right, #032cc5, #4b6cb7)'; // Restore original gradient direction
    }
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