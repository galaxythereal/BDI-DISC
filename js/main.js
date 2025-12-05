/* ============================================
   DISC SALES MASTERY - MAIN JAVASCRIPT
   ============================================ */

// ============================================
// 1. NAVIGATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
});

// ============================================
// 2. AUDIO PLAYER
// ============================================
let audioPlayer = null;
let isPlaying = false;
let currentSpeed = 1;
const speeds = [0.75, 1, 1.25, 1.5, 2];
let speedIndex = 1;

function initAudioPlayer() {
    audioPlayer = document.getElementById('episode-audio');
    if (!audioPlayer) return;
    
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressFill = document.getElementById('progressFill');
    const progressHandle = document.getElementById('progressHandle');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    
    // Update duration when metadata loads
    audioPlayer.addEventListener('loadedmetadata', function() {
        if (durationEl) {
            durationEl.textContent = formatTime(audioPlayer.duration);
        }
    });
    
    // Update progress
    audioPlayer.addEventListener('timeupdate', function() {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        if (progressFill) progressFill.style.width = progress + '%';
        if (progressHandle) progressHandle.style.left = progress + '%';
        if (currentTimeEl) currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    });
    
    // Audio ended
    audioPlayer.addEventListener('ended', function() {
        isPlaying = false;
        updatePlayPauseButton();
    });
}

function togglePlay() {
    if (!audioPlayer) {
        audioPlayer = document.getElementById('episode-audio');
    }
    
    if (!audioPlayer) return;
    
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        audioPlayer.play();
    }
    
    isPlaying = !isPlaying;
    updatePlayPauseButton();
}

function updatePlayPauseButton() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    if (playPauseBtn) {
        if (isPlaying) {
            playPauseBtn.classList.add('playing');
        } else {
            playPauseBtn.classList.remove('playing');
        }
    }
}

function seek(event) {
    if (!audioPlayer) return;
    
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;
    
    const rect = progressBar.getBoundingClientRect();
    const pos = (rect.right - event.clientX) / rect.width; // RTL adjustment
    audioPlayer.currentTime = pos * audioPlayer.duration;
}

function skipTime(seconds) {
    if (!audioPlayer) return;
    audioPlayer.currentTime += seconds;
}

function changeSpeed() {
    if (!audioPlayer) return;
    
    speedIndex = (speedIndex + 1) % speeds.length;
    currentSpeed = speeds[speedIndex];
    audioPlayer.playbackRate = currentSpeed;
    
    const speedDisplay = document.getElementById('speedDisplay');
    if (speedDisplay) {
        speedDisplay.textContent = currentSpeed + 'x';
    }
}

function changeVolume(value) {
    if (!audioPlayer) return;
    audioPlayer.volume = value / 100;
}

function toggleMute() {
    if (!audioPlayer) return;
    audioPlayer.muted = !audioPlayer.muted;
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

// Initialize audio player when DOM is ready
document.addEventListener('DOMContentLoaded', initAudioPlayer);

// ============================================
// 3. EXPANDABLE CONTENT
// ============================================
function toggleExpand(button) {
    const expandContent = button.nextElementSibling;
    button.classList.toggle('active');
    expandContent.classList.toggle('active');
}

function toggleTranscript() {
    const transcriptBody = document.querySelector('.transcript-body');
    const expandBtn = document.querySelector('.expand-transcript-btn');
    
    if (transcriptBody && expandBtn) {
        transcriptBody.classList.toggle('expanded');
        expandBtn.classList.toggle('active');
        
        if (transcriptBody.classList.contains('expanded')) {
            expandBtn.querySelector('span').textContent = 'إخفاء النص';
        } else {
            expandBtn.querySelector('span').textContent = 'عرض النص الكامل';
        }
    }
}

// ============================================
// 4. FAQ ACCORDION
// ============================================
function toggleFaq(button) {
    const answer = button.nextElementSibling;
    const isActive = button.classList.contains('active');
    
    // Close all FAQs
    document.querySelectorAll('.faq-question').forEach(q => {
        q.classList.remove('active');
        q.nextElementSibling.classList.remove('active');
    });
    
    // Open clicked FAQ if it wasn't active
    if (!isActive) {
        button.classList.add('active');
        answer.classList.add('active');
    }
}

// // ============================================
// // 5. QUIZ FUNCTIONALITY
// // ============================================
// let currentQuestion = 1;
// const totalQuestions = 12;
// let answers = {};

// const discProfiles = {
//     D: {
//         title: 'الشخصية القيادية',
//         icon: '🦁',
//         strengths: [
//             'تتخذ قرارات سريعة وحاسمة',
//             'تركز على النتائج وتحقيق الأهداف',
//             'تتعامل بشكل ممتاز مع العملاء من نفس النوع',
//             'لا تخشى التحديات والمفاوضات الصعبة'
//         ],
//         challenges: [
//             'قد تبدو متسرعاً مع العملاء الذين يحتاجون وقتاً',
//             'قد تتجاهل بناء العلاقات الشخصية',
//             'قد تفتقر للصبر مع التفاصيل الكثيرة'
//         ],
//         tips: [
//             'تدرب على الصبر مع عملاء S و C',
//             'خصص وقتاً لـ small talk مع عملاء I',
//             'جهّز التفاصيل مسبقاً لعملاء C'
//         ],
//         challengingTypes: 'قد تجد صعوبة مع عملاء S (يحتاجون صبراً) و C (يحتاجون تفاصيل)'
