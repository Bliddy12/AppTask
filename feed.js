
const scrollbtn=document.getElementById("scrollbtn");
function handleScroll()
{
    if(window.scrollY>300)
    {
        scrollbtn.style.display="block";
    }
    else
    {
        scrollbtn.style.display="none";
    }
}
function scrollToTop()
{
    window.scrollTo({
        top: 0,
        behavior:"smooth"
    });
}


window.addEventListener("scroll",handleScroll);
//Likes handler
document.querySelectorAll('.heart').forEach(heartButton => {
    // For each heart button find its specific icon inside it
    const heartIcon = heartButton.querySelector('.heart-icon'); 
    const likeCountSpan = heartButton.closest('.photo-buttons-container').nextElementSibling.querySelector('.like-count');
    heartButton.addEventListener('click', () => {
        heartButton.classList.toggle('liked');
        let currentLikes = parseInt(likeCountSpan.textContent.replace(/,/g, '')); 
        if (heartButton.classList.contains('liked')) {
            heartIcon.classList.add('liked');
            heartIcon.classList.remove('bi-heart');
            heartIcon.classList.add('bi-heart-fill');
            currentLikes++; 
        } else {
            heartIcon.classList.remove('bi-heart-fill');
            heartIcon.classList.remove('liked');
            heartIcon.classList.add('bi-heart');
            currentLikes--;
        }
        likeCountSpan.textContent = currentLikes.toLocaleString(); 
    });
});

//Search handler
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
  const filter = searchInput.value.toLowerCase();
  const allStoryFeeds = document.querySelectorAll('.story-feed');
  allStoryFeeds.forEach(storyFeed => {
    let postText = '';
    let elem = storyFeed;
    while (elem && elem.tagName !== 'HR') {
      postText += elem.textContent.toLowerCase() + ' ';
      elem = elem.nextElementSibling;
    }
    let shouldShow = postText.includes(filter);
    elem = storyFeed;
    while (elem && elem.tagName !== 'HR') {
      if (shouldShow) {
        elem.style.display = '';
      } else {
        elem.style.display = 'none';
      }
      elem = elem.nextElementSibling;
    }
    if (elem && elem.tagName === 'HR') {
      if (shouldShow) {
        elem.style.display = '';
      } else {
        elem.style.display = 'none';
      }
    }
  });
});
 
//comment identifier handler
const inputs = document.querySelectorAll(".add-comment");

  inputs.forEach(input => {
    const commentSection = input.parentElement;
    const typingIndicator = document.createElement("p");
    typingIndicator.className = "typing-indicator";
    typingIndicator.textContent = "...משתמש כותב תגובה";
    typingIndicator.style.display = "none";
    commentSection.appendChild(typingIndicator);

    let timer;

    input.addEventListener("input", () => {
      typingIndicator.style.display = "block";

      clearTimeout(timer);
      timer = setTimeout(() => {
        typingIndicator.style.display = "none";
      }, 2000);
    });
  });

// Handle adding and showing/hiding comments when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const commentInputFields = document.querySelectorAll(".add-comment");

  //For each input field, find its comment section div
  commentInputFields.forEach((inputField) => {
    const commentSectionWrapper = inputField.closest(".comment-section");
    if (!commentSectionWrapper) return;

    // Find the previous sibling with the given class name
    function getPreviousSiblingByClass(element, className) {
      let previous = element.previousElementSibling;
      while (previous) {
        if (previous.classList && previous.classList.contains(className)) {
          return previous;
        }
        previous = previous.previousElementSibling;
      }
      return null;
    }

    //Gets the user comments div and view comments button
    const commentsContainer = getPreviousSiblingByClass(commentSectionWrapper, "user-comment");
    const toggleCommentsButton = getPreviousSiblingByClass(commentsContainer, "view-comments-btn");

    //Count the numbers of <i> (the user comment) and render it real time on the page
    function refreshCommentsCount() {
      const numberOfComments = commentsContainer.querySelectorAll("i").length;
      toggleCommentsButton.textContent = `View all ${numberOfComments} comments`;
    }
    refreshCommentsCount();


    inputField.addEventListener("keypress", (event) => {
      if (event.key === "Enter" && inputField.value.trim() !== "") {

        //Avoid spaces in line
        const commentText = inputField.value.trim();

        //Create a commnet with the input field text
        const newComment = document.createElement("i");
        newComment.textContent = `eyal_swisa: ${commentText}`;
        commentsContainer.appendChild(newComment);
        commentsContainer.appendChild(document.createElement("br"));

        //Reset input field value
        inputField.value = "";

        //Rendering new amount of comments
        refreshCommentsCount();
      }
    });
  });
});


//Handle showing and hiding comment sections
document.addEventListener("DOMContentLoaded", () => {
  const showHideButtons = document.querySelectorAll(".view-comments-btn");

  //For each 'view-comments=btn', check if clicked
  showHideButtons.forEach((button) => {
    button.addEventListener("click", () => {

      //Find the comments container that comes right after the button.
      const relatedCommentsBox = button.nextElementSibling;

      //Checking if the comment section are hidden or not
      const isCurrentlyHidden = window.getComputedStyle(relatedCommentsBox).display === "none";

      //If comment section are not hidden, change the text to be 'Hide comments'
      if (isCurrentlyHidden) {
        relatedCommentsBox.style.display = "block";
        button.textContent = "Hide comments";
      } 
      //If comment section are hidden, count the numbers of comments (which is the <i> elements) and render the button number 
      else {
        relatedCommentsBox.style.display = "none";
        const commentCount = relatedCommentsBox.querySelectorAll("i").length;
        button.textContent = `View all ${commentCount} comments`;
      }
    }
    );
  });
});
//handle post model
const modal = document.getElementById("postModal");
const openBtn = document.getElementById("createPostButton");
const closeBtn = document.querySelector(".closeBtn");
const dropArea = document.getElementById("postForm");
const dropAreaMsg = document.querySelector("#postForm label");
const fileInput = document.getElementById("mediaUpload");
const preview = document.getElementById("preview");

const continueBtn = document.getElementById("continueBtn");
const dragIcon = document.getElementById("drag-file-icon");
const uploadLabel = document.querySelector("label[for='mediaUpload']");
const dragText = document.querySelector("#postForm label");


// Open modal
openBtn.onclick = () => {
  modal.style.display = "block";
};

function restartModal() {
  console.log("modal:", modal);

  modal.style.display = "none";

  // Reset image preview
  preview.style.display = "none";
  preview.src = "";

  // Reset text
  dropAreaMsg.textContent = "יש לגרור תמונות וסרטונים לכאן";

  // Reset UI elements
  dragIcon.style.display = "inline-block";
  uploadLabel.style.display = "inline-block";
  dragText.style.display = "block";
  dropArea.style.marginTop = "70px";
  fileInput.value = "";

  // Remove caption box if exists
  const existingCaptionBox = dropArea.querySelector(".caption-box");
  if (existingCaptionBox) {
    dropArea.removeChild(existingCaptionBox);
  }

  // Remove any video preview
  const videoPreview = dropArea.querySelector("#videoPreview");
  if (videoPreview) {
    dropArea.removeChild(videoPreview);
  }

  // Hide continue button
  if (continueBtn) {
    continueBtn.style.display = "none";
  }
}

// Close modal
closeBtn.onclick = () => {
  restartModal();
};

// Close modal by clicking outside
window.onclick = function(e) {
  if (e.target === modal) {
    restartModal();
  }
};

// Handle drop area

dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (!file) return;

  dropAreaMsg.textContent = file.name;

  // Replace input for form if needed
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  fileInput.files = dataTransfer.files;

  handleImageUpload(file);
});

// Handle file input change
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  dropAreaMsg.textContent = file.name;

   handleImageUpload(file);
});

// Helper to handle UI state change after image upload
function handleImageUpload(file) {
  // Clear previous previews
  preview.style.display = "none";
  preview.src = "";

  const existingVideo = document.getElementById("videoPreview");
  if (existingVideo) {
    existingVideo.remove();
  }

  // Remove old caption input if exists
  const oldCaption = dropArea.querySelector(".caption-box");
  if (oldCaption) oldCaption.remove();

  // Hide drag UI
  dragIcon.style.display = "none";
  uploadLabel.style.display = "none";
  dragText.style.display = "none";
  continueBtn.style.display = "inline-block";
  dropArea.style.margin = "0";

  // Create caption input
  const captionBox = document.createElement("input");
  captionBox.placeholder = "הכנס כיתוב...";
  captionBox.style.display = "block";
  captionBox.style.margin = "10px auto";
  captionBox.className = "caption-box";
  dropArea.appendChild(captionBox);

  continueBtn.onclick=()=>{
    showPublishNotification();
    uploadPhoto(file, captionBox.value);
    restartModal();
  };

  const reader = new FileReader();
  reader.onload = function (event) {
    const result = event.target.result;

    if (file.type.startsWith("image/")) {
      preview.src = result;
      preview.style.display = "block";
      preview.style.margin = "0 auto";
    } else if (file.type.startsWith("video/")) {
      const video = document.createElement("video");
      video.id = "videoPreview";
      video.controls = true;
      video.src = result;
      video.style.maxWidth = "100%";
      video.style.borderRadius = "10px";
      video.style.margin = "0 auto";
      video.style.display = "block";
      dropArea.insertBefore(video, captionBox);
    }
  };

  reader.readAsDataURL(file);
}

function showPublishNotification() {
  const notification = document.getElementsByClassName('publish-notification')[0];
  if (!notification) return;

  notification.style.display = 'block';

  setTimeout(() => {
    notification.style.display = 'none';
  }, 10000); // hide after 10 seconds
}

function uploadPhoto(file, cap) {
    // Create the new post container
    const newPost = document.createElement("div");
    newPost.className = "story-feed";

    // User info section
    const userInfo = document.createElement("div");
    userInfo.className = "username-info";

    const photoUsername = document.createElement("button");
    photoUsername.className = "photo-username";

    const photoImage = document.createElement("img");
    photoImage.src = "https://randomuser.me/api/portraits/men/60.jpg";
    photoImage.className= "photo-image";
    photoUsername.appendChild(photoImage);
    const uploadTime = document.createElement("span");
    uploadTime.textContent = "eyal_swisa • now";

    photoUsername.appendChild(uploadTime);
    userInfo.appendChild(photoUsername);

    const threeLinesButton = document.createElement("button");
    threeLinesButton.className = "btn btn-primary bg-transparent border-0 threeLines ";
    const iElement = document.createElement("i");
    iElement.className = "bi bi-three-dots fs-2";
    threeLinesButton.appendChild(iElement);
    threeLinesButton.setAttribute("data-bs-toggle","modal")
    threeLinesButton.setAttribute("data-bs-target", "#postOptionsModal");
    userInfo.appendChild(threeLinesButton);

    newPost.appendChild(userInfo);
    const postDiv = document.createElement("div");
    postDiv.appendChild(newPost);
    postDiv.className="post";

    // Post image
    if (file.type.startsWith("image/"))
    {
      const postImg = document.createElement("img");
      const reader = new FileReader();
      reader.onload = function (event) {
      postImg.src = event.target.result;
      postImg.style.maxWidth = "100%";
      postImg.style.borderRadius = "10px";
    };
    reader.readAsDataURL(file);
    postDiv.appendChild(postImg);
    }
    if (file.type.startsWith("video/")) {
      const postVideo = document.createElement("video");
      postVideo.controls = true; // adds play/pause controls
      postVideo.style.maxWidth = "100%";
      postVideo.style.borderRadius = "10px";

      const reader = new FileReader();
      reader.onload = function (event) {
        const source = document.createElement("source");
        source.src = event.target.result;
        source.type = file.type;
        postVideo.appendChild(source);
      };

      reader.readAsDataURL(file);
      postDiv.appendChild(postVideo);
    }


    // Post buttons
    const photoButtons = document.createElement("div");
    photoButtons.className = "photo-buttons-container";

    const button1 = document.createElement("button");
    button1.className = "btn btn-primary bg-transparent border-0 heart";
    const i1 = document.createElement("i");
    i1.className = "bi bi-heart fs-2 heart-icon";
    button1.appendChild(i1);
    photoButtons.appendChild(button1);

    const button2 = document.createElement("button");
    button2.className = "btn btn-primary bg-transparent border-0";
    const i2 = document.createElement("i");
    i2.className = "bi bi-chat fs-2";
    button2.appendChild(i2);
    photoButtons.appendChild(button2);

    const button3 = document.createElement("button");
    button3.className = "btn btn-primary bg-transparent border-0";
    const i3 = document.createElement("i");
    i3.className = "bi bi-send fs-2";
    button3.setAttribute("data-bs-toggle","modal");
    button3.setAttribute("data-bs-target","#shareModal");
    button3.appendChild(i3);
    photoButtons.appendChild(button3);

    const button4 = document.createElement("button");
    button4.className = "btn btn-primary bg-transparent border-0 ms-auto";
    const i4 = document.createElement("i");
    i4.className = "bi bi-bookmark fs-2";
    button4.appendChild(i4);
    photoButtons.appendChild(button4);

    postDiv.appendChild(photoButtons);

    // Likes section
    const photoText = document.createElement("div");
    photoText.className = "photo-text";
    const likesCount = document.createElement("div");
    likesCount.textContent = "0 likes";
    photoText.appendChild(likesCount);
    postDiv.appendChild(photoText);

    // Caption section
    const userNameText = document.createElement("div");
    userNameText.textContent = "eyal_swissa";
    userNameText.className = "photo-text";

    const caption = document.createElement("span");
    caption.style.fontWeight = "200";
    caption.textContent =" "+ cap;

    userNameText.appendChild(caption);
    postDiv.appendChild(userNameText);

    // Comments section
    const commentButton = document.createElement("button");
    commentButton.className = "view-comments-btn";
    commentButton.textContent = "view all 0 comments";
    postDiv.appendChild(commentButton);

    const commentSection = document.createElement("div");
    commentSection.className = "user-comment";
    postDiv.appendChild(commentSection);

    const addNewComment = document.createElement("div");
    addNewComment.className = "comment-section";

    const commentInput = document.createElement("input");
    commentInput.className = "add-comment";
    commentInput.type = "text";
    commentInput.placeholder = "add a comment...";
    addNewComment.appendChild(commentInput);

    const commentTypingIndicator = document.createElement("p");
    commentTypingIndicator.className = "typing-indicator";
    commentTypingIndicator.style.display = "none";
    commentTypingIndicator.textContent = "משתמש כותב תגובה....";
    addNewComment.appendChild(commentTypingIndicator);

    postDiv.appendChild(addNewComment);

    const borderPost = document.createElement("hr");
    borderPost.style = "width: 570px;";
    postDiv.appendChild(borderPost);
    const centerFeed = document.querySelector(".center-feed");
    centerFeed.insertBefore(postDiv,centerFeed.children[1]);
    
    requestAnimationFrame(() => {
      postDiv.classList.add("show");
    });
    attachPostListeners(postDiv);
  }
// handle adding listeners to new posts
function attachPostListeners(postDiv) {
  // Like button logic
  const heartButton = postDiv.querySelector('.heart');
  const heartIcon = heartButton.querySelector('.heart-icon');
  const likeCountSpan = postDiv.querySelector('.photo-text div'); // Assuming this is like count div

  heartButton.addEventListener('click', () => {
    heartButton.classList.toggle('liked');
    let currentLikes = parseInt(likeCountSpan.textContent.replace(/,/g, '').replace(' likes', '')) || 0;

    if (heartButton.classList.contains('liked')) {
      heartIcon.classList.remove('bi-heart');
      heartIcon.classList.add('bi-heart-fill');
      heartIcon.style.color = 'red';
      currentLikes++;
    } else {
      heartIcon.classList.remove('bi-heart-fill');
      heartIcon.classList.add('bi-heart');
      heartIcon.style.color = '';
      currentLikes--;
    }

    likeCountSpan.textContent = `${currentLikes.toLocaleString()} likes`;
  });

  // Comment input logic
  const commentInput = postDiv.querySelector('.add-comment');
  const commentSection = postDiv.querySelector('.user-comment');
  const commentButton = postDiv.querySelector('.view-comments-btn');
  const typingIndicator = postDiv.querySelector('.typing-indicator');

  commentInput.addEventListener('input', () => {
    typingIndicator.style.display = 'block';
    clearTimeout(commentInput.typingTimeout);
    commentInput.typingTimeout = setTimeout(() => {
      typingIndicator.style.display = 'none';
    }, 2000);
  });

  commentInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && commentInput.value.trim()) {
      const newComment = document.createElement('i');
      newComment.textContent = `eyal_swisa: ${commentInput.value.trim()}`;
      commentSection.appendChild(newComment);
      commentSection.appendChild(document.createElement("br"));
      commentInput.value = '';
      updateCommentCount();
    }


  });

  commentButton.addEventListener('click', () => {
    const isHidden = getComputedStyle(commentSection).display === 'none';
    commentSection.style.display = isHidden ? 'block' : 'none';
    updateCommentCount();
    commentButton.textContent = isHidden ? 'Hide comments' : `View all ${commentSection.querySelectorAll('i').length} comments`;
  });

  function updateCommentCount() {
    const count = commentSection.querySelectorAll('i').length;
    commentButton.textContent = `View all ${count} comments`;
  }

  // Initial visibility
  commentSection.style.display = 'none';
  updateCommentCount();


  //remove post button
  // Only once: get reference to modal and delete button
const modalElement = document.getElementById('postOptionsModal');
const deletePostButton = document.getElementById("deletebutton");
const optionsModal = new bootstrap.Modal(modalElement);

// Attach delete event ONCE
deletePostButton.addEventListener("click", removePost);
let currentPost = null;
// For each post (or whenever needed), bind click to open modal
const threeLinesButton = postDiv.querySelector(".threeLines");
threeLinesButton.addEventListener("click", () => {
  optionsModal.show();
  currentPost = postDiv;
});


deletePostButton.addEventListener("click", () => {
  
    removePost();
    optionsModal.hide();
});
function removePost(){
  currentPost.style.display = "none";
}


}

//Dark/Light mode handler
const toggleBtn = document.getElementById('toggleLightOrDark');

toggleBtn.addEventListener('click', () => {
  const icon = toggleBtn.querySelector('i');
  const label = toggleBtn.querySelector('span');

  //Check if currently in light mode by checking the icon class
  const isLight = icon.classList.contains('bi-sun');

  // Toggle icon classes (sun/moon)
  icon.classList.toggle('bi-sun');
  icon.classList.toggle('bi-moon');

  // Toggle light-mode class on both html and body
  document.body.classList.toggle('light-mode');
  document.documentElement.classList.toggle('light-mode');

  // Update label text
  if(label.textContent = isLight)
    label.textContent = 'Dark Mode';
  else
    label.textContent = 'Light Mode';
});


function filterPosts(type) {
  // Existing photos
  const publishedPosts = document.querySelectorAll('.published-post');
  // New uploaded photos
  const newPosts = document.querySelectorAll('.post');

  publishedPosts.forEach(function (post) {
    const hasImage = post.querySelector('img') !== null;
    const hasVideo = post.querySelector('video') !== null;

    if (type === 'images') {
      if (hasImage) {
        post.style.display = '';
      } else {
        post.style.display = 'none';
      }
    } else if (type === 'videos') {
      if (hasVideo) {
        post.style.display = '';
      } else {
        post.style.display = 'none';
      }
    } else if (type === 'all') {
      if (hasImage || hasVideo) {
        post.style.display = '';
      } else {
        post.style.display = 'none';
      }
    }
  });

  newPosts.forEach(function (post) {
    const hasImage = post.querySelector('img') !== null;
    const hasVideo = post.querySelector('video') !== null;

    if (type === 'images') {
      if (hasImage) {
        post.style.display = '';
      } else {
        post.style.display = 'none';
      }
    } else if (type === 'videos') {
      if (hasVideo) {
        post.style.display = '';
      } else {
        post.style.display = 'none';
      }
    } else if (type === 'all') {
      if (hasImage || hasVideo) {
        post.style.display = '';
      } else {
        post.style.display = 'none';
      }
    }
  });
}

//handle share Modal Search Bar

const shareModalSearch  = document.getElementById("shareModalSearch");
const shareModalUsers = document.getElementById("shareUserGrid");
shareModalSearch.addEventListener("input",()=>{
  const users = shareModalUsers.querySelectorAll(".shareModalUsers");
  const input = shareModalSearch.value.toLowerCase();
  users.forEach(user => {
    const username = user.textContent.toLowerCase();
    if (username.includes(input)) {
      user.style.display = "block";
    } else {
      user.style.display = "none";
    }
  });
});


