$(document).ready(() => { 
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $('#registry').hide();
      $('#menuNavbar').show();
      $('#nav-search').show();
    } else {
      $('#nav-search').hide();
      $('#menuNavbar').hide();
      $('#registry').show();
      $('#login-btn').click(login);
      $('#signup-btn').click(signup);
      $('#logout-btn').click(logout);
    }
  }); // firebase
});

function login() {
  let email = $('#email-login').val();
  let pw = $('#pw-login').val();
  if (email !== '' && pw !== '') {
    const promise = firebase.auth().signInWithEmailAndPassword(email, pw);
    promise.catch(e => alert(e.message));
  }
}

function signup() {
  let email = $('#email-signup').val();
  let pw = $('#pw-signup').val();
  console.log('hola', email, pw);
  if (email !== '' && pw !== '') {
    console.log('hola2');
    const promise = firebase.auth().createUserWithEmailAndPassword(email, pw);
    promise.catch(e => alert(e.message));
  }
}

function logout() {
  firebase.auth().signOut();
}

if (screen.width<1024) {
	ajustePantallaPequeña();
} else {
	ajustePantallaGrande();
}

// solo cuando se carga desde celular 
function ajustePantallaPequeña() {
	fetch('https://api.edamam.com/search?q='+ randomize() +'&app_id=01dfc015&app_key=ab3ca8c9eb858e5904ba8bc581944e8e&from=0&to=9&calories=gte%20591,%20lte%20722&health=alcohol-free').then(function(response) {
	    return response.json();
	 })
	
    .then(function(data) {
    	let index = 0;
			$.each(data.hits, function(i, food) {
	      index += 1;
			  $(".carousel-inner").append(`<div class="carousel-item img-carousel-${index}"><div class="row justify-content-center"></div>`);
			 

		    let image = food.recipe.image;
		    let name = food.recipe.label;

		    $(".img-carousel-"+index + " .row").last().append(`<div class="col-xs-12 recetasRecomendadas">
				              		<div class="img-thumbnail text-center">
				                	<a href=""><img class="d-block w-100" src="${image}"></a>
				                	<div class="carousel-caption d-none d-md-block">
								    	    <h5>${name}</h5>
								 	        </div></div></div>`);
    	});
    	$('.img-carousel-1').addClass('active');
    });
}

// solo cuando se carga desde web
function ajustePantallaGrande() {
fetch('https://api.edamam.com/search?q='+ randomize() +'&app_id=01dfc015&app_key=ab3ca8c9eb858e5904ba8bc581944e8e&from=0&to=9&calories=gte%20591,%20lte%20722&health=alcohol-free').then(function(response) {
	    return response.json();
	 })
	
    .then(function(data) {
    	let cols = 0;
    	let index = 0;
			$.each(data.hits, function(i, food) {
        if (cols == 0) {
        		index += 1;
		      $(".carousel-inner").append(`<div class="carousel-item img-carousel-${index}"><div class="row justify-content-center"></div>`);
		    }
		    let image = food.recipe.image;
		    let name = food.recipe.label;

		    $(".img-carousel-"+index + " .row").last().append(`<div class="col-md-4 recetasRecomendadas">
				              		<div class="img-thumbnail text-center">
				                	<a href=""><img class="d-block w-100" src="${image}"></a>
				                	<div class="carousel-caption d-none d-md-block">
								    	    <h5 class="nameFood">${name}</h5>
								 	        </div></div></div>`);

		    cols +=1;
    		if (cols == 3) {
      			cols = 0;
    		}
    	});
	
    	
    	$('.img-carousel-1').addClass('active');

    });
}


$('.carousel').carousel();

// funcion random para carrusel al cargar la pagina
function randomize() {
  const lis = ['pollo', 'chocolate', 'carne', 'arroz', 'dulce', 'masa'];

  let result =lis.splice(getRandomInt(0, lis.length), 1)[0];
  
  return result;
 
}

// seleccion de palabra clave para carrusel
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/*fetch('https://api.edamam.com/search?q='+ search +'&app_id=01dfc015&app_key=ab3ca8c9eb858e5904ba8bc581944e8e&from=0&to=100&calories=gte%20591,%20lte%20722&health=alcohol-free').then(function(response) {
	    return response.json();
	 })
	
    .then(function(data) {
    	console.log(data);
    });*/
  
// llama a la funcion cuando al buscador se presiona un enter
$('#searchRecetas').on('keypress', function(event) {
  if (event.which === 13) {
    setSearch($('#searchRecetas').val());
  }
});

// buscar todas las imagenes con palabra ingresada
function setSearch(search) {
  $('#carrousel').hide()
	$('#foodList').html("");
	fetch('https://api.edamam.com/search?q='+ search +'&app_id=01dfc015&app_key=ab3ca8c9eb858e5904ba8bc581944e8e&from=0&to=100&calories=gte%20591,%20lte%20722&health=alcohol-free').then(function(response) {
	    return response.json();
   })
	
    .then(function(data) {
    	console.log(data);
      let cols = 0;
    	let index = 0;
      	$.each(data.hits, function(i, food) {
      	 	index = i + 1;
          if(i == 0){
			      $("#foodList").append('<div class="row listImg"></div>');  
          }

		    let image = food.recipe.image;
        let name = food.recipe.label;
        
        $('#foodList .row').append(`<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12 imgcont" data-index="${index}">
                                    <div class="card mb-3 card-${index} img-thumbnail">
                                      <img class="card-img-top img-${index}" src="${image}">
                                      <div class="card-body">
                                        <h5 class="card-title text-${index}">${name}</h5>
                                        <p class="card-text">
                                          <small class="text-muted">${food.recipe.dietLabels}</small>
                                        </p>
                                      </div>
                                    </div>
                                  </div>`);
		});
    // llama a la funcion cuando pasar por la imagen
		$('.imgcont').mouseover(getInImg);
    // llama a la funcion cuando sale de la imagen
		$('.imgcont').mouseleave(getOutImg);
    });
}

// Al entrar a la imagen buscada le da un efecto 
function getInImg() {
  let index = $(this).data('index');

  $('.img-'+index).css({'filter': 'brightness(30%)', 
    '-webkit-filter': 'brightness(30%)',
    '-moz-filter': 'brightness(30%)', 
    '-o-filter': 'brightness(30%)',
    '-ms-filter': 'brightness(30%)',
    'filter': 'grayscale(30%)'
  });
  $('.card-'+index).css({'position': 'relative',
    'z-index': '1', 
    '-webkit-transform': 'scale(1.2)',
    '-moz-transform': 'scale(1.2)',
    '-ms-transform': 'scale(1.2)',
    '-o-transform': 'scale(1.2)',
    'transform': 'scale(1.2)'});
}

// Al salir de la imagen vuelve a su estado por defecto
function getOutImg() {
  var index = $(this).data('index');

  $('.card-'+index).css({'position': 'relative',
    'z-index': '0',
    '-webkit-transition': 'scale(1.0)',
    '-moz-transform': 'scale(1.0)',
    '-ms-transform': 'scale(1.0)',
    '-o-transform': 'scale(1.0)',
    'transform': 'scale(1.0)'});

  $('.img-'+index).css({'filter': 'brightness(100%)', 
    '-webkit-filter': 'brightness(100%)'});
}

