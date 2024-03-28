let matrixA_star;
let startCoordinate = [];
let finishCoordinate = [];
let row;
let col;
let sliderValue;
function creatArea(aStarSearch) {
    let canvas = document.getElementById('fieldCanvas');
    let buttonClear = document.getElementById('clearButton');
    let imgStart = document.getElementById('startImg');
    let imgFinish = document.getElementById('finishImg');
    let slider = document.getElementById('slider');
    let borderColor = document.getElementById('colorBolder');
    let borderGeneration = document.getElementById('generationMap');
    borderColor = "grey";
    document.getElementById('colorBolder').oninput = function () {
        borderColor = this.value;
    }

    let canvasField = canvas.getContext('2d');



    slider.addEventListener('input', sliderManage);
    buttonClear.addEventListener("click", buttonClearManege);
    borderGeneration.addEventListener('click',borderGenerationManege);

    createMatrix();


    function borderGenerationManege(){
        clearField();
        updateMatrix();
        matrixA_star = generateMaze(0.6);
        drawMapByMatrix(matrixA_star);
    }
    function sliderManage() {
        sliderValue = slider.value;
        clearField();
        updateMatrix();
        createMatrix();
        changeSizeIcons();
    }
    function buttonClearManege() {
        updateMatrix();
        clearField();
    }
    function updateMatrix() {
        createMatrix();
    }
    function clearField(){
        canvasField.clearRect(0, 0, canvas.width, canvas.height);
    }
    function drawMapByMatrix(matrix){
        let canvas = document.getElementById('fieldCanvas');
        let canvasField = canvas.getContext('2d');

        for(let i = 0;i<col;i++)
            for(let j = 0;j<row;j++)
                if(matrix[i][j] === 1){
                    canvasField.fillRect(j*slider.value,i*slider.value,slider.value,slider.value);
                }
    }

    function  changeSizeIcons(){
        document.getElementById('startImg').style.width  = slider.value + 'px';
        document.getElementById('finishImg').style.width = slider.value + 'px';
    }
    function createMatrix() {
        row = Math.floor(canvas.width / slider.value);
        col = Math.floor(canvas.height / slider.value);

        // Adjust the canvas size to fit the squares
        canvas.width = row * slider.value;
        canvas.height = col * slider.value;

        matrixA_star = new Array(col);
        for (let i = 0; i < col; i++) {
            matrixA_star[i] = new Array(row);
            for (let j = 0; j < row; j++) {
                matrixA_star[i][j] = 0;
            }
        }
    }

    function createBlock(event) {
        let matrixX = Math.floor(event.offsetX / slider.value);
        let matrixY = Math.floor(event.offsetY / slider.value);
        console.log(event.offsetX);
        console.log(event.offsetY);
        console.log(matrixX);
        console.log(matrixY);
        let correctX = matrixX * slider.value;
        let correctY = matrixY * slider.value;

        canvasField.fillStyle = borderColor;
        canvasField.fillRect(correctX, correctY, slider.value, slider.value);

        //canvasField.fill();
        matrixA_star[matrixY][matrixX] = 1;
        console.log(matrixA_star);
    }

    canvas.onmousedown = function (event) {
        // Calculate the block coordinates based on the mouse position and block size
        let matrixX = Math.floor(event.offsetX / slider.value);
        let matrixY = Math.floor(event.offsetY / slider.value);

        // Check if the block is already filled
        if (matrixA_star[matrixY][matrixX] === 1) {
            // The block is filled, so delete it

            // Set the fill color to the canvas color
            canvasField.fillStyle = 'white'; // Replace 'white' with the actual canvas color

            // Clear the block on the canvas
            canvasField.clearRect(matrixX * slider.value, matrixY * slider.value, slider.value, slider.value);

            // Fill the cleared area with the canvas color
            canvasField.fillRect(matrixX * slider.value, matrixY * slider.value, slider.value, slider.value);

            // Update the matrix
            matrixA_star[matrixY][matrixX] = 0;
        } else {
            // The block is not filled, so create it

            // Set the fill color to black
            canvasField.fillStyle = 'black'; // Replace 'black' with the actual block color

            // Draw the block on the canvas
            canvasField.fillRect(matrixX * slider.value, matrixY * slider.value, slider.value, slider.value);

            // Update the matrix
            matrixA_star[matrixY][matrixX] = 1;
        }

        canvas.onmousemove = function (event) {
            createBlock(event);
        }
        canvas.onmouseup = function () {
            canvas.onmousemove = null;
        }
        canvas.onmouseover = function () {
            canvas.onmousemove = null;
        }
    }


    imgStart.onmousedown = function (event) {

        let shiftX = event.clientX - imgStart.getBoundingClientRect().left;
        let shiftY = event.clientY - imgStart.getBoundingClientRect().top;

        document.body.append(imgStart);

        moveAt(event.pageX, event.pageY);

        // переносит мяч на координаты (pageX, pageY),
        // дополнительно учитывая изначальный сдвиг относительно указателя мыши
        function moveAt(pageX, pageY) {
            imgStart.style.left = pageX - shiftX + 'px';
            imgStart.style.top = pageY - shiftY + 'px';
        }


        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
            startCoordinate[0] = Math.floor((event.pageX - canvas.getBoundingClientRect().x) / slider.value);
            startCoordinate[1] = Math.floor((event.pageY - canvas.getBoundingClientRect().y) / slider.value);
            console.log(startCoordinate);
        }

        // передвигаем мяч при событии mousemove
        document.addEventListener('mousemove', onMouseMove);

        // отпустить мяч, удалить ненужные обработчики
        imgStart.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            imgStart.onmouseup = null;
        };

    };

    imgStart.ondragstart = function () {
        return false;
    };

    imgFinish.onmousedown = function (event) {

        let shiftX = event.clientX - imgFinish.getBoundingClientRect().left;
        let shiftY = event.clientY - imgFinish.getBoundingClientRect().top;

        imgFinish.style.position = 'absolute';
        imgFinish.style.zIndex = '1000';
        document.body.append(imgFinish);

        moveAt(event.pageX, event.pageY);

        // переносит мяч на координаты (pageX, pageY),
        // дополнительно учитывая изначальный сдвиг относительно указателя мыши
        function moveAt(pageX, pageY) {
            imgFinish.style.left = pageX - shiftX + 'px';
            imgFinish.style.top = pageY - shiftY + 'px';
        }


        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
            finishCoordinate[0] = Math.floor((event.pageX - canvas.getBoundingClientRect().x) / slider.value);
            finishCoordinate[1] = Math.floor((event.pageY - canvas.getBoundingClientRect().y) / slider.value);
            console.log(finishCoordinate);
        }

        // передвигаем мяч при событии mousemove
        document.addEventListener('mousemove', onMouseMove);

        // отпустить мяч, удалить ненужные обработчики
        imgFinish.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            imgFinish.onmouseup = null;
        };

    };

    imgFinish.ondragstart = function () {
        return false;
    };

}


function managePath(array){
    let canvas = document.getElementById('fieldCanvas');
    let slider = document.getElementById('slider');
    let img =  document.createElement('img');
    let canvasField = canvas.getContext('2d');
    img.src = 'resources/penguin-svgrepo-com.svg';
    img.style.position = 'absolute';

    img.onload = ()=>{
        for(let i =0;i<array.length;i++){
            setTimeout(createPixel(img,array[i][0]*slider.value,array[i][1]*slider.value,canvasField,slider.value),110240100);

            //setTimeout(()=>canvasField.fillRect(array[i][0]*slider.value, array[i][1]*slider.value, slider.value, slider.value),1000);
            console.log(array);
        }
    }
}

function createPixel(img,x,y,field,size,){
    field.drawImage(img,x,y,size,size);
}