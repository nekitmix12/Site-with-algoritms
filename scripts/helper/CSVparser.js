//парсер для treeAlgorithm
class CSVParser {
    constructor() {
        // Функция для проверки, является ли строка числом
        this.numberCheck = function (str) {
            return !isNaN(Number(str));
        }
    }

    static getInstance() {
        // Если экземпляр класса не существует, создаем его
        if (!CSVParser.instance) {
            CSVParser.instance = new CSVParser();
        }

        // Возвращаем экземпляр класса
        return CSVParser.instance;
    }

    parseInputData(inputData) {
        let column = 0;
        let row = 0;
        let parameterLen = 0;
        inputData = inputData.trim();

        const isNumber = [];
        let totalRows = 1;
        let curParameter = "";
        for (const char of inputData) {
            if (char === ",") {
                totalRows++;
                isNumber.push(this.numberCheck(curParameter));
                curParameter = "";
                continue;
            } else if (char === "\n") {
                isNumber.push(this.numberCheck(curParameter));
                break;
            }

            curParameter += char;
        }
        if (totalRows !== isNumber.length)
            isNumber.push(this.numberCheck(curParameter));

        // curParameter = "";
        const table = [];
        table.push(Array(totalRows).fill(""));
        for (const char of inputData) {
            if (char === ",") {
                if (!parameterLen || this.numberCheck(table[column][row]) !== isNumber[row])
                    return null;
                row++;
                parameterLen = 0;
                continue;
            } else if (char === "\n") {
                if (row !== totalRows - 1 || !parameterLen || this.numberCheck(table[column][row]) !== isNumber[row])
                    return null;
                table.push(Array(totalRows).fill(""));
                column++;
                row = 0;
                continue;
            }

            if (row >= totalRows)
                return null;

            table[column][row] += char;
            parameterLen++;
        }
        if (inputData[inputData.length - 1] === '\n')
            table.pop();
        else if (row !== totalRows - 1 || !parameterLen || this.numberCheck(table[column][row]) !== isNumber[row])
            return null;

        // Возвращаем таблицу
        return table;
    }
}

// Инициализируем экземпляр класса как null
CSVParser.instance = null;