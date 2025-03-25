// Cybersecurity Quiz - Enhanced Script.js for Performance and Features

document.addEventListener('DOMContentLoaded', function () {
    // Background video handling for better compatibility
    const bgVideo = document.getElementById('bg-video');
    if (bgVideo) {
        bgVideo.play().catch(error => console.warn('Autoplay blocked:', error));
    }

    // Define the ranks
    const ranks = [
        { name: "Newbie", threshold: 0, description: "You're just starting your cybersecurity journey. Keep learning!" },
        { name: "Script Kiddie", threshold: 0.2, description: "You're familiar with basic tools but need deeper understanding." },
        { name: "Security Enthusiast", threshold: 0.4, description: "You're building good security knowledge. Keep practicing!" },
        { name: "Security Analyst", threshold: 0.6, description: "You have solid security foundations and analytical skills." },
        { name: "Security Expert", threshold: 0.75, description: "You have extensive knowledge across multiple security domains." },
        { name: "Security Guru", threshold: 0.9, description: "You've mastered cybersecurity concepts. Few challenges can stump you!" }
    ];

    // Initialize UI elements
    const loadingElement = document.getElementById('loading');
    const categoriesView = document.getElementById('categories-view');
    const categoriesContainer = document.getElementById('categories-container');
    const quizView = document.getElementById('quiz-view');
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const feedbackElement = document.getElementById('feedback');
    const nextButton = document.getElementById('next-btn');
    const backToCategoriesButton = document.getElementById('back-to-categories-btn');
    const resetButton = document.getElementById('reset-btn');

    let currentQuestionIndex = 0;
    let questions = [];

    // Event Listeners
    nextButton.addEventListener('click', nextQuestion);
    backToCategoriesButton.addEventListener('click', backToCategories);
    resetButton.addEventListener('click', resetQuiz);

    // Event delegation for answer selection
    optionsElement.addEventListener('click', function (event) {
        const option = event.target.closest('.option');
        if (option) selectOption(option);
    });

    // Event delegation for category selection
    categoriesContainer.addEventListener('click', function (event) {
        const categoryCard = event.target.closest('.category-card');
        if (categoryCard) startCategoryQuiz(categoryCard.dataset.categoryId);
    });

    // Start quiz for selected category
    function startCategoryQuiz(categoryId) {
        quizView.classList.remove('hidden');
        categoriesView.classList.add('hidden');
        loadQuestions(categoryId);
    }

    // Function to load questions dynamically
    function loadQuestions(categoryId) {
        fetch(`questions/${categoryId}.json`)
            .then(response => response.json())
            .then(data => {
                questions = data;
                currentQuestionIndex = 0;
                displayQuestion(questions[currentQuestionIndex]);
            })
            .catch(error => console.error('Error loading questions:', error));
    }

    // Display a question
    function displayQuestion(question) {
        questionElement.innerHTML = question.question;
        optionsElement.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionEl = document.createElement('div');
            optionEl.className = 'option';
            optionEl.textContent = option;
            optionEl.dataset.index = index;
            optionsElement.appendChild(optionEl);
        });
        feedbackElement.innerHTML = '';
        nextButton.disabled = true;
    }

    // Handle option selection
    function selectOption(optionEl) {
        const selectedIndex = parseInt(optionEl.dataset.index);
        const correctIndex = questions[currentQuestionIndex].correctAnswer;

        if (selectedIndex === correctIndex) {
            optionEl.classList.add('correct');
            feedbackElement.innerHTML = '<p class="correct">✅ Correct!</p>';
        } else {
            optionEl.classList.add('incorrect');
            feedbackElement.innerHTML = `<p class="incorrect">❌ Incorrect! Correct answer: <strong>${questions[currentQuestionIndex].options[correctIndex]}</strong></p>`;
        }

        // Prevent multiple selections
        document.querySelectorAll('.option').forEach(opt => opt.classList.add('disabled'));
        nextButton.disabled = false;
    }

    // Move to the next question
    function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion(questions[currentQuestionIndex]);
        } else {
            alert('🎉 Quiz Completed! Great job!');
            backToCategories();
        }
    }

    // Reset quiz progress
    function resetQuiz() {
        localStorage.clear();
        alert('🔄 Quiz progress reset!');
        backToCategories();
    }

    // Return to categories view
    function backToCategories() {
        quizView.classList.add('hidden');
        categoriesView.classList.remove('hidden');
    }
});
