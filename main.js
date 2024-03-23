import {aStarSearch} from "./A_star.js"


var canvas = document.getElementById('c1');
var ctx = canvas.getContext('2d');
var myColor = "red";
let matrix;

var button = document.getElementById('clearButton');

button.onclick = function(){
    clearValue();
}

var slider = document.getElementById('slider');
slider.addEventListener('input',clearValue);
slider.addEventListener('input',createMatrix);
slider.addEventListener('input',createMatrix);

let startImg = document.getElementById('startImg');
startImg.width = slider.value;
let startCoordinate = [];

let finishImg = document.getElementById('finishImg');
finishImg.width = slider.value * 0.8;
let finishCoordinate = [];



function changeOnCorrectVaue(){
    finishImg.width = slider.value * 0.8;
    startImg.width = slider.value;
}

function clearValue(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
}

function createMatrix(){
    let row = Math.floor(canvas.width / slider.value);
    let col = Math.floor(canvas.height/ slider.value);
    
    matrix = new Array(col + 1);            
    for (var i = 0; i < col + 1; i++) {
        matrix[i] = new Array(row + 1);
        for (var j =0;j<row + 1;j++){
            matrix[i][j]=0;
        }     
    }

}

document.getElementById('color').oninput = function(){
    myColor = this.value;
}

createMatrix();

function createBlock(event){
    let col = canvas.width / slider.value;
    let row = canvas.height/ slider.value;
    
    let matrixX = Math.floor(event.offsetX/slider.value);
    let matrixY = Math.floor(event.offsetY/slider.value);

    let correctX= matrixX * slider.value;
    let correctY= matrixY * slider.value;

    ctx.fillRect(correctX,correctY,slider.value,slider.value);
    ctx.fillStyle = myColor;
    ctx.fill();
    console.log(matrixX);
    console.log(matrixY);
    matrix[matrixY][matrixX]=1;
    console.log(matrix);
}

canvas.onmousedown= function (event){     
   
    createBlock(event);
    canvas.onmousemove = function(event){
        createBlock(event);
    }
    canvas.onmouseup = function(){
        canvas.onmousemove = null; 
    }
    canvas.onmouseover = function(){
        canvas.onmousemove = null; 
    }
}




startImg.onmousedown = function(event) {

    let shiftX = event.clientX - startImg.getBoundingClientRect().left;
    let shiftY = event.clientY - startImg.getBoundingClientRect().top;
  
    startImg.style.position = 'absolute';
    startImg.style.zIndex = 1000;
    document.body.append(startImg);
  
    moveAt(event.pageX, event.pageY);
  
    // переносит мяч на координаты (pageX, pageY),
    // дополнительно учитывая изначальный сдвиг относительно указателя мыши
    function moveAt(pageX, pageY) {
        startImg.style.left = pageX - shiftX + 'px';
        startImg.style.top = pageY - shiftY + 'px';
    }


    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
      startCoordinate[0] = Math.floor((event.pageX - canvas.getBoundingClientRect().x)/slider.value);
      startCoordinate[1] = Math.floor((event.pageY - canvas.getBoundingClientRect().y)/slider.value);
      console.log(startCoordinate);
    }
  
    // передвигаем мяч при событии mousemove
    document.addEventListener('mousemove', onMouseMove);
  
    // отпустить мяч, удалить ненужные обработчики
    startImg.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      startImg.onmouseup = null;
    };
  
  };
  
  startImg.ondragstart = function() {
    return false;
  };





 

  finishImg.onmousedown = function(event) {

    let shiftX = event.clientX - finishImg.getBoundingClientRect().left;
    let shiftY = event.clientY - finishImg.getBoundingClientRect().top;
  
    finishImg.style.position = 'absolute';
    finishImg.style.zIndex = 1000;
    document.body.append(startImg);
  
    moveAt(event.pageX, event.pageY);
  
    // переносит мяч на координаты (pageX, pageY),
    // дополнительно учитывая изначальный сдвиг относительно указателя мыши
    function moveAt(pageX, pageY) {
        finishImg.style.left = pageX - shiftX + 'px';
        finishImg.style.top = pageY - shiftY + 'px';
    }


    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
      startCoordinate[0] = Math.floor((event.pageX - canvas.getBoundingClientRect().x)/slider.value);
      startCoordinate[1] = Math.floor((event.pageY - canvas.getBoundingClientRect().y)/slider.value);
      console.log(startCoordinate);
    }
  
    // передвигаем мяч при событии mousemove
    document.addEventListener('mousemove', onMouseMove);
  
    // отпустить мяч, удалить ненужные обработчики
    finishImg.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      finishImg.onmouseup = null;
    };
  
  };
  
  finishImg.ondragstart = function() {
    return false;
  };

// Тест
const grid = [
    [0, 0, 0, 0, 1, 0],
    [0, 1, 1, 0, 0, 0],
    [2, 1, 0, 0, 3, 0],
    [0, 1, 0, 1, 0, 0]
];

const start = [2, 0]; // начальная позиция (2)
const goal = [2, 4]; // конечная позиция (3)
const result = aStarSearch(grid, start, goal);
console.log(result);





