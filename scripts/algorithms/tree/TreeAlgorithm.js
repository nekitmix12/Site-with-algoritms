class Node {

    constructor(data, name) {

        this.childNodes = [];
        this.value;
        this.valuePercentage = undefined;
        this.decisionMaker;
        this.data = data;
        this.name = name;
        this.parent;
        this.isleaf = false;
        this.htmlNode;

    };

    isLeaf() {
        return this.childNodes === undefined || this.childNodes.length === 0;
    }
}

let optimizeCount = 0;


function startTreeBuilding(matrix) {

    root = new Node(matrix, "root");

    buildTree(root);
}


function buildTree(node) {

    let splittingParameter = chooseSplittingParameter(node.data);
    node.value = splittingParameter["data"]["value"]["maxValue"];

    node.valuePercentage = splittingParameter["data"]["value"]["sure"];
    node.decisionMaker = splittingParameter["feature"];

    for (let featureVal in splittingParameter["data"]["arrays"]) {

        let treeNode = new Node(splittingParameter["data"]["arrays"][featureVal]["array"], featureVal);
        treeNode.parent = node;

        if (treeNode.data[0].length > 2 && splittingParameter["data"]['entropy'] !== 999) {
            buildTree(treeNode);
        } else {

            treeNode.isleaf = true;
            treeNode.valuePercentage = 1;
            treeNode.value = treeNode.data[1][treeNode.data[1].length - 1];
        }

        node.childNodes.push(treeNode);
    }
}

function makeDecision() {
    // Retrieve and process user input
    let userInput = document.getElementById('inputData').value;
    let processedInput = processUserInput(userInput);

    // Start from the root of the decision tree
    let currentNode = copyOfRoot;
    let maxIterations = root.data[0].length;

    // Iterate until a decision is made or the maximum number of iterations is reached
    while (currentNode !== undefined && maxIterations-- > 0) {
        if (!currentNode.visited) {
            highlightNode(currentNode, 'rgb(242,161,4)');
        }

        // Make a decision based on the current node and the processed input
        let decision = doubleDecision(currentNode, processedInput);
        if (decision !== -1) {
            currentNode = currentNode.childNodes[decision];
        } else {
            currentNode = findMatchingChildNode(currentNode, processedInput);
        }

        // If a decision has been made, highlight the current node and break the loop
        if (isDecisionMade(currentNode)) {
            currentNode.visited = true;
            highlightNode(currentNode, 'rgb(242,161,4)');
            break;
        }
    }
}

function processUserInput(userInput) {
    let inputArray = userInput.split(",");
    return inputArray.map(item => item.trim());
}

function highlightNode(node, color) {
    setRGBColor(color, node);
    if (node.finalA !== undefined) {
        setLeafColor(color, node.finalA);
    }
}

function findMatchingChildNode(node, processedInput) {
    for (let childNode of node.childNodes) {
        if (processedInput.includes(childNode.name) ||
            node.decisionMaker === root.data[0][root.data[0].length - 1] ||
            node.decisionMaker === root.data[0][root.data]) {
            return childNode;
        }
    }
    return null;
}

function isDecisionMade(node) {
    return node !== undefined &&
        node.name !== "root" &&
        node.parent.decisionMaker === root.data[0][root.data[0].length - 1] &&
        !node.visited;
}


function setRGBColor(RGB, node) {

    let rgb = parseRGB(RGB);

    if (node.a !== undefined) {
        node.a.style.backgroundColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
    }
}

function setLeafColor(RGB, finalA) {

    let rgb = parseRGB(RGB);
    finalA.style.backgroundColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
}

function parseRGB(rgbString) {

    let numberRegex = /\d{1,3}/;
    let rgbValues = [];


    for (let i = 0; i < 3; i++) {
        rgbValues[i] = parseFloat(numberRegex.exec(rgbString));
        rgbString = rgbString.replace(numberRegex, "");
    }

    return rgbValues;
}

function doubleDecision(currentNode, array) {

    if (currentNode !== undefined && currentNode.childNodes[0] !== undefined) {

        if (currentNode.childNodes[0].name[0] === "<") {

            let num = currentNode.childNodes[0].name;
            num = num.replace('<', '');

            for (let j = 0; j < array.length; j++) {

                if (!isNaN(parseFloat(array[j]))) {

                    if (parseFloat(array[j]) < parseFloat(num)) {
                        return 0;
                    } else {
                        return 1;
                    }
                }
            }
        } else {
            return -1;
        }
    }
}


function chooseSplittingParameter(matrix) {

    let featuresList = {};

    for (let i = 1; i < matrix.length; i++) {
        celSet.add(matrix[i][matrix[i].length - 1]);
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
                        ++il;
                    } else {
                        featureDict["arrays"][rightName]["array"].push(matrix[i]);
                        ++ir;
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

                    for (let val of celSet) {
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

    function doubleData(columnIngex) {

        class NumElem {

            constructor(value, celElem) {
                this.value = parseFloat(value);
                this.celElem = celElem;
            }

        };

        let numsSorted = [];
        let nums = []

        for (let i = 1; i < matrix.length; i++) {

            nums.push(new NumElem(
                matrix[i][columnIngex],
                matrix[i][matrix[0].length - 1]
            ));

            numsSorted.push(new NumElem(
                matrix[i][columnIngex],
                matrix[i][matrix[0].length - 1]
            ));
        }

        numsSorted.sort((a, b) => a.value - b.value);

        deleteCopies(numsSorted);

        let part1 = [], part2 = [];

        for (let i = 1; i < numsSorted.length; i++) {
            part2.push(numsSorted[i]);
        }

        part1.push(numsSorted[0]);

        let finalEntropy = 999;
        let borderIndex = undefined;

        for (let i = 1; i < numsSorted.length; i++) {

            if (numsSorted[i].celElem !== numsSorted[i - 1].celElem) {

                let currEntropy =
                    part1.length / numsSorted.length * doubleEntropy(part1) +
                    part2.length / numsSorted.length * doubleEntropy(part2);

                if (currEntropy < finalEntropy) {
                    finalEntropy = currEntropy;
                    borderIndex = i;
                }
            }

            part2.splice(0, 1);
            part1.push(numsSorted[i]);
        }

        let result = {};

        result["entropy"] = finalEntropy;
        result["indexes"] = {"rightIndexes": [], "leftIndexes": []};

        if (borderIndex === undefined) {
            borderIndex = 1;
        }

        if (numsSorted.length < 2) {
            return result;
        }

        result["splittingParameter"] = (numsSorted[borderIndex].value + numsSorted[borderIndex - 1].value) / 2;

        for (let i = 0; i < nums.length; ++i) {

            if (nums[i].value < result["splittingParameter"]) {
                result["indexes"]["leftIndexes"].push(i);
            } else {
                result["indexes"]["rightIndexes"].push(i);
            }
        }

        return (result);
    }

    function deleteCopies(numsSorted) {

        for (let i = 1; i < numsSorted.length; ++i) {

            if (numsSorted[i - 1].value === numsSorted[i].value) {

                if (numsSorted[i - 1].celVal === numsSorted[i].celVal) {
                    numsSorted.splice(i, 1);
                    i--;
                }
            }
        }
    }


    function stringEntropy(featureNum, featureDict) {

        let finalEntropy = 0;

        let size = 0;

        for (let val in featureDict["arrays"]) {
            size += featureDict["arrays"][val]["array"].length;
        }

        for (let val in featureDict["arrays"]) {

            for (let celVal of celSet) {

                finalEntropy -=
                    (featureDict["arrays"][val][celVal] / size) *
                    getBaseLog(2, featureDict["arrays"][val][celVal] / size) *
                    featureDict["arrays"][val]["array"].length / size;
            }
        }

        return finalEntropy;
    }


    function doubleEntropy(nums) {

        let cels = {};

        for (let val of celSet) {
            cels[val] = 0;
        }

        for (let i = 0; i < nums.length; i++) {
            cels[nums[i].celElem] += 1;
        }

        let localEntropy = 0;

        for (let val of celSet) {
            localEntropy -= (cels[val] / nums.length) * getBaseLog(2, cels[val] / nums.length);
        }

        return localEntropy;
    }


    function decisionValue() {

        let valueCounts = {};
        let maxCount = -1;
        let maxValue = undefined;

        for (let value of celSet) {
            valueCounts[value] = 0;
        }


        for (let i = 1; i < matrix.length; ++i) {
            ++valueCounts[matrix[i][matrix[0].length - 1]];
        }

        let proportion = 0;

        for (let value of celSet) {
            if (valueCounts[value] > maxCount) {
                maxValue = value;
                maxCount = valueCounts[value];
                proportion = valueCounts[value] / (matrix.length - 1);
            }
        }

        return {"maxValue": maxValue, "proportion": proportion};
    }

    function isDouble(columnIndex) {

        for (let i = 1; i < matrix.length; ++i) {

            if (isNaN(parseFloat(matrix[i][columnIndex]))) {
                return false;
            }
        }

        return true;
    }
}

function optimizeTree(node) {
    optimizeCount++;

    let areAllChildNodesSame = true;
    let currentValue = undefined;

    if (node.childNodes.length <= 0) {
        return;
    }

    for (let i = 0; i < node.childNodes.length; i++) {
        if (node.childNodes[i].valuePercentage < 1) {
            areAllChildNodesSame = false;
            break;
        }
    }

    for (let i = 0; i < node.childNodes.length; i++) {
        if (currentValue !== undefined) {
            if (node.childNodes[i].value !== currentValue) {
                areAllChildNodesSame = false;
                break;
            }
        } else {
            currentValue = node.childNodes[i].value;
        }
    }

    if (areAllChildNodesSame) {
        if (node.childNodes.length > 0) {
            node.value = node.childNodes[0].value;
            node.valuePercentage = node.childNodes[0].valuePercentage;
            node.childNodes = [];
            node.isleaf = true;
        }
    } else {

        for (let i = 0; i < node.childNodes.length; i++) {
            optimizeTree(node.childNodes[i]);
        }
    }
}