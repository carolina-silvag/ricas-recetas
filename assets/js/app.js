$(document).ready(() => { 
	fetch('https://api.edamam.com/search?q='+ randomize() +'&app_id=01dfc015&app_key=ab3ca8c9eb858e5904ba8bc581944e8e&from=0&to=7&calories=gte%20591,%20lte%20722&health=alcohol-free').then(function(response) {
	    return response.json();
	 })
	
    .then(function(data) {
    	console.log(data);
    });
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    	$('#registry').hide()
      $('#home').show();
    } else {
    	$('#registry').show()
    	$('#home').hide();
      $('#login-btn').click(login);
      $('#signup-btn').click(signup);
    }
  }); // firebase
});

function login() {
  let email = $('#email').val();
  let pw = $('#pw').val();
  if (email !== '' && pw !== '') {
    const promise = firebase.auth().signInWithEmailAndPassword(email, pw);
    promise.catch(e => alert(e.message));
  }
}

function signup() {
  let email = $('#email').val();
  let pw = $('#pw').val();
  if (email !== '' && pw !== '') {
    const promise = firebase.auth().createUserWithEmailAndPassword(email, pw);
    promise.catch(e => alert(e.message));
  }
}

// Instantiate the Bootstrap carousel
$('.multi-item-carousel').carousel({
  interval: false
});


// para cada diapositiva en el carrusel, copie el ítem de la siguiente diapositiva en la diapositiva.
// Haz lo mismo para el próximo, siguiente artículo.
$('.multi-item-carousel .carousel-item').each(function() {
  var next = $(this).next();
  if (!next.length) {
    next = $(this).siblings(':first');
  }
  next.children(':first-child').clone().appendTo($(this));
  
  if (next.next().length > 0) {
    next.next().children(':first-child').clone().appendTo($(this));
  } else {
    $(this).siblings(':first').children(':first-child').clone().appendTo($(this));
  }
});


function randomize() {
  const lis = ['pollo', 'chocolate', 'carne', 'arroz', 'dulce', 'masa'];
  // while (lis.length) {
    let result =lis.splice(getRandomInt(0, lis.length), 1)[0];
    // console.log(result);
    return result;
  // }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/*fetch('https://api.edamam.com/search?q='+ search +'&app_id=01dfc015&app_key=ab3ca8c9eb858e5904ba8bc581944e8e&from=0&to=100&calories=gte%20591,%20lte%20722&health=alcohol-free').then(function(response) {
	    return response.json();
	 })
	
    .then(function(data) {
    	console.log(data);
    });*/
  

$('#btnSearch').click(search);
function search() {
  setSearch($('#searchRecetas').val());
}

function setSearch(search) {
	$('#listFood').html("");
	fetch('https://api.edamam.com/search?q='+ search +'&app_id=01dfc015&app_key=ab3ca8c9eb858e5904ba8bc581944e8e&from=0&to=100&calories=gte%20591,%20lte%20722&health=alcohol-free').then(function(response) {
	    return response.json();
	 })
	
    .then(function(data) {
    	console.log(data);
    	let cols = 0;
    	let index = 0;
      	$.each(data.hits, function(i, food) {
      	 	index = i + 1;
	        if (cols == 0) {
			      $("#listFood").append('<div class="row listImg"></div>');
			    }

		    let image = food.recipe.image;
		    let name = food.recipe.label;

		    $("#listFood .row").last().append(`<div class="col-xs-12 col-md-4 imgcont" data-index="${index}"><div class="img-thumbnail"><figure>
		    							<img src="${image}" class="img-${index}" data-toggle="modal" data-target="#modalLocal"">
		    							</figure></div>
		    							<figcaption class="text text-${index} text-center">${name}</figcaption></div>`);

		    $('.text').hide();



			cols +=1;
			console.log(cols)

    		if (cols == 3) {
    			console.log(cols)
      			cols = 0;
    		}

		      
		});
		$('.imgcont').mouseover(getInImg);
		$('.imgcont').mouseleave(getOutImg);

    });


}

function getInImg() {
  let index = $(this).data('index');

  $('.text-'+index).show();
  $('.img-'+index).css({'filter': 'brightness(30%)', 
    '-webkit-filter': 'brightness(30%)',
    '-moz-filter': 'brightness(30%)', 
    '-o-filter': 'brightness(30%)',
    '-ms-filter': 'brightness(30%)',
    'filter': 'grayscale(30%)',
    'filter': 'url(grayscale.svg)', // Firefox 4+ 
    'filter': 'gray' // IE 6-9
  });
  $('.img-'+index).parent().css({'position': 'relative',
    'z-index': '1', 
    '-webkit-transform': 'scale(1.2)',
    '-moz-transform': 'scale(1.2)',
    '-ms-transform': 'scale(1.2)',
    '-o-transform': 'scale(1.2)',
    'transform': 'scale(1.2)'});
  $('.text-'+index).css({'position': 'absolute',
    'top': '50%',
    'left': '50%',
    'transform': 'translateX(-50%) translateY(-50%)',
    'margin': '0',
    'z-index': '2',
    'color': 'white',
    'text-align': 'center',
    'font-weight': 'bold',
    'font-size': '2em'});
}

// Al salir de la imagen cambia
function getOutImg() {
  var index = $(this).data('index');
  $('.text-'+index).hide();

  $('.img-'+index).parent().css({'position': 'relative',
    'z-index': '0',
    '-webkit-transition': 'scale(1.0)',
    '-moz-transform': 'scale(1.0)',
    '-ms-transform': 'scale(1.0)',
    '-o-transform': 'scale(1.0)',
    'transform': 'scale(1.0)'});
  $('.text-'+ index+ 'figure').css({'display': 'none', 
    'background-color': 'transparent'});
  $('.img-'+index).css({'filter': 'brightness(100%)', 
    '-webkit-filter': 'brightness(100%)'});
}

