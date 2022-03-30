const newFormHandler = async (event) => {
    event.preventDefault();

    const title = document.querySelector('#blog-title').value.trim();
    const blog_text = document.querySelector('#blog-text').value.trim();

    if (title && blog_text) {
        const response = await fetch ('/api/blogs', {
            method: 'POST',
            body: JSON.stringify({ title: title, blog_text: blog_text }),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('Failed to create blog')
        }
    }
};

const delButtonHandler = async (event) => {
    if (event.target.hasAttribute('data-id')) {
        const id = event.target.getAttribute('data-id');

        const response = await fetch (`/api/blog/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('Failed to delete blog')
        }
    }
};

document 
    .querySelector('#new-blog-form')
    .addEventListener('submit', newFormHandler);

// document 
//     .querySelector('.blog-list')
//     .addEventListener('click', delButtonHandler);