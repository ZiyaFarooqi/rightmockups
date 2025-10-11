document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Navigation Logic ---
    const nav = document.querySelector(".nav-links");
    const navToggle = document.querySelector(".mobile-nav-toggle");

    if(navToggle) {
        navToggle.addEventListener("click", () => {
            const visibility = nav.getAttribute("data-visible");
    
            if (visibility === "false") {
                nav.setAttribute("data-visible", true);
                navToggle.setAttribute("aria-expanded", true);
            } else {
                nav.setAttribute("data-visible", false);
                navToggle.setAttribute("aria-expanded", false);
            }
        });
    }

    // --- On-Scroll Reveal Animation Logic ---
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));
    
    // --- Homepage: Interactive Before & After Slider Logic ---
    const sliderContainer = document.querySelector('.before-after-container');
    if (sliderContainer) {
        const resizer = sliderContainer.querySelector('.resizer');
        const afterImage = sliderContainer.querySelector('.after-image');
        let isResizing = false;
        const startResize = (e) => { isResizing = true; resizer.style.background = 'var(--primary-color)'; };
        const endResize = () => { isResizing = false; resizer.style.background = 'white'; };
        const resize = (e) => {
            if (!isResizing) return;
            const clientX = e.clientX || e.touches[0].clientX;
            const rect = sliderContainer.getBoundingClientRect();
            let x = Math.max(0, Math.min(clientX - rect.left, rect.width));
            afterImage.style.width = x + 'px';
            resizer.style.left = x + 'px';
        };
        resizer.addEventListener('mousedown', startResize);
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', endResize);
        resizer.addEventListener('touchstart', startResize, { passive: true });
        window.addEventListener('touchmove', resize, { passive: true });
        window.addEventListener('touchend', endResize);
    }
    
    // --- OFFERS PAGE: REVISED INTERACTIVE CALCULATOR LOGIC ---
    const mockupSlider = document.getElementById('mockup-slider');
    if (mockupSlider) {
        const quantityDisplay = document.getElementById('quantity-display');
        const deliveryDisplay = document.getElementById('delivery-display');
        const pricePerMockupDisplay = document.getElementById('price-per-mockup-display');
        const totalPriceDisplay = document.getElementById('total-price-display');
        const calculatorCta = document.getElementById('calculator-cta');
        const presetButtons = document.querySelectorAll('.preset-btn');

        const tiers = [
            { quantity: 50,   price: 20,   delivery: "2 Days" },
            { quantity: 100,  price: 40,   delivery: "3 Days" },
            { quantity: 250,  price: 100,  delivery: "5 Days" },
            { quantity: 500,  price: 150,  delivery: "7 Days" },
            { quantity: 1000, price: 250,  delivery: "10 Days" },
            { quantity: 2000, price: 500,  delivery: "15 Days" }
        ];

        function getSurroundingTiers(quantity) {
            let lowerTier = tiers[0];
            let upperTier = tiers[tiers.length - 1];
            for (let i = 0; i < tiers.length; i++) {
                if (quantity >= tiers[i].quantity) { lowerTier = tiers[i]; }
                if (quantity < tiers[i].quantity) { upperTier = tiers[i]; break; }
            }
            return { lowerTier, upperTier };
        }

        function calculatePrice(quantity) {
            const { lowerTier, upperTier } = getSurroundingTiers(quantity);
            if (quantity === lowerTier.quantity) { return lowerTier.price; }
            if (quantity >= upperTier.quantity && lowerTier === upperTier) {
                const pricePer = upperTier.price / upperTier.quantity;
                return quantity * pricePer;
            }
            const quantityRange = upperTier.quantity - lowerTier.quantity;
            const priceRange = upperTier.price - lowerTier.price;
            const quantityAboveLower = quantity - lowerTier.quantity;
            const price = lowerTier.price + (quantityAboveLower / quantityRange) * priceRange;
            return Math.ceil(price / 5) * 5;
        }

        function updateCalculator(quantity) {
            const numQuantity = parseInt(quantity);
            const { lowerTier } = getSurroundingTiers(numQuantity);
            const finalPrice = calculatePrice(numQuantity);
            const pricePerMockup = (finalPrice / numQuantity).toFixed(2);

            quantityDisplay.textContent = numQuantity;
            deliveryDisplay.textContent = lowerTier.delivery;
            pricePerMockupDisplay.textContent = `$${pricePerMockup}`;
            totalPriceDisplay.textContent = `$${finalPrice.toLocaleString('en-US')}`;
            calculatorCta.textContent = `Get Started with ${numQuantity} Mockups`;
            presetButtons.forEach(btn => {
                btn.classList.toggle('active', parseInt(btn.dataset.quantity) === numQuantity);
            });
        }

        mockupSlider.addEventListener('input', (e) => {
            updateCalculator(e.target.value);
        });

        presetButtons.forEach(button => {
            button.addEventListener('click', () => {
                const quantity = button.dataset.quantity;
                mockupSlider.value = quantity;
                updateCalculator(quantity);
            });
        });

        updateCalculator(mockupSlider.value);
    }

    // --- Services Page: 3D Interactive Tilt Card Logic ---
    const tiltCards = document.querySelectorAll('.step');
    if (tiltCards.length > 0) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const rotateY = (x / rect.width) * 20;
                const rotateX = (y / rect.height) * -20;
                card.style.setProperty('--rotateY', `${rotateY}deg`);
                card.style.setProperty('--rotateX', `${rotateX}deg`);
            });
            card.addEventListener('mouseleave', function() {
                card.style.setProperty('--rotateY', '0deg');
                card.style.setProperty('--rotateX', '0deg');
            });
        });
    }

    // --- Services Page: FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const answer = item.querySelector('.faq-answer');
                const isOpen = item.classList.contains('active');
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                });
                if (!isOpen) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }

    // --- Global: Contact Form Logic has been removed to allow Web3Forms to work correctly ---
    
});