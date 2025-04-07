console.log('hello detail page');
const postBox = document.getElementById('post-box');
const backBtn = document.getElementById('back-btn');
const updateBtn = document.getElementById('update-btn');
const deleteBtn = document.getElementById('delete-btn');
const spinnerBox = document.getElementById('spinner-box');
const url = window.location.href + 'data/';

backBtn.addEventListener('click', (e) => {
    history.back();
});

$.ajax({
    type: 'GET',
    url: url,
    success: function (response) {
        console.log('success', response);
        const data = response.data;
        if (data.logged_in !== data.author ) {
            console.log("different user");
        } else {
            console.log("same user");
            updateBtn.classList.remove('not-visible');
            deleteBtn.classList.remove('not-visible');
        }

        spinnerBox.classList.add('not-visible');
        // console.log('data', data);
    },
    error: function (error) {
        console.log('error', error);
    }
});