export const navigationService = {
    updateProgressBar(currentStep, totalSteps) {
        const progressBar = document.querySelector('.progress-bar')
        const percentage = Math.round((currentStep / totalSteps) * 100)

        progressBar.style.width = `${percentage}%`
        progressBar.textContent = `${percentage}%`
    },

    disableUnreachedTabs(currentIndex) {
        const tabs = document.querySelectorAll('nav-link')
        tabs.forEach((tab, index) => {
            tab.disabled = index > currentIndex
        })
    },

    activateTab(questionIndex) {
        const currentTab = document.getElementById(`question-${questionIndex + 1}-tab`)
        currentTab.click()
    }
}