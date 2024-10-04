var sesion = JSON.parse(localStorage.getItem('usuario')) || { email: "null" };

if (sesion.email == "null") {
    window.location.href = "index.html";
}



const cargarNombre = async () => {
    const datos = new FormData();
    datos.append("email", sesion.email);
    datos.append("action", "select");

    let respuesta = await fetch("php/loginUsuario.php", { method: 'POST', body: datos });
    let json = await respuesta.json();

    if (json.success) {
        document.getElementById("user").innerHTML = json.nombre;
        document.getElementById("foto_perfil").src = "assets/" + json.foto;
        // PARA DIV PUBLICACIÓN
        document.getElementById("perfil2").innerHTML = json.nombre;
        document.getElementById("foto_perfil2").src = "assets/" + json.foto;
    } else {
        Swal.fire({ title: "ERROR", text: json.mensaje, icon: "error" });
    }
}



document.getElementById("salir").onclick = () => {
    Swal.fire({
        title: "¿Está seguro de Cerrar Sesión?",
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: `No`
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            window.location.href = "index.html";
        }
    });
}



const cargarPerfil = async () => {
    const datos = new FormData();
    datos.append("email", sesion.email);
    datos.append("action", "perfil");

    try {
        const respuesta = await fetch("php/loginUsuario.php", { method: 'POST', body: datos });
        const json = await respuesta.json();

        if (json.success) {
            document.getElementById("email").innerHTML = json.email;
            document.getElementById("nombre").value = json.nombre;
            document.getElementById("foto-preview").innerHTML = `<img src="assets/${json.foto}" class="foto-perfil">`;
            document.getElementById("foto_perfil").src = `assets/${json.foto}`;
        } else {
            Swal.fire({ title: "ERROR", text: json.mensaje, icon: "error" });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({ title: "ERROR", text: "Hubo un problema con la conexión", icon: "error" });
    }
};



const guardarPerfil = async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const formPerfil = document.getElementById("formPerfil");
    const datos = new FormData(formPerfil);
    datos.append("email", sesion.email);
    datos.append("action", "saveperfil");

    try {
        const respuesta = await fetch("php/loginUsuario.php", { method: 'POST', body: datos });
        const json = await respuesta.json();

        if (json.success) {
            Swal.fire({ title: "¡ÉXITO!", text: json.mensaje, icon: "success" });
            // Actualiza la imagen de perfil en la página sin recargar
            document.getElementById("foto-preview").innerHTML = `<img src="assets/${json.foto}" class="foto-perfil">`;
            document.getElementById("foto_perfil").src = `assets/${json.foto}`;
        } else {
            Swal.fire({ title: "ERROR", text: json.mensaje, icon: "error" });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({ title: "ERROR", text: "Hubo un problema con la conexión", icon: "error" });
    }
};



function preview() {
    const fotoInput = document.getElementById('foto');
    const preview = document.querySelector('.foto-perfil');

    if (!preview) {
        console.error("¡Elemento de vista previa no encontrado!");
        return; // Salir de la función si el elemento no existe
    }

    if (fotoInput.files && fotoInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result; // Cambia la fuente de la imagen
            preview.style.display = 'block'; // Asegúrate de que la imagen sea visible
        }

        reader.readAsDataURL(fotoInput.files[0]); // Leer el archivo como URL
    }
}



//BLOQUE DE CÓDIGO PARA POST

const guardarPost=async()=>{
    let post=document.getElementById("post").value;
    let id_u=sesion.id_u;
    if(post.trim()==""){
        Swal.fire({icon:"error",title:"ERROR",text:"TIENES CAMPOS VACÍOS"});
        return;
    }
    let datos=new FormData();
    datos.append("post",post);
    datos.append("id_u",id_u);
    datos.append("action","publicar");

    let respuesta=await fetch("php/post.php",{method:'POST',body:datos});
    let json=await respuesta.json();

    if(json.success==true){
        Swal.fire("¡ÉXITO!",json.mensaje,"success");
        document.getElementById("post").value="";
    }else{
        Swal.fire("ERROR!",json.mensaje,"error");
    }
    cargarPosts();
}




const cargarPosts=async()=>{
    let datos=new FormData();
    datos.append("action","cargarPosts");
    let respuesta=await fetch("php/post.php",{method:'POST',body:datos});
    let json= await respuesta.json();
    let id_u=sesion.id_u;
    
    var divPost=``
    json.map(post=>{
    moment.locale("es");
    moment().format("L");
    
    var fecha3=moment(post.fecha,'YYYY-MM-DD hh:mm:ss').fromNow();
    
    divPost+=`
    <div class="card w-50 m-auto mt-3">
    
    <div class="card-header">
            <div class="col m-2">
            <img src="assets/${post.foto}" width="50px" height="50px" style="border-radius: 100%;">
            <b class="mx-1">${post.nombre}</b>
            <small>${fecha3}</small>
        </div>
    </div>
    
        <div class="card-body">
               <p class="">${post.post}</p>
            </div>
    
    
    <div class="card-footer"> 
    <input type="text" class="form-control d-inline-block w-75" placeholder="Agrega un comentario" id="comentario${post.idpost}">
    
    <button class="btn btn-primary mx-2 d-inline-block" onclick="comentar(${post.idpost},${post.id_u})">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
          <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
          </svg>
        </button> 
        
        </div>
    
    </div>
    
    
    <div class="accordion w-50 m-auto" id="accordionExample">
        <div class="accordion-item">
            <h2 class="accordion-header">
            <button onclick="verComentarios(${post.idpost})" class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${post.idpost}" aria-expanded="true" aria-controlls="collapseOne">
              Ver comentarios . . .   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" class="bi bi-chat-dots-fill mx-2" viewBox="0 0 16 16">
              <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
            </svg>
            </button>
            </h2>
            
            <div id="collapse${post.idpost}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
    
            </div>
            
        </div>
    </div>
    
    `
    });
    
    document.getElementById('divPosts').innerHTML=divPost;
    }
    


    const comentar = async (idpost) => {
        let comentario = document.getElementById('comentario' + idpost).value;
    
        let datos = new FormData();
        datos.append("comentario", comentario);
        datos.append("idpost", idpost);
        datos.append("id_u", sesion.id_u);
        datos.append("action", "comentar");
    
        let respuesta = await fetch("php/post.php", { method: 'POST', body: datos });
        let json = await respuesta.json();
        if (json.success) {
            Swal.fire("¡ÉXITO!", json.mensaje, "success");
            document.getElementById('comentario' + idpost).value = ""; 
        } else {
            Swal.fire("ERROR!", json.mensaje, "error");
        }
    }
    



const verComentarios=async(idpost)=>{
    let count=0;
    var listaComentarios=`<ul class="list-group list-group-flush">
    `
    let datos=new FormData();
    datos.append("idpost",idpost);
    datos.append("action","verComentarios");
    
    let respuesta=await fetch("php/post.php",{method:'POST',body:datos});
    let json= await respuesta.json();
    
    moment.locale("es");
    moment().format("L");
    
    json.map(comen=>{
    var fecha3=moment(comen.fecha,'YYYY-MM-DD hh:mm:ss').fromNow();
    
    listaComentarios += `
    <li class="list-group-item">
      <p>
      <img src="assets/${comen.foto}" width="45px" height="45px" style="border-radius:100%;">
        <b class="mx-2">${comen.nombre}</b> <small>${fecha3}</small>
      </p>
      <p><b>${comen.comentario}</b></p>
    </li>
    `
    count++;
    });
    listaComentarios+=`</ul>`
    if (count > 0) {
        document.getElementById(`collapse${idpost}`).innerHTML = listaComentarios; // Cambiar p.idpost por idpost
    } else {
        document.getElementById(`collapse${idpost}`).innerHTML = "<h5>NO HAY COMENTARIOS</h5>";
    }
    
    }



    const cargarPersonal=async()=>{
        let id_u=sesion.id_u;
        let datos=new FormData();
        datos.append("id_u",id_u);
        datos.append("action","postsPersonal");
        let respuesta=await fetch("php/post.php",{method:'POST',body:datos});
        let json= await respuesta.json();
        
        
        var divPost=``
        json.map(post=>{
        moment.locale("es");
        moment().format("L");
        
        var fecha3=moment(post.fecha,'YYYY-MM-DD hh:mm:ss').fromNow();
        
        divPost+=`
        <div class="card w-50 m-auto mt-3">
        
        <div class="card-header">
                <div class="col m-2">
                <img src="assets/${post.foto}" width="50px" height="50px" style="border-radius: 100%;">
                <b class="mx-1">${post.nombre}</b>
                <small>${fecha3}</small>
            </div>
        </div>
        
            <div class="card-body">
                   <p class="">${post.post}</p>
                </div>
        
        
        <div class="card-footer"> 
        <input type="text" class="form-control d-inline-block w-75" placeholder="Agrega un comentario" id="comentario${post.idpost}">
        
        <button class="btn btn-primary mx-2 d-inline-block" onclick="comentar(${post.idpost},${post.id_u})">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
              <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
              </svg>
            </button> 
            
            </div>
        
        </div>
        
        
        <div class="accordion w-50 m-auto" id="accordionExample">
            <div class="accordion-item">
                <h2 class="accordion-header">
                <button onclick="verComentarios(${post.idpost})" class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${post.idpost}" aria-expanded="true" aria-controlls="collapseOne">
                  Ver comentarios . . .   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" class="bi bi-chat-dots-fill mx-2" viewBox="0 0 16 16">
                  <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                </svg>
                </button>
                </h2>
                
                <div id="collapse${post.idpost}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
        
                </div>
                
            </div>
        </div>
        
        `
        });
        
        document.getElementById('divPersonal').innerHTML=divPost;
        }
        