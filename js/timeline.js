(function () {
  // VARIABLES
  const timeline = document.querySelector(".timeline ol"),
  elH = document.querySelectorAll(".timeline li > div"),
  arrows = document.querySelectorAll(".timeline .arrows .arrow"),
  arrowPrev = document.querySelector(".timeline .arrows .arrow__prev"),
  arrowNext = document.querySelector(".timeline .arrows .arrow__next"),
  firstItem = document.querySelector(".timeline li:first-child"),
  lastItem = document.querySelector(".timeline li:last-child"),
  xScrolling = 280,
  disabledClass = "disabled";

  // START
  window.addEventListener("load", init);

  function init() {
    setEqualHeights(elH);
    animateTl(xScrolling, arrows, timeline);
    setSwipeFn(timeline, arrowPrev, arrowNext);
    setKeyboardFn(arrowPrev, arrowNext);
  }

  // SET EQUAL HEIGHTS
  function setEqualHeights(el) {
    let counter = 0;
    for (let i = 0; i < el.length; i++) {
      const singleHeight = el[i].offsetHeight;

      if (counter < singleHeight) {
        counter = singleHeight;
      }
    }

    for (let i = 0; i < el.length; i++) {
      el[i].style.height = `${counter}px`;
    }
  }

  // CHECK IF AN ELEMENT IS IN VIEWPORT
  // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (
      window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth));

  }

  // SET STATE OF PREV/NEXT ARROWS
  function setBtnState(el, flag = true) {
    if (flag) {
      el.classList.add(disabledClass);
    } else {
      if (el.classList.contains(disabledClass)) {
        el.classList.remove(disabledClass);
      }
      el.disabled = false;
    }
  }

  // ANIMATE TIMELINE
  function animateTl(scrolling, el, tl) {
    let counter = 0;
    for (let i = 0; i < el.length; i++) {
      el[i].addEventListener("click", function () {
        if (!arrowPrev.disabled) {
          arrowPrev.disabled = true;
        }
        if (!arrowNext.disabled) {
          arrowNext.disabled = true;
        }
        const sign = this.classList.contains("arrow__prev") ? "" : "-";
        if (counter === 0) {
          tl.style.transform = `translateX(-${scrolling}px)`;
        } else {
          const tlStyle = getComputedStyle(tl);
          // add more browser prefixes if needed here
          const tlTransform =
          tlStyle.getPropertyValue("-webkit-transform") ||
          tlStyle.getPropertyValue("transform");
          const values =
          parseInt(tlTransform.split(",")[4]) +
          parseInt(`${sign}${scrolling}`);
          tl.style.transform = `translateX(${values}px)`;
        }

        setTimeout(() => {
          isElementInViewport(firstItem) ?
          setBtnState(arrowPrev) :
          setBtnState(arrowPrev, false);
          isElementInViewport(lastItem) ?
          setBtnState(arrowNext) :
          setBtnState(arrowNext, false);
        }, 1100);

        counter++;
      });
    }
  }

  // ADD SWIPE SUPPORT FOR TOUCH DEVICES
  function setSwipeFn(tl, prev, next) {
    const hammer = new Hammer(tl);
    hammer.on("swipeleft", () => next.click());
    hammer.on("swiperight", () => prev.click());
  }

  // ADD BASIC KEYBOARD FUNCTIONALITY
  function setKeyboardFn(prev, next) {
    document.addEventListener("keydown", e => {
      if (e.which === 37 || e.which === 39) {
        const timelineOfTop = timeline.offsetTop;
        const y = window.pageYOffset;
        if (timelineOfTop !== y) {
          window.scrollTo(0, timelineOfTop);
        }
        if (e.which === 37) {
          prev.click();
        } else if (e.which === 39) {
          next.click();
        }
      }
    });
  }
})();


document.addEventListener('DOMContentLoaded', () => {
  const images = Array.from(document.querySelectorAll('.images .img img'));
  const lightbox = document.querySelector('.lightbox');
  const wrapperImg = lightbox.querySelector('.preview-img img');
  const caption = lightbox.querySelector('.caption');
  const closeBtn = lightbox.querySelector('.close');
  const prevBtn = lightbox.querySelector('.prev');
  const nextBtn = lightbox.querySelector('.next');

  let currentIndex = 0;

  images.forEach((img, i) => {
    img.addEventListener('click', () => {
      currentIndex = i;
      openLightbox(img);
    });
  });

  function openLightbox(img) {
    wrapperImg.src = img.src;
    wrapperImg.alt = img.alt;
    caption.textContent = img.alt;
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  function showSlide(index) {
    if(index < 0) currentIndex = images.length -1;
    else if(index >= images.length) currentIndex = 0;
    else currentIndex = index;
    const img = images[currentIndex];
    wrapperImg.src = img.src;
    caption.textContent = img.alt;
  }

  closeBtn.onclick = closeLightbox;
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  prevBtn.onclick = () => showSlide(currentIndex -1);
  nextBtn.onclick = () => showSlide(currentIndex +1);

  // navigation keyboard
  document.addEventListener('keydown', e => {
    if (lightbox.style.display === 'block') {
      if (e.key === 'ArrowRight') showSlide(currentIndex +1);
      if (e.key === 'ArrowLeft') showSlide(currentIndex -1);
      if (e.key === 'Escape') closeLightbox();
    }
  });
});