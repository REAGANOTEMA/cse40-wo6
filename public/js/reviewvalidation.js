document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reviewForm');
    form.addEventListener('submit', (e) => {
        const rating = parseInt(form.rating.value);
        if (rating < 1 || rating > 5) {
            e.preventDefault();
            alert('Rating must be between 1 and 5');
        }
    });
});
