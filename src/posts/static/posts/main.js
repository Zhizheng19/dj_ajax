/*
* FILE         : main.js
* PROJECT      : Full Stack Framework Assignment
* PROGRAMMER   : Zhizhong Dong
* FIRST VERSION: 2025-04-09
* DESCRIPTION  : Handles loading posts, creating new posts, liking/unliking posts, and loading more posts.
*/
const helloWorldBox = document.getElementById('hello-world');
const postsBox = document.getElementById('posts-box');
const spinnerBox = document.getElementById('spinner-box');
const loadBtn = document.getElementById('load-btn');
const endBox = document.getElementById('end-box');
const postForm = document.getElementById('post-form');
const title = document.getElementById('id_title');
const body = document.getElementById('id_body');
const postAlertBox = document.getElementById('post-alert-box');
const alertBox = document.getElementById('alert-box');

const addBtn = document.getElementById('add-btn');
const closeBtns = [...document.getElementsByClassName('add-modal-close')];
const dropzone = document.getElementById('my-dropzone');

const url = window.location.href;

const csrf = document.getElementsByName('csrfmiddlewaretoken');

// get cookie for csrftoken
const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');
// check if a post has been deleted, and show an alert if so
const deleted = localStorage.getItem('deletedTitle');
if (deleted) {
    handleAlerts('danger', `"${deleted}" has been deleted.`);
    localStorage.removeItem('deletedTitle');
}
// like/unlike posts and update the like count
const likeUnlikePosts = (e) => {
    const likeUnlikeForms = [...document.getElementsByClassName('like-unlike-forms')];
    likeUnlikeForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const clickedId = e.target.getAttribute('data-form-id');
            // console.log('clickedId', clickedId);
            const clickedBtn = document.getElementById(`like-unlike-${clickedId}`);

            $.ajax({
                type: 'POST',
                url: '/like-unlike/',
                data: {
                    'csrfmiddlewaretoken': csrftoken,   
                    'pk': clickedId,
                },
                success: function (response) {
                    // console.log('success', response);
                    clickedBtn.textContent = response.liked ? `Unlike (${response.count})` : `Like (${response.count})`
                },
                error: function (error) {
                    // console.log('error', error);
                }
            })
        })
    })
}

let visible = 3;    // how many posts to show
// get posts data and display them
const getData = () => {
    $.ajax({
        type: 'GET',
        url: `data/${visible}`,
        success: function (response) {
            // console.log('success', response);
            const data = response.data; // get all the posts data
            // console.log('data', data);
            setTimeout(() => {
                spinnerBox.classList.add('not-visible');
                data.forEach(el => {
                    postsBox.innerHTML += `
                <div class="card mb-2">
                    <div class="card-body">
                        <h5 class="card-title">${el.title}</h5>
                        <p class="card-text">${el.body}</p>
                    </div>
                    <div class="card-footer">  
                        <div class="row">
                            <div class="col-2">                                 
                                <a href="${url}${el.id}" class="btn btn-primary">Details</a>
                            </div>
                            <div class="col-2">          
                                <form class="like-unlike-forms" data-form-id="${el.id}">                       
                                    <button class="btn btn-primary" id="like-unlike-${el.id}">
                                        ${el.liked ? `Unlike (${el.count})`: `Like (${el.count})`}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div> 

                </div>
                `
                });
                likeUnlikePosts();
            }, 100)
            // console.log(response.size);
            if (response.size === 0) {
                endBox.textContent = 'No posts added yet...';
            }
            if (response.size <= visible) {
                loadBtn.classList.add('not-visible');
                endBox.textContent = 'No more posts to load...';
            }
        },
        error: function (error) {
            // console.log('error', error);
        }
    })
}
// load more posts
loadBtn.addEventListener('click', () => {
    spinnerBox.classList.remove('not-visible');
    visible += 3;
    getData();
})

// create a new post
let newPostId = null;
postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '',
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
            'title': title.value,
            'body': body.value,
        },
        success: function (response) {
            // console.log('success', response);
            newPostId = response.id;
            postsBox.insertAdjacentHTML('afterbegin', `
                <div class="card mb-2">
                    <div class="card-body">
                        <h5 class="card-title">${response.title}</h5>
                        <p class="card-text">${response.body}</p>
                    </div>
                    <div class="card-footer">  
                        <div class="row">
                            <div class="col-2">                                 
                                <a href="${url}${response.id}" class="btn btn-primary">Details</a>
                            </div>
                            <div class="col-2">          
                                <form class="like-unlike-forms" data-form-id="${response.id}">                       
                                    <button class="btn btn-primary" id="like-unlike-${response.id}">
                                    Like (0)
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div> 
                </div>
                `);
                likeUnlikePosts();
                // $('#addPostModal').modal('hide');
                // handleAlerts('success', 'New Post added!');

                postAlertBox.innerHTML = `
                <div class="alert alert-success" role="alert">
                    New Post added!
                </div>
                `;
                addBtn.setAttribute('disabled', true);
                dropzone.classList.remove('not-visible');
                // postForm.reset();
        },
        error: function (error) {
            // console.log('error', error);
            postAlertBox.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Something went wrong!
            </div>
            `;
            // handleAlerts('danger', 'Something went wrong!');
        }
    })
});

// close add post modal
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        postForm.reset();
        if (!dropzone.classList.contains('not-visible')) {
            dropzone.classList.add('not-visible');
        }
    const dz =Dropzone.forElement("#my-dropzone");
    dz.removeAllFiles(true);
    addBtn.removeAttribute('disabled');
    postAlertBox.reset();
    });
});

Dropzone.autoDiscover = false;
// console.log("Initializing Dropzone...");
const myDropzone = new Dropzone("#my-dropzone", {
    url: "upload/",
    init: function () {
        this.on("sending", function (file, xhr,formData) {
            formData.append('csrfmiddlewaretoken', csrftoken);
            formData.append('new_post_id', newPostId);
        });
    },
    maxFiles: 3,
    maxFilesize: 4,
    acceptedFiles: '.png, .jpg, .jpeg',
});

getData();
