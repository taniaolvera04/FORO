<?php
require_once "config.php";
header('Content-Type: text/html; charset=utf-8');

if($_POST){
    $action=$_REQUEST['action'];

    switch($action){
        case "publicar":

            $valido['success']=array('success'=>false,'mensaje'=>"");            
            $post=$_POST['post'];
            $email=$_POST['email'];
                $id_u = $row['id_u'];

                $sql="INSERT INTO post VALUES(null,'$post',null, '$id_u')";
                if($cx->query($sql)){
                    $valido['success']=true;
                    $valido['mensaje']="SE PUBLICÓ CORRECTAMENTE";
                }else {
                    $valido['success']=false;
                    $valido['mensaje']="ERROR AL PUBLICAR";
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


        case "postsPersonal":
            $email=$_POST['email'];
            $result=$cx->query("SELECT usuario.id_u, usuario.nombre, usuario.foto, post.post, post.fecha, post.idpost
            FROM post INNER JOIN usuario ON(usuario.id_u=post.id_u) WHERE email='$email' ORDER BY post.fecha DESC");
            $rows=array();
            while($row=$result->fetch_assoc() ){
                $rows[]=$row;
            }
            echo json_encode($rows);
        break;


        case "comentar":

            $valido['success']=array('success'=>false,'mensaje'=>"");            
            $idpost=$_POST['idpost'];
            $id_u=$_POST['id_u'];
            $comentario=$_POST['comentario'];

                $sql="INSERT INTO comentario VALUES(null,'$comentario',null, $id_u,$idpost)";
                if($cx->query($sql)){
                    $valido['success']=true;
                    $valido['mensaje']="SE PUBLICÓ CORRECTAMENTE";
                }else {
                    $valido['success']=false;
                    $valido['mensaje']="ERROR AL PUBLICAR";
                }
         
        echo json_encode($valido);


        case "cargarComentarios":
            $result=$cx->query("SELECT usuario.nombre, usuario.foto, usuario.id_u, comentario.fecha, comentario.comentario, comentario.idcomentario, comentario.idpost
            FROM usuario INNER JOIN comentario ON(usuario.id_u=comentario.id_u) ORDER BY comentario.fecha DESC");
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