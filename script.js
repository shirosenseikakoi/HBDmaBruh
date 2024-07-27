let isBlown = false; // Flag to prevent multiple triggers

function flipCard() {
    document.querySelector('.card').classList.toggle('flipped');
}

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const microphone = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        microphone.connect(analyser);
        
        function detectSound() {
            analyser.getByteFrequencyData(dataArray);
            let values = 0;

            for (let i = 0; i < dataArray.length; i++) {
                values += dataArray[i];
            }

            let average = values / dataArray.length;

            // Adjust sensitivity threshold here (higher value = less sensitive)
            if (average > 80 && !isBlown) {
                blowOutCandles();
                playBirthdayMusic();
                startConfetti();
                isBlown = true; // Set flag to true to prevent multiple triggers
                setTimeout(() => {
                    isBlown = false; // Reset flag after a delay to allow re-trigger
                }, 2000); // Adjust delay as needed
            }

            requestAnimationFrame(detectSound);
        }

        detectSound();
    })
    .catch(err => {
        console.error('Error accessing microphone: ' + err);
    });

function blowOutCandles() {
    const candles = document.querySelectorAll('.candle');
    candles.forEach(candle => candle.classList.add('blown-out'));
    
}

function playBirthdayMusic() {
    const audio = new Audio('https://raw.githubusercontent.com/shirosenseikakoi/birthdaysong/main/July%209%20Happy%20Birthday%20Song%20%20Best%20Happy%20Birthday%20to%20You.mp3');
    audio.play();
}

function startConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50'];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    function Confetti() {
        this.x = randomInRange(0, canvas.width);
        this.y = randomInRange(-canvas.height, -10);
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speedX = randomInRange(-3, 3);
        this.speedY = randomInRange(2, 5);
        this.rotation = randomInRange(0, 2 * Math.PI);
        this.scale = randomInRange(0.5, 1.5);
        this.opacity = randomInRange(0.5, 1);

        this.update = function() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.speedX / 100;
            ctx.globalAlpha = this.opacity;
            ctx.save();
            ctx.translate(this.x + 7, this.y + 7);
            ctx.rotate(this.rotation);
            ctx.scale(this.scale, this.scale);
            ctx.fillStyle = this.color;
            ctx.fillRect(-7, -7, 14, 14);
            ctx.restore();

            if (this.y > canvas.height) {
                this.y = randomInRange(-canvas.height, -10);
            }
        };
    }

    const confettiParticles = [];

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiParticles.forEach(particle => particle.update());
        requestAnimationFrame(animateConfetti);
    }

    for (let i = 0; i < 150; i++) {
        confettiParticles.push(new Confetti());
    }

    animateConfetti();
}