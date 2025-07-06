// DOM Elements
const gradeInputs = document.getElementById('gradeInputs');
const addGradeBtn = document.getElementById('addGrade');
const weightedAverageEl = document.getElementById('weightedAverage');
const gradeProgressEl = document.getElementById('gradeProgress');
const calculateNeededBtn = document.getElementById('calculateNeeded');
const checkPanicBtn = document.getElementById('checkPanic');
const panicAlert = document.getElementById('panicAlert');
const panicMeme = document.getElementById('panicMeme');
const startTimerBtn = document.getElementById('startTimer');
const pauseTimerBtn = document.getElementById('pauseTimer');
const resetTimerBtn = document.getElementById('resetTimer');
const timerDisplay = document.getElementById('timerDisplay');
const timerStatus = document.getElementById('timerStatus');
const timerProgress = document.getElementById('timerProgress');
const memeContainer = document.getElementById('memeContainer');
const analyzeGradesBtn = document.getElementById('analyzeGrades');
const gradeHistory = document.getElementById('gradeHistory');
const analysisResults = document.getElementById('analysisResults');
const addSandboxRow = document.getElementById('addSandboxRow');
const sandboxGrades = document.getElementById('sandboxGrades');
const calculateWhatIf = document.getElementById('calculateWhatIf');
const finalGradeDisplay = document.getElementById('finalGradeDisplay');
const gradeVisual = document.getElementById('gradeVisual');

// Meme data
const studyMemes = [
    'https://i.imgflip.com/1bij.jpg',
    'https://i.imgflip.com/9vct.jpg',
    'https://i.imgflip.com/1bg0.jpg',
    'https://i.imgflip.com/1bim.jpg',
    'https://i.imgflip.com/1bg1.jpg'
];

const panicMemes = {
    low: 'https://i.imgflip.com/1bgw0.jpg',
    medium: 'https://i.imgflip.com/1bip.jpg',
    high: 'https://i.imgflip.com/1bg3.jpg',
    extreme: 'https://i.imgflip.com/1bg7.jpg'
};

// Timer variables
let timer;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isPaused = true;
let isBreak = false;
let studyTime = 25 * 60; // 25 minutes in seconds
let breakTime = 5 * 60; // 5 minutes in seconds

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners
    addGradeBtn.addEventListener('click', addGradeRow);
    calculateNeededBtn.addEventListener('click', calculateGradeNeeded);
    checkPanicBtn.addEventListener('click', checkPanicLevel);
    startTimerBtn.addEventListener('click', startTimer);
    pauseTimerBtn.addEventListener('click', pauseTimer);
    resetTimerBtn.addEventListener('click', resetTimer);
    analyzeGradesBtn.addEventListener('click', analyzeGradeHistory);
    addSandboxRow.addEventListener('click', addSandboxGradeRow);
    calculateWhatIf.addEventListener('click', calculateWhatIfGrade);
    
    // Add initial grade row
    addGradeRow();
    
    // Add initial sandbox row
    addSandboxGradeRow();
    
    // Update timer display
    updateTimerDisplay();
});

// Grade Calculator Functions
function addGradeRow() {
    const row = document.createElement('div');
    row.className = 'grade-row row g-3 mb-2';
    row.innerHTML = `
        <div class="col-md-5">
            <input type="number" class="form-control grade" placeholder="Grade (0-10)" step="0.1" min="0" max="10">
        </div>
        <div class="col-md-5">
            <div class="input-group">
                <input type="number" class="form-control weight" placeholder="Weight (%)" step="1" min="0" max="100">
                <span class="input-group-text">%</span>
            </div>
        </div>
        <div class="col-md-2">
            <button class="btn btn-danger remove-grade" type="button">Remove</button>
        </div>
    `;
    
    // Add event listener to the remove button
    const removeBtn = row.querySelector('.remove-grade');
    removeBtn.addEventListener('click', () => {
        row.remove();
        calculateWeightedAverage();
    });
    
    // Add event listeners to grade and weight inputs
    const gradeInput = row.querySelector('.grade');
    const weightInput = row.querySelector('.weight');
    
    gradeInput.addEventListener('input', calculateWeightedAverage);
    weightInput.addEventListener('input', calculateWeightedAverage);
    
    gradeInputs.appendChild(row);
    
    // Focus the new grade input
    gradeInput.focus();
}

function calculateWeightedAverage() {
    const rows = document.querySelectorAll('.grade-row');
    let totalWeight = 0;
    let weightedSum = 0;
    
    rows.forEach(row => {
        const grade = parseFloat(row.querySelector('.grade').value) || 0;
        const weight = parseFloat(row.querySelector('.weight').value) || 0;
        
        weightedSum += grade * (weight / 100);
        totalWeight += weight;
    });
    
    // Calculate weighted average (only if total weight is > 0)
    let weightedAverage = 0;
    if (totalWeight > 0) {
        weightedAverage = weightedSum / (totalWeight / 100);
    }
    
    // Update the UI
    if (!isNaN(weightedAverage) && totalWeight > 0) {
        weightedAverageEl.textContent = weightedAverage.toFixed(2);
        
        // Update progress bar
        const percentage = (weightedAverage / 10) * 100;
        gradeProgressEl.style.width = `${percentage}%`;
        
        // Set progress bar color based on grade
        if (weightedAverage >= 8) {
            gradeProgressEl.className = 'progress-bar bg-success';
        } else if (weightedAverage >= 6.5) {
            gradeProgressEl.className = 'progress-bar bg-primary';
        } else if (weightedAverage >= 5.5) {
            gradeProgressEl.className = 'progress-bar bg-warning';
        } else {
            gradeProgressEl.className = 'progress-bar bg-danger';
        }
    } else {
        weightedAverageEl.textContent = '-';
        gradeProgressEl.style.width = '0%';
    }
}

// Grade Needed Calculator
function calculateGradeNeeded() {
    const currentGrade = parseFloat(document.getElementById('currentGrade').value) || 0;
    const desiredGrade = parseFloat(document.getElementById('desiredGrade').value) || 5.5;
    const finalWeight = parseFloat(document.getElementById('finalWeight').value) || 50;
    
    if (finalWeight <= 0 || finalWeight > 100) {
        showAlert('Final weight must be between 1 and 100', 'danger');
        return;
    }
    
    const currentWeight = 100 - finalWeight;
    const currentContribution = currentGrade * (currentWeight / 100);
    const neededFinalGrade = (desiredGrade - currentContribution) / (finalWeight / 100);
    
    const resultEl = document.getElementById('neededAlert');
    
    if (neededFinalGrade <= 0) {
        resultEl.className = 'alert alert-success';
        resultEl.innerHTML = `You've already achieved your desired grade! 🎉<br>You don't need to take the final exam.`;
    } else if (neededFinalGrade > 10) {
        resultEl.className = 'alert alert-danger';
        resultEl.innerHTML = `It's impossible to achieve your desired grade. 😢<br>You would need a ${neededFinalGrade.toFixed(2)} on the final, but the maximum is 10.`;
    } else {
        resultEl.className = 'alert alert-info';
        resultEl.textContent = `You need to score at least ${neededFinalGrade.toFixed(2)} on the final exam.`;
    }
}

// Panic Level Meter
function checkPanicLevel() {
    const currentScore = parseFloat(document.getElementById('currentScore').value) || 0;
    const goalScore = parseFloat(document.getElementById('goalScore').value) || 5.5;
    const examWeight = parseFloat(document.getElementById('examWeight').value) || 30;
    
    if (currentScore >= goalScore) {
        panicAlert.className = 'alert alert-success';
        panicAlert.textContent = "You're on track! No need to panic. 😎";
        panicMeme.innerHTML = `<img src="${panicMemes.low}" class="img-fluid" alt="No panic meme">`;
        return;
    }
    
    const neededScore = (goalScore - (currentScore * (100 - examWeight) / 100)) / (examWeight / 100);
    
    if (neededScore <= 5.5) {
        panicAlert.className = 'alert alert-success';
        panicAlert.textContent = "You're chill 😎 - You only need a " + neededScore.toFixed(1) + " to pass!";
        panicMeme.innerHTML = `<img src="${panicMemes.low}" class="img-fluid" alt="Chill meme">`;
    } else if (neededScore <= 7.5) {
        panicAlert.className = 'alert alert-warning';
        panicAlert.textContent = "Moderate stress 😅 - Aim for a " + neededScore.toFixed(1) + ". You got this!";
        panicMeme.innerHTML = `<img src="${panicMemes.medium}" class="img-fluid" alt="Moderate stress meme">`;
    } else if (neededScore <= 9) {
        panicAlert.className = 'alert alert-danger';
        panicAlert.textContent = "STUDY NOW 🚨 - You need a " + neededScore.toFixed(1) + ". Time to hit the books!";
        panicMeme.innerHTML = `<img src="${panicMemes.high}" class="img-fluid" alt="Study now meme">`;
    } else {
        panicAlert.className = 'alert alert-danger';
        panicAlert.textContent = "Good luck explaining this to your parents 💀 - You'd need a " + neededScore.toFixed(1) + ".";
        panicMeme.innerHTML = `<img src="${panicMemes.extreme}" class="img-fluid" alt="Panic meme">`;
    }
}

// Study Timer Functions
function startTimer() {
    if (isPaused) {
        isPaused = false;
        startTimerBtn.disabled = true;
        pauseTimerBtn.disabled = false;
        timerStatus.textContent = isBreak ? 'Break Time!' : 'Focus Time!';
        
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                if (isBreak) {
                    // Break is over, start study session
                    isBreak = false;
                    timeLeft = studyTime;
                    showRandomMeme();
                    timerStatus.textContent = 'Break over! Time to study!';
                    showAlert('Break over! Time to get back to work!', 'warning');
                } else {
                    // Study session is over, start break
                    isBreak = true;
                    timeLeft = breakTime;
                    showRandomMeme();
                    timerStatus.textContent = 'Study session complete! Take a break!';
                    showAlert('Great job! Time for a well-deserved break!', 'success');
                }
                startTimer();
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (!isPaused) {
        clearInterval(timer);
        isPaused = true;
        startTimerBtn.disabled = false;
        pauseTimerBtn.disabled = true;
        timerStatus.textContent = 'Paused';
    }
}

function resetTimer() {
    clearInterval(timer);
    isPaused = true;
    isBreak = false;
    studyTime = parseInt(document.getElementById('studyMinutes').value) * 60 || 25 * 60;
    breakTime = parseInt(document.getElementById('breakMinutes').value) * 60 || 5 * 60;
    timeLeft = studyTime;
    updateTimerDisplay();
    startTimerBtn.disabled = false;
    pauseTimerBtn.disabled = true;
    timerStatus.textContent = 'Ready to study!';
    timerProgress.style.width = '0%';
    timerProgress.className = 'progress-bar progress-bar-striped progress-bar-animated bg-primary';
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update progress bar
    const totalTime = isBreak ? breakTime : studyTime;
    const percentage = ((totalTime - timeLeft) / totalTime) * 100;
    timerProgress.style.width = `${percentage}%`;
    
    // Change progress bar color based on time left
    if (isBreak) {
        timerProgress.className = 'progress-bar progress-bar-striped progress-bar-animated bg-success';
    } else if (timeLeft < 300) { // Less than 5 minutes left
        timerProgress.className = 'progress-bar progress-bar-striped progress-bar-animated bg-danger';
    } else if (timeLeft < 600) { // Less than 10 minutes left
        timerProgress.className = 'progress-bar progress-bar-striped progress-bar-animated bg-warning';
    } else {
        timerProgress.className = 'progress-bar progress-bar-striped progress-bar-animated bg-primary';
    }
}

function showRandomMeme() {
    const randomMeme = studyMemes[Math.floor(Math.random() * studyMemes.length)];
    memeContainer.innerHTML = `<img src="${randomMeme}" class="img-fluid rounded" alt="Study meme">`;
}

// Grade History Analyzer
function analyzeGradeHistory() {
    const input = gradeHistory.value.trim();
    if (!input) {
        showAlert('Please enter some grades to analyze', 'warning');
        return;
    }
    
    const lines = input.split('\n');
    const subjects = {};
    let totalGrades = 0;
    let totalWeight = 0;
    let weightedSum = 0;
    
    // Parse each line
    lines.forEach((line, index) => {
        const parts = line.split(',').map(part => part.trim());
        if (parts.length >= 2) {
            const subject = parts[0];
            const grade = parseFloat(parts[1]);
            const weight = parts[2] ? parseFloat(parts[2]) : 1; // Default weight of 1 if not specified
            
            if (!isNaN(grade)) {
                // Add to subject stats
                if (!subjects[subject]) {
                    subjects[subject] = {
                        grades: [],
                        weights: [],
                        count: 0,
                        total: 0,
                        weightedTotal: 0,
                        totalWeight: 0
                    };
                }
                
                subjects[subject].grades.push(grade);
                subjects[subject].weights.push(weight);
                subjects[subject].count++;
                subjects[subject].total += grade;
                subjects[subject].weightedTotal += grade * weight;
                subjects[subject].totalWeight += weight;
                
                // Update overall stats
                totalGrades++;
                totalWeight += weight;
                weightedSum += grade * weight;
            }
        }
    });
    
    // Calculate overall average
    const overallAverage = totalWeight > 0 ? weightedSum / totalWeight : 0;
    
    // Generate analysis
    let analysis = `<h4>Overall Average: ${overallAverage.toFixed(2)}</h4>`;
    
    // Add subject breakdown
    analysis += '<h5 class="mt-4">Subject Breakdown:</h5>';
    analysis += '<div class="table-responsive"><table class="table table-striped">';
    analysis += '<thead><tr><th>Subject</th><th>Average</th><th>Grades</th><th>Analysis</th></tr></thead><tbody>';
    
    for (const [subject, data] of Object.entries(subjects)) {
        const avg = data.total / data.count;
        const weightedAvg = data.totalWeight > 0 ? data.weightedTotal / data.totalWeight : 0;
        const gradesList = data.grades.join(', ');
        
        // Generate analysis for this subject
        let subjectAnalysis = [];
        
        // Check for trends
        if (data.grades.length >= 3) {
            // Check if grades are improving
            const firstHalf = data.grades.slice(0, Math.ceil(data.grades.length / 2));
            const secondHalf = data.grades.slice(Math.floor(data.grades.length / 2));
            
            const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
            const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
            
            if (secondAvg > firstAvg + 1) {
                subjectAnalysis.push("📈 Grades are improving!");
            } else if (secondAvg < firstAvg - 1) {
                subjectAnalysis.push("📉 Grades are declining. Consider getting help.");
            }
            
            // Check for consistency
            const minGrade = Math.min(...data.grades);
            const maxGrade = Math.max(...data.grades);
            
            if (maxGrade - minGrade > 3) {
                subjectAnalysis.push("⚠️ Grades are inconsistent. Focus on consistency.");
            }
        }
        
        // Check if any grades are failing
        if (data.grades.some(g => g < 5.5)) {
            const failingCount = data.grades.filter(g => g < 5.5).length;
            subjectAnalysis.push(`🚨 ${failingCount} ${failingCount === 1 ? 'grade' : 'grades'} below passing (5.5)`);
        }
        
        // Add subject row
        analysis += `<tr>
            <td><strong>${subject}</strong></td>
            <td>${weightedAvg.toFixed(2)}</td>
            <td>${gradesList}</td>
            <td>${subjectAnalysis.join('<br>') || 'No significant trends'}</td>
        </tr>`;
    }
    
    analysis += '</tbody></table></div>';
    
    // Add overall analysis
    analysis += '<h5 class="mt-4">Overall Analysis:</h5><ul>';
    
    // Check overall performance
    if (overallAverage >= 8) {
        analysis += '<li>🌟 Excellent performance overall! Keep up the great work!</li>';
    } else if (overallAverage >= 6.5) {
        analysis += '<li>👍 Good job! You\'re doing well overall.</li>';
    } else if (overallAverage >= 5.5) {
        analysis += '<li>💪 You\'re passing, but there\'s room for improvement.</li>';
    } else {
        analysis += '<li>⚠️ You\'re currently not meeting the passing grade. Consider seeking help.</li>';
    }
    
    // Check for strengths and weaknesses
    const subjectAverages = [];
    for (const [subject, data] of Object.entries(subjects)) {
        const weightedAvg = data.totalWeight > 0 ? data.weightedTotal / data.totalWeight : 0;
        subjectAverages.push({ subject, average: weightedAvg });
    }
    
    // Sort by average (highest first)
    subjectAverages.sort((a, b) => b.average - a.average);
    
    if (subjectAverages.length > 1) {
        analysis += `<li>Your strongest subject is <strong>${subjectAverages[0].subject}</strong> (${subjectAverages[0].average.toFixed(2)})`;
        analysis += ` and your weakest is <strong>${subjectAverages[subjectAverages.length - 1].subject}</strong> (${subjectAverages[subjectAverages.length - 1].average.toFixed(2)}).</li>`;
    }
    
    // Check for grade distribution
    const gradeCounts = { '8+': 0, '6.5-8': 0, '5.5-6.5': 0, '0-5.5': 0 };
    
    for (const subject of Object.values(subjects)) {
        for (const grade of subject.grades) {
            if (grade >= 8) gradeCounts['8+']++;
            else if (grade >= 6.5) gradeCounts['6.5-8']++;
            else if (grade >= 5.5) gradeCounts['5.5-6.5']++;
            else gradeCounts['0-5.5']++;
        }
    }
    
    analysis += '<li>Grade distribution: ';
    const distribution = [];
    if (gradeCounts['8+'] > 0) distribution.push(`${gradeCounts['8+']} excellent (8+)`);
    if (gradeCounts['6.5-8'] > 0) distribution.push(`${gradeCounts['6.5-8']} good (6.5-8)`);
    if (gradeCounts['5.5-6.5'] > 0) distribution.push(`${gradeCounts['5.5-6.5']} passing (5.5-6.5)`);
    if (gradeCounts['0-5.5'] > 0) distribution.push(`${gradeCounts['0-5.5']} failing (<5.5)`);
    
    analysis += distribution.join(', ') + '.</li>';
    
    // Add study recommendations
    analysis += '</ul><h5 class="mt-4">Recommendations:</h5><ul>';
    
    if (gradeCounts['0-5.5'] > 0) {
        analysis += '<li>Focus on improving your failing grades first. Consider getting a tutor or joining a study group.</li>';
    }
    
    if (subjectAverages.length > 0 && subjectAverages[subjectAverages.length - 1].average < 5.5) {
        const worstSubject = subjectAverages[subjectAverages.length - 1];
        analysis += `<li>Your lowest subject is <strong>${worstSubject.subject}</strong>. Consider dedicating more study time to this subject.</li>`;
    }
    
    if (overallAverage < 6.5) {
        analysis += '<li>Try to identify which study methods work best for you. Active recall and spaced repetition are proven techniques.</li>';
    }
    
    if (gradeCounts['8+'] / totalGrades < 0.2 && totalGrades > 5) {
        analysis += '<li>You have few excellent grades. Challenge yourself to aim higher in your stronger subjects.</li>';
    }
    
    analysis += '<li>Make sure to review your mistakes on tests and assignments to avoid repeating them.</li>';
    analysis += '<li>Consider creating a study schedule to better manage your time across subjects.</li>';
    
    analysis += '</ul>';
    
    // Display the analysis
    analysisResults.innerHTML = analysis;
}

// Sandbox Functions
function addSandboxGradeRow() {
    const row = document.createElement('div');
    row.className = 'sandbox-row row g-3 mb-2';
    row.innerHTML = `
        <div class="col-md-6">
            <input type="text" class="form-control sandbox-grade" placeholder="Grade (e.g., 7.5 or A-)" value="7.5">
        </div>
        <div class="col-md-4">
            <div class="input-group">
                <input type="number" class="form-control sandbox-weight" placeholder="Weight" value="20" min="0" max="100">
                <span class="input-group-text">%</span>
            </div>
        </div>
        <div class="col-md-2">
            <button class="btn btn-danger btn-sm remove-sandbox" type="button">×</button>
        </div>
    `;
    
    // Add event listener to the remove button
    const removeBtn = row.querySelector('.remove-sandbox');
    removeBtn.addEventListener('click', () => {
        row.remove();
        calculateWhatIfGrade();
    });
    
    // Add event listeners to grade and weight inputs
    const gradeInput = row.querySelector('.sandbox-grade');
    const weightInput = row.querySelector('.sandbox-weight');
    
    gradeInput.addEventListener('input', calculateWhatIfGrade);
    weightInput.addEventListener('input', calculateWhatIfGrade);
    
    sandboxGrades.appendChild(row);
    
    // Focus the new grade input
    gradeInput.focus();
    
    // Recalculate
    calculateWhatIfGrade();
}

function calculateWhatIfGrade() {
    const whatIfGrade = parseFloat(document.getElementById('whatIfGrade').value) || 0;
    const whatIfWeight = parseFloat(document.getElementById('whatIfWeight').value) || 0;
    
    let totalWeight = 0;
    let weightedSum = 0;
    const rows = document.querySelectorAll('.sandbox-row');
    
    // Calculate current weighted average
    rows.forEach(row => {
        const gradeInput = row.querySelector('.sandbox-grade').value;
        // Try to parse as number first, then as letter grade if that fails
        let grade = parseFloat(gradeInput);
        
        if (isNaN(grade)) {
            // Try to parse letter grade (simplified)
            const letterGrade = gradeInput.trim().toUpperCase();
            if (letterGrade === 'A' || letterGrade === 'A+') grade = 10;
            else if (letterGrade === 'A-') grade = 9;
            else if (letterGrade === 'B+') grade = 8.5;
            else if (letterGrade === 'B') grade = 8;
            else if (letterGrade === 'B-') grade = 7.5;
            else if (letterGrade === 'C+') grade = 7;
            else if (letterGrade === 'C') grade = 6.5;
            else if (letterGrade === 'C-') grade = 6;
            else if (letterGrade === 'D+') grade = 5.5;
            else if (letterGrade === 'D') grade = 5;
            else if (letterGrade === 'D-') grade = 4.5;
            else if (letterGrade === 'F') grade = 4;
            else grade = 0; // Default to 0 if can't parse
        }
        
        const weight = parseFloat(row.querySelector('.sandbox-weight').value) || 0;
        
        weightedSum += grade * (weight / 100);
        totalWeight += weight;
    });
    
    // Add the "what if" grade
    const newWeightedSum = weightedSum + (whatIfGrade * (whatIfWeight / 100));
    const newTotalWeight = totalWeight + whatIfWeight;
    
    // Calculate final grades
    let currentGrade = 0;
    let projectedGrade = 0;
    
    if (totalWeight > 0) {
        currentGrade = weightedSum / (totalWeight / 100);
    }
    
    if (newTotalWeight > 0) {
        projectedGrade = newWeightedSum / (newTotalWeight / 100);
    }
    
    // Update the UI
    if (!isNaN(currentGrade)) {
        finalGradeDisplay.textContent = currentGrade.toFixed(2);
        
        // Update progress bar
        const percentage = (currentGrade / 10) * 100;
        gradeVisual.style.width = `${percentage}%`;
        
        // Set progress bar color based on grade
        if (currentGrade >= 8) {
            gradeVisual.className = 'progress-bar bg-success';
        } else if (currentGrade >= 6.5) {
            gradeVisual.className = 'progress-bar bg-primary';
        } else if (currentGrade >= 5.5) {
            gradeVisual.className = 'progress-bar bg-warning';
        } else {
            gradeVisual.className = 'progress-bar bg-danger';
        }
        
        // Show what-if analysis
        if (whatIfWeight > 0) {
            const difference = projectedGrade - currentGrade;
            let analysis = `With a ${whatIfGrade} (${whatIfWeight}%): `;
            
            if (difference > 0.1) {
                analysis += `Your grade would increase to ${projectedGrade.toFixed(2)} (+${difference.toFixed(2)})`;
            } else if (difference < -0.1) {
                analysis += `Your grade would decrease to ${projectedGrade.toFixed(2)} (${difference.toFixed(2)})`;
            } else {
                analysis += `Your grade would stay about the same at ${projectedGrade.toFixed(2)}`;
            }
            
            document.getElementById('whatIfResult').innerHTML = `<div class="alert alert-info">${analysis}</div>`;
        } else {
            document.getElementById('whatIfResult').innerHTML = '<div class="alert alert-info">Enter a grade and weight to see how it affects your average</div>';
        }
    }
}

// Utility Functions
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Add to the top of the container
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, 5000);
}

// Initialize tooltips
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});
