    /**
     * showBubble(text, options)
     * - text: string (phrase)
     * - options: {
     *     wordDelay: ms between words,
     *     firstDelay: initial delay,
     *     animation: boolean (use CSS animation),
     *     onComplete: callback
     *   }
     *
     * Реализует появление слов ПОСЛОВНО, каждое слово - span,
     * анимация задаётся через ключевые кадры wordIn.
     */
    (function(){
        const bubbleText = document.getElementById('bubbleText');
        const playBtn = document.getElementById('playBtn');
        const replayBtn = document.getElementById('replayBtn');
        const skipBtn = document.getElementById('skipBtn');

      // демо-фраза (твоё предложение)
        const demo = 'Claire, 34 ans, mère de deux enfants. Elle jongle chaque semaine entre factures, câlins et cafés froids.';

      // внутреннее состояние
        let timers = [];
        let isDisplaying = false;

    function clearTimers(){
        timers.forEach(t => clearTimeout(t));
        timers = [];
    }
    function sanitizeWords(text){
        // Разделяем по пробелам, сохраняя пунктуацию в словах.
        // Сохраним эмодзи как часть слова — split по пробелу.
        return text.trim().split(/\s+/);
    }

    function showBubble(text, options = {}){
        const { wordDelay = 300, firstDelay = 180, animation = true, onComplete } = options;

    // остановим прежнюю анимацию, если была
        clearTimers();
        isDisplaying = true;
        bubbleText.innerHTML = ''; // очистить

        const words = sanitizeWords(text);

        // Создаём спаны для слов, но изначально пустые (для плавного добавления)
        const spans = words.map((w, i) => {
        const span = document.createElement('span');
        span.className = 'word';
          // Добавляем пробел после слова визуально (margin-right в CSS)
        span.textContent = w;
        bubbleText.appendChild(span);
        return span;
    });
                // По-словно показываем
        spans.forEach((span, i) => {
          const delay = firstDelay + i * wordDelay;
            const t = setTimeout(() => {
            // если animation=true — применяем CSS-анимацию wordIn с индивидуальной задержкой
            if (animation) {
                span.style.animation = `wordIn 360ms ease forwards`;
                span.style.animationDelay = '0ms'; // анимация запускается сразу при добавлении
              // Но чтобы запустить эффект "по очереди", задаём небольшую задержку через setTimeout
                span.style.opacity = '1'; // резерв
                // вместо анимационной задержки используем transform/opacity вручную:
                span.style.transition = 'opacity 220ms ease, transform 220ms cubic-bezier(.2,.9,.3,1)';
                // краткий "включатель" — делаем видимым
                // небольшая микрозадержка чтобы transition сработал
                requestAnimationFrame(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0) scale(1)';
                });
            } else {
                span.style.opacity = '1';
            }

            // Последний — вызываем onComplete
            if (i === spans.length - 1){
                isDisplaying = false;
                if (typeof onComplete === 'function') onComplete();
            }
            }, delay);
            timers.push(t);
        });

        // Вдобавок: если пользователь просит показать всё сразу — предусмотрено отдельной кнопкой
        }
      // Функция мгновенного показа всего текста (без задержек)
        function showAllNow(){
        clearTimers();
        isDisplaying = false;
        const words = sanitizeWords(demo);
        bubbleText.innerHTML = '';
        words.forEach(w => {
            const span = document.createElement('span');
            span.className = 'word';
            span.style.opacity = '1';
            span.style.transform = 'translateY(0) scale(1)';
            span.textContent = w;
            bubbleText.appendChild(span);
        });
        }

      // Кнопки для демонстрации
        playBtn.addEventListener('click', () => {
        // если уже идёт анимация — ничего не делаем
        if (isDisplaying) return;
        showBubble(demo, { wordDelay: 350, firstDelay: 120, animation: true });
        });

        replayBtn.addEventListener('click', () => {
        clearTimers();
        isDisplaying = false;
        bubbleText.innerHTML = '';
        // маленькая пауза перед повтором
        setTimeout(() => showBubble(demo, { wordDelay: 280, firstDelay: 120 }), 120);
        });

        skipBtn.addEventListener('click', () => {
        showAllNow();
        });

      // Авто-показ при загрузке (необязательно)
        window.addEventListener('load', () => {
        setTimeout(() => {
            showBubble(demo, { wordDelay: 300, firstDelay: 140 });
        }, 400);
        });

      // Очистка перед выгрузкой страницы
        window.addEventListener('beforeunload', () => clearTimers());
    })();
  
