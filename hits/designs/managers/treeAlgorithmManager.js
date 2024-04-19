document.getElementById('neuralNetworkButton').addEventListener('click', function () {

    location.replace('./nnAlgo.html');
});
document.getElementById('antButton').addEventListener('click', function () {

    location.replace('./index.html');
    manage('ant')

});
document.getElementById('clusterButton').addEventListener('click', function () {

    location.replace('./index.html');
    manage('cluster')

});
document.getElementById('AStarButton').addEventListener('click', function () {

    location.replace('./index.html');
    manage('AStar')

});


let root;
let copyOfRoot;
const inputFile = document.getElementById('file_input');
start_button.addEventListener('click', start);
reset_button.addEventListener('click', reset);
getFile_button.addEventListener('click', createTree);
optimize_button.addEventListener('click', optimize);
let isReady = true;

let celSet = new Set();

let treeRoot = document.getElementById("root");

function receiveData(csvText, sep = ",") {

    let matrix = [];
    let csvLines = csvText.split('\n');

    for (let i = 0; i < csvLines.length - 1; i++) {

        let line = csvLines[i];
        let cells = line.split(sep);

        let currRow = [];

        for (let j = 0; j < cells.length; j++) {

            cells[j] = cells[j].trim();

            if (cells[j].length === 0 || cells[j] === undefined) {
                alert("Файл с отступами, мне не нравится");
                return;
            }

            currRow.push(cells[j]);
        }

        matrix.push(currRow);
    }

    return matrix;
}

function createTree() {
    treeRoot = removeTree();

    if (inputFile.value === '') {
        alert("Файл пустой");
        return;
    }

    readFile(inputFile.files[0], function(dataBase) {
        startTreeBuilding(dataBase);
        drawTree(root, treeRoot);
    });

    isReady = true;
}

function readFile(file, callback) {
    let reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function () {
        let data = receiveData(reader.result);
        callback(data);
    }

    reader.onerror = function () {
        alert('Ошибка чтения файла');
    }
}
function start() {
    if (isReady) makeDecision();
}

function reset() {
    treeRoot = removeTree(treeRoot);
}

function drawTree(currentNode, treeElement) {
    copyOfRoot = root;

    let li = createListItem(currentNode);
    treeElement.appendChild(li);

    if (currentNode.isleaf || currentNode.isLeaf()) {
        appendLeafNode(li, currentNode);
        return;
    }

    let ul = document.createElement("ul");
    li.appendChild(ul);

    currentNode.childNodes.forEach(childNode => drawTree(childNode, ul));
}

function createListItem(currentNode) {
    let li = document.createElement("li");
    let a = document.createElement("a");
    currentNode.a = a;

    a.textContent = getNodeText(currentNode);
    li.appendChild(a);

    return li;
}

function getNodeText(currentNode) {
    if (currentNode.name === "root") {
        return currentNode.name;
    } else {
        let feature = currentNode.parent.decisionMaker;
        return `${feature} - ${currentNode.name}`;
    }
}

function appendLeafNode(li, currentNode) {
    let finalUl = document.createElement("ul");
    let finalLi = document.createElement("li");
    let finalA = document.createElement("a");

    finalA.textContent = currentNode.value;
    currentNode.finalA = finalA;

    finalLi.appendChild(finalA);
    finalUl.appendChild(finalLi);

    li.appendChild(finalUl);
}

function optimize() {

    if (isReady) {

        if (inputFile.value === '') {
            alert("Пустой файл");
            return;
        } else {

            let data = inputFile.files[0];
            let reader = new FileReader();
            reader.readAsText(data);

            reader.onload = function () {
                data = receiveData(reader.result);
                root = new Node(data, 'root');
            }
        }

        buildTree(root);
        optimizeTree(root);
        document.getElementById("root").innerHTML = "";
        drawTree(root, treeRoot);
    }
}

drawTree(root, treeRoot);

// Получаем элемент с id "root"
const list = document.getElementById('root');

// Добавляем обработчик события "wheel" (колесо мыши) для элемента list
list.addEventListener('wheel', function (event) {
    // Отменяем стандартное поведение события
    event.preventDefault();

    // Получаем направление прокрутки колеса мыши
    const delta = Math.sign(event.deltaY);
    // Получаем текущее значение масштаба элемента list или устанавливаем его равным 1, если оно не определено
    const zoomValue = parseFloat(window.getComputedStyle(list).zoom) || 1;

    // Если новое значение масштаба находится в диапазоне от 0.1 до 5
    if (zoomValue - delta > 0.1 && zoomValue - delta < 5) {
        // Устанавливаем новое значение масштаба для элемента list
        list.style.zoom = zoomValue - delta;
    }
});
let isDragging = false;
let initialMousePos = {x: 0, y: 0};
let initialScrollPos = {x: 0, y: 0};

list.addEventListener('mousedown', function (event) {
    isDragging = true;
    initialMousePos = {x: event.clientX, y: event.clientY};
    initialScrollPos = {x: list.scrollLeft, y: list.scrollTop};
});

list.addEventListener('mousemove', function (event) {
    if (isDragging) {
        const dx = event.clientX - initialMousePos.x;
        const dy = event.clientY - initialMousePos.y;
        list.scrollLeft = initialScrollPos.x - dx;
        list.scrollTop = initialScrollPos.y - dy;
    }
});

list.addEventListener('mouseup', function () {
    isDragging = false;
});

list.addEventListener('mouseleave', function () {
    isDragging = false;
});

function removeTree() {

    let divTree = document.getElementById("tree");
    treeRoot.remove();

    let ul = document.createElement("ul");
    ul.setAttribute('id', 'root')
    divTree.appendChild(ul);
    return ul;
}
