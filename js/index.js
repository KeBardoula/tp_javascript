import QuizService from './services/QuizService.js';
import ResultService from './services/ResultService.js';
import QuestionRenderer from './components/QuestionRenderer.js';
import QuizNavigation from './components/QuizNavigation.js';

document.addEventListener('DOMContentLoaded', () => {
    const quizService = new QuizService();
    const resultService = new ResultService();
    const questionRenderer = new QuestionRenderer();
    const quizNavigation = new QuizNavigation(quizService, resultService, questionRenderer);
});