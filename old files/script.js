// Page Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('pageLoader').classList.add('hidden');
    }, 800);
});

// Hero Slider
let currentSlide = 0;
let slideInterval;

function initializeSlider() {
    slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 6000);
}

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
}

function goToSlide(index) {
    showSlide(index);
}

// Testimonials
let currentTestimonial = 0;

function initializeTestimonials() {
    setInterval(() => {
        const testimonials = document.querySelectorAll('.testimonial');
        testimonials[currentTestimonial].classList.remove('active');
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonials[currentTestimonial].classList.add('active');
    }, 5000);
}

// Mobile Menu
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.getElementById('menuToggle');
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
}

// Scroll Progress
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('scrollProgress').style.width = scrolled + '%';

    const backToTop = document.getElementById('backToTop');
    if (winScroll > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// Scroll to Top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Quote Form
function openQuoteForm() {
    alert('Quote Request Form\n\nThank you for your interest in Raito Opto Electronics!\n\nIn a full implementation, this would open a detailed quote request form where you can:\n\n• Select product type\n• Specify requirements\n• Provide contact information\n• Request a demo\n\nContact us at:\nEmail: sales@raitoopto.com\nPhone: +91 (422) 123-4567');
}

// Initialize on load
initializeSlider();
initializeTestimonials();