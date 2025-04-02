// console.log('hello world');

const helloWorldBox = document.getElementById('hello_world');
const postsBox = document.getElementById('posts_box');

$.ajax({
    type: 'GET',
    url:'hello-world',
    success: function(response) {
        console.log('success',response.text);
        helloWorldBox.textContent = response.text;
    },
    error: function(error) {
        console.log('error',error);
    }
})

$.ajax({
    type: 'GET',
    url:'data',
    success: function(response) {
        console.log('success', response);
        const data = response.data;
        console.log('data', data);
        data.forEach(el => {
            postsBox.innerHTML += `
                ${el.title} - <b>${el.body}</b></br>
            `
        })
    },
    error: function(error) {
        console.log('error',error);
    }
})