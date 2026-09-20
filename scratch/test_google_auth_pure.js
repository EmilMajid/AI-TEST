// Pure unit & logic test for Google OAuth & Gradual Onboarding Mechanics

function runVerification() {
  console.log("=== 1. Test: getOrCreateGoogleUser logic ===");
  
  const inMemoryUsers = [];
  
  function getOrCreateGoogleUser(googleProfile) {
    const cleanEmail = (googleProfile.email || "").trim().toLowerCase();
    let user = inMemoryUsers.find(
      (u) =>
        (u.googleId && u.googleId === googleProfile.sub) ||
        (u.email && u.email.toLowerCase() === cleanEmail)
    );

    let isNew = false;
    if (user) {
      if (!user.googleId) user.googleId = googleProfile.sub;
      if (googleProfile.picture && !user.avatarUrl) user.avatarUrl = googleProfile.picture;
    } else {
      isNew = true;
      user = {
        id: Date.now(),
        email: cleanEmail,
        firstName: googleProfile.given_name || googleProfile.name?.split(" ")[0] || "İstifadəçi",
        lastName: googleProfile.family_name || "",
        googleId: googleProfile.sub,
        avatarUrl: googleProfile.picture,
        accountType: "student",
        role: "student",
        isProfileDone: false,
        profileWarningsCount: 0,
        source: "real",
        status: "active",
      };
      inMemoryUsers.push(user);
    }
    const hasGrade = Boolean(user.class && String(user.class).trim().length > 0);
    return { user, isNew, hasGrade };
  }

  function setUserGrade(userId, grade, role = "student") {
    const user = inMemoryUsers.find(u => u.id === userId);
    if (!user) return null;
    user.accountType = role;
    user.role = role;
    if (role === "student") {
      user.class = String(grade).replace(/\D/g, "") || "5";
    }
    return user;
  }

  function incrementProfileWarning(userId) {
    const user = inMemoryUsers.find(u => u.id === userId);
    if (!user) return { warningsCount: 0, isLocked: false, isProfileDone: true };
    if (user.isProfileDone) return { warningsCount: 0, isLocked: false, isProfileDone: true };

    const current = user.profileWarningsCount || 0;
    const newCount = Math.min(current + 1, 4);
    user.profileWarningsCount = newCount;
    return {
      warningsCount: newCount,
      isLocked: newCount >= 4,
      isProfileDone: false
    };
  }

  function completeUserProfile(userId, details) {
    const user = inMemoryUsers.find(u => u.id === userId);
    if (!user) return null;
    if (details.region) user.region = details.region;
    if (details.school) user.school = details.school;
    if (details.fatherName) user.fatherName = details.fatherName;
    if (details.parentEmail) user.parentEmail = details.parentEmail;
    user.isProfileDone = true;
    user.profileWarningsCount = 0;
    return user;
  }

  // TEST SCENARIO
  const profile = {
    sub: "google-12345678",
    email: "tural.telebe@gmail.com",
    name: "Tural Məmmədov",
    given_name: "Tural",
    family_name: "Məmmədov",
    picture: "https://lh3.googleusercontent.com/avatar.jpg"
  };

  const res1 = getOrCreateGoogleUser(profile);
  console.log("1. New Google User created:", {
    id: res1.user.id,
    email: res1.user.email,
    isNew: res1.isNew,
    hasGrade: res1.hasGrade,
    isProfileDone: res1.user.isProfileDone
  });
  if (!res1.isNew || res1.hasGrade) throw new Error("Step 1 assertion failed!");

  // Step 2: Instant Grade Selection (1-click)
  const userWithGrade = setUserGrade(res1.user.id, "7", "student");
  console.log("2. 1-Click Grade selected:", {
    class: userWithGrade.class,
    role: userWithGrade.role
  });
  if (userWithGrade.class !== "7") throw new Error("Step 2 assertion failed!");

  // Step 3: Progressive warnings on test completion
  console.log("3. Progressive Test Warnings:");
  for (let testNum = 1; testNum <= 4; testNum++) {
    const warning = incrementProfileWarning(res1.user.id);
    console.log(`  Test ${testNum}: warning=${warning.warningsCount}/3, locked=${warning.isLocked}`);
    if (testNum < 4 && warning.isLocked) throw new Error(`Test ${testNum} should not be locked!`);
    if (testNum === 4 && !warning.isLocked) throw new Error("Test 4 MUST be locked!");
  }

  // Step 4: Completing Profile unlocks everything
  const completed = completeUserProfile(res1.user.id, {
    region: "Sumqayıt",
    school: "23 saylı tam orta məktəb",
    fatherName: "Vaqif",
    parentEmail: "ata.mammadov@gmail.com"
  });
  console.log("4. Profile completed:", {
    isProfileDone: completed.isProfileDone,
    profileWarningsCount: completed.profileWarningsCount,
    school: completed.school,
    region: completed.region
  });
  if (!completed.isProfileDone || completed.profileWarningsCount !== 0) throw new Error("Step 4 assertion failed!");

  const postCompleteWarning = incrementProfileWarning(res1.user.id);
  console.log("5. Subsequent test after profile complete (should never lock):", postCompleteWarning);
  if (postCompleteWarning.isLocked || !postCompleteWarning.isProfileDone) throw new Error("Step 5 assertion failed!");

  console.log("\n🎉 ALL LOGICAL SPECIFICATIONS VERIFIED 100% SUCCESSFULLY!");
}

runVerification();
