// Combined Slideshow and Typing Effect
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
const typedTextSpan = document.getElementById("typed-text");

// Each service is now mapped to its own unique background image (slide)
const services = [
    { name: "Shipping & Logistics", slideIndex: 0 },      // slide1 - Container ship
    { name: "Freight Forwarding", slideIndex: 1 },        // slide2 - Cargo plane
    { name: "Air Cargo Solutions", slideIndex: 2 },       // slide3 - Airplane
    { name: "Warehouse", slideIndex: 3 },               // slide4 - Warehouse interior
    { name: "Transportation & Handling", slideIndex: 4 },   // slide5 - Trucks/logistics       // slide6 - Port operations
    { name: "Trading", slideIndex: 5 }                    // slide6 - Business/trading
];


const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000;
let serviceIndex = 0;
let charIndex = 0;

function showSlide(slideIndex) {
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    if (slides[slideIndex]) slides[slideIndex].classList.add('active');
    if (indicators[slideIndex]) indicators[slideIndex].classList.add('active');
}

function loadSlideImage(slideIndex) {
    const images = [
        "0.jpg",
        "freight.jpeg",
        "2.png",
        "Warehouse.jpg",
        "handling.jpg",
        "trading.jpeg"
    ];

    if (slides[slideIndex]) {
        slides[slideIndex].style.backgroundImage = `url('${images[slideIndex]}')`;
    }
}

function type() {
    if (charIndex < services[serviceIndex].name.length) {
        typedTextSpan.textContent += services[serviceIndex].name.charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        typedTextSpan.textContent = services[serviceIndex].name.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        serviceIndex++;
        if (serviceIndex >= services.length) serviceIndex = 0;

        showSlide(services[serviceIndex].slideIndex);
        loadSlideImage(services[serviceIndex].slideIndex);

        setTimeout(type, typingDelay + 500);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    if (services.length) {
        slides[0].style.backgroundImage = "url('0.jpg')";
        showSlide(services[serviceIndex].slideIndex);
        setTimeout(type, newTextDelay / 2);
    }
});

indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => showSlide(index));
    indicator.addEventListener('click', () => {
        loadSlideImage(index);
        showSlide(index)
    });
});

// Mobile menu toggle with animation
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('nav')) {
        mobileMenu.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Counter animation
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                if (!counter.classList.contains('counted')) {
                    counter.classList.add('counted');
                    animateCounter(counter);
                }
            });
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Form submission
const contactForm = document.querySelector('#contact form');
contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const scriptURL = 'https://script.google.com/macros/s/AKfycbx0BFOwb_UKFj5y3TGjZns4J4JDpvyotZdjC_Ucy0uWyC6W1wZ_u49bOSocJYwyxzdTQw/exec';
    const form = this;
    const submitButton = form.querySelector('.submit-btn');
    const successMessage = form.querySelector('.form-message.success');
    const errorMessage = form.querySelector('.form-message.error');

    successMessage.classList.remove('show');
    errorMessage.classList.remove('show');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending';
    submitButton.classList.add('sending');

    const formData = new FormData(form);
    const companyInput = form.querySelector('#company');
    if (companyInput.value.trim() === '') {
        formData.set('company', 'N/A');
    }

    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
            if (response.ok) {
                console.log('Success!', response);
                successMessage.classList.add('show');
                form.reset();
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 5000);
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .catch(error => {
            console.error('Error!', error.message);
            errorMessage.classList.add('show');
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 5000);
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
            submitButton.classList.remove('sending');
        });
});

// Restrict contact number to digits only
const contactNumberInput = document.getElementById('contactNumber');
if (contactNumberInput) {
    contactNumberInput.addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
}

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Back to Top button logic
const backToTopButton = document.querySelector('.back-to-top');
if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Show button after scrolling 300px
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
}


// Interactive Services Section
const serviceItems = document.querySelectorAll('.service-item');
const serviceContents = document.querySelectorAll('.service-description-content');

// Add a background container
const servicesHero = document.querySelector('.services-hero'); // The main section

serviceItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const targetService = item.getAttribute('data-target');

        serviceItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        serviceContents.forEach(content => {
            if (content.getAttribute('data-service') === targetService) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        servicesHero.classList.remove("bg-rice", "bg-agri", "bg-salt", "bg-scrap", "bg-coal", "bg-shipping", "bg-freight");
        if (targetService === "rice") servicesHero.classList.add("bg-rice");
        if (targetService === "agri-products") servicesHero.classList.add("bg-agri");
        if (targetService === "salt") servicesHero.classList.add("bg-salt");
        if (targetService === "scrap") servicesHero.classList.add("bg-scrap");
        if (targetService === "coal") servicesHero.classList.add("bg-coal");
        if (targetService === "shippinglogistics") servicesHero.classList.add("bg-shipping");
        if (targetService === "freightaircargo") servicesHero.classList.add("bg-freight")
    });
});
