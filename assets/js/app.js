$(document).ready(() => { 
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $('#registry').hide();
      $('#menuNavbar').show();
      $('#nav-search').show();
      loadCurrentUser(user.uid);
    } else {
      $('#nav-search').hide();
      $('#menuNavbar').hide();
      $('#registry').show();
      $('#login-btn').click(login);
      $('#signup-btn').click(signup);
      $('#logout-btn').click(logout);
      $('#google-btn1').click(ingresoGoogle);
      $('#facebook-btn1').click(ingresoFacebook);
      $('#google-btn2').click(ingresoGoogle);
      $('#facebook-btn2').click(ingresoFacebook);
    }
  }); // firebase
});

// variables globales para guardar y reutilizar datos necesarios
var database = firebase.database();
var user = null;

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
  if (email !== '' && pw !== '') {
    const promise = firebase.auth().createUserWithEmailAndPassword(email, pw);
    promise.catch(e => alert(e.message));
  }
}

function logout() {
  firebase.auth().signOut();
}

function ingresoGoogle() {
  if (!firebase.auth().currentUser) {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth().signInWithPopup(provider).then(function(result){
      var token = result.credential.accesstoken;
      var user = result.user;
      var name = result.user.displayName;
      agregarUserBD(user);
    }).catch(function(error) {
      console.log("error", error.message);
      var errorCode = error.Code;
      var errorMessage = error.message;
      var errorEmail = error.email;
      var errorCredential = error.credential;
      if (errorCode === 'auth/account-exists-with-different-credential'){
        alert('Es el mismo usuario');
      }
    });
  } else {
    firebase.auth().signOut();
  }
}

function ingresoFacebook() {
  if (!firebase.auth().currentUser) {
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('public_profile');
    firebase.auth().signInWithPopup(provider).then(function(result){
      var token = result.credential.accesstoken;
      var user = result.user;
      console.log(user);
      agregarUserBD(user);

      /*window.location.href = 'movie.html';*/

    }).catch(function(error) {
      console.log("error", error.message);
      var errorCode = error.Code;
      var errorMessage = error.message;
      var errorEmail = error.email;
      var errorCredential = error.credential;
      if(errorCode === 'auth/account-exists-with-different-credential'){
        alert('Es el mismo usuario');
      }
    });
  }else {
    firebase.auth().signOut();
  }
}

if (screen.width < 768) {
	$('#productosDelDia').hide();
} else {
	 ajustePantallaGrande();
}

// solo cuando se carga desde celular 
function ajustePantallaPequeña() {
  fetch('https://api.edamam.com/search?q=' + randomize() + '&app_id=01dfc015&app_key=ab3ca8c9eb858e5904ba8bc581944e8e&from=0&to=9&calories=gte%20591,%20lte%20722&health=alcohol-free').then(function(response) {
	    return response.json();
	 })
	
    .then(function(data) {
    	let index = 0;

			$.each(data.hits, function(i, food) {
	      index += 1;
        /*<div class="carousel-item active">
                <img src="..." alt="...">
                <div class="carousel-caption d-none d-md-block">
                  <h5>...</h5>
                  <p>...</p>
                </div>
              </div>*/
			  $(".carousel-inner").append(`<div class="carousel-item img-carousel-${index}"></div>`);
			 

		    let image = food.recipe.image;
		    let name = food.recipe.label;

		    $('.img-carousel-' + index).last().append(`
				                	<a href=""><img class="d-block w-100" src="${image}"></a>
                          <div class="carousel-caption d-none d-md-block">
                            <h5>${name}</h5>
                            <p>...</p>
                          </div>`);
    	});
    	$('.img-carousel-1').addClass('active');
    });
}

// solo cuando se carga desde web
function ajustePantallaGrande() {
  fetch('https://api.edamam.com/search?q=' + randomize() + '&app_id=01dfc015&app_key=ab3ca8c9eb858e5904ba8bc581944e8e&from=0&to=9&calories=gte%20591,%20lte%20722&health=alcohol-free').then(function(response) {
	    return response.json();
	 })
    .then(function(data) {
    	let cols = 0; // para colocer imagenes en el carrusel col-3
    	let index = 0;

		  $.each(data.hits, function(i, food) {
        if (cols === 0) {
        	index += 1;
		      $('.carousel-inner').append(`<div class="carousel-item img-carousel-${index}"><div class="row justify-content-center"></div>`);
		    }
		    let image = food.recipe.image;
		    let name = food.recipe.label;

		    $('.img-carousel-' + index + ' .row').last().append(`<div class="col-md-4 recetasRecomendadas">
				              		<div class="img-thumbnail text-center">
				                	<a href=""><img class="d-block w-100" src="${image}"></a>
				                	<div class="carousel-caption d-none d-md-block text">
								    	    <h5 class="nameFood">${name}</h5>
								 	        </div></div></div>`);

		    cols += 1; 
    		if (cols === 3) {
      			cols = 0;
    		}
    	});
	    // para activar el primer item
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
  
// llama a la funcion cuando al buscador se presiona un enter
$('#searchRecetas').on('keypress', function(event) {
  if (event.which === 13) {
    setSearch($('#searchRecetas').val());
  }
});

// buscar todas las imagenes con palabra ingresada
function setSearch(search) {
  $('#carrousel').hide();
  $('#foodList').html('');
  fetch('https://api.edamam.com/search?q=' + search + '&app_id=01dfc015&app_key=ab3ca8c9eb858e5904ba8bc581944e8e&from=0&to=100&calories=gte%20591,%20lte%20722&health=alcohol-free').then(function(response) {
	    return response.json();
  })
	
    .then(function(data) {
    	console.log(data);
      let cols = 0;
    	let index = 0;
      $('#foodList').append('<div class="row listImg"></div>');
      $.each(data.hits, function(i, food) {
        index = i + 1;
        let recipe = food.recipe;
        
        $('#foodList .listImg').append(`<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 imgcont" data-index="${index}">

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

      // llama a la funcion cuando pasar por la imagen
  		$('.imgcont').mouseover(getInImg);
      // llama a la funcion cuando sale de la imagen
  		$('.imgcont').mouseleave(getOutImg);

      //
      $('#foodList .card').click(showInfo);
  
      });
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

//

function showInfo() {
  let index = $(this).parent().data('index');
  var name = $('.text-'+index).text();
  console.log(name)
  fetch('https://api.edamam.com/search?q=' + name + '&app_id=01dfc015&app_key=ab3ca8c9eb858e5904ba8bc581944e8e&from=0&to=100&calories=gte%20591,%20lte%20722&health=alcohol-free').then(function(response) {
      return response.json();
   })
  
    .then(function(data) {
      console.log('es mio',data)
      const recipe = data.hits[0].recipe;
      $('#info_modal .modal-title').text(recipe.label);
      $('#info_modal .modal-body').text(recipe.ingredientLines);

      $('#info_modal').modal();

      // llama a la funcion para guardar recetas
      $('.save_recipe').click(appendReceta);
    });
}

// agregando recetas a firebase
function appendReceta() {
  let index = $(this).parent().data('index');
  var name = $('.text-'+index).html();
  fetch('https://api.edamam.com/search?q='+name+'&app_id=01dfc015&app_key=ab3ca8c9eb858e5904ba8bc581944e8e&from=0&to=9&calories=gte%20591,%20lte%20722&health=alcohol-free').then(function(response) {
      return response.json();
   }) 
    .then(function(data) {
      let dataReceta = data.hits[0].recipe;

      let uid = user;
      database.ref('/recetas/'+uid+'/'+dataReceta.label).set(dataReceta);
    });
}


function loadCurrentUser(uid) {
  console.log('buscando ', uid);
  user = uid;
}

$('#btn-myRecipes').click(cargar);

function cargar() {
  let uid = user;
  database.ref('/recetas/'+uid).on('value', function(data) {
    $('#home').hide();
    $('#myRecipes').show();
    $('#myRecipes .row').html("");
      var misRecetas = data.val();
      $.each(misRecetas, function(i, misRecetas) {
        index = i + 1;

        let image = misRecetas.image;
        let name = misRecetas.label;
        let receta = misRecetas.ingredientLines;
        
        $('#myRecipes .listImg').append(`<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 imgcont" data-index="${index}">
                                      <div class="row" id="calificar">
                                        <div class="col-5">
                                          <img class="img img-thumbnail" data-name="${index}" src="${image}">
                                        </div>
                                        <div class=" col-7">
                                            <h5 class="text">${name}</h5> 
                                            <p>${receta}</p> 
                                        </div>
                                       </div>
                       
                                    </div>`);
    });


  });
}


