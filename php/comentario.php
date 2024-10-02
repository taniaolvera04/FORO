<?php
require_once "config.php";
header('Content-Type: text/html; charset=utf-8');

if($_POST){
    $action=$_REQUEST['action'];

    switch($action){
        case "comentario":

            $valido['success']=array('success'=>false,'mensaje'=>"");            
            $post=$_POST['post'];
            $email=$_POST['email'];
           

            $check = "SELECT id_u FROM usuario WHERE email='$email'";
            $result = $cx->query($check);
            

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $id_u = $row['id_u'];

                $sql="INSERT INTO post VALUES(null,'$post',null, '$id_u')";
                if($cx->query($sql)){
                    $valido['success']=true;
                    $valido['mensaje']="SE PUBLICÓ CORRECTAMENTE";
                }else {
                    $valido['success']=false;
                    $valido['mensaje']="ERROR AL PUBLICAR";
                }
                
            }else{
                $valido['success']=false;
                $valido['mensaje']="USUARIO NO DISPONIBLE";
            }
         
        echo json_encode($valido);
        break;


        case "cargarPosts":
            $result=$cx->query("SELECT usuario.id_u, usuario.nombre, usuario.foto, post.post, post.fecha, post.idpost
            FROM post INNER JOIN usuario ON(usuario.id_u=post.id_u) ORDER BY post.fecha DESC");
            $rows=array();
            while($row=$result->fetch_assoc() ){
                $rows[]=$row;
            }
            echo json_encode($rows);
        break;

    }
    
}else{
    $valido['success']=false;
    $valido['mensaje']="ERROR NO SE RECIBIÓ NADA";
}
?>