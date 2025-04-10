/*
* FILE         : main.js
* PROJECT      : Full Stack Framework Assignment
* PROGRAMMER   : Zhizhong Dong
* FIRST VERSION: 2025-04-09
* DESCRIPTION  : Handles form submission for updating the user profile and avatar image.
*/
// console.log("hello my profile");
const alertBox = document.getElementById("alert-box");
const avatarBox = document.getElementById("avatar-box");
const profileForm = document.getElementById("profile-form");
const csrf = document.getElementsByName("csrfmiddlewaretoken");
const bioInput = document.getElementById("id_bio");
const avatarInput = document.getElementById("id_avatar");

profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("csrfmiddlewaretoken", csrf[0].value);
    formData.append("bio", bioInput.value);
    formData.append("avatar", avatarInput.files[0]);
    
    $.ajax({
        type: "POST",
        url: "",
        data: formData,
        success: (response) => {
            // console.log(response);
            avatarBox.innerHTML = `
            <img src="${response.avatar}" class="rounded" height="200px" width="auto" alt="${response.user.username}" />
            `;
            bioInput.value = response.bio;
            handleAlerts('success', 'Your profile has been updated!');
        },
        error: (response) => {
            // console.log(response);
        },
        processData: false,
        contentType: false,
        cache: false,
    })
})