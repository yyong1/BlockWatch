var ReviewSlider = {
  currentIndex: 0,
  reviews: [],
  $slidesContainer: null,
  $slides: null,
  $prevButton: null,
  $nextButton: null,

  init: function() {
      this.$slidesContainer = $('.slides-container');
      this.$prevButton = $('.fa-angle-left');
      this.$nextButton = $('.fa-angle-right');

      this.loadReviews();
      this.bindEvents();
  },

  loadReviews: function() {
      RestClient.get('/reviews', function (response) {
          this.reviews = response;
          this.renderSlides();
      }.bind(this), function (error) {
          console.error('Error loading reviews: ', error);
      });
  },

  renderSlides: function() {
      this.$slidesContainer.empty();
      this.reviews.forEach((review, index) => {
          const $slide = $('<div>').addClass('slide').toggleClass('active', index === 0);
          $slide.html(`
              <p class="text">${review.comment}</p>
              <div class="user">
                  <img src="${review.image}" alt="user-photo">
                  <div class="user-info">
                      <h3>${review.username}</h3>
                      <div class="stars">${'<i class="fas fa-star"></i>'.repeat(review.rating)}</div>
                      <i class="fas fa-quote-right"></i>
                  </div>
              </div>
          `);
          this.$slidesContainer.append($slide);
      });
      this.$slides = $('.slide');
  },

  bindEvents: function() {
      this.$prevButton.click(() => {
          const nextIndex = this.currentIndex === 0 ? this.$slides.length - 1 : this.currentIndex - 1;
          this.showSlide(nextIndex);
      });

      this.$nextButton.click(() => {
          const nextIndex = this.currentIndex === this.$slides.length - 1 ? 0 : this.currentIndex + 1;
          this.showSlide(nextIndex);
      });
  },

  showSlide: function(index) {
      this.$slides.eq(this.currentIndex).removeClass('active');
      this.$slides.eq(index).addClass('active');
      this.currentIndex = index;
  }
};

$(document).ready(function() {
  ReviewSlider.init();
});
