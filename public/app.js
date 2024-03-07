async function init() {
    // URL to your model directory
    const URL = 'http://localhost:3000/my_model/';
    const checkpointURL = URL + 'model.json'; // Model topology
    const metadataURL = URL + 'metadata.json'; // Model metadata


    const recognizer = await speechCommands.create(
        'BROWSER_FFT', // Fourier Transform type
        undefined, // Vocabulary feature is not used in this custom model scenario
        checkpointURL,
        metadataURL);

    await recognizer.ensureModelLoaded(); // Ensure the model is loaded before proceeding

    const classLabels = recognizer.wordLabels(); // Extract class labels from the model

    // Setup the UI to show class labels
    const labelContainer = document.getElementById('label-container');
    labelContainer.innerHTML = ''; // Clear existing labels (if any)
    classLabels.forEach(label => {
        const labelDiv = document.createElement('div');
        labelDiv.textContent = label;
        labelContainer.appendChild(labelDiv);
    });

    recognizer.listen(result => {
        const scores = result.scores; // Probability of prediction for each class
        // Render the probability scores per class
        for (let i = 0; i < classLabels.length; i++) {
            const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;

            if(result.scores[i] > 0.75) { // Using the specified threshold
                // Send the recognized command to the Node.js backend
                fetch('http://localhost:3000/open-app', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ command: classLabels[i] }),
                })
                .then(response => response.json()) // Assuming the server responds with JSON
                .then(data => console.log(data.message)) // Log the server response
                .catch(error => console.error('Error:', error));

                break; // Break after the first recognized command to avoid multiple commands being sent
            }
        }
    }, {
        includeSpectrogram: true, 
        probabilityThreshold: 0.95,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: .75
    });
}