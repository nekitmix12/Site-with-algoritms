class TreeNode {
    decisionMaker;
    a;

    constructor(data, name) {
        this.value;
        this.valuePercentage = undefined;
        this.decisionMaker;
        this.children = [];
        this.data = data;
        this.name = name;
        this.a;
        this.parent;
        this.isleaf = false;
    };

    isLeaf() {
        if (this.children === undefined)
            return true;
        return this.children.length === 0;

    }
}

// Создаем новый Set
let uniqueValsSet = new Set();

// Функция для начала построения дерева
function startTreeBuilding(matrix) {
    // Создаем корневой узел дерева
    root = new TreeNode(matrix, "root");
    // Строим дерево
    buildTree(root);
}

// Функция для построения дерева
function buildTree(currentNode) {
    // Выбираем параметр для разделения
    let splittingParameter = chooseSplittingParameter(currentNode.data);
    // Устанавливаем значение узла
    currentNode.value = splittingParameter["data"]["value"]["maxValue"];
    // Устанавливаем процентное значение узла
    currentNode.valuePercentage = splittingParameter["data"]["value"]["sure"];
    // Устанавливаем решающий параметр узла
    currentNode.decisionMaker = splittingParameter["feature"];
    // Проходим по всем массивам в данных разделения
    for (let featureVal in splittingParameter["data"]["arrays"]) {
        // Создаем новый узел дерева
        let treeNode = new TreeNode(splittingParameter["data"]["arrays"][featureVal]["array"], featureVal);
        // Устанавливаем родительский узел
        treeNode.parent = currentNode;
        // Если длина данных больше 2 и энтропия не равна 999, строим дерево дальше
        if (treeNode.data[0].length > 2 && splittingParameter["data"]['entropy'] !== 999) {
            buildTree(treeNode);
        } else {
            // Иначе устанавливаем узел как листовой
            treeNode.isleaf = true;
            treeNode.valuePercentage = 1;
            treeNode.value = treeNode.data[1][treeNode.data[1].length - 1];
        }
        // Добавляем узел в дети текущего узла
        currentNode.children.push(treeNode);
    }

}

// Асинхронная функция для принятия решения
async function makeDecision() {
    // Получаем введенные данные
    let string = document.getElementById('inputData').value;
    // Разделяем строку на массив
    let array = string.split(",");
    // Удаляем пробелы в начале и конце каждого элемента массива
    for (let i = 0; i < array.length; i++) {
        array[i] = array[i].trim();
    }
    // Устанавливаем текущий узел как корневой
    let currentNode = rootCopy;
    // Устанавливаем счетчик как длину данных корневого узла
    let counter = root.data[0].length;
    // Пока текущий узел не undefined
    while (currentNode !== undefined) {
        // Если узел не посещен
        if (!currentNode.visited) {
            // Устанавливаем узел как посещенный
            currentNode.visited = true;
            // Вызываем функцию градиента
            await gradient('rgb(242,161,4)', currentNode);
            // Ждем 100 мс
            await sleep(100);
            // Если у узла есть finalA
            if (currentNode.finalA !== undefined) {
                // Вызываем функцию градиента для finalA
                await gradientForFinal('rgb(242,161,4)', currentNode.finalA);
                // Ждем 100 мс
                await sleep(100);
            }
        }
        // Если функция doubleDecision возвращает не -1
        if (doubleDecision(currentNode, array) !== -1) {
            // Устанавливаем текущий узел как дочерний узел
            currentNode = currentNode.children[doubleDecision(currentNode, array)];
        } else {
            // Если текущий узел не undefined
            for (let j = 0; j < currentNode.children.length; j++) {
                // Если массив содержит имя дочернего узла или решающий параметр текущего узла равен последнему элементу данных корневого узла или решающий параметр текущего узла равен данным корневого узла
                if (array.includes(currentNode.children[j].name) || currentNode.decisionMaker === root.data[0][root.data[0].length - 1] || currentNode.decisionMaker === root.data[0][root.data]) {
                    // Устанавливаем текущий узел как дочерний узел
                    currentNode = currentNode.children[j];
                    break;
                }
            }
        }
        // Если текущий узел не undefined и его имя не "root" и решающий параметр родительского узла равен последнему элементу данных корневого узла и узел не посещен
        if (currentNode !== undefined && currentNode.name !== "root" && currentNode.parent.decisionMaker === root.data[0][root.data[0].length - 1] && !currentNode.visited) {
            // Устанавливаем узел как посещенный
            currentNode.visited = true;
            // Вызываем функцию градиента
            await gradient('rgb(242,161,4)', currentNode);
            break;
        }
        // Уменьшаем счетчик
        counter--;
        // Если счетчик меньше 0
        if (counter < 0) {
            break;
        }
    }
}

// Асинхронная функция для установки градиента для finalA
async function gradientForFinal(RGB, finalA) {
    // Получаем RGB
    let rgb = getRGB(RGB);
    // Устанавливаем цвет фона для finalA
    finalA.style.backgroundColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
    // Ждем 100 мс
    await sleep(100);
}

// Асинхронная функция для установки градиента для узла
async function gradient(RGB, node) {
    // Получаем RGB
    let rgb = getRGB(RGB);
    // Устанавливаем цвет фона для узла
    node.a.style.backgroundColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
    // Ждем 100 мс
    await sleep(100);
}

// Функция для получения RGB из строки
function getRGB(str) {
    // Создаем регулярное выражение для поиска чисел от 1 до 3 цифр
    let regex = /\d{1,3}/;
    let rgb = [];
    // Проходим по всем элементам строки
    for (let i = 0; i < 3; i++) {
        // Добавляем число в массив
        rgb[i] = parseFloat(regex.exec(str));
        // Удаляем найденное число из строки
        str = str.replace(regex, "")
    }
    // Возвращаем массив
    return rgb
}

// Функция для задержки выполнения кода на заданное количество миллисекунд
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Функция для принятия решения на основе текущего узла и массива
function doubleDecision(currentNode, array) {
    // Проверяем, определен ли текущий узел и его первый дочерний элемент
    if (currentNode !== undefined && currentNode.children[0] !== undefined) {
        // Если имя первого дочернего элемента начинается с "<"
        if (currentNode.children[0].name[0] === "<") {
            let num = currentNode.children[0].name;
            // Удаляем символ "<" из имени
            num = num.replace('<', '');
            // Проходим по всем элементам массива
            for (let j = 0; j < array.length; j++) {
                // Если элемент массива - число
                if (!isNaN(parseFloat(array[j]))) {
                    // Если число меньше num, возвращаем 0, иначе - 1
                    if (parseFloat(array[j]) < parseFloat(num)) {
                        return 0;
                    } else {
                        return 1;
                    }
                }
            }
        } else {
            // Если имя первого дочернего элемента не начинается с "<", возвращаем -1
            return -1;
        }
    }

}

function chooseSplittingParameter(matrix) {
    let featuresList = {};

    for (let i = 1; i < matrix.length; i++) {
        uniqueValsSet.add(matrix[i][matrix[i].length - 1]);
    }

    let currValue = decisionValue();

    for (let j = 0; j < matrix[0].length - 1; j++) {
        let featureDict = {};

        featureDict["isDouble"] = (isDouble(j));
        featureDict["entropy"] = undefined;
        featureDict["value"] = currValue;
        if (featureDict["isDouble"] === true) {
            let doubleResult = doubleData(j);

            featureDict["entropy"] = doubleResult["entropy"];
            if (featureDict["entropy"] !== 999) {
                let leftName = "<" + doubleResult["splittingParameter"],
                    rightName = ">=" + doubleResult["splittingParameter"];
                featureDict["arrays"] = [];
                featureDict["arrays"][leftName] = {"array": []};
                featureDict["arrays"][rightName] = {"array": []};

                let il = 0, ir = 0;
                for (let i = 1; i < matrix.length; i++) {
                    if (i === doubleResult["indexes"]["leftIndexes"][il] + 1) {
                        featureDict["arrays"][leftName]["array"].push(matrix[i]);
                        il++;
                    } else {
                        featureDict["arrays"][rightName]["array"].push(matrix[i]);
                        ir++;
                    }
                }
                if (featureDict["arrays"][leftName]["array"].length < 2) {
                    featureDict["arrays"].splice(leftName, 1);
                }
                if (featureDict["arrays"][rightName]["array"].length < 2) {
                    featureDict["arrays"].splice(rightName, 1);
                }
                featureDict["arrays"][leftName]["array"].splice(0, 0, matrix[0]);
                featureDict["arrays"][rightName]["array"].splice(0, 0, matrix[0]);
            }

        } else {
            featureDict["entropy"] = 0;
            featureDict["arrays"] = [];
            for (let i = 1; i < matrix.length; i++) {

                let featureVal = matrix[i][j];
                let celVal = matrix[i][matrix[0].length - 1];
                if (featureDict["arrays"][featureVal] === undefined) {
                    let celDict = {};
                    for (let val of uniqueValsSet) {
                        celDict[val] = 0;
                    }
                    celDict["array"] = [];
                    featureDict["arrays"][featureVal] = celDict;
                }
                featureDict["arrays"][featureVal][celVal] += 1;
                let neededArray = new Array(matrix[i].length);
                for (let k = 0; k < matrix[i].length; k++) {
                    neededArray[k] = matrix[i][k];
                }
                neededArray.splice(j, 1);

                featureDict["arrays"][featureVal]["array"].push(neededArray);
            }
            let neededArray = new Array(matrix[0].length);
            for (let k = 0; k < matrix[0].length; k++) {
                neededArray[k] = matrix[0][k];
            }
            neededArray.splice(j, 1);
            for (let featureVal in featureDict["arrays"]) {
                featureDict["arrays"][featureVal]["array"].splice(0, 0, neededArray);
            }
            featureDict["entropy"] += stringEntropy(j, featureDict);
        }
        featuresList[matrix[0][j]] = {"data": featureDict, "feature": matrix[0][j]};
    }


    let finalEntropy = 1000;
    let finalDecisionMaker = undefined;
    for (let feature in featuresList) {
        if (featuresList[feature]["data"]["entropy"] < finalEntropy) {
            finalEntropy = featuresList[feature]["data"]["entropy"];
            finalDecisionMaker = featuresList[feature];
        }

    }
    return finalDecisionMaker;


    function getBaseLog(base, num) {
        if (num === 0 || base === 0) return 0;
        return Math.log(num) / Math.log(base);
    }


    function doubleData(columnIndex) {
        // Создаем класс NumElem с конструктором, который принимает значение и celElem
        class NumElem {
            constructor(value, celElem) {
                this.value = parseFloat(value); // Преобразуем значение в число с плавающей точкой
                this.celElem = celElem; // Присваиваем celElem
            }
        }

        let numsSorted = []; // Создаем пустой массив для отсортированных чисел
        let nums = [] // Создаем пустой массив для чисел
        // Проходим по матрице, начиная со второго элемента
        for (let i = 1; i < matrix.length; ++i) {
            // Добавляем новый элемент NumElem в массивы nums и numsSorted
            nums.push(new NumElem(matrix[i][columnIndex], matrix[i][matrix[0].length - 1]));
            numsSorted.push(new NumElem(matrix[i][columnIndex], matrix[i][matrix[0].length - 1]));
        }

        // Сортируем массив numsSorted по значению
        numsSorted.sort((a, b) => a.value - b.value);

        // Удаляем дубликаты из массива numsSorted
        deleteCopies(numsSorted);

        let part1 = [], part2 = []; // Создаем два пустых массива
        // Добавляем в part2 все элементы numsSorted, начиная со второго
        for (let i = 1; i < numsSorted.length; ++i) {
            part2.push(numsSorted[i]);
        }

        part1.push(numsSorted[0]); // Добавляем первый элемент numsSorted в part1
        let finalEntropy = 999; // Инициализируем конечную энтропию как 999
        let borderIndex = undefined; // Инициализируем индекс границы как неопределенный

        // Проходим по всем элементам numsSorted, начиная со второго
        for (let i = 1; i < numsSorted.length; ++i) {

            // Если celElem текущего элемента не равен celElem предыдущего элемента
            if (numsSorted[i].celElem !== numsSorted[i - 1].celElem) {
                // Вычисляем текущую энтропию
                let currEntropy = part1.length / numsSorted.length * doubleEntropy(part1) + part2.length / numsSorted.length * doubleEntropy(part2);
                // Если текущая энтропия меньше конечной энтропии
                if (currEntropy < finalEntropy) {
                    finalEntropy = currEntropy; // Устанавливаем конечную энтропию как текущую энтропию
                    borderIndex = i; // Устанавливаем индекс границы как текущий индекс
                }
            }
            part2.splice(0, 1); // Удаляем первый элемент из part2
            part1.push(numsSorted[i]); // Добавляем текущий элемент в part1
        }
        let result = {}; // Создаем пустой объект для результата

        result["entropy"] = finalEntropy; // Устанавливаем энтропию результата
        result["indexes"] = {"rightIndexes": [], "leftIndexes": []}; // Инициализируем индексы результата
        if (borderIndex === undefined) { // Если индекс границы не определен
            borderIndex = 1; // Устанавливаем индекс границы как 1
        }
        if (numsSorted.length < 2) { // Если длина numsSorted меньше 2
            return result; // Возвращаем результат
        }
        // Устанавливаем параметр разделения результата как среднее значение между текущим и предыдущим элементами numsSorted
        result["splittingParameter"] = (numsSorted[borderIndex].value + numsSorted[borderIndex - 1].value) / 2;
        // Проходим по всем элементам nums
        for (let i = 0; i < nums.length; ++i) {
            // Если значение текущего элемента меньше параметра разделения результата
            if (nums[i].value < result["splittingParameter"]) {
                result["indexes"]["leftIndexes"].push(i); // Добавляем текущий индекс в leftIndexes результата
            } else {
                result["indexes"]["rightIndexes"].push(i); // Добавляем текущий индекс в rightIndexes результата
            }
        }
        return (result); // Возвращаем результат
    }
    function doubleEntropy(nums) {
        let cels = {};
        let localEntropy = 0;
        for (let val of uniqueValsSet) {
            cels[val] = 0;
        }

        for (let i = 0; i < nums.length; ++i) {
            cels[nums[i].celElem] += 1;
            // Вычисляем и уменьшаем локальную энтропию на произведение текущего значения на логарифм текущего значения, деленного на длину массива чисел
            localEntropy -= (cels[nums[i].celElem] / nums.length) * getBaseLog(2, cels[nums[i].celElem] / nums.length);
        }

        return localEntropy; // Возвращаем локальную энтропию
    }
    function deleteCopies(numsSorted) {

        for (let i = 1; i < numsSorted.length; ++i) {
            if (numsSorted[i - 1].value === numsSorted[i].value) {
                if (numsSorted[i - 1].celVal === numsSorted[i].celVal) {
                    numsSorted.splice(i, 1);
                    --i;
                }
            }
        }
    }


    function stringEntropy(featureNum, featureDict) {
        let finalEntropy = 0; // Инициализируем конечную энтропию как 0
        let size = 0; // Инициализируем размер как 0

        for (let val in featureDict["arrays"]) {
            let arrayLength = featureDict["arrays"][val]["array"].length;
            size += arrayLength;
            for (let celVal of uniqueValsSet) { // Проходим по всем значениям в uniqueValsSet
                let celValSize = featureDict["arrays"][val][celVal]; // Получаем размер текущего значения
                // Вычисляем и уменьшаем конечную энтропию на произведение размера текущего значения на логарифм размера текущего значения, деленного на размер, на длину текущего массива, деленную на размер
                finalEntropy -= (celValSize / size) * getBaseLog(2, celValSize / size) * arrayLength / size;
            }
        }

        return finalEntropy; // Возвращаем конечную энтропию
    }

    function decisionValue() {
        let valueCounts = {}; // Создаем пустой словарь
        let maxCount = -1; // Инициализируем максимальное количество как -1
        let maxVal = undefined; // Инициализируем максимальное значение как неопределенное
        let confidence = 0; // Инициализируем уверенность как 0,
        // но на деле уверенности полные штаны

        for (let val of uniqueValsSet) { // Проходим по всем значениям в uniqueValsSet
            valueCounts[val] = 0; // Устанавливаем каждое значение в словаре как 0
        }

        for (let i = 1; i < matrix.length; i++) { // Проходим по всем строкам матрицы, начиная со второй
            let currentVal = matrix[i][matrix[0].length - 1]; // Получаем текущее значение из последнего столбца текущей строки
            valueCounts[currentVal]++; // Увеличиваем количество текущего значения в словаре на 1

            if (valueCounts[currentVal] > maxCount) { // Если количество текущего значения больше максимального количества
                maxVal = currentVal; // Устанавливаем максимальное значение как текущее значение
                maxCount = valueCounts[currentVal]; // Устанавливаем максимальное количество как количество текущего значения
                confidence = maxCount / (matrix.length - 1); // Вычисляем уверенность как максимальное количество, деленное на количество строк в матрице минус 1
            }
        }

        return {"maxValue": maxVal, "sure": confidence}; // Возвращаем объект с максимальным значением и уверенностью, главное, га уверенности
    }

    function isDouble(columnIndex) { // Функция для проверки, являются ли все значения в столбце числами
        for (let i = 1; i < matrix.length; ++i) { // Проходим по всем строкам матрицы, начиная со второй
            if (isNaN(parseFloat(matrix[i][columnIndex]))) { // Если значение в текущем столбце текущей строки не является числом
                return false;
            }
        }
        return true; // Если все значения в столбце являются числами, возвращаем true
    }
}

let optimizeCount = 0;

function optimizeTree(node) {
    ++optimizeCount;
    let allChildrenSame = true; // Предполагаем, что все дочерние элементы одинаковы
    let curVal = undefined; // Текущее значение не определено

    if (node.children.length <= 0) { // Если у узла нет дочерних элементов, прекращаем выполнение функции
        return;
    }

    for (let i = 0; i < node.children.length; i++) { // Проходим по всем дочерним элементам
        if (node.children[i].valuePercentage < 1) { // Если процентное значение дочернего элемента меньше 1, все дочерние элементы не одинаковы
            allChildrenSame = false;
            break;
        }

        if (curVal !== undefined && node.children[i].value !== curVal) { // Если текущее значение определено и значение дочернего элемента не равно текущему, все дочерние элементы не одинаковы
            allChildrenSame = false;
            break;
        }

        curVal = node.children[i].value; // Устанавливаем текущее значение как значение дочернего элемента

        if (!allChildrenSame) { // Если все дочерние элементы не одинаковы, оптимизируем дочерний элемент
            optimizeTree(node.children[i]);
        }
    }

    if (allChildrenSame && node.children.length > 0) { // Если все дочерние элементы одинаковы и у узла есть дочерние элементы
        node.value = node.children[0].value; // Устанавливаем значение узла как значение первого дочернего элемента
        node.valuePercentage = node.children[0].valuePercentage; // Устанавливаем процентное значение узла как процентное значение первого дочернего элемента
        node.children = []; // Удаляем все дочерние элементы
        node.isleaf = true; // Устанавливаем узел как листовой
    }
}