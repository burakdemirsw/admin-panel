
class Carousell {
  constructor(el, options = {}) {
    const DEFAULTS = {
      infinite : true,
      slideSelector: '.C-slide',
      initialSlideIndex: 0,
      vertical: false,
    };
    this.carousel = el;
    this.settings = {
      ...DEFAULTS,
      ...options,
    };

    this.slides = document.querySelectorAll(
      this.settings.slideSelector
    );

    this.state = {
      currentSlide: this.settings.initialSlideIndex,
    };

    this.track = null;
    this.navigation = null;
    this.navigationButtons = [];
    this.init();
  }

  setState(newState, callback = () => undefined) {
    this.state = {
      ...this.state,
      ...newState,
    };
    this.updateCarousel();
    return callback();
  }

  getSettings = () => {
    return this.settings;
  }

  reInitWithOptions = (options = {}) => {
    this.carousel.classList.remove('initialized');
    this.track.classList.add('C-track--reinit');
    this.settings = {
      ...this.getSettings(),
      ...options,
    };

    this.init();
    this.onResizeActions();
    this.track.classList.remove('C-track--reinit');
  };

  init() {
    const {
      carousel,
      slides,
    } = this;

    const {
      vertical,
    } = this.settings;

    carousel.classList.remove('C-carousel--vertical');
    if (vertical) {
      carousel.classList.add('C-carousel--vertical');
    } else {
      slides.forEach(slide => {
        slide.style.float = 'left';
      });
    }

    this.onInitActions();

    window.addEventListener('resize', () => {
      setTimeout(() => { this.onResizeActions(); }, 100);
    });

  }

  onInitActions() {
    this.createSlideTrack();
    this.createNavigation();
    this.createNavigationButtons();
    this.updateCarousel();
    this.carousel.classList.add('initialized');
  }
  createSlideTrack() {
    const {
      slides,
      carousel,
      track,
    } = this;

    if(!track) {
      const track = document.createElement('div');
      track.classList.add('C-track');
      slides.forEach(slide => {
        track.appendChild(slide);
      });

      carousel.appendChild(track);
      this.track = track;
    }
    this.setSlideTrackDimensions();
  }

  setSlideTrackDimensions() {

    const {
      track,
      slides,
    } = this;
    slides.forEach(slide => {
      slide.style.transition = 'none';
    });
    const numberOfSlides = slides.length;

    if (!track) { return; }

    const {
      vertical,
    } = this.settings;

    const height = [...slides].reduce((acc, slide) => (
      acc + slide.offsetHeight
    ), 0);
    const width = [...slides].reduce((acc, slide) => (
      acc + slide.offsetWidth
    ), 0);

    track.style.transition = 'none';

    if (!!vertical) {
      track.style.width = width / numberOfSlides + 'px';
      track.style.height = height + 'px';
    } else {
      track.style.width = width + 'px';
      track.style.height = height / numberOfSlides + 'px';
    }

    track.style.transition = '';
    slides.forEach(slide => {
      slide.style.transition = '';
    });
  }

  updateTrackPosition() {
    const {
      slides,
      track,
    } = this;

    const numberOfSlides = slides.length;
    const basePercentage = 100 / numberOfSlides;

    const {
      vertical,
    } = this.settings;

    const {
      currentSlide,
    } = this.state;

    const translateValue = !!vertical
    ? `translateY(-${basePercentage * currentSlide}%)`
    : `translateX(-${basePercentage * currentSlide}%)`

    track.style.transform = translateValue;

  }

  createNavigation () {
    const {
      slides,
      carousel,
      navigation,
    } = this;

    if (!navigation) {
      const navigationContainer = document.createElement('div');
      navigationContainer.classList.add('C-navigation');
      [...slides].forEach((slide, index) => {
        navigationContainer.appendChild(this.createNavigationDot(index));
      });
      carousel.appendChild(navigationContainer);
      this.navigation = navigationContainer;
    }
  }

  createNavigationDot(index) {
    const { currentSlide } = this.state;
    const navigationDot = document.createElement('div');
    navigationDot.classList.add('C-navigation__dot');
    navigationDot.setAttribute('data-slideIndex', index);
    navigationDot.addEventListener('click', () => {
      this.goTo(index);
    });

    return navigationDot;
  }


  updateNavigation() {
    const {
      navigation,
    } = this;

    const {
      currentSlide,
    } = this.state;

    const navigationDots = navigation.querySelectorAll('.C-navigation__dot');
    navigationDots.forEach(dot => {
      const dotIndex = parseInt(dot.getAttribute('data-slideIndex'), 10);
      if (dotIndex === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  updateSlides() {
    const {
      slides,
    } = this;

    const {
      currentSlide,
    } = this.state;

    slides.forEach((slide, index) => {
      if (index === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }

  goTo = (index) => {
    this.setState({
      currentSlide: index,
    }, () => {
    });
  }

  updateCarousel() {
    this.updateTrackPosition();
    this.updateNavigation();
    this.updateSlides();
  }

}

const registeredCarousels = [];
const carousels = document.querySelectorAll('.C-carousel');
carousels.forEach((carousel, index) => {
  registeredCarousels.push({
    id: `C-carousel-${index}`,
    carousel: new Carousel(carousel, {
      vertical: true,
    }),
  })
});

