document.addEventListener('DOMContentLoaded', function() {
    cargarDegustacion();
});

async function cargarDegustacion(){
    const valores = window.location.search;
    const urlParams = new URLSearchParams(valores);
    var plateName = urlParams.get('plateName');
    var localName = urlParams.get('localName');
    const response = await fetch(
        'http://localhost:8080/api/locales/' + localName + '/degustaciones/' + plateName,
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

    if(response.status == 404){
        const resJson = await response.json();
        if(resJson.message.startsWith('El local con nombre:')){
            document.getElementById('post').innerHTML =
            '<h2 class="h2"> El local no existe, puede crearlo si desea</h2>'+
            '   <form class="form">'+
            '       <div class="inputContainer">'+
            '           <input type="text" class="input" placeholder="a" id="localName">'+
            '           <label class="label">Nombre del local</label>'+
            '       </div>'+
            '       <div class="inputContainer">'+
            '           <input type="text" class="input" placeholder="a" id="address">'+
            '           <label class="label">Dirección </label>'+
            '       </div>'+
            '       <input type="button" class="submitBtn" value="Crear local" onclick="createLocal()">'+
            '       <p id="message"></p> '+
            '   </form>';
            document.getElementById('post').style.height = '360px';
            document.getElementById('localName').value = localName;
        }else{
            document.getElementById('post').innerHTML =
            '<h2 class="h2"> La degustación no ha sido encontrada, puede crearla si desea</h2>'+
            '   <form class="form">'+
            '       <div class="inputContainer">'+
            '           <input type="text" class="input" placeholder="a" id="plateName">'+
            '           <label class="label">Nombre del plato/tapa</label>'+
            '       </div>'+
            '       <div class="inputContainer">'+
            '           <input type="text" class="input" placeholder="a" id="type">'+
            '           <label class="label">Tipo del plato</label>'+
            '       </div>'+
            '       <div class="inputContainer">'+
            '           <input type="text" class="input" placeholder="a" id="tasteQualifier">'+
            '           <label class="label">Calificador de gusto</label>'+
            '       </div>'+
            '       <div class="inputContainer">'+
            '           <input type="text" class="input" placeholder="a" id="originCountry">'+
            '           <label class="label">País de origen</label>'+
            '       </div>'+
            '       <div class="inputContainer">'+
            '           <input type="text" class="input" placeholder="a" id="description">'+
            '           <label class="label">Descripción</label>'+
            '       </div>'+
            '       <p> Inserte una image para la degustación</p>'+
            '       <div class="inputContainer">'+
            '           <input type="file"  placeholder="a" id="image" accept="image/png, image/jpeg">'+
            '       </div>'+
            '       <input type="button" class="submitBtn" value="Crear degustacion" onclick="createDegustacion()">'+
            '       <p id="message"></p> '+
            '   </form>';
    
            document.getElementById('post').style.height = '650px';
            document.getElementById('plateName').value = plateName;
        }
    }

    if(response.status == 200){
        const resJson = await response.json();
        document.getElementById('post').innerHTML = 
        '<h2> Degustación encontrada </h2> '+
        '    <section class="left">'+ 
        '        <img height="200" width="200" class="img" id="image"/>'+
        '        <h3> Nombre del plato</h3>'+
        '        <p id="plateName" class="p"> </p>'+
        '    </section>'+
        '    <section class="right">'+
        '        <h3>Descripción</h3> '+
        '        <p id="description" class="p"> </p>'+
        '        <h3> Valoración media</h3>'+
        '        <p id="rateMedia" class="p"> </p>'+
        '        <h3> Valorar</h3>'+
        '        <form class="rating">'+
        '            <p class="clasificacion">'+
        '                <input id="radio1" type="radio" name="estrellas" value="5"><!--'+
        '              --><label for="radio1">★</label><!--'+
        '              --><input id="radio2" type="radio" name="estrellas" value="4"><!--'+
        '              --><label for="radio2">★</label><!--'+
        '              --><input id="radio3" type="radio" name="estrellas" value="3"><!--'+
        '              --><label for="radio3">★</label><!--'+
        '              --><input id="radio4" type="radio" name="estrellas" value="2"><!--'+
        '              --><label for="radio4">★</label><!--'+
        '              --><input id="radio5" type="radio" name="estrellas" value="1"><!--'+
        '              --><label for="radio5">★</label>'+
        '            </p>'+
        '            <button class="botonValorar" type="button" onclick="rateDegustacion()">Valorar</button>'+
        '          </form>'+
        '            <p id="message"></p> '+
        '    </section> ';

        document.getElementById('post').style.height ='550px';
        document.getElementById('plateName').innerHTML = resJson.plateName; 
        if(resJson.photoUrl != null) document.getElementById('image').src = 'http://localhost:8080/images/'+resJson.photoUrl;
        else document.getElementById('image').src = 'https://previews.123rf.com/images/quartadis/quartadis1706/quartadis170600001/79411286-plato-con-comida-parrilla-fiesta-de-barbacoa-picnic-al-aire-libre-ilustraci%C3%B3n-de-dibujos-animados-de.jpg';
        
        if(resJson.description == null){
            document.getElementById('description').innerHTML = 'vacio';  
            document.getElementById('description').style.fontStyle = "italic";
        } else document.getElementById('description').innerHTML = resJson.description; 
        if(resJson.rateMedia == null){
            document.getElementById('rateMedia').innerHTML = 'vacio';  
            document.getElementById('rateMedia').style.fontStyle = "italic";
        } else document.getElementById('rateMedia').innerHTML = resJson.rateMedia +'/5'; 
    }
}



async function createDegustacion(){
    document.getElementById('message').style.color = 'crimson';
    let plateName = document.getElementById('plateName').value;
    let type = document.getElementById('type').value;
    let tasteQualifier = document.getElementById('tasteQualifier').value;
    let originCountry = document.getElementById('originCountry').value;
    let description = document.getElementById('description').value;
    if(plateName == '') document.getElementById('message').innerHTML = 'Debe poner un nombre para el plato';
    else{
        const valores = window.location.search;
        const urlParams = new URLSearchParams(valores);
        var localName = urlParams.get('localName');
        let cuerpo = {};
        cuerpo.plateName = plateName;
        cuerpo.localName = localName;
        if(type != '') cuerpo.type = type;
        if(tasteQualifier != '') cuerpo.tasteQualifier = tasteQualifier;
        if(originCountry != '') cuerpo.originCountry = originCountry;
        if(description != '') cuerpo.description = description;

        let data = new FormData();
        data.append("degustacionDTO_in",new Blob([JSON.stringify(cuerpo)],{type:'application/json'}));
        const file = document.getElementById('image');
        if(file.files.length == 1){
            data.append("image", file.files[0]);
        }
        const response = await fetch(
            'http://localhost:8080/api/usuarios/me/degustaciones',
            {
                method: 'POST',   
                headers: {
                    'Accept' : 'application/json',
                    'Authorization' : window.localStorage.sessionToken,
                },
                body: data
            }
        );

        if(response.status != 201){
            const resJson = await response.json();
            document.getElementById('message').innerHTML = resJson.message;
        }else{
            document.getElementById('message').style.color = 'green';
            document.getElementById('message').innerHTML = 'La degustación se ha creado correctamente';
            setTimeout('document.location.reload()', 200)
        }
    }
}

async function rateDegustacion(){
    let rate = 0;
    if (document.getElementById('radio1').checked) {
        rate = document.getElementById('radio1').value;
    }else if (document.getElementById('radio2').checked) {
        rate = document.getElementById('radio2').value;
    }else if (document.getElementById('radio3').checked) {
        rate = document.getElementById('radio3').value;
    }else if (document.getElementById('radio4').checked) {
        rate = document.getElementById('radio4').value;
    }else if (document.getElementById('radio5').checked) {
        rate = document.getElementById('radio5').value;
    }
    if(rate != 0){
        let cuerpo = {};
        const valores = window.location.search;
        const urlParams = new URLSearchParams(valores);
        var plateName = urlParams.get('plateName');
        var localName = urlParams.get('localName');
        cuerpo.plateName = plateName;
        cuerpo.localName = localName;
        cuerpo.rate = rate;
        const response = await fetch(
            'http://localhost:8080/api/usuarios/me/valoraciones',
            {
                method: 'POST',   
                headers: {
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/json',
                    'Authorization' : window.localStorage.sessionToken
                },
                body: JSON.stringify(cuerpo)
            }
        );
    
        if(response.status!=201){
            document.getElementById('message').style.color = 'crimson';
            document.getElementById('message').innerHTML = 'Ya has valorado esta degustación';
        }else{ 
            document.getElementById('message').style.color = 'green';
            document.getElementById('message').innerHTML = '¡Valorado con éxito!';
            document.getElementById('message').style.color = 'green';
            setTimeout('document.location.reload()', 200)
        }
    }else{
        document.getElementById('message').style.color = 'crimson';
        document.getElementById('message').innerHTML = 'Debe marcar alguna de las casillas';
    }
}

async function createLocal(){
    document.getElementById('message').style.color = 'crimson';
    let localName = document.getElementById('localName').value;
    let address = document.getElementById('address').value;
    if(localName == '') document.getElementById('message').innerHTML = 'Debe poner un nombre para el local';
    else{
        let cuerpo = {};
        cuerpo.name = localName;
        if(address != '') cuerpo.address = address;
        const response = await fetch(
            'http://localhost:8080/api/usuarios/me/locales',
            {
                method: 'POST',   
                headers: {
                    'Accept' : 'application/json',
                    'Content-type' : 'application/json',
                    'Authorization' : window.localStorage.sessionToken,
                },
                body: JSON.stringify(cuerpo)
            }
        );
        
        if(response.status != 201){
            const resJson = await response.json();
            document.getElementById('message').innerHTML = resJson.message;
        }else{
            document.getElementById('message').style.color = 'green';
            document.getElementById('message').innerHTML = 'El local se ha creado correctamente';
        }
    }
}
function logout(){
    window.localStorage.setItem('sessionToken', '')
    window.location.href = 'login.html';
}