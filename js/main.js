function verifyEdad(){
    let birthDate = document.getElementById('birthDate').value;
    let date = birthDate.split('-');
    let actualDate = new Date();

    if(parseInt(date[0]) + 18 < actualDate.getFullYear())
        window.location.href = 'register.html'
    else if((parseInt(date[0]) + 18 == actualDate.getFullYear()) && (parseInt(date[1]) <= actualDate.getMonth() + 1) && (parseInt(date[2]) <= actualDate.getDate()))
        window.location.href = 'register.html';
    else{
        document.getElementById('message').style.color = 'crimson';
        document.getElementById('message').innerHTML = 'No eres mayor de edad';
    }   
}

async function register(){
    document.getElementById('message').style.color = 'crimson';
    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let password2 = document.getElementById('password2').value;
    if(username == '' || email == '' || password == '' || password2 == '')
        document.getElementById('message').innerHTML = 'Los campos obligatorios no pueden estar vacios';
    else{
        if(password != password2)
            document.getElementById('message').innerHTML = 'Las contraseñas deben coincidir';
        else{
            document.getElementById('message').style.color = 'grey';
            document.getElementById('message').innerHTML = 'Se está procesando la petición...';
            let cuerpo = {};
            cuerpo.username = username;
            cuerpo.email = email;
            cuerpo.password = password;
            if(document.getElementById('firstName').value != '') cuerpo.firstName = document.getElementById('firstName').value;
            if(document.getElementById('lastName').value != '') cuerpo.lastName = document.getElementById('lastName').value;
            if(document.getElementById('address').value != '') cuerpo.address = document.getElementById('address').value;
            if(document.getElementById('gender').value != '') cuerpo.gender = document.getElementById('gender').value;
            if(document.getElementById('country').value != '') cuerpo.country = document.getElementById('country').value;
            if(document.getElementById('description').value != '') cuerpo.description = document.getElementById('description').value;
            let data = new FormData();
            data.append("registerDTO_in",new Blob([JSON.stringify(cuerpo)],{type:'application/json'}));
            const file = document.getElementById('image');
            if(file.files.length == 1){
                data.append("image", file.files[0]);
            }
            const response = await fetch(
                'http://localhost:8080/api/registrar',
                {
                    method: 'POST',   
                    headers: {
                        'Accept' : 'application/json'                
                    },
                    body: data
                }
            );
            if(response.status != 201){
                let resJson = await response.json();
                document.getElementById('message').style.color = 'crimson';
                document.getElementById('message').innerHTML = resJson.message;
            }else {
                document.getElementById('message').innerHTML = 'La cuenta se creó exitosamente, verifique su correo para confirmar su cuenta';
                document.getElementById('message').style.color = 'green';
                document.getElementById('link').innerHTML = 'Ir a inicio de sesión';
            }
        }
    }
}

async function login(){
    document.getElementById('message').style.color = 'crimson';
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    if(username == ''|| password == '') document.getElementById('message').innerHTML = 'Los campos no pueden ser vacios';
    else{
        let cuerpo = {};
        cuerpo.username = username;   
        cuerpo.password = password;
        const response = await fetch(
            'http://localhost:8080/api/login',
            {
                method: 'POST',   
                headers: {
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(cuerpo)
            }
        );
        if(response.status != 200){
            let resJson = await response.json();
            document.getElementById('message').innerHTML = resJson.message;
        }else{
            document.getElementById('message').innerHTML = 'Inicio de sesión correcto';
            document.getElementById('message').style.color = 'green';
            let token = response.headers.get('Authorization');
            window.localStorage.setItem('sessionToken', token);
            setTimeout("window.location.href = 'inicio.html'", 200);
        }
    }
}

async function sendPwdRecoveryEmail(){
    document.getElementById('message').style.color = 'crimson';
    let email = document.getElementById('email').value;
    if(email == '') document.getElementById('message').innerHTML = 'El campo no puede estar vacio';
    else{
        const response = await fetch(
            'http://localhost:8080/api/recuperarContraseña',
            {
                method: 'POST',   
                headers: {
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/json'
                },
                body: email
            }
        );
        if(response.status != 200){
            let resJson = await response.json();
            document.getElementById('message').innerHTML = resJson.message;
        }else{
            document.getElementById('message').innerHTML = 'Se ha enviado un link a su correo para realizar el cambio de contraseña';
            document.getElementById('message').style.color = 'green';
        }
    }
}

async function changePwd(){
    document.getElementById('message').style.color = 'crimson';
    let password = document.getElementById('password').value;
    let password2 = document.getElementById('password2').value;
    if(password == ''|| password2 == '') document.getElementById('message').innerHTML = 'La contraseña no puede estar vacía';
    else{
        if(password != password2) document.getElementById('message').innerHTML = 'Las contrseñas no coinciden';
        else{
            const valores = window.location.search;
            const urlParams = new URLSearchParams(valores);
            var token = 'Bearer ' + urlParams.get('token');
            const response = await fetch(
                'http://localhost:8080/api/usuarios/me/cambiarContraseña',
                {
                    method: 'POST',   
                    headers: {
                        'Accept' : 'application/json',
                        'Content-Type' : 'application/json',
                        'Authorization' : token
                    },
                    body: password
                }
            );
            if(response.status != 200){
                let resJson = await response.json();
                document.getElementById('message').innerHTML = resJson.message;
            }else{
                document.getElementById('message').innerHTML = 'Contraseña ha sido cambiada correctamente';
                document.getElementById('message').style.color = 'green';
                document.getElementById('link').innerHTML = 'Ir a inicio de sesión';
            }
        }
    }
}