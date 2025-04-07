console.log('hello detail page');
const backBtn = document.getElementById('back-btn');
const updateBtn = document.getElementById('update-btn');
const deleteBtn = document.getElementById('delete-btn');

backBtn.addEventListener('click', (e) => {
    history.back();
});