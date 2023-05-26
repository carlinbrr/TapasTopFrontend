document.addEventListener('DOMContentLoaded', function() {
    confirm();
});

async function confirm(){
    document.getElementById('message').style.color = 'crimson';
    const valores = window.location.search;
    const urlParams = new URLSearchParams(valores);
    var token = urlParams.get('token');
    const response = await fetch(
        'http://localhost:8080/api/verificarToken',
        {
            method: 'POST',   
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body: token
        }
    );
    if(response.status != 200){
        let resJson = await response.json();
        document.getElementById('message').innerHTML = resJson.message;
    }else window.location.href = 'changePasswordForm.html?token=' +  token;  
}