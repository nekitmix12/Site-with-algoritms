
// Функция обрабатывает клики по canvas и добавляет новые точки
    function handleMouseClick(e) {
        // Получаем координаты клика относительно canvas
        let canvasBounds = e.target.getBoundingClientRect();
        let clientX = e.clientX - canvasBounds.left;
        let clientY = e.clientY - canvasBounds.top;
        const canvas = document.getElementById("fieldCanvas");
        let context = canvas.getContext("2d");
        // Рисование линии от новой точки до всех существующих точек
        context.beginPath();
        if (points.length >= 1) {
            points.forEach(vert => {
                let [vertX, vertY] = vert;
                let dx = clientX - vertX;
                let dy = clientY - vertY;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let offsetX = dx * 10 / distance;
                let offsetY = dy * 10 / distance;

                context.moveTo(vertX + offsetX, vertY + offsetY);
                context.lineTo(clientX, clientY);
                context.strokeStyle = "rgba(235,235,235,0.5)";
                context.stroke();
            });
        }

        // Рисуем новую точку (город)
        context.beginPath();
        context.arc(clientX, clientY, 15, 0, 2 * Math.PI, false);
        context.fill();

        // Добавляем новую точку в массив точек
        points.push([clientX, clientY]);
    }

// Функция рисует лучший найденный путь
    function drawPath(bestPath, color) {
        // Создаем копию лучшего пути и добавляем первый город в конец для замыкания пути
        const canvas = document.getElementById("fieldCanvas")
        const context = canvas.getContext("2d");
        const extendedPath = bestPath.slice();
        extendedPath.push(bestPath[0].slice());

        // Рисуем путь между городами
        for (let i = 0; i < extendedPath.length - 1; ++i) {
            const delta = [extendedPath[i + 1][0] - extendedPath[i][0], extendedPath[i + 1][1] - extendedPath[i][1]];
            const s = Math.sqrt(delta[0] * delta[0] + delta[1] * delta[1]);

            context.beginPath();
            context.moveTo(extendedPath[i][0] + delta[0] * 10 / s, extendedPath[i][1] + delta[1] * 10 / s);
            context.lineTo(extendedPath[i + 1][0] - delta[0] * 10 / s, extendedPath[i + 1][1] - delta[1] * 10 / s);

            context.strokeStyle = color;
            context.lineWidth = 10;
            context.stroke();
        }
    }

// Функция для перемешивания массива
    function shuffleArray(array) {
        const shuffled = array.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
        }
        return shuffled;
    }

// Функция для расчета общего расстояния пути
    function calculateDistance(chromosome) {
        // Суммируем расстояния между последовательными точками, замыкая путь в конце
        return chromosome.reduce((totalDistance, point, index) => {
            const nextPoint = chromosome[(index + 1) % chromosome.length];
            const deltaX = nextPoint[0] - point[0];
            const deltaY = nextPoint[1] - point[1];
            return totalDistance + Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        }, 0);
    }

// Функция для создания начальной популяции
    function createInitialPopulation(firstGeneration) {
        const population = [];
        const size = points.length * points.length;

        // Генерируем новую особь путем перемешивания первого поколения и добавляем расстояние
        const generateIndividual = () => {
            const individual = firstGeneration.slice();
            shuffleArray(individual);
            individual.push(calculateDistance(individual));
            return individual;
        };

        // Добавляем первое поколение и генерируем остальные особи
        population.push(firstGeneration.concat(calculateDistance(firstGeneration)));
        for (let i = 0; i < size; ++i) {
            population.push(generateIndividual());
        }

        return population;
    }

// Функция для выбора двух случайных чисел
    function twoRandomNumbers(min, max) {
        let a = Math.floor(Math.random() * (max - min) + min);
        let b;
        do {
            b = Math.floor(Math.random() * (max - min) + min);
        } while (a === b);
        return [a, b];
    }

// Функция для выбора одного случайного числа
    function randomNumber(min, max) {
        const range = max - min;
        const randomFraction = Math.random();
        return min + Math.floor(randomFraction * range);
    }

    let chromosomeLength;

// Функция для скрещивания двух особей с возможной мутацией
    function crossover(firstParent, secondParent) {
        let child = [];
        let [index1, index2] = twoRandomNumbers(0, firstParent.length - 1);
        child = firstParent.slice(index1, index2 + 1);

        // Добавляем недостающие точки из второго родителя
        secondParent.forEach(num => {
            if (!child.includes(num)) {
                child.push(num);
            }
        });

        // Применяем мутацию с вероятностью 10%
        if (Math.random() < 0.1) {
            const [i, j] = twoRandomNumbers(1, chromosomeLength - 1);
            [child[i], child[j]] = [child[j], child[i]];
        }

        return child;
    }

// Функция для создания потомства от двух родителей
    function breedOffspring(firstParent, secondParent) {
        let firstChild = crossover(firstParent, secondParent);
        let secondChild = crossover(secondParent, firstParent);

        // Вычисляем дистанцию для каждого потомка и добавляем ее к хромосоме
        const calculateAndPushDistance = (child) => {
            const distance = calculateDistance(child);
            child.push(distance);
            return child;
        };

        return [calculateAndPushDistance(firstChild), calculateAndPushDistance(secondChild)];
    }

// Функция для очистки canvas и всех данных
    function clearCanvas() {
        let canvas =document.getElementById("fieldCanvas");
        let context = canvas.getContext("2d");
        context.clearRect(0, 0,  canvas.width, canvas.height);
        points = [];
    }

// Функция для ожидания заданного времени
    async function waitAsync(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

// Функция генетического алгоритма
    async function geneticAlgorithm() {
        // Создаем первое поколение и вычисляем длину хромосомы
        let firstGeneration = points.slice();
        chromosomeLength = firstGeneration.length;

        // Создаем начальную популяцию и сортируем ее по расстоянию
        let population = createInitialPopulation(firstGeneration);
        population.sort((a, b) => a[a.length - 1] - b[b.length - 1]);

        // Запоминаем лучшую хромосому
        let bestChromosome = population[0].slice();

        // Переменная для отслеживания завершения алгоритма
        let finish = 5;

        // Основной цикл генетического алгоритма
        for (let i = 0; i < 10000; ++i) {
            // Уменьшаем размер популяции до изначального
            population = population.slice(0, points.length * points.length);

            // Создаем новое поколение потомков
            for (let j = 0; j < points.length * points.length; ++j) {
                const index1 = randomNumber(0, population.length - 1);
                const index2 = randomNumber(0, population.length - 1);
                const [child1, child2] = breedOffspring(
                    population[index1].slice(0, population[index1].length - 1),
                    population[index2].slice(0, population[index2].length - 1)
                );
                population.push(child1);
                population.push(child2);
            }

            // Сортируем популяцию по расстоянию
            population.sort((a, b) => a[a.length - 1] - b[b.length - 1]);

            // Если нашли лучшую хромосому, обновляем bestChromosome и сбрасываем счетчик finish
            if (JSON.stringify(bestChromosome) !== JSON.stringify(population[0])) {
                bestChromosome = population[0].slice();
                finish = 5;
            }

            // Каждые 100 итераций уменьшаем счетчик finish
            if (i % 100 === 0) {
                finish -= 1;
            }

            // Если счетчик finish достиг нуля, завершаем алгоритм
            if (finish === 0) {
                drawPath(bestChromosome, "rgb(0,0,0)");
                break;
            }

            // Ожидаем, чтобы не блокировать главный поток
            await waitAsync(0);
        }
    }
