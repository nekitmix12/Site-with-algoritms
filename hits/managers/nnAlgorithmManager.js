document.getElementById('treeButton').addEventListener('click', function () {

    location.replace('./treeAlgo.html');
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
let valuesDiv = document.getElementById('values');

for (let i = 0; i < 10; i++) {
    let valDiv = document.createElement('div');
    valDiv.className = 'valdiv';

    let digitP = document.createElement('p');
    digitP.className = 'digit';
    digitP.id = 'ans_' + i;
    digitP.textContent = i + ': ';
    valDiv.appendChild(digitP);

    let digitValueP = document.createElement('p');
    digitValueP.className = 'digitvalue';
    digitValueP.id = 'digval_' + i;
    valDiv.appendChild(digitValueP);

    valuesDiv.appendChild(valDiv);

}
function removeHighlight(){
    for (let i = 0; i < 10; i++) {
        document.getElementById("digval_" + i).classList.remove('highlight');
    }
}
function highlightMaxValue() {
    let maxVal = -Infinity;
    let maxElem = null;

    for (let i = 0; i < 10; i++) {
        let elem = document.getElementById("digval_" + i);
        let val = parseFloat(elem.textContent);

        if (val > maxVal) {
            maxVal = val;
            maxElem = elem;
        }
    }

  removeHighlight()

    if (maxElem) {
        maxElem.classList.add('highlight');
    }
}