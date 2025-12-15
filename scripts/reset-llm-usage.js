const fs = require('fs');
const path = require('path');

const USAGE_PATH = path.join(__dirname, 'llm-usage.json');

function resetUsage() {
    console.log('Resetting daily LLM usage...');

    if (!fs.existsSync(USAGE_PATH)) {
        console.log('Usage file not found, creating new one.');
        fs.writeFileSync(USAGE_PATH, JSON.stringify({}, null, 2));
        return;
    }

    try {
        const usage = JSON.parse(fs.readFileSync(USAGE_PATH, 'utf-8'));

        // Reset counters for all providers
        Object.keys(usage).forEach(provider => {
            usage[provider] = {
                tokensUsed: 0,
                requestsMade: 0
            };
        });

        fs.writeFileSync(USAGE_PATH, JSON.stringify(usage, null, 2));
        console.log('Usage stats reset successfully.');
        console.log(usage);
    } catch (error) {
        console.error('Error resetting usage:', error);
    }
}

resetUsage();
