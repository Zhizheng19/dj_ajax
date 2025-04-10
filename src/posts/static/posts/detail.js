/*
* FILE         : detail.js
* PROJECT      : Full Stack Framework Assignment
* PROGRAMMER   : Zhizhong Dong
* FIRST VERSION: 2025-04-09
* DESCRIPTION  : Handles AJAX requests for post details, update, delete, and dynamically updating the UI.
*/
const postBox = document.getElementById('post-box');
const backBtn = document.getElementById('back-btn');
const updateBtn = document.getElementById('update-btn');
const deleteBtn = document.getElementById('delete-btn');

const spinnerBox = document.getElementById('spinner-box');
// urls
const url = window.location.href + 'data/';
const updateUrl = window.location.href + 'update/';
const deleteUrl = window.location.href + 'delete/';
// for update modal
const titleInput = document.getElementById('id_title');
const bodyInput = document.getElementById('id_body');
const alertBox = document.getElementById('alert-box');
// forms
const updateForm = document.getElementById('update-form');
const deleteForm = document.getElementById('delete-form');

const csrf = document.getElementsByName('csrfmiddlewaretoken');
/*
* AJAX GET request for post details data
*/
$.ajax({
    type: 'GET',
    url: url,
    success: function (response) {
        // console.log('success', response);
        const data = response.data;
        if (data.logged_in !== data.author ) {
            // console.log("different user");
        } else {
            // console.log("same user");
            updateBtn.classList.remove('not-visible');
            deleteBtn.classList.remove('not-visible');
        }
        
        const titleEl = document.createElement('h3');
        titleEl.setAttribute('class', 'mt-3');
        titleEl.setAttribute('id', 'post-title');
        
        const bodyEl = document.createElement('p');
        bodyEl.setAttribute('class', 'mt-1');
        bodyEl.setAttribute('id', 'post-body');
        
        titleEl.textContent = data.title;
        bodyEl.textContent = data.body;
        
        postBox.appendChild(titleEl);
        postBox.appendChild(bodyEl);
        // for update modal
        titleInput.value = data.title;
        bodyInput.value = data.body;

        spinnerBox.classList.add('not-visible');
        // console.log('data', data);
    },
    error: function (error) {
        // console.log('error', error);
    }
});


// POST requests for update
updateForm.addEventListener('submit', (e) => {
    e.preventDefault();         // stop the browser from submitting the form,
                                // so we can do it manually with ajax

    const title = document.getElementById('post-title');
    const body = document.getElementById('post-body');

    $.ajax({
        type: 'POST',
        url: updateUrl,
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
            'title': titleInput.value,
            'body': bodyInput.value,
        },
        success: function (response) {
            // console.log('success', response);
            title.textContent = response.title;
            body.textContent = response.body;
            handleAlerts('success', 'Post updated!');
        },
        error: function (error) {
            // console.log('error', error);
        }
    });
});
// POST requests for delete
deleteForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    $.ajax({
        type: 'POST',
        url: deleteUrl,
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
        },
        success: function (response) {
            window.location.href = window.location.origin;
            localStorage.setItem('deletedTitle',titleInput.value);
        },
        error: function (error) {
            // console.log('error', error);
        }
    });
});