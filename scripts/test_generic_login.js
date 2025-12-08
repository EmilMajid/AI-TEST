async function testGenericLoginFallback() {
    const url = "http://localhost:3000/api/auth/login";
    // Using a random email that definitely isn't in the mock list
    // to trigger the generic "demo user" creation path
    const body = {
        action: "login", // Action is login, but maybe lookup happened first?
        // Actually, the generic fallback happens inside action="login" if user not found in mock list
        // BUT only if password is provided.
        email: "random.user." + Date.now() + "@test.com",
        password: "anypassword",
        role: "student"
    };

    // First we usually do lookup
    // But testing the fallback logic in 'login' action directly
    try {
        console.log("Testing generic login fallback...");
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        console.log("Status:", response.status);
        if (data.user) {
            console.log("User Region:", data.user.region);
            if (!data.user.region) {
                console.error("FAILURE: Generic user missing region!");
            } else {
                console.log("SUCCESS: Generic user has region:", data.user.region);
            }
        } else {
            console.log("No user returned (maybe auth error):", data);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

testGenericLoginFallback();
