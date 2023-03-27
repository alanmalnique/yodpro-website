var yodproapp = angular.module('yodpro', ['ui.mask']);
var apiurl = 'http://localhost:8000';
var carousel;

yodproapp.controller('app', function($scope, $http, $sce) {
	$scope.contato = {
		nome: '',
		condominio: '',
		whatsapp: '',
		mensagem: ''
	};
	$scope.website = {
		banners: [],
		services: [],
		advantages: []
	};
	var req = {
		method: 'GET',
		url: apiurl + '/web/all',
		withCredentials: false,
		headers: {
			'Access-Control-Allow-Origin': true,
			'Content-Type': 'application/json; charset=utf-8',
			'X-Requested-With': 'XMLHttpRequest'
		}
	}
	$http(req)
		.then(res => {
			var result = res.data;
			result.forEach((item, index) => {
				if (item.inst_tipo === 1) {
					$scope.website.banners.push({
						image: apiurl + '/web/arquivo/' + item.arq_id + '/show',
						description: $sce.trustAsHtml(item.inst_texto)
					});
				}

				if (item.inst_tipo === 2) {
					$scope.website.services.push({
						description: item.inst_texto
					});
				}

				if (item.inst_tipo === 3) {
					$scope.website.advantages.push({
						image: apiurl + '/web/arquivo/' + item.arq_id + '/show',
						title: item.inst_titulo,
						description: item.inst_texto
					});
				}
				if (parseInt(index)+1 === result.length) {
					init();
				}
			});
		});
	
	$scope.send = function() {
		if ($scope.validateFields()) {
			$(".loader").fadeIn("normal");
			var req = {
				method: 'POST',
				url: apiurl + '/web/contato',
				withCredentials: false,
				headers: {
				 	'Access-Control-Allow-Origin': true,
					'Content-Type': 'application/json; charset=utf-8',
					'X-Requested-With': 'XMLHttpRequest'
				},
				data: $scope.contato
			}
			$http(req)
				.then(res => {
					$(".loader").fadeOut("normal");
					$scope.contato = {
						nome: '',
						condominio: '',
						whatsapp: '',
						mensagem: ''
					};
					alert('Mensagem enviada com sucesso! Em breve retornaremos o seu contato!');
				})
				.catch(err => {
					$(".loader").fadeOut("normal");
					alert('Ocorreu um erro ao enviar sua mensagem! Tente novamente mais tarde.');
				});
		}
	}

	$scope.validateFields = function() {
		var canContinue = true;
		if ($scope.contato.nome === '' || $scope.contato.nome.length < 10) {
			$("input[name=nome]").parent().addClass('error');
			canContinue = false;
		} else {
			$("input[name=nome]").parent().removeClass('error');
		}
		if ($scope.contato.condominio === '' || $scope.contato.condominio.length < 5) {
			$("input[name=condominio]").parent().addClass('error');
			canContinue = false;
		} else {
			$("input[name=condominio]").parent().removeClass('error');
		}
		if ($scope.contato.whatsapp === '' || $scope.contato.nome.whatsapp < 15) {
			$("input[name=whatsapp]").parent().addClass('error');
			canContinue = false;
		} else {
			$("input[name=whatsapp]").parent().removeClass('error');
		}
		return canContinue;
	}
	$("input").on("keyup", function() {
		$scope.validateFields();
	});
});

$(window).resize(function() {
	changeCarousel();
});

function init() {
	setTimeout(function(){
		var headerslider = $('.header-slider').bxSlider({
			pager: false,
			nextText: '',
			prevText: '',
			onSliderLoad: function(currentIndex) {
				animateCaption(currentIndex);
			},
			onSlideBefore: function() {
				$(".caption > *").css("opacity", 0);
			},
			onSlideAfter: function($slideElement, oldIndex, newIndex) {
				animateCaption(newIndex);
			}
		});
		$('.advantages-slider').bxSlider({
			pager: false,
			nextText: '',
			prevText: '',
			auto: true,
		});
		animateCaption();

		carousel = $('.services-carousel').bxSlider({
			pager: true,
			controls: false,
			auto: true,
			minSlides: 3,
			maxSlides: 3,
        	slideWidth: 400
		});
		changeCarousel();
	}, 300);
	setTimeout(function(){
		$(".loader").fadeOut('normal');
	}, 1000);
	
	$("#menu").on("click", function() {
		$("body > .menu").addClass("open");
	});
	
	$("body > .menu > a, body > .menu > ul > li").on("click", function() {
		$("body > .menu").removeClass("open");
		var ref = $(this).attr("ref");
		if (ref !== undefined ) {
			$([document.documentElement, document.body]).animate({
				scrollTop: $("."+ref).offset().top
			}, 1000);
		}
	});
}

function changeCarousel() {
	if ($(window).width() < 768) {
		carousel.reloadSlider({
			pager: true,
			controls: false,
			minSlides: 1,
			maxSlides: 1
		});
	}
}

function animateCaption() {
	$(".caption h1:visible").animate({ opacity: 1 }, 700);
	$(".caption h2:visible").delay(300).animate({ opacity: 1 }, 700);
	$(".caption h3:visible").delay(600).animate({ opacity: 1 }, 700);
	$(".caption a:visible").delay(900).animate({ opacity: 1 }, 700);
}

yodproapp.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.withCredentials = false;
	delete $httpProvider.defaults.headers.common["X-Requested-With"];
	$httpProvider.defaults.headers.common["Accept"] = "application/json";
	$httpProvider.defaults.headers.common["Content-Type"] = "application/json";
	$httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
	$httpProvider.defaults.headers.common['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, PUT, DELETE, PATCH';
	$httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type, api-token, Accept, Authorization, X-Requested-With, Application';
}]);
