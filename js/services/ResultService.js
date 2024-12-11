export default class ResultService {
    constructor() {
        this.answers = [];
        this.chart = null;
    }

    addAnswer(answer) {
        // Vérifier si la réponse n'existe pas déjà pour éviter les doublons
        const existingAnswer = this.answers.find(a => 
            a.text === answer.text && a.isCorrect === answer.isCorrect
        );

        if (!existingAnswer) {
            this.answers.push(answer);
        }
    }

    generateResultChart() {
        // Calculer le nombre de bonnes et mauvaises réponses
        const correctAnswers = this.answers.filter(answer => answer.isCorrect).length;
        const incorrectAnswers = this.answers.length - correctAnswers;

        // Récupérer le contexte du canvas
        const ctx = document.getElementById('my-chart').getContext('2d');

        // Détruire le graphique précédent s'il existe
        if (this.chart) {
            this.chart.destroy();
        }

        // Créer le nouveau graphique Doughnut
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Bonnes réponses', 'Mauvaises réponses'],
                datasets: [{
                    label: 'Résultats du Quiz',
                    data: [correctAnswers, incorrectAnswers],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)',  // Vert pour les bonnes réponses
                        'rgba(255, 99, 132, 0.6)'   // Rouge pour les mauvaises réponses
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Résultats du Quiz (${correctAnswers}/${this.answers.length})`,
                        font: {
                            size: 18
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const value = context.parsed;
                                const percentage = ((value / total) * 100).toFixed(2);
                                return `${context.label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Méthode pour réinitialiser le quiz
    resetQuiz() {
        this.answers = [];
        if (this.chart) {
            this.chart.destroy();
        }
    }

    // Calculer le score final
    getFinalScore() {
        const correctAnswers = this.answers.filter(answer => answer.isCorrect).length;
        return {
            total: this.answers.length,
            correct: correctAnswers,
            incorrect: this.answers.length - correctAnswers,
            percentage: ((correctAnswers / this.answers.length) * 100).toFixed(2)
        };
    }
}