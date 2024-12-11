export default class QuizNavigation {
    constructor(quizService, resultService, questionRenderer) {
        this.quizService = quizService;
        this.resultService = resultService;
        this.questionRenderer = questionRenderer;
        this.currentStep = 1;
        this.totalSteps = 10;

        this.initializeNavigation();
        this.loadSavedAnswers();
    }

    initializeNavigation() {
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('previous-btn');
        const restartBtn = document.getElementById('restart-btn');
        
        nextBtn.addEventListener('click', () => this.goToNextStep());
        prevBtn.addEventListener('click', () => this.goToPreviousStep());
        
        // Ajouter un gestionnaire pour le bouton recommencer
        restartBtn.addEventListener('click', () => this.restartQuiz());
    
        // Cacher le bouton recommencer par défaut
        restartBtn.style.display = 'none';
    
        this.updateNavigationState();
        this.renderCurrentQuestion();
    }

    loadSavedAnswers() {
        for (let step = 1; step <= this.totalSteps; step++) {
            const savedAnswer = sessionStorage.getItem(`question-${step}-answer`);
            if (savedAnswer !== null) {
                const radioButton = document.querySelector(`input[name="question${step}"][value="${savedAnswer}"]`);
                if (radioButton) {
                    radioButton.checked = true;
                }
            }
        }
    }

    goToNextStep() {
        // Vérifier uniquement pour les questions réelles (pas la page de résultats)
        if (this.currentStep <= this.quizService.questions.length) {
            const currentQuestion = this.quizService.getQuestionById(this.currentStep);
            const selectedAnswer = document.querySelector(`input[name="question${this.currentStep}"]:checked`);
    
            if (selectedAnswer) {
                // Sauvegarder la réponse dans sessionStorage
                sessionStorage.setItem(`question-${this.currentStep}-answer`, selectedAnswer.value);
    
                const answer = currentQuestion.answers[selectedAnswer.value];
                this.resultService.addAnswer(answer);
                
                // Augmenter la barre de progression uniquement quand on passe à l'étape suivante
                this.updateProgressBar(this.currentStep);
                
                this.currentStep++;
                this.updateNavigationState();
                this.renderCurrentQuestion();
    
                // Activation de l'onglet suivant
                if (this.currentStep <= this.quizService.questions.length) {
                    const nextTabButton = document.getElementById(`question-${this.currentStep}-tab`);
                    const currentTabButton = document.getElementById(`question-${this.currentStep - 1}-tab`);
                    
                    if (nextTabButton) {
                        nextTabButton.disabled = false;
                        nextTabButton.click();
                    }
                    
                    if (currentTabButton) {
                        currentTabButton.classList.remove('active');
                    }
                }
    
                // Gestion de l'affichage des résultats
                if (this.currentStep > this.quizService.questions.length) {
                    const resultsTab = document.getElementById('results-tab');
                    const restartBtn = document.getElementById('restart-btn');
                    const nextBtn = document.getElementById('next-btn');
                    const prevBtn = document.getElementById('previous-btn');
                    
                    // Masquer les boutons suivant et précédent
                    if (nextBtn) nextBtn.style.display = 'none';
                    if (prevBtn) prevBtn.style.display = 'none';
                    
                    if (resultsTab) {
                        resultsTab.click();
                        this.resultService.generateResultChart();
                    }
    
                    // Réafficher le bouton recommencer
                    if (restartBtn) {
                        restartBtn.style.display = 'block';
                    }
                }
            } else {
                alert("Veuillez répondre à la question actuelle avant de passer à la suivante.");
            }
        }
    }

    goToPreviousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateNavigationState();
            this.renderCurrentQuestion();

            // Activation de l'onglet précédent
            const prevTabButton = document.getElementById(`question-${this.currentStep}-tab`);
            const currentTabButton = document.getElementById(`question-${this.currentStep + 1}-tab`);
            
            if (prevTabButton) {
                prevTabButton.click();
            }
            
            if (currentTabButton) {
                currentTabButton.classList.remove('active');
            }
        }
    }

    renderCurrentQuestion() {
        const currentQuestion = this.quizService.getQuestionById(this.currentStep);
        
        if (!currentQuestion) {
            console.error(`No question found for step ${this.currentStep}`);
            return;
        }
    
        this.questionRenderer.renderQuestion(currentQuestion);
        
        // Restaurer la réponse précédemment sélectionnée
        const savedAnswer = sessionStorage.getItem(`question-${this.currentStep}-answer`);
        if (savedAnswer !== null) {
            const radioButton = document.querySelector(`input[name="question${this.currentStep}"][value="${savedAnswer}"]`);
            if (radioButton) {
                radioButton.checked = true;
            }
        }
    }

    updateProgressBar(completedStep) {
        const progressBar = document.querySelector('.progress-bar');
        const percentage = Math.round((completedStep / this.totalSteps) * 100);
        progressBar.style.width = `${percentage}%`;
        progressBar.textContent = `${percentage}%`;
    }

    updateNavigationState() {
        document.getElementById('previous-btn').disabled = this.currentStep === 1;
        document.getElementById('next-btn').disabled = this.currentStep > this.totalSteps;
    }

    restartQuiz() {
        // Réinitialiser le service de résultats
        this.resultService.resetQuiz();
    
        // Réinitialiser la navigation
        this.currentStep = 1;
        this.updateNavigationState();
        this.renderCurrentQuestion();
    
        // Réafficher les boutons de navigation
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('previous-btn');
        const restartBtn = document.getElementById('restart-btn');
    
        nextBtn.style.display = 'block';
        prevBtn.style.display = 'block';
        restartBtn.style.display = 'none';
    
        // Réinitialiser la progression
        this.updateProgressBar(0);
    
        // Réactiver le premier onglet et désactiver les autres
        const firstTab = document.getElementById('question-1-tab');
        const resultsTab = document.getElementById('results-tab');
    
        if (firstTab) {
            firstTab.click();
            firstTab.classList.add('active');
        }
    
        if (resultsTab) {
            resultsTab.classList.remove('active');
        }
    
        // Désactiver tous les onglets sauf le premier
        for (let i = 2; i <= this.totalSteps; i++) {
            const tabButton = document.getElementById(`question-${i}-tab`);
            if (tabButton) {
                tabButton.disabled = true;
            }
        }
    
        // Décocher toutes les réponses
        for (let step = 1; step <= this.totalSteps; step++) {
            const radioButtons = document.querySelectorAll(`input[name="question${step}"]`);
            radioButtons.forEach(radio => {
                radio.checked = false;
            });
        }
    
        // Effacer le contenu des résultats
        const resultsContent = document.getElementById('results-content');
        resultsContent.innerHTML = `
            <div style="width: 50%; margin: auto; text-align: center;">
                <canvas id="my-chart" width="400" height="400"></canvas>
            </div>
        `;
    
        // Réinitialiser sessionStorage
        sessionStorage.clear();
    }
}