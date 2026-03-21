// Handle form submission
document.getElementById('predictForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const predictBtn = document.getElementById('predictBtn');
    const originalText = predictBtn.innerHTML;
    predictBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Analyzing...';
    predictBtn.disabled = true;
    
    try {
        const formData = new FormData(this);
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            displayResult(result);
            // Add to history
            addToHistory(result, formData);
        } else {
            showNotification('Error: ' + result.error, 'error');
        }
    } catch (error) {
        showNotification('Prediction failed: ' + error.message, 'error');
    } finally {
        predictBtn.innerHTML = originalText;
        predictBtn.disabled = false;
    }
});

function displayResult(result) {
    const resultCard = document.getElementById('resultCard');
    const resultContent = document.getElementById('resultContent');
    const riskBar = document.getElementById('riskBar');
    const probValue = document.getElementById('probValue');
    const recommendations = document.getElementById('recommendationList');
    
    // Show result card with animation
    resultCard.classList.remove('hidden');
    resultCard.classList.add('result-animation');
    resultCard.scrollIntoView({ behavior: 'smooth' });
    
    // Update content
    resultContent.innerHTML = `
        <div class="space-y-4">
            <div class="text-4xl font-bold ${result.color === 'green' ? 'text-green-600' : result.color === 'orange' ? 'text-orange-500' : 'text-red-600'}">
                ${result.prediction}
            </div>
            <div class="text-6xl font-black text-gray-800">
                ${result.probability}
            </div>
            <div class="px-8 py-4 bg-${result.color}-100 rounded-2xl border-4 border-${result.color}-200">
                <div class="text-2xl font-bold text-${result.color}-800">${result.risk_level}</div>
            </div>
        </div>
    `;
    
    // Update progress bar
    const colorMap = {
        'green': '#10b981',
        'orange': '#f59e0b', 
        'red': '#ef4444'
    };
    
    riskBar.style.backgroundColor = colorMap[result.color];
    setTimeout(() => {
        riskBar.style.width = result.bar_width + '%';
    }, 100);
    
    probValue.textContent = result.probability;
    probValue.className = `text-4xl font-bold text-center mt-6 font-mono ${result.color === 'green' ? 'text-green-600' : result.color === 'orange' ? 'text-orange-500' : 'text-red-600'}`;
    
    // Generate recommendations
    generateRecommendations(result.probability, recommendations);
}

// Reset form and hide result
function resetForm() {
    document.getElementById('predictForm').reset();
    const resultCard = document.getElementById('resultCard');
    resultCard.classList.add('hidden');
    resultCard.classList.remove('result-animation');
}

// Toggle history panel
function toggleHistory() {
    const panel = document.getElementById('historyPanel');
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) {
        loadHistory();
    }
}

// Load prediction history from server
async function loadHistory() {
    try {
        const response = await fetch('/history');
        const history = await response.json();
        displayHistory(history);
    } catch (error) {
        console.error('Failed to load history:', error);
    }
}

// Display history in the panel
function displayHistory(history) {
    const historyList = document.getElementById('historyList');
    
    if (history.length === 0) {
        historyList.innerHTML = '<p class="text-gray-500 text-center">No prediction history available</p>';
        return;
    }
    
    historyList.innerHTML = history.map((item, index) => {
        const date = new Date(item.timestamp);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        const riskColor = item.risk_level === 'Low Risk' ? 'green' : item.risk_level === 'Moderate Risk' ? 'orange' : 'red';
        
        return `
            <div class="history-item bg-gray-50 rounded-xl p-4 mb-3 border border-gray-200">
                <div class="flex justify-between items-start mb-2">
                    <div class="text-sm text-gray-500">${dateStr}</div>
                    <div class="px-2 py-1 bg-${riskColor}-100 text-${riskColor}-800 text-xs font-semibold rounded-full">
                        ${item.risk_level}
                    </div>
                </div>
                <div class="text-lg font-semibold text-gray-800">${item.prediction}</div>
                <div class="text-sm text-gray-600">Risk: ${item.probability.toFixed(1)}%</div>
                <div class="text-xs text-gray-500 mt-2">
                    Age: ${item.input_data.age} | BMI: ${item.input_data.bmi.toFixed(1)} | Glucose: ${item.input_data.glucose}
                </div>
            </div>
        `;
    }).join('');
}

// Add current prediction to local history
function addToHistory(result, formData) {
    const history = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
    const entry = {
        timestamp: new Date().toISOString(),
        result: result,
        formData: Object.fromEntries(formData)
    };
    history.unshift(entry);
    if (history.length > 10) history.pop(); // Keep only last 10
    localStorage.setItem('predictionHistory', JSON.stringify(history));
}

// Generate health recommendations
function generateRecommendations(probability, container) {
    const prob = parseFloat(probability);
    let recommendations = [];
    
    if (prob < 40) {
        recommendations = [
            'Maintain current healthy lifestyle',
            'Regular annual check-ups',
            'Continue balanced diet and exercise'
        ];
    } else if (prob < 70) {
        recommendations = [
            'Increase physical activity to 150 minutes/week',
            'Reduce sugar and refined carbohydrates',
            'Monitor blood pressure regularly',
            'Consider consulting a nutritionist'
        ];
    } else {
        recommendations = [
            'Immediate medical consultation recommended',
            'Comprehensive diabetes screening',
            'Strict dietary modifications required',
            'Daily blood glucose monitoring',
            'Weight management program'
        ];
    }
    
    container.innerHTML = recommendations.map(rec => 
        `<div class="flex items-start">
            <i class="fas fa-check-circle text-blue-600 mt-1 mr-2"></i>
            <span>${rec}</span>
        </div>`
    ).join('');
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'} mr-2"></i>
            ${message}
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Remove old spinner CSS and use Font Awesome instead

