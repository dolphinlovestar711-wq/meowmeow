const currentUserKey = "petParadiseCurrentMember";
const profilesKey = "petParadiseMemberProfiles";
const currentUser = localStorage.getItem(currentUserKey);

if (!currentUser) {
  alert("請先登入會員。");
  window.location.replace("member.html");
} else {
  const form = document.getElementById("profile-form");
  const nameInput = document.getElementById("profile-name");
  const birthdayInput = document.getElementById("profile-birthday");
  const phoneInput = document.getElementById("profile-phone");
  const emailInput = document.getElementById("profile-email");
  const addressInput = document.getElementById("profile-address");
  const status = document.getElementById("profile-status");
  birthdayInput.max = new Date().toISOString().split("T")[0];

  function getProfiles() {
    try {
      return JSON.parse(localStorage.getItem(profilesKey) || "{}");
    } catch (error) {
      return {};
    }
  }

  function loadProfile() {
    const profile = getProfiles()[currentUser];
    emailInput.value = currentUser;

    if (!profile) {
      return;
    }

    nameInput.value = profile.name || "";
    birthdayInput.value = profile.birthday || "";
    phoneInput.value = profile.phone || "";
    addressInput.value = profile.address || "";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const profiles = getProfiles();
    profiles[currentUser] = {
      name: nameInput.value.trim(),
      birthday: birthdayInput.value,
      phone: phoneInput.value.trim(),
      email: currentUser,
      address: addressInput.value.trim(),
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(profilesKey, JSON.stringify(profiles));
    status.textContent = "會員資料已成功儲存至本機端！";
  });

  loadProfile();
}
