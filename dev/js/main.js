$(document).ready(function() {

// For Tabs
	$('ul.tabs__caption').on('click', 'li:not(.active)', function() {
    $(this)
      .addClass('active').siblings().removeClass('active');
    $('.tabs')  
      .find('div.tabs__content').removeClass('active').eq($(this).index()).addClass('active');
  	if ($('#show_menu').hasClass('open')) {
				$('#show_menu').removeClass('open');
				$topMenu.removeClass('open');
		}
  });
});// Конец document.ready


// Инициализация изотопа
var $grid = $('.row').isotope({
  itemSelector: '.row-item',
  layoutMode: 'fitRows'
});

// фильтрация в гриде
$('.filters-button-group').on( 'click', '.btn-filter', function() {
 var filterValue = $(this).attr('data-filter');
 $grid.isotope({ filter: filterValue });

  $('.btn-filter.is-checked').removeClass('is-checked');
	$(this).addClass('is-checked');
});
//Конец фильтрация в гриде

// == For responsive MENU == 
var $topMenu = $('#main-menu');

$('#show_menu').on('click', function () {	
	 if ($topMenu.hasClass('open') ) {
	 		$topMenu.removeClass('open');
	 		$(this).removeClass('open');
	 }
	 else{
	 		$topMenu.addClass('open');
	 		$(this).addClass('open');
	 }
});

$(window).resize(function(){
	if ($(window).width() > 768) {
		$topMenu.removeClass('animation')
			      .removeClass('open');
		$('#show_menu').removeClass('open');
	}
	else {
		$topMenu.addClass('animation');
	}
});

//Modal window
$('.btn--addProfile').click(function(){
  var modal_id = $(this).attr('data-target');
  $('body').append('<div class="modal-bg"></div>');
  $('#'+ modal_id).addClass('md-show');
});

$('.close-btn, .btn--md-lookup').on('click', function(){
  $('.modal-bg').remove();
  $(this).parents('.md-modal').removeClass('md-show');
});

document.onkeydown = function(e) {
  if (e.keyCode == 27) { // escape
    $('.modal-bg').remove();
  	$('.md-modal').removeClass('md-show');
  }
};