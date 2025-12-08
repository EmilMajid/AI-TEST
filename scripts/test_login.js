async function testLogin() {
    const url = "http://localhost:3000/api/auth/login";
    const body = {
        action: "login",
        email: "sevinc.ismayilova@test.com",
        password: "test12345", // Wrong password intentionally to test fallback
        userId: "student-sevinc",
        role: "student"
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error:", error);
    }
}

testLogin();
