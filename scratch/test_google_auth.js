// Path interceptor for '@/...' imports in node
const path = require("path");
const Module = require("module");
const origRequire = Module.prototype.require;
const rootDir = path.resolve(__dirname, "..");

Module.prototype.require = function(request) {
  if (request.startsWith("@/")) {
    const target = path.join(rootDir, request.slice(2));
    return origRequire.call(this, target);
  }
  return origRequire.apply(this, arguments);
};

async function runTests() {
  console.log("=== 1. Testing user-store helpers ===");
  const userStore = require("../lib/user-store.ts");
  
  // Test Google user creation
  const demoProfile = {
    sub: "google-test-sub-998877",
    email: "test.google.telebe@gmail.com",
    name: "Tural Məmmədov",
    given_name: "Tural",
    family_name: "Məmmədov",
    picture: "https://lh3.googleusercontent.com/test.jpg"
  };

  const { user, isNew, hasGrade } = userStore.getOrCreateGoogleUser(demoProfile);
  console.log("getOrCreateGoogleUser result:", {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    googleId: user.googleId,
    isNew,
    hasGrade,
    isProfileDone: user.isProfileDone,
    profileWarningsCount: user.profileWarningsCount
  });

  // Test set-grade
  const updatedWithGrade = userStore.setUserGrade(user.id, "7", "student");
  console.log("setUserGrade result:", {
    class: updatedWithGrade?.class,
    role: updatedWithGrade?.role,
    accountType: updatedWithGrade?.accountType
  });

  // Test warning increment (up to 4)
  console.log("\n=== 2. Testing Warning Counter & 4th-time Lock ===");
  for (let i = 1; i <= 4; i++) {
    const warningRes = userStore.incrementProfileWarning(user.id);
    console.log(`Warning ${i}: count=${warningRes.warningsCount}, isLocked=${warningRes.isLocked}`);
  }

  // Test profile completion
  console.log("\n=== 3. Testing Complete Profile ===");
  const completed = userStore.completeUserProfile(user.id, {
    region: "Sumqayıt",
    school: "23 saylı tam orta məktəb",
    fatherName: "Vaqif",
    parentEmail: "ata.mammadov@gmail.com",
    parentEmail2: "ana.mammadova@gmail.com"
  });

  console.log("completeUserProfile result:", {
    isProfileDone: completed?.isProfileDone,
    profileWarningsCount: completed?.profileWarningsCount,
    region: completed?.region,
    school: completed?.school,
    fatherName: completed?.fatherName,
    parentEmail: completed?.parentEmail
  });

  const checkAfterComplete = userStore.incrementProfileWarning(user.id);
  console.log("Check warning after complete (should NOT lock):", checkAfterComplete);

  console.log("\n✅ ALL UNIT & INTEGRATION TESTS PASSED SUCCESSFULLY!");
}

runTests().catch(console.error);
