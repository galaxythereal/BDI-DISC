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

// ============================================
// 5. QUIZ FUNCTIONALITY
// ============================================
let currentQuestion = 1;
const totalQuestions = 12;
let answers = {};

const discProfiles = {
    D: {
        title: 'الشخصية القيادية',
        icon: '🦁',
        strengths: [
            'تتخذ قرارات سريعة وحاسمة',
            'تركز على النتائج وتحقيق الأهداف',
            'تتعامل بشكل ممتاز مع العملاء من نفس النوع',
            'لا تخشى التحديات والمفاوضات الصعبة'
        ],
        challenges: [
            'قد تبدو متسرعاً مع العملاء الذين يحتاجون وقتاً',
            'قد تتجاهل بناء العلاقات الشخصية',
            'قد تفتقر للصبر مع التفاصيل الكثيرة'
        ],
        tips: [
            'تدرب على الصبر مع عملاء S و C',
            'خصص وقتاً لـ small talk مع عملاء I',
            'جهّز التفاصيل مسبقاً لعملاء C'
        ],
challengingTypes: 'قد تجد صعوبة مع عملاء S (يحتاجون صبراً) و C (يحتاجون تفاصيل)'
    },
    I: {
        title: 'الشخصية الاجتماعية',
        icon: '🦚',
        strengths: [
            'بناء علاقات قوية وسريعة',
            'الحماس والتفاؤل المعدي',
            'القدرة على الإقناع من خلال القصص',
            'إضفاء جو إيجابي على الاجتماعات'
        ],
        challenges: [
            'قد تتحدث أكثر مما تستمع',
            'قد تغفل عن التفاصيل الدقيقة والمتابعة',
            'قد تبالغ في الوعود بحماس اللحظة'
        ],
        tips: [
            'استمع أكثر وسجل ملاحظات مكتوبة',
            'ركز على الحقائق مع عملاء C',
            'التزم بالوقت ولا تخرج عن الموضوع مع D'
        ],
        challengingTypes: 'قد تجد صعوبة مع عملاء C (يريدون حقائق لا مشاعر) و D (يريدون إيجازاً)'
    },
    S: {
        title: 'الشخصية الهادئة',
        icon: '🕊️',
        strengths: [
            'مستمع ممتاز وصبور جداً',
            'يبني ثقة وولاء طويل المدى',
            'مخلص وداعم للفريق والعملاء',
            'يخلق بيئة آمنة للمناقشة'
        ],
        challenges: [
            'قد تتردد في إغلاق الصفقة (Closing)',
            'قد تأخذ وقتاً طويلاً جداً في الإجراءات',
            'تجد صعوبة في التعامل مع التغيير المفاجئ'
        ],
        tips: [
            'تدرب على الحزم وطلب الـ Order',
            'كن أكثر سرعة ومباشرة مع عملاء D',
            'لا تأخذ رفض العميل بشكل شخصي'
        ],
        challengingTypes: 'قد تجد صعوبة مع عملاء D (سريعون جداً) و I (فوضويون أحياناً)'
    },
    C: {
        title: 'الشخصية التحليلية',
        icon: '🦉',
        strengths: [
            'دقة متناهية في المعلومات',
            'تحليل منطقي ومنظم',
            'جودة عالية في العمل والمتابعة',
            'إجابات جاهزة لكل الأسئلة الفنية'
        ],
        challenges: [
            'قد تغرق العميل في تفاصيل غير ضرورية',
            'قد تبدو بارداً أو منعزلاً اجتماعياً',
            'البطء في اتخاذ القرار بسبب التحليل الزائد'
        ],
        tips: [
            'ركز على الصورة الكبيرة وليس فقط التفاصيل',
            'اهتم ببناء العلاقة الشخصية مع I و S',
            'اعطِ ملخصاً سريعاً للنتائج لعملاء D'
        ],
        challengingTypes: 'قد تجد صعوبة مع عملاء I (غير منظمين) و D (لا يهتمون بالتفاصيل)'
    }
};

function initQuiz() {
    const quizContainer = document.getElementById('quizContainer');
    if (!quizContainer) return;

    // Add event listeners to radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const currentQEl = document.querySelector(`.quiz-question[data-question="${currentQuestion}"]`);
            // Highlight selected option logic could go here
            
            // Enable next button
            const nextBtn = document.getElementById('nextBtn');
            if(nextBtn) nextBtn.disabled = false;

            // Save answer
            answers['q' + currentQuestion] = this.value;
        });
    });

    updateQuizProgress();
}

function nextQuestion() {
    // Validate selection
    if (!answers['q' + currentQuestion]) return;

    // Hide current
    document.querySelector(`.quiz-question[data-question="${currentQuestion}"]`).classList.remove('active');
    
    // Increment
    currentQuestion++;
    
    // Show next
    const nextQ = document.querySelector(`.quiz-question[data-question="${currentQuestion}"]`);
    if (nextQ) {
        nextQ.classList.add('active');
        
        // Update buttons
        document.getElementById('prevBtn').disabled = false;
        
        if (currentQuestion === totalQuestions) {
            document.getElementById('nextBtn').classList.add('hidden');
            document.getElementById('submitBtn').classList.remove('hidden');
        } else {
             // Disable next until selection
             const nextBtn = document.getElementById('nextBtn');
             // Check if already answered (if user went back then forward)
             nextBtn.disabled = !answers['q' + currentQuestion];
        }
        
        updateQuizProgress();
    }
}

function prevQuestion() {
    if (currentQuestion === 1) return;

    document.querySelector(`.quiz-question[data-question="${currentQuestion}"]`).classList.remove('active');
    currentQuestion--;
    document.querySelector(`.quiz-question[data-question="${currentQuestion}"]`).classList.add('active');

    document.getElementById('nextBtn').classList.remove('hidden');
    document.getElementById('submitBtn').classList.add('hidden');
    
    if (currentQuestion === 1) {
        document.getElementById('prevBtn').disabled = true;
    }
    
    document.getElementById('nextBtn').disabled = false; // Always enabled going back
    updateQuizProgress();
}

function updateQuizProgress() {
    const percent = ((currentQuestion - 1) / totalQuestions) * 100;
    const progressFill = document.getElementById('progressFillQuiz');
    const currentQSpan = document.getElementById('currentQuestion');
    const progressPercentSpan = document.getElementById('progressPercent');
    
    if (progressFill) progressFill.style.width = percent + '%';
    if (currentQSpan) currentQSpan.textContent = currentQuestion;
    if (progressPercentSpan) progressPercentSpan.textContent = Math.round(percent) + '%';
}

function showResults() {
    // Calculate Scores
    const counts = { D: 0, I: 0, S: 0, C: 0 };
    Object.values(answers).forEach(val => counts[val]++);

    // Find Max
    let maxType = 'D';
    let maxCount = 0;
    
    for (const [type, count] of Object.entries(counts)) {
        if (count > maxCount) {
            maxCount = count;
            maxType = type;
        }
    }

    // Update DOM
    const profile = discProfiles[maxType];
    
    document.getElementById('quizContainer').classList.add('hidden');
    document.getElementById('quizResults').classList.remove('hidden');
    
    // Header
    document.getElementById('resultsIcon').textContent = profile.icon;
    document.getElementById('resultType').textContent = maxType;
    document.getElementById('resultTitle').textContent = profile.title;
    
    // Chart
    const total = 12;
    ['D', 'I', 'S', 'C'].forEach(type => {
        const percent = Math.round((counts[type] / total) * 100);
        document.getElementById(`bar${type}`).style.width = percent + '%';
        document.getElementById(`value${type}`).textContent = percent + '%';
    });
    
    // Lists
    fillList('strengthsList', profile.strengths);
    fillList('challengesList', profile.challenges);
    fillList('tipsList', profile.tips);
    document.getElementById('challengingTypes').textContent = profile.challengingTypes;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function fillList(elementId, items) {
    const list = document.getElementById(elementId);
    if (!list) return;
    list.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
    });
}

function retakeQuiz() {
    currentQuestion = 1;
    answers = {};
    
    // Reset inputs
    document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
    
    // Reset UI
    document.getElementById('quizResults').classList.add('hidden');
    document.getElementById('quizContainer').classList.remove('hidden');
    
    document.querySelectorAll('.quiz-question').forEach(q => q.classList.remove('active'));
    document.querySelector('.quiz-question[data-question="1"]').classList.add('active');
    
    document.getElementById('prevBtn').disabled = true;
    document.getElementById('nextBtn').classList.remove('hidden');
    document.getElementById('nextBtn').disabled = true; // wait for input
    document.getElementById('submitBtn').classList.add('hidden');
    
    updateQuizProgress();
}

function shareResults() {
    const type = document.getElementById('resultType').textContent;
    const text = `اكتشفت أن نمط شخصيتي في المبيعات هو ${type} في كورس DISC Sales Mastery! 🎯`;
    
    if (navigator.share) {
        navigator.share({
            title: 'نتيجة اختبار DISC',
            text: text,
            url: window.location.href
        });
    } else {
        alert('تم نسخ النتيجة للحافظة: ' + text);
        navigator.clipboard.writeText(text);
    }
}

// Initialize quiz if on quiz page
document.addEventListener('DOMContentLoaded', initQuiz);


// ============================================
// 6. CUSTOMER SIMULATOR (Resources Page)
// ============================================

const scenarios = [
    {
        quote: "أنا مشغول جداً، عندك 5 دقائق. ما النتيجة اللي هتحققها لي؟ وكم التكلفة؟",
        context: "العميل يتحدث بسرعة، لغة جسده واثقة، ينظر في ساعته، لا يهتم بالـ small talk.",
        type: 'D',
        explanation: "التركيز على الوقت والنتيجة والتكلفة المباشرة، مع لغة الجسد الواثقة والاستعجال، علامات كلاسيكية لنمط D (المسيطر)."
    },
    {
        quote: "يا أهلاً! سمعت إن الشركة عندكم عملت شغل هايل مع شركة X. احكيلي عملتوا إيه؟ أنا بحب الأفكار المجنونة!",
        context: "العميل مبتسم جداً، نبرة صوت عالية ومتحمسة، يستخدم يديه كثيراً في الشرح.",
        type: 'I',
        explanation: "الحماس، السؤال عن الآخرين (Social Proof)، حب الأفكار الجديدة، والترحيب الحار، كلها صفات نمط I (المؤثر)."
    },
    {
        quote: "قبل ما نقرر، محتاج أعرف مين هيدرب الفريق؟ وإيه الضمانات لو حصلت مشكلة بعدين؟",
        context: "العميل هادئ، يتحدث ببطء، يبدو عليه القلق قليلاً، يركز على 'نحن' والفريق.",
        type: 'S',
        explanation: "البحث عن الأمان (الضمانات)، الاهتمام بالفريق، الهدوء والتروي، هي سمات نمط S (المستقر)."
    },
    {
        quote: "ممكن تبعتلي الـ Specs الفنية في ملف Excel؟ وعايز أعرف بالظبط نسبة الخطأ في النظام.",
        context: "العميل جاد، قليل الكلام، يسجل ملاحظات دقيقة، يركز على الأرقام والبيانات.",
        type: 'C',
        explanation: "طلب البيانات الدقيقة (Excel, Specs)، السؤال عن نسبة الخطأ، والجدية، تشير بوضوح لنمط C (التحليلي)."
    },
    {
        quote: "مش عايز تفاصيل كتير، قولي بس إيه الـ Bottom Line؟ هكسب كام؟",
        context: "يقاطعك أثناء الكلام، يريد الوصول للنهاية، صوته حازم.",
        type: 'D',
        explanation: "مقاطعة الكلام والبحث عن 'الخلاصة' والربح (Bottom Line) هي سلوكيات D بامتياز."
    }
];

let currentScenarioIndex = 0;
let simScore = 0;

function checkSimAnswer(selectedType) {
    const scenario = scenarios[currentScenarioIndex];
    const feedbackDisplay = document.getElementById('feedback-display');
    const optionsGrid = document.querySelector('.options-grid');
    
    if (!feedbackDisplay) return;

    // Disable buttons
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.disabled = true);

    optionsGrid.style.pointerEvents = 'none'; // Prevent multiple clicks
    feedbackDisplay.classList.remove('hidden');

    const feedbackIcon = document.getElementById('feedback-icon');
    const feedbackText = document.getElementById('feedback-text');
    const feedbackExpl = document.getElementById('feedback-explanation');
    const scoreEl = document.getElementById('sim-score');

    if (selectedType === scenario.type) {
        feedbackIcon.textContent = '✓';
        feedbackIcon.style.backgroundColor = '#4caf50';
        feedbackText.textContent = 'إجابة صحيحة!';
        feedbackText.style.color = '#4caf50';
        simScore += 10;
        if(scoreEl) scoreEl.textContent = simScore;
    } else {
        feedbackIcon.textContent = '✗';
        feedbackIcon.style.backgroundColor = '#f44336';
        feedbackText.textContent = `خطأ، النمط الصحيح هو ${scenario.type}`;
        feedbackText.style.color = '#f44336';
    }

    feedbackExpl.textContent = scenario.explanation;
}

function nextScenario() {
    currentScenarioIndex++;
    
    if (currentScenarioIndex >= scenarios.length) {
        // End Game
        const container = document.getElementById('simulator-game');
        container.innerHTML = `
            <div class="sim-end">
                <h3>انتهى التدريب! 🏁</h3>
                <div class="final-score">النتيجة النهائية: ${simScore} / ${scenarios.length * 10}</div>
                <p>ممتاز! لقد تدربت على تحديد الأنماط المختلفة.</p>
                <button class="btn btn-primary" onclick="location.reload()">لعب مرة أخرى</button>
            </div>
        `;
        return;
    }

    // Reset UI for next
    const scenario = scenarios[currentScenarioIndex];
    document.querySelector('.scenario-number').textContent = `السيناريو ${currentScenarioIndex + 1} من ${scenarios.length}`;
    document.getElementById('customer-quote').textContent = `"${scenario.quote}"`;
    document.getElementById('customer-context').textContent = scenario.context;
    
    document.getElementById('feedback-display').classList.add('hidden');
    const optionsGrid = document.querySelector('.options-grid');
    optionsGrid.style.pointerEvents = 'auto';
    
    document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = false);
}


// ============================================
// 7. CERTIFICATE GENERATOR (Resources Page)
// ============================================

function updateCertPreview() {
    const nameInput = document.getElementById('cert-name');
    const dateInput = document.getElementById('cert-date');
    const namePreview = document.getElementById('cert-name-preview');
    const datePreview = document.getElementById('cert-date-preview');

    if (nameInput && namePreview) {
        namePreview.textContent = nameInput.value || '[ اسمك هنا ]';
    }

    if (dateInput && datePreview) {
        const dateVal = dateInput.value;
        if (dateVal) {
            datePreview.textContent = new Date(dateVal).toLocaleDateString('ar-EG');
        } else {
            datePreview.textContent = '--/--/----';
        }
    }
}

function generateCertificate() {
    const nameInput = document.getElementById('cert-name');
    if (!nameInput || !nameInput.value.trim()) {
        alert('الرجاء كتابة اسمك الكامل أولاً');
        return;
    }

    // In a real app, this would use html2canvas or a PDF library.
    // For this prototype, we'll trigger the print dialog.
    window.print();
}

// Initialize Simulator if on resources page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('simulator-game')) {
        // Pre-fill date in certificate
        const dateInput = document.getElementById('cert-date');
        if (dateInput) {
            dateInput.valueAsDate = new Date();
            updateCertPreview();
        }
    }
});


// ============================================
// 8. SIDEBAR MINI QUIZ (Episode Pages)
// ============================================

function checkAnswer() {
    const selected = document.querySelector('input[name="q1"]:checked');
    if (!selected) {
        alert('الرجاء اختيار إجابة');
        return;
    }

    const parentLabel = selected.parentElement;
    const allLabels = document.querySelectorAll('.quiz-option');
    
    // Reset styles
    allLabels.forEach(label => {
        label.classList.remove('correct-answer', 'wrong-answer');
    });

    if (parentLabel.classList.contains('correct')) {
        parentLabel.classList.add('correct-answer');
        // Optional: Show success message or sound
    } else {
        parentLabel.classList.add('wrong-answer');
        // Highlight the correct one
        document.querySelector('.quiz-option.correct').classList.add('correct-answer');
    }
    
    // Disable button after answering
    document.querySelector('.check-answer-btn').disabled = true;
}

// Helper to keep footer year updated
document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.querySelector('.footer-bottom p');
    if (yearSpan && yearSpan.textContent.includes('2024')) {
        // Optional: Auto update year
        // yearSpan.innerHTML = yearSpan.innerHTML.replace('2024', new Date().getFullYear());
    }
});
