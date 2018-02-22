$(document).ready(() => { 
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $('#registry').hide();
      $('#menuNavbar').show();
      $('#nav-search').show();
      loadCurrentUser(user.uid);
      console.log(user.uid)
    } else {
      $('#nav-search').hide();
      $('#menuNavbar').hide();
      $('#registry').show();
      $('#icoGoogle').click(ingresoGoogle);
	  $('#icoFacebook').click(ingresoFacebook);
      $('#login-btn').click(login);
      $('#signup-btn').click(signup);
      $('#logout-btn').click(logout);
    }
  }); // firebase
});

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
  if(!firebase.auth().currentUser){
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

      if(errorCode === 'auth/account-exists-with-different-credential'){
        alert('Es el mismo usuario');
      }
    });
  }else {
    firebase.auth().signOut();
  }
}

function ingresoFacebook() {
  if(!firebase.auth().currentUser){
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
                                    <div class="card mb-3 card-${index} img-thumbnail" id="guardar">
                                      <img class="card-img-top img-${index}" src="${image}">
                                      <div class="card-body">
                                        <h5 class="card-title text-${index}" value="${name}">${name}</h5>
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
	// llama a la funcion para guardar recetas
		$('.imgcont').click(appendReceta);
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

// agregando recetas a firebase
function appendReceta() {
	let index = $(this).data('index');
	var name = $('.text-'+index).html();
	fetch('https://api.edamam.com/search?q='+name+'&app_id=01dfc015&app_key=ab3ca8c9eb858e5904ba8bc581944e8e&from=0&to=9&calories=gte%20591,%20lte%20722&health=alcohol-free').then(function(response) {
	    return response.json();
	 })
	
    .then(function(data) {
    	console.log('uno solo',data);
    	console.log(data.hits)
    	let dataReceta = data.hits[0].recipe;

    	let uid = user;
  		database.ref("/recetas/"+uid+"/"+dataReceta.label).set(dataReceta);
    });
}


function loadCurrentUser(uid) {
  console.log('buscando ', uid);
  user = uid;
  /*database.ref('/user/'+uid).on("value", function(data) {
    var user = data.val();
    currentUser = user;
    var divUserName = $('#user-name');
    var divUserPic = $('#user-pic');
    divUserName.html(user.name);
    divUserName.removeAttr('hidden');
    divUserPic.find('img').attr({
      src: user.photoURL
    });
    divUserPic.removeAttr('hidden');
  });*/
}

$('#btn-myRecipes').click(cargar);

function cargar() {
	let uid = user;
	database.ref('/recetas/'+uid).on("value", function(data) {
		$('#home').hide();
		$('#myRecipes').show();
		$('#myRecipes .row').html("");
    	var misRecetas = data.val();
    	$.each(misRecetas, function(i, misRecetas) {

      	 	index = i + 1;

		    let image = misRecetas.image;
	        let name = misRecetas.label;
    		console.log(image, name, i);
        
	        $('#myRecipes .listImg').append(`<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 imgcont" data-index="${index}">
	                                    <div class="row" id="calificar">
		                                    <div class="col-5">
		                                      <img class="img img-thumbnail" data-name="${index}" src="${image}">
		                                    </div>
		                                    <div class=" col-7">
		                                        <h5 class="text">${name}</h5>  
		                                    </div>
	                                     </div>
	                     
	                                  </div>`);
		});


  });
}
