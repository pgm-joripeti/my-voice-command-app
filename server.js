const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;
let lastCommand = null;
let lastCommandTime = Date.now();

app.use(express.json()); // For parsing application/json
app.use(express.static('public')); // Serve files from the public directory

app.post('/open-app', (req, res) => {
    const { command } = req.body;
    const currentTime = Date.now();

    // Ignore background noise detections
    if (command.toLowerCase() === 'background noise') {
        console.log('Background noise detected - ignoring');
        res.json({ message: 'Background noise ignored' });
        return;
    }

    // Check if the same command was issued within a short time frame
    if (lastCommand === command && currentTime - lastCommandTime < 1000) { // 1000 milliseconds = 1 second
        console.log(`Duplicate command "${command}" ignored`);
        res.json({ message: 'Duplicate command ignored' });
        return;
    }

    console.log(`Received command to open: ${command}`);
    // Other switch-case logic...

    // Update the last command and its time after processing
    lastCommand = command;
    lastCommandTime = currentTime;

    let systemCommand;

    switch (command.toLowerCase()) {
        case 'excel':
            systemCommand = 'open -a "Microsoft Excel"';
            break;
        case 'canva':
            systemCommand = 'open https://www.canva.com/';
            break;
        case 'notes':
            systemCommand = 'open -a "Notities"';
            break;
        case 'obs':
            systemCommand = 'open -a "OBS"';
            break;
        case 'skype':
            systemCommand = 'open -a "Skype"';
            break;
        case 'time harvest':
            systemCommand = 'open -a "Harvest"';
            break;
        case 'whatsapp':
            systemCommand = 'open -a "WhatsApp"';
            break;
        case 'ableton':
            systemCommand = 'open -a "Ableton Live 10 Suite"'; // Adjust according to your version
            break;
        case 'analyser':
            systemCommand = 'open -a "FluxAnalyzer"'; // Adjust according to your version
            break;
        case 'audio hijack':
            systemCommand = 'open -a "Audio Hijack"';
            break;
        case 'nordpass':
            systemCommand = 'open -a "NordPass"';
            break;
        case 'chrome':
            systemCommand = 'open -a "Google Chrome"';
            break;
        case 'launchpad':
        systemCommand = 'open -a "launchpad"';
        break;
        case 'visual studio code':
            systemCommand = 'open -a "Visual Studio Code"';
            break;
        case 'background noise':
            console.log('background noise detected');
            break;
        default:
            console.log(`Command ${command} not recognized.`);
            // Send a JSON response
            res.json({ message: 'Command executed successfully' });
    }

    if (systemCommand) {
        exec(systemCommand, (err) => {
            if (err) {
                console.error(`Failed to execute command: ${err}`);
                res.status(500).json({ message: 'Failed to execute command', error: err.toString() });
                return;
            }
            res.json({ message: `Executed command: ${command}` });            
        });
    }
});

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
