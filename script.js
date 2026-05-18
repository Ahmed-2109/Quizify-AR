// --- QUIZ DATA ---
const quizData = [
    {
        question: "Which technology is Saiket Systems NOT primarily known for?",
        options: ["Cloud Computing", "Blockchain", "Artificial Intelligence", "Quantum Teleportation"],
        correct: 3
    },
    {
        question: "What is the primary purpose of using semantic HTML tags?",
        options: ["To make the code look pretty", "To provide meaning and structure to web content", "To speed up the internet", "To replace CSS"],
        correct: 1
    },
    {
        question: "Which CSS property is used to create a responsive grid layout?",
        options: ["display: block", "display: flex", "display: grid", "float: left"],
        correct: 2
    },
    {
        question: "In JavaScript, which method is used to select an element by its ID?",
        options: ["querySelector()", "getElementById()", "getElementByClass()", "Both A and B"],
        correct: 3
    },
    {
        question: "What does DOM stand for in web development?",
        options: ["Data Object Model", "Document Object Model", "Digital Ordinance Mode", "Desktop Object Management"],
        correct: 1
    },
    {
        question: "Which programming language is known as the 'language of the web'?",
        options: ["Python", "Java", "JavaScript", "C++"],
        correct: 2
    },
    {
        question: "What does 'API' stand for in software development?",
        options: ["Application Programming Interface", "Advanced Program Integration", "Automated Protocol Interaction", "App Process Indicator"],
        correct: 0
    },
    {
        question: "Which of these is a popular CSS framework for building responsive sites?",
        options: ["React", "Tailwind CSS", "Node.js", "MongoDB"],
        correct: 1
    },
    {
        question: "What is the main function of a 'Git' version control system?",
        options: ["To host websites", "To track changes in source code", "To compile JavaScript", "To design user interfaces"],
        correct: 1
    },
    {
        question: "Which HTTP status code represents 'Not Found'?",
        options: ["200", "404", "500", "302"],
        correct: 1
    }
];

// --- APP STATE ---
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;

// --- DOM ELEMENTS ---
const screens = {
    start: document.getElementById('start-screen'),
    quiz: document.getElementById('quiz-screen'),
    result: document.getElementById('result-screen')
};

const elements = {
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    currentQuestionNum: document.getElementById('current-question-num'),
    totalQuestionsNum: document.getElementById('total-questions-num'),
    totalQuestionsCount: document.getElementById('total-questions-count'),
    progressBarFill: document.getElementById('progress-bar-fill'),
    nextBtn: document.getElementById('next-btn'),
    startBtn: document.getElementById('start-btn'),
    restartBtn: document.getElementById('restart-btn'),
    finalScore: document.getElementById('final-score'),
    scoreCircle: document.getElementById('score-progress-circle'),
    resultEmoji: document.getElementById('result-emoji'),
    resultTitle: document.getElementById('result-title'),
    resultMessage: document.getElementById('result-message')
};

// --- INITIALIZATION ---
function init() {
    elements.totalQuestionsNum.textContent = quizData.length;
    elements.totalQuestionsCount.textContent = quizData.length;
    
    // Event Listeners
    elements.startBtn.addEventListener('click', startQuiz);
    elements.nextBtn.addEventListener('click', handleNextQuestion);
    elements.restartBtn.addEventListener('click', restartQuiz);
}

// --- CORE FUNCTIONS ---

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    showScreen('quiz');
    loadQuestion();
}

function loadQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
    selectedOption = null;
    elements.nextBtn.disabled = true;
    
    // Update Progress
    elements.currentQuestionNum.textContent = currentQuestionIndex + 1;
    const progress = ((currentQuestionIndex) / quizData.length) * 100;
    elements.progressBarFill.style.width = `${progress}%`;
    
    // Set Question Text with a small delay for animation feel
    elements.questionText.style.opacity = 0;
    setTimeout(() => {
        elements.questionText.textContent = currentQuestion.question;
        elements.questionText.style.opacity = 1;
    }, 200);
    
    // Clear and Load Options
    elements.optionsContainer.innerHTML = '';
    currentQuestion.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.style.animationDelay = `${index * 0.1}s`;
        optionElement.innerHTML = `
            <span class="option-index">${String.fromCharCode(65 + index)}</span>
            <span class="option-text">${option}</span>
        `;
        optionElement.addEventListener('click', () => selectOption(index, optionElement));
        elements.optionsContainer.appendChild(optionElement);
    });
}

function selectOption(index, element) {
    const allOptions = document.querySelectorAll('.option');
    allOptions.forEach(opt => opt.classList.remove('selected'));
    
    element.classList.add('selected');
    selectedOption = index;
    elements.nextBtn.disabled = false;
}

function handleNextQuestion() {
    if (selectedOption === null) return;
    
    if (selectedOption === quizData[currentQuestionIndex].correct) {
        score++;
    }
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    showScreen('result');
    
    // Update progress bar to 100%
    elements.progressBarFill.style.width = '100%';
    
    // Animate Score Number
    animateValue(elements.finalScore, 0, score, 1500);
    
    // Animate SVG Circle
    const percentage = (score / quizData.length);
    const circumference = 2 * Math.PI * 90; // r=90
    const offset = circumference - (percentage * circumference);
    
    setTimeout(() => {
        elements.scoreCircle.style.strokeDashoffset = offset;
    }, 100);
    
    // Customize result based on score
    if (percentage >= 0.8) {
        elements.resultEmoji.textContent = '🏆';
        elements.resultTitle.textContent = 'Outstanding!';
        elements.resultMessage.textContent = 'You are a true tech expert. Your boss will be impressed!';
    } else if (percentage >= 0.5) {
        elements.resultEmoji.textContent = '🥈';
        elements.resultTitle.textContent = 'Great Job!';
        elements.resultMessage.textContent = 'You have a solid foundation in modern technology.';
    } else {
        elements.resultEmoji.textContent = '📚';
        elements.resultTitle.textContent = 'Keep Learning';
        elements.resultMessage.textContent = 'Every expert was once a beginner. Keep pushing forward!';
    }
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function restartQuiz() {
    showScreen('start');
}

// Run Init
document.addEventListener('DOMContentLoaded', init);