var sesion=localStorage.getItem('usuario') || "null";

if (sesion != "null") {
  
        window.location.href = 'inicio.html';

  }
 
  function validarCorreo(correo){
    var regex= /[\w-\.]{2,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;
    return regex.test(correo.trim());
  }

  function validarPassword(password){
    var regex= /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;
    return regex.test(password.trim());
  }




  const login= async() => {
    let usuario = document.getElementById('email').value;
    let password = document.getElementById("password").value;

    if (usuario.trim() == "" || password == "") {
        Swal.fire({ title: "ERROR", text: "TIENES CAMPOS VACÍOS", icon: "error" });
        return;
    }

    if (!validarCorreo(usuario)) {
        Swal.fire({ title: "ERROR", text: "CORREO NO VÁLIDO", icon: "error" });
        return;
    }

    if (!validarPassword(password)) {
        Swal.fire({ title: "ERROR", text: "CONTRASEÑA NO VÁLIDA", icon: "error" });
        return;
    }

    datos = new FormData();
    datos.append("email", usuario);
    datos.append("password", password);
    datos.append('action', 'login');

   
    let respuesta = await fetch("php/loginUsuario.php",{method:'POST',body:datos});
    let json = await respuesta.json();

    
    if (json.success == true) {

        localStorage.setItem("usuario", usuario);
        window.location.href = 'inicio.html';
        
    } else {
        Swal.fire({ title: "ERROR", text: json.mensaje, icon: "error" });
    }

};



  const Registrar = async() => {

    let usuario = document.getElementById("r_email").value;
    let password = document.getElementById("r_password").value;
    let nombre = document.getElementById("r_nombre").value;
    let foto = document.getElementById("foto").files[0];



    if (usuario.trim() == "" || password == "" || nombre == "" || !foto) {
        Swal.fire({ title: "ERROR", text: "TIENES CAMPOS VACÍOS", icon: "error" });
        return;
    }

    if (!validarCorreo(usuario)) {
        Swal.fire({ title: "ERROR", text: "CORREO NO VÁLIDO", icon: "error" });
        return;
    }

    if (!validarPassword(password)) {
        Swal.fire({ title: "ERROR", text: "CONTRASEÑA NO VÁLIDA", icon: "error" });
        return;
    }

    let datos = new FormData();
    datos.append("email", usuario);
    datos.append("password", password);
    datos.append("nombre", nombre);

   if(foto){
    datos.append("foto", foto);
   }
    datos.append('action', 'registrar');

    let respuesta = await fetch("php/loginUsuario.php",{method:'POST',body:datos});
    let json = await respuesta.json();


    if (json.success == true) {

        document.getElementById("r_email").value="";
        document.getElementById("r_password").value="";
        document.getElementById("r_nombre").value="";
        document.getElementById("foto").value="";

        Swal.fire({ title: "¡REGISTRO EXITOSO!", text: json.mensaje, icon: "success" });
    } else {
        Swal.fire({ title: "ERROR", text: json.mensaje, icon: "error" });
    }
};


function previewImage() {
    const fotoInput = document.getElementById('foto');
    const preview = document.getElementById('foto-preview');
    
    if (fotoInput.files && fotoInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block'; 
        }

        reader.readAsDataURL(fotoInput.files[0]); // Leer el archivo como URL
    }
}