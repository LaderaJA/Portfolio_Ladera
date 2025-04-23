// pop-out
document.querySelectorAll('.screenshot').forEach(img => {
    img.addEventListener('click', function () {
    const modalImg = document.getElementById('modalImage');
    modalImg.src = this.src;
    });
});
