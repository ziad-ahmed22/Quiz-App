let bullets = document.querySelector('.bullets');
let qArea = document.querySelector('.question-area');
let qNums = document.querySelector('.question-num span');
let ansArea = document.querySelector('.answer-area');
let submitBtn = document.querySelector('.submit');
let counter = document.querySelector('.counter');

let curentIndex = 0;
let correctAnswer = 0;
let timerInterval;

fetch("quiz.json").then(response => response.json())
.then(data => {
    qNums.innerHTML = data.length;
    createBullets(data);
    activeBullets();
    question(data);
    answer(data);
    timer();

    submitBtn.addEventListener('click', () => {
        checkAnswer(data);

        clearInterval(timerInterval);
        timer()
        if (curentIndex <= data.length) {
            clearInterval(timerInterval);
            counter.innerHTML = "00 : 00";
        }
            

        if (curentIndex < data.length - 1) {
            curentIndex++;
            activeBullets();
            question(data);
            answer(data);
            timer()
        } else {
            submitFun(data);
        }
    });
});

function createBullets(data) {
    for (let i = 0; i < data.length; i++) {
        let span = document.createElement('span');
        bullets.appendChild(span);
    }
}
function activeBullets() {
    document.querySelectorAll('.bullets span')[curentIndex].classList.add('active');
}
function question(data) {
    qArea.innerHTML = "";

    let divNum = document.createElement('div');
    divNum.className = "question-num";
    divNum.appendChild(document.createTextNode(curentIndex + 1));
    qArea.appendChild(divNum);

    let divQ = document.createElement('div');
    divQ.className = "question";

    divQ.appendChild(document.createTextNode(data[curentIndex].question));
    qArea.appendChild(divQ);
}
function answer(data) {
    ansArea.innerHTML = "";
    let ansLength = Object.keys(data[curentIndex].answer).length;

    for (let i = 1; i <= ansLength; i++) {
        let divAns = document.createElement('div');
        divAns.className = "answer";
        
        let input = document.createElement('input');
        input.setAttribute('type', 'radio');
        input.setAttribute('name', 'answer');
        input.setAttribute('id', `ans${i}`);
        input.dataset.ans = data[curentIndex]["answer"][`ans${i}`];

        let label = document.createElement('label');
        label.htmlFor = `ans${i}`;
        label.innerHTML = data[curentIndex]["answer"][`ans${i}`];

        divAns.appendChild(input);
        divAns.appendChild(label);
        ansArea.appendChild(divAns);
    }
}
function checkAnswer(data) {
    let ansInput = document.querySelectorAll('.answer input');
    ansInput.forEach(inp => {
        if (inp.checked) {
            if (inp.dataset.ans === data[curentIndex].right_answer) {
                correctAnswer++;
            }
        }
    });
}
function submitFun(data) {
    qArea.remove();
    ansArea.remove();
    bullets.remove();
    submitBtn.remove();
    let div = document.createElement('div');
    div.className = 'grade';
    div.innerHTML = `Grade is: <span class="correct">( ${correctAnswer} )</span> of <span class="all-question">( ${data.length} )</spa`
    document.querySelector('.content').appendChild(div);
}
function timer() {
    let timeInSecond = 65;
    timerInterval = setInterval(() => {

        let minutes = Math.floor(timeInSecond / 60);
        let seconds = Math.floor(timeInSecond % 60);
        timeInSecond--;
        minutes < 10 ? minutes = `0${minutes}` : minutes = minutes;
        seconds < 10 ? seconds = `0${seconds}` : seconds = seconds;

        counter.innerHTML = `${minutes} : ${seconds}`;
        timeInSecond < 0 ? submitBtn.click() : "";
    }, 1000);
}
