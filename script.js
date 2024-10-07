document.addEventListener('DOMContentLoaded', function () {

    const giftButton = document.getElementById('giftButton');
    const giftModal = document.getElementById('giftModal');
    const closeButton = document.querySelector('.close-button');

    // Show modal when gift button is clicked
    giftButton.addEventListener('click', function () {
      giftModal.style.display = 'block';
    });

    // Hide modal when close button is clicked
    closeButton.addEventListener('click', function () {
      giftModal.style.display = 'none';
    });

    // Hide modal when user clicks outside the modal
    window.addEventListener('click', function (event) {
      if (event.target === giftModal) {
        giftModal.style.display = 'none';
      }
    });

    const countdown = () => {
        const countDate = new Date("Oct 15, 2024 15:00:00").getTime();
        const now = new Date().getTime();
        const gap = countDate - now;

        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        const textDay = Math.floor(gap / day);
        const textHour = Math.floor((gap % day) / hour);
        const textMinute = Math.floor((gap % hour) / minute);
        const textSecond = Math.floor((gap % minute) / second);

        document.getElementById('days').innerText = textDay;
        document.getElementById('hours').innerText = textHour;
        document.getElementById('minutes').innerText = textMinute;
        document.getElementById('seconds').innerText = textSecond;
    };

    setInterval(countdown, 1000);

    const form = document.querySelector('form');
    const commentSection = document.querySelector('.comments');

    // Load comments from localStorage when the page loads
    loadComments();

    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent the default form submission

        const name = form.querySelector('input').value;
        const message = form.querySelector('textarea').value;

        if (name && message) {
            const comment = createCommentElement(name, message);
            commentSection.appendChild(comment);

            // Save comment to localStorage
            saveCommentToLocalStorage(name, message);

            form.querySelector('input').value = '';
            form.querySelector('textarea').value = '';
        } else {
            alert('Please fill out all fields!');
        }
    });
  function formatDate(date) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Intl.DateTimeFormat('id-ID', options).format(date);
    }

    // Function to create a comment element
    // Function to create a comment element
  function createCommentElement(name, message, date) {
      const comment = document.createElement('div');
      comment.classList.add('comment');

      comment.innerHTML = `
          <div class="avatar">${name.charAt(0).toUpperCase()}</div>
          <div class="comment-body">
              <div class="comment-header">
                  <p class="author" style="font-weight: bold;">${name}</p>
              </div>
              <p class="message">${message}</p>
              <div class="actions">
                  <button class="reply-btn"><i class="fa fa-reply"></i> Reply</button>
                  <button class="delete-btn"><i class="fa fa-trash"></i> Hapus</button>
              </div>
              <div class="reply-form" style="display: none;">
                  <input type="text" placeholder="Masukkan nama kamu" required>
                  <textarea placeholder="Balasan kamu" required></textarea>
                  <button type="submit" class="send-reply">Kirim Balasan</button>
              </div>
              <div class="reply-section"></div>
          </div>
      `;

      // Add event listener for the reply button
      const replyButton = comment.querySelector('.reply-btn');
      replyButton.addEventListener('click', function () {
          const replyForm = comment.querySelector('.reply-form');
          replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
      });

      // Add event listener for the delete button
      const deleteButton = comment.querySelector('.delete-btn');
      deleteButton.addEventListener('click', function () {
          deleteCommentFromLocalStorage(name, message, date);
          comment.remove();
      });

      // Add event listener for the reply form submission
      const replyForm = comment.querySelector('.reply-form');
      replyForm.addEventListener('submit', function (e) {
          e.preventDefault();

          const replyName = replyForm.querySelector('input').value;
          const replyMessage = replyForm.querySelector('textarea').value;
          const replyDate = formatDate(new Date()); // Format tanggal saat ini untuk balasan

          if (replyName && replyMessage) {
              const replyElement = createCommentElement(replyName, replyMessage, replyDate);
              const replySection = comment.querySelector('.reply-section');
              replySection.appendChild(replyElement);

              // Save reply to localStorage
              saveReplyToLocalStorage(name, message, replyName, replyMessage, replyDate);

              replyForm.querySelector('input').value = '';
              replyForm.querySelector('textarea').value = '';
              replyForm.style.display = 'none';
          } else {
              alert('Please fill out all fields!');
          }
      });

      return comment;
  }

  // Function to delete a comment from localStorage
  function deleteCommentFromLocalStorage(name, message) {
      let comments = JSON.parse(localStorage.getItem('comments')) || [];
      comments = comments.filter(comment => !(comment.name === name && comment.message === message));
      localStorage.setItem('comments', JSON.stringify(comments));
  }

    // Function to save a comment to localStorage
    function saveCommentToLocalStorage(name, message) {
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments.push({ name, message, replies: [] });
        localStorage.setItem('comments', JSON.stringify(comments));
    }

    // Function to save a reply to localStorage
    function saveReplyToLocalStorage(parentName, parentMessage, name, message) {
        const comments = JSON.parse(localStorage.getItem('comments'));
        const comment = comments.find(c => c.name === parentName && c.message === parentMessage);
        if (comment) {
            comment.replies.push({ name, message });
            localStorage.setItem('comments', JSON.stringify(comments));
        }
    }

    // Function to load comments from localStorage
    function loadComments() {
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments.forEach(comment => {
            const commentElement = createCommentElement(comment.name, comment.message);
            commentSection.appendChild(commentElement);

            // Load replies if any
            comment.replies.forEach(reply => {
                const replyElement = createCommentElement(reply.name, reply.message);
                const replySection = commentElement.querySelector('.reply-section');
                replySection.appendChild(replyElement);
            });
        });
    }
});
