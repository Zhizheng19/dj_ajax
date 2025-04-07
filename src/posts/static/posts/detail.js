console.log('hello detail page');
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
        spinnerBox.classList.add('not-visible');
        // const data = response.data;
        // console.log('data', data);
    },
    error: function (error) {
        console.log('error', error);
    }
});