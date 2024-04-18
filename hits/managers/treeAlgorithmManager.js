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

start_button.addEventListener('click', start);
reset_button.addEventListener('click', reset);
getFile_button.addEventListener('click', createTree);
optimize_button.addEventListener('click', optimize);

const fileInput = document.getElementById('file_input');
let isReady = true;
let root;
let rootCopy;

let treeRoot = document.getElementById("root");

function receiveData(csvText, separator = ",") {
    const matrix = [];
    const csvLines = csvText.split('\n');

    for (let line of csvLines) {
        const cells = line.split(separator).map(cell => cell.trim());

        if (cells.some(cell => !cell)) {
            alert("В файле есть пропуски, мне не нравится");
            return;
        }

        matrix.push(cells);
    }

    return matrix;
}

async function createTree() {
    treeRoot = removeTree();
    if (fileInput.value === '') {
        startTreeBuilding(getData(index));
        drawTree(root, treeRoot);
    } else {
        let dataBase = fileInput.files[0];
        let reader = new FileReader();
        reader.readAsText(dataBase);
        try {
            await new Promise((resolve, reject) => {
                reader.onload = resolve;
                reader.onerror = reject;
            });
            dataBase = receiveData(reader.result);
            startTreeBuilding(dataBase);
            drawTree(root, treeRoot);
        } catch (error) {
            console.error('Error reading file:', error);
        }
    }
    isReady = true;
}

function start() {
    if (isReady) {
        makeDecision()
    }
}

function reset() {
    treeRoot = removeTree(treeRoot);
}


function drawTree(currentNode, treeElement) {
    rootCopy = root;
    let li = document.createElement("li");
    let a = document.createElement("a");
    currentNode.a = a;
    a.href = "#";
    let nodeName = currentNode.name;
    if (nodeName === "root") {
        a.textContent = nodeName;
    } else {
        let feature = currentNode.parent.decisionMaker;
        a.textContent = feature + " : " + nodeName;
    }

    li.appendChild(a);
    treeElement.appendChild(li);
    if (currentNode.isleaf || currentNode.isLeaf()) {
        let finalUl = document.createElement("ul");
        let finalLi = document.createElement("li");
        let finalA = document.createElement("a");
        finalA.href = "#";
        finalA.textContent = currentNode.value;
        finalLi.appendChild(finalA);
        finalUl.appendChild(finalLi);
        li.appendChild(finalUl);

        return;
    }
    let ul = document.createElement("ul");
    li.appendChild(ul);
    for (let i = 0; i < currentNode.children.length; i++) {
        drawTree(currentNode.children[i], ul);
    }
}

// Асинхронная функция для оптимизации
async function optimize() {
    // Если состояние не готово, прекращаем выполнение функции
    if (!isReady) return;

    let data;
    // Если значение ввода файла пусто, получаем данные
    if (fileInput.value === '') {
        data = getData(index);
    } else {
        // Иначе, получаем файл из ввода файла
        const file = fileInput.files[0];
        // Читаем данные из файла
        data = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(receiveData(reader.result));
            reader.onerror = reject;
            reader.readAsText(file);
        }).catch(error => {
            // В случае ошибки при чтении файла, выводим ошибку в консоль
            console.error('Error reading file:', error);
        });
    }

    // Если данные не получены, прекращаем выполнение функции
    if (!data) return;

    // Создаем новый узел дерева с полученными данными и корнем 'root'
    root = new TreeNode(data, 'root');
    // Строим дерево из корня
    buildTree(root);
    // Оптимизируем дерево
    optimizeTree(root);

    // Получаем элемент с id 'root'
    const rootElement = document.getElementById("root");
    // Очищаем содержимое элемента
    rootElement.innerHTML = "";
    // Рисуем дерево с корнем root в элементе treeRoot
    drawTree(root, treeRoot);
}
// Функция для удаления дерева
function removeTree() {

    let divTree = document.getElementById("tree");
    // Удаляем корневой элемент дерева
    treeRoot.remove();
    // Создаем новый элемент ul
    let ul = document.createElement("ul");
    // Устанавливаем id нового элемента ul как "root"
    ul.setAttribute('id', 'root')
    // Добавляем новый элемент ul в divTree
    divTree.appendChild(ul);
    // Возвращаем новый элемент ul
    return ul;
}

// Рисуем дерево с корнем root в элементе treeRoot
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