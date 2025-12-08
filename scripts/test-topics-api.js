// using native fetch

async function checkApi() {
    try {
        const response = await fetch('http://localhost:3000/api/textbooks/topics?class=8');
        const data = await response.json();

        console.log("Success:", data.success);
        if (data.topics) {
            console.log("Topics found for subjects:", Object.keys(data.topics));
            if (data.topics['Riyaziyyat']) {
                console.log("Riyaziyyat topics count:", data.topics['Riyaziyyat'].length);
                console.log("First 3 topics:", data.topics['Riyaziyyat'].slice(0, 3));
            } else {
                console.log("Riyaziyyat topics NOT found.");
            }
        } else {
            console.log("No topics object returned.");
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}

checkApi();
