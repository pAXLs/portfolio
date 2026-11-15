/**
 * PORTFOLIO CLIENT-SIDE INTERACTIVITY
 * Aleksandr Pavlenko (AXL.DEV)
 * - Navigation & Smooth Scroll
 * - Theme Switcher (Dark/Light + LocalStorage)
 * - Typing Animation
 * - Portfolio Filter & Lightbox Modal
 * - Form Validation with Email Check (@ and domain)
 * - Toast Notification System
 * - Back to Top & Copy URL
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. Header Scroll Effect & Back-to-Top ---
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (scrollY > 350) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
    
    highlightNavOnScroll();
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- 2. Mobile Menu (Burger) ---
  const burgerBtn = document.getElementById('burger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMenu() {
    burgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll', navMenu.classList.contains('active'));
  }

  burgerBtn.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          if (navMenu.classList.contains('active')) {
            toggleMenu();
          }
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Highlight active link on scroll
  const sections = document.querySelectorAll('section[id]');
  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.nav-link[href*="#${sectionId}"]`);
      
      if (navItem) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItem.classList.add('active');
        } else {
          navItem.classList.remove('active');
        }
      }
    });
  }

  // --- 3. Dark / Light Theme Toggle ---
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('axl_portfolio_theme');
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else {
    // Default to dark theme for developer portfolio
    htmlElement.setAttribute('data-theme', 'dark');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('axl_portfolio_theme', newTheme);
    showToast('Тема обновлена', `Включена ${newTheme === 'dark' ? 'тёмная' : 'светлая'} тема.`);
  });

  // --- 4. Typing Effect ---
  const typingElement = document.querySelector('.typing-text');
  const phrases = [
    'Frontend Developer',
    'Game Dev (Godot)',
    'UI/UX & Web Engineer',
    'Студент ГУАП (Санкт-Петербург)'
  ];
  let phraseIndex = 0;
  let letterIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, letterIndex - 1);
      letterIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentPhrase.substring(0, letterIndex + 1);
      letterIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && letterIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at end of phrase
    } else if (isDeleting && letterIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before typing new phrase
    }

    setTimeout(typeEffect, typingSpeed);
  }
  if (typingElement) {
    typeEffect();
  }

  // --- 5. Portfolio Gallery Filters ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // --- 6. Lightbox Modal for Project Details ---
  const modalBackdrop = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalContent = document.getElementById('modal-content');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');

  const projectDetailsData = {
    project1: {
      title: 'Devil Hunter Game',
      subtitle: '2D Action-RPG на движке Godot',
      image: 'assets/project1.svg',
      tags: ['Godot Engine', 'GDScript', 'Pixel Art', 'State Machine', 'Game Design'],
      description: 'Полноценный инди-проект, разработанный с нуля на Godot Engine. Реализован конечный автомат состояний персонажа (бег, атаки, уклонение, получение урона), система анимаций спрайтов, искусственный интеллект врагов и система инвентаря.',
      github: 'https://github.com/pAXLs/devil_hanter_game',
      metrics: 'FPS: стабильные 60+ на любых ПК • Размер билда: &lt; 35 МБ'
    },
    project2: {
      title: 'Crypto SaaS Dashboard',
      subtitle: 'Аналитическая панель для трейдинга и аналитики',
      image: 'assets/project2.svg',
      tags: ['JavaScript ES6+', 'CSS Grid', 'Chart.js', 'WebSockets', 'Responsive UI'],
      description: 'Высокопроизводительный веб-интерфейс для мониторинга котировок, визуализации свечных графиков и баланса портфеля. Поддержка светлой и темной тем, адаптивная сетка дашборда и экспорт отчетов.',
      github: 'https://github.com/pAXLs/portfolio',
      metrics: 'Время загрузки: 0.7 сек • Lighthouse Score: 98/100'
    },
    project3: {
      title: 'Pulse UI Design System',
      subtitle: 'Комплексная библиотека дизайн-токенов в Figma',
      image: 'assets/project3.svg',
      tags: ['Figma', 'UI/UX Design', 'Auto Layout 5.0', 'Design Tokens', 'Accessibility'],
      description: 'Библиотека из более чем 80 адаптивных компонентов (кнопки, инпуты, карточки, модальные окна, навигация) с поддержкой цветовых токенов WCAG 2.1 AA для доступности людей с нарушениями зрения.',
      github: 'https://github.com/pAXLs/portfolio',
      metrics: '80+ компонентов • 120+ вариантов состояний'
    },
    project4: {
      title: 'EcoSmart IoT Landing',
      subtitle: 'Презентационный лендинг умных контроллеров',
      image: 'assets/project4.svg',
      tags: ['HTML5', 'CSS Keyframes', 'Flexbox', 'Intersection Observer', 'Mobile First'],
      description: 'Маркетинговый промо-сайт для линейки IoT-датчиков. Включает интерактивный калькулятор энергопотребления, 3D-эффект карточек при движении курсора и оптимизированную SVG-графику.',
      github: 'https://github.com/pAXLs/portfolio',
      metrics: 'Чистый CSS без сторонних фреймворков • Полная адаптивность'
    },
    project5: {
      title: 'SUAI StudyFlow Portal',
      subtitle: 'Веб-платформа для студентов ГУАП',
      image: 'assets/project5.svg',
      tags: ['FastAPI', 'Python', 'Vanilla JS', 'ГОСТ 7.32', 'Automation'],
      description: 'Внутренний сервис для трекинга учебных заданий, расписания лабораторных работ и автоматизированной проверки оформления отчетов в соответствии со стандартами ЕСКД и ГОСТ 7.32.',
      github: 'https://github.com/pAXLs/portfolio',
      metrics: 'Интеграция с университетскими стандартами ГУАП'
    }
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-id');
      const data = projectDetailsData[projectId];
      if (data) {
        modalContent.innerHTML = `
          <div style="margin-bottom: 20px;">
            <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 260px; object-fit: cover; border-radius: 12px; margin-bottom: 20px;">
            <span style="font-size: 0.85rem; color: var(--accent-cyan); font-weight: 700; text-transform: uppercase;">${data.subtitle}</span>
            <h3 style="font-size: 1.8rem; margin: 6px 0 14px; color: var(--text-main);">${data.title}</h3>
            <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">${data.description}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
              ${data.tags.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
            <div style="background: rgba(255,255,255,0.04); padding: 12px 16px; border-radius: 8px; font-size: 0.85rem; color: var(--text-dim); margin-bottom: 20px;">
              📊 <strong>Метрики:</strong> ${data.metrics}
            </div>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">Перейти к коду проекта</a>
              <button class="btn btn-secondary btn-sm" onclick="document.getElementById('modal-close-btn').click()">Закрыть</button>
            </div>
          </div>
        `;
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  // --- 7. Feedback Form Validation ---
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('user-name');
  const emailInput = document.getElementById('user-email');
  const messageInput = document.getElementById('user-message');
  const submitBtn = document.getElementById('submit-btn');

  // Email validation regex (Strict check for presence of @ and valid domain structure)
  function isValidEmail(email) {
    const re = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).trim().toLowerCase());
  }

  function validateField(input, condition) {
    const group = input.closest('.form-group');
    if (!condition) {
      group.classList.add('has-error');
      return false;
    } else {
      group.classList.remove('has-error');
      return true;
    }
  }

  // Remove error on input change
  [nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      group.classList.remove('has-error');
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, nameInput.value.trim().length >= 2);
    const isEmailValid = validateField(emailInput, isValidEmail(emailInput.value));
    const isMessageValid = validateField(messageInput, messageInput.value.trim().length >= 10);

    if (isNameValid && isEmailValid && isMessageValid) {
      // Simulate form submission
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');
      
      submitBtn.disabled = true;
      btnText.textContent = 'Отправка...';
      if (btnSpinner) btnSpinner.style.display = 'inline-block';

      setTimeout(() => {
        submitBtn.disabled = false;
        btnText.textContent = 'Отправить сообщение';
        if (btnSpinner) btnSpinner.style.display = 'none';

        // Clear form
        contactForm.reset();

        // Show Toast
        showToast(
          'Заявка успешно отправлена!',
          'Спасибо, Александр! Ваше сообщение принято и скоро будет обработано.'
        );
      }, 1000);
    } else {
      showToast('Ошибка заполнения', 'Пожалуйста, проверьте правильность введенных данных.', true);
    }
  });

  // --- 8. Toast Notifications ---
  const toast = document.getElementById('toast-notify');
  const toastTitle = document.getElementById('toast-title');
  const toastMsg = document.getElementById('toast-msg');
  let toastTimer = null;

  function showToast(title, message, isError = false) {
    if (toastTimer) clearTimeout(toastTimer);

    toastTitle.textContent = title;
    toastMsg.textContent = message;

    const icon = toast.querySelector('.toast-icon');
    if (icon) {
      icon.textContent = isError ? '⚠️' : '✅';
    }
    toast.style.borderColor = isError ? '#ef4444' : 'var(--accent-emerald)';

    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // --- 9. Copy URL Button ---
  const copyUrlBtn = document.getElementById('copy-url-btn');
  if (copyUrlBtn) {
    copyUrlBtn.addEventListener('click', () => {
      const siteUrl = 'https://paxls.github.io/portfolio/';
      navigator.clipboard.writeText(siteUrl).then(() => {
        showToast('Ссылка скопирована', 'Адрес сайта скопирован в буфер обмена.');
      }).catch(() => {
        // Fallback
        const temp = document.createElement('input');
        temp.value = siteUrl;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast('Ссылка скопирована', 'Адрес сайта скопирован в буфер обмена.');
      });
    });
  }

  // --- 10. Update Year dynamically in Footer ---
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});