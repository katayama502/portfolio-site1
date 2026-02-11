document.addEventListener('DOMContentLoaded', () => {

    // Loading Screen
    const loadingScreen = document.getElementById('loading');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 1000);
        }, 1500); // Fake load time for effect
    });

    // Scroll Observer for Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // observer.unobserve(entry.target); // Keep observing if we want re-trigger, or unobserve for once
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animateElements = document.querySelectorAll('h2, .text-block p, .timeline-item, .grid-item, .vision-text, .skill-list');
    animateElements.forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });

    // Smooth Scroll for Nav
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Simple Glitch Effect for Title (Optional enhancement)
    const title = document.querySelector('.glitch-text');
    if (title) {
        setInterval(() => {
            title.style.textShadow = `
                ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0 #ff004c,
                ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0 #00f0ff
            `;
            setTimeout(() => {
                title.style.textShadow = 'none';
            }, 100);
        }, 3000);
    }
    // Audio Implementation
    // Note: Browsers block autoplay. We need a user interaction to start audio.
    const audioContext = {
        bgm: new Audio('audio/bgm.mp3'),
        click: new Audio('audio/click_bass.mp3'),
        isBgmPlaying: false
    };

    // Configure BGM
    audioContext.bgm.loop = true;
    audioContext.bgm.volume = 0.5; // Adjust volume as needed

    // Function to start BGM
    const startBgm = () => {
        if (!audioContext.isBgmPlaying) {
            audioContext.bgm.play().then(() => {
                audioContext.isBgmPlaying = true;
                console.log('BGM started');
            }).catch(e => {
                console.log('BGM play failed (likely needs interaction):', e);
            });
        }
    };

    // Play click sound with overlap support
    const playClickSound = () => {
        const sound = audioContext.click.cloneNode();
        sound.volume = 0.8; // Bass slightly louder
        sound.play().catch(e => console.log('Click sound failed:', e));
    };

    // Initialize Audio on first interaction
    const initAudio = () => {
        startBgm();
        document.removeEventListener('click', initAudio);
        document.removeEventListener('keydown', initAudio);
        document.removeEventListener('touchstart', initAudio);
    };

    document.addEventListener('click', initAudio);
    document.addEventListener('keydown', initAudio);
    document.addEventListener('touchstart', initAudio);

    // Global click listener for bass sound
    document.addEventListener('mousedown', () => {
        // We use mousedown for immediate feedback
        playClickSound();
    });
});
