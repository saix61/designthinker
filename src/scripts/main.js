document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Предотвращаем стандартное поведение ссылки
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


function startFirstView() {
    function typeWriter(elementId, speed) {
        const element = document.querySelector(elementId);
        console.log(element);

        if (!element) return;

        // Находим родительский элемент (если необходимо)
        const parent = element.parentNode;

        // Находим следующий <p> элемент
        const nextP = parent.querySelector('p:nth-of-type(2)'); // Предполагаем, что следующий элемент - это <p>
        let text = nextP.textContent; // Получаем текст из следующего <p> элемента

        let index = 0;

        function printChar() {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
                setTimeout(printChar, speed);
            }
        }

        printChar();
    }

    // Запускаем эффект (скорость — в миллисекундах)
    setTimeout(() => {
        typeWriter('.typewriter', 30);
    }, 1500);



    let isCounted = false;
    function startCounter() {
        const counter = document.querySelector('.js-counter');
        if (!counter) return

        if (isCounted || !(counter.classList.contains('_active') || counter.closest('._active'))) {
            return;
        }
        isCounted = true;

        const counterText = counter.querySelector('span');

        const targetCount = parseInt(counter.dataset.count, 10);
        const duration = 2000; // Общая длительность (10 секунд)
        let startTime = null;

        // Функция: ease-out (замедление) для 80–100%
        function easeOut(t) {
            return 1 - (1 - t) * (1 - t); // Обратное квадратичное замедление
        }

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;

            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1); // 0 → 1

            let currentValue;

            if (progress <= 0.1) {
                // Фаза 1: 0–95% (ускорение)
                const easedProgress = progress / 0.1;
                currentValue = Math.floor(easedProgress * (targetCount * 0.1));
            } else {
                // Фаза 2: 95–100% (замедление)
                const phaseProgress = (progress - 0.1) / 0.9;
                const easedPhaseProgress = easeOut(phaseProgress);
                currentValue = Math.floor(
                    (targetCount * 0.1) + easedPhaseProgress * (targetCount * 0.9)
                );
            }

            counterText.textContent = currentValue;

            // Продолжаем анимацию, пока не достигнем 100%
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
            else {
                counter.classList.remove('js-counter')
            }
        }

        requestAnimationFrame(animate);
    }



    function isTriggeredCaseOne(element) {
        const rect = element.getBoundingClientRect();
        return rect.top <= window.innerHeight - rect.height
    }

    function isElementInViewportCenter(element) {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Y‑координата центра элемента
        const elementCenterY = rect.top + (rect.height + window.innerHeight) / 2;

        // Проверяем, попадает ли центр элемента в видимую область
        return elementCenterY <= viewportHeight;
    }

    // Функция для обновления классов у элементов
    function updateElementsState() {
        // Получаем все элементы с нужным классом
        const elements = document.querySelectorAll('.js-anm-scroll'); // замените на ваш класс

        elements.forEach(element => {
            if (isElementInViewportCenter(element)) {
                element.classList.add('_center');
                element.classList.add('_delay-disabled');
                if (element.classList.contains('portfolio-list')) {
                    element.closest('.portfolio').querySelector('.anm-fixed').classList.add('_fix-heading')
                }
            } else {
                element.classList.remove('_center');
                if (element.classList.contains('portfolio-list')) {
                    element.closest('.portfolio').querySelector('.anm-fixed').classList.remove('_fix-heading')
                }
            }

            if (isTriggeredCaseOne(element)) {
                element.classList.add('_active');

                startCounter()

                if (element.classList.contains('anm-fixed')) {
                    document.querySelector('.hero').classList.add('_fade');
                }
            }
            else {
                if (element.classList.contains('anm-fixed')) {
                    document.querySelector('.hero').classList.remove('_fade');
                }
            }
        });
    }

    // Вызываем при загрузке, прокрутке и изменении размера окна
    window.addEventListener('scroll', updateElementsState);
    window.addEventListener('resize', updateElementsState);
    updateElementsState()
}

document.addEventListener('DOMContentLoaded', () => {
    const targetText = 'TRANSFORMATION';
    const displayLength = 14;
    const totalSteps = 26;
    const finalPhaseSteps = 15;

    const preloader = document.querySelector('.js-preloader')
    const textElement = preloader.querySelector('.text');

    function getRandomChar() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return chars.charAt(Math.floor(Math.random() * chars.length));
    }

    function generateRandomString(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += getRandomChar();
        }
        return result;
    }

    function wrapInSpans(text) {
        return text
            .split('')
            .map(char => `<span>${char}</span>`)
            .join('');
    }

    let step = 0;

    function animate() {
        if (step < totalSteps - finalPhaseSteps) {
            // Начальная фаза: быстрая смена случайных строк
            textElement.innerHTML = wrapInSpans(generateRandomString(displayLength));

            // Следующий шаг через фиксированное время
            if (step < totalSteps - 1) {
                setTimeout(animate, 100);
            }
        } else {
            // Финальная фаза: постепенное проявление текста с замедлением
            const finalStep = step - (totalSteps - finalPhaseSteps); // 0..14
            const progress = finalStep / (finalPhaseSteps - 1); // 0..1

            // Нелинейное замедление: задержка растёт квадратично
            const baseDelay = 150;
            const maxDelay = 200;
            const delay = baseDelay + (maxDelay - baseDelay) * progress * progress;

            // Формирование текущей строки
            const visibleChars = Math.ceil(
                (finalStep + 1) * (targetText.length / finalPhaseSteps)
            );
            let displayedText = targetText.substring(0, visibleChars);

            // Дополнение до 14 символов случайными буквами
            while (displayedText.length < displayLength) {
                displayedText += getRandomChar();
            }

            textElement.innerHTML = wrapInSpans(displayedText);

            // Планируем следующий шаг с переменной задержкой
            if (step < totalSteps - 1) {
                setTimeout(animate, delay);
            } else {
                // Финальное состояние (без дополнительных вызовов)
                textElement.innerHTML = wrapInSpans(targetText);

                setTimeout(() => {
                    preloader.classList.add('_hidden');
                    document.body.style.overflow = '';
                    setTimeout(() => {
                        startFirstView()
                    }, 500);
                }, 1000);
            }
        }

        step++;
    }

    // Запуск анимации
    setTimeout(() => {
        preloader.classList.add('_active')

        setTimeout(() => {
            animate();
        }, 100);
    }, 100);
});
