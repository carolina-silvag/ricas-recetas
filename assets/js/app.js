$(document).ready(() => { 
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $('#registry').hide();
      $('#nav-search').show();
    } else {
      $('#nav-search').hide();
      $('#registry').show();
      $('#login-btn').click(login);
      $('#signup-btn').click(signup);
      $('#logout-btn').click(logout);
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

function logout() {
  firebase.auth().signOut();
}

if (screen.width<1024) {
	ajustePantallaPequeña();
} else {
	ajustePantallaGrande();
}


function ajustePantallaPequeña() {
	fetch('https://api.edamam.com/search?q='+ randomize() +'&app_id=01dfc015&app_key=ab3ca8c9eb858e5904ba8bc581944e8e&from=0&to=9&calories=gte%20591,%20lte%20722&health=alcohol-free').then(function(response) {
	    return response.json();
	 })
	
    .then(function(data) {
    	let cols = 0;
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
								    	    <h5>${name}</h5>
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
  

$('#searchRecetas').on('keypress', function(event) {
  if (event.which === 13) {
    setSearch($('#searchRecetas').val())
  }
})

function setSearch(search) {
  $('#carrousel').hide()
	$('#foodList').html("");
	fetch('https://api.edamam.com/search?q='+ search +'&app_id=01dfc015&app_key=ab3ca8c9eb858e5904ba8bc581944e8e&from=0&to=3&calories=gte%20591,%20lte%20722&health=alcohol-free').then(function(response) {
	    return response.json();
   })
	
    .then(function(data) {
    	console.log(data);
    	let index = 0;
      	$.each(data.hits, function(i, food) {
           index = i + 1;
           filterElements(data)
          $("#foodList").append('<div class="row listImg"></div>');

          let recipe = food.recipe
        
        $('#foodList .row').append(`<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 imgcont" data-index="${index}">
                                    <div class="card mb-3">
                                    <img class="card-img-top img-${index}" src="${recipe.image}">
                                    <div class="card-body">
                                    <h5 class="card-title text-${index}">${recipe.label}</h5>
                                    <p class="card-text">
                                    <table class="table table-sm">
                                    <tr>
                                    <td>${diet(recipe)}</td>
                                    <td class="text-right">${cautions(recipe)}</td>
                                    </tr>
                                    </table>
                                    </p>
                                    <p class="card-text">
                                    <small class="text-muted">${Math.round(recipe.calories)} calories</small>
                                    </p>
                                    </div>
                                    </div>
                                    </div>`);
		});
		$('.imgcont').mouseover(getInImg);
		$('.imgcont').mouseleave(getOutImg);
    });
}

function cautions(recipe) {
  if (recipe.cautions.length !== 0) {
    return `<i style="margin: 0 5px;" class="fas fa-exclamation-triangle"></i><small class="text-muted">${recipe.cautions}</small>`;
  } else {
    return ' ';
  }
}

function diet(recipe) {
  if (recipe.dietLabels.length !== 0) {
    return `<i style="margin: 0 5px;" class="fas fa-heartbeat"></i><small class="text-muted">${recipe.dietLabels}</small>`;
  } else {
    return ' ';
  }
}

function filterElements(data) {
  $('#foodList').append(`<div class="row"><div class="col-lg-10 col-md-10 col-sm-12 col-12>
  <input type="text">
  </div></div>`)
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

