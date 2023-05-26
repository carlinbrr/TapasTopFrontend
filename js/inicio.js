document.addEventListener('DOMContentLoaded', function() {
    cargarInicio();
});

async function cargarInicio(){
    const id = window.localStorage.idLoggedUser;
    const response = await fetch(
        'http://localhost:8080/api/usuarios/me',
        {
            method: 'GET',   
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : window.localStorage.sessionToken
            },
        }
    );

    if(response.status == 401){
        alert('Debe iniciar sesión');
        window.location.href = 'login.html';
    }

    if(response.status == 200){
        const resJson = await response.json();
        document.getElementById('username').innerHTML = resJson.username;
        document.getElementById('email').innerHTML = resJson.email;
        document.getElementById('nDegustacionesLastWeek').innerHTML = resJson.ndegustacionesLastWeek;
        if(resJson.photoUrl !=  null){
            document.getElementById('image').src = 'http://localhost:8080/images/'+resJson.photoUrl;
        }else{
            document.getElementById('image').src = 'https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-Free-PNG.png';
        }
        if(resJson.firstName == null) {
            document.getElementById('firstName').innerHTML = 'vacio'; 
            document.getElementById('firstName').style.fontStyle = "italic";
        }else document.getElementById('firstName').innerHTML = resJson.firstName;
        if(resJson.lastName == null) {
            document.getElementById('lastName').innerHTML = 'vacio'; 
            document.getElementById('lastName').style.fontStyle = "italic";
        }else document.getElementById('lastName').innerHTML = resJson.lastName;
        if(resJson.address == null){
            document.getElementById('address').innerHTML = 'vacio';  
            document.getElementById('address').style.fontStyle = "italic";
        } else document.getElementById('address').innerHTML = resJson.address;  
        if(resJson.gender == null){
            document.getElementById('gender').innerHTML = 'vacio';  
            document.getElementById('gender').style.fontStyle = "italic";
        } else document.getElementById('gender').innerHTML = resJson.gender; 
        if(resJson.country == null){
            document.getElementById('country').innerHTML = 'vacio';  
            document.getElementById('country').style.fontStyle = "italic";
        } else document.getElementById('country').innerHTML = resJson.country;
        if(resJson.description == null){
            document.getElementById('description').innerHTML = 'vacio';  
            document.getElementById('description').style.fontStyle = "italic";
        } else document.getElementById('description').innerHTML = resJson.description; 
    }
}

function searchDegustacion(){
    let plateName = document.getElementById('plateNameSearch').value;
    window.location.href = 'degustacion.html?plateName=' + plateName;
}

function logout(){
    window.localStorage.setItem('sessionToken', '')
    window.location.href = 'login.html';
}
