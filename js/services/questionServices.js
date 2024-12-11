import { QUESTIONS } from '../data.js'

export const questionService = {
    getQuestions() {
        return QUESTIONS
    },

    validateAnswer(questionId, selectedAnswer) {
        const question = QUESTIONS.find(q => q.id === questionId)
        return question.answers.find(a => a.text === selectedAnswer)?.correct || false
    },

    renderQuestionContent(question, questionIndex) {
        return `
            <form id="form-question-${questionIndex + 1}">
                <div class="mb-3">
                    <label>${question.text}</label>
                    ${question.answers.map((answers, answersIndex) =>`
                        <div class="form-check">
                            <input class="form-check-input" type="radio"
                                name="question-${questionIndex + 1}"
                                id="question-${questionIndex + 1}-${answersIndex}"
                                value="${answers.correct}">
                            <label class="form-check-label" for="question-${questionIndex + 1}-${answersIndex}">
                                ${answers.text}
                            </label>
                        </div>
                    `).join('')}
                </div>
            </form>
        `
    }
}