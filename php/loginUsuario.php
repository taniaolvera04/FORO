<?php
require_once "config.php";
header('Content-Type: text/html; charset=utf-8');

if($_POST){
    $action=$_REQUEST['action'];
    switch($action){
        case "registrar":

            $valido['success']=array('success'=>false,'mensaje'=>"");            
            $a=$_POST['email'];
            $b=md5($_POST['password']);
            $c=$_POST['nombre'];

            $tipo=$_FILES['foto']['type'];

            $extension= pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);

            $fileName="img_".time().".". $extension;
            $fileTmpName=$_FILES['foto']['tmp_name'];
            $uploadDirectory='../img_profile/';
            if(!is_dir($uploadDirectory)){
                mkdir($uploadDirectory, 0755, true);
            }

            $filePath=$uploadDirectory . basename($fileName);
           

            if(move_uploaded_file($fileTmpName,$filePath)){

            $check="SELECT * FROM usuario WHERE email='$a'";
            $res=$cx->query($check);
            if($res->num_rows==0){
                $sql="INSERT INTO usuario VALUES(null,'$a','$b','$c', '$filePath')";
                if($cx->query($sql)){
                    $valido['success']=true;
                    $valido['mensaje']="SE REGISTRÓ CORRECTAMENTE";
                }else {
                    $valido['success']=false;
                    $valido['mensaje']="ERROR AL REGISTRAR";
                }
            }else{
                $valido['success']=false;
                $valido['mensaje']="USUARIO NO DISPONIBLE";
            }
        }
           
            echo json_encode($valido);
            break;

       
            case "login": 
                $valido['success'] = array('success' => false, 'mensaje' => "");            
                $a = $_POST['email'];
                $b = md5($_POST['password']);
                $check = "SELECT * FROM usuario WHERE email='$a' AND password='$b';";
                $res = $cx->query($check);
                if ($res->num_rows > 0) {
                    $row = $res->fetch_array();
                    $valido['success'] = true;
                    $valido['mensaje'] = "SE INICIÓ CORRECTAMENTE";
                   
                } else {
                    $valido['success'] = false;
                    $valido['mensaje'] = "USUARIO Y/O CONTRASEÑA INCORRECTO";
                }           
                echo json_encode($valido);
                break;
            

        case "select":
            header('Content-Type: text/html; charset=utf-8');
                $valido['success']=array('success'=>false,'mensaje'=>"","foto"=>"");            
                $a=$_POST['email'];
                $check="SELECT * FROM usuario WHERE email='$a';";
                $res=$cx->query($check);
                if($res->num_rows>0){
                    $row=$res->fetch_array();
                    $valido['success']=true;
                    $valido['nombre']=$row[3];
                    $valido['foto']=$row[4];
                }else {
                    $valido['success']=false;
                    $valido['mensaje']="USUARIO Y/O PASSWORD INCORRECTO";
                }           
                echo json_encode($valido);
     
                break;

                case "perfil":
                    header('Content-Type: application/json; charset=utf-8');
                    $valido = ['success' => false, 'mensaje' => '', 'email' => '', 'password' => '', 'nombre' => '', 'foto' => ''];
                    $a = $_POST['email'];
                    $check = "SELECT * FROM usuario WHERE email='$a';";
                    $res = $cx->query($check);
                    if ($res->num_rows > 0) {
                        $row = $res->fetch_array();
                        $valido['success'] = true;
                        $valido['email'] = $row['email'];
                        $valido['password'] = $row['password'];
                        $valido['nombre'] = $row['nombre'];
                        $valido['foto'] = $row['foto'];
                    } else {
                        $valido['success'] = false;
                        $valido['mensaje'] = "ALGO SALIO MAL";
                    }
                    echo json_encode($valido);
                    break;
                
                case "saveperfil":
                    header('Content-Type: application/json; charset=utf-8');
                    $valido = ['success' => false, 'mensaje' => '', 'foto' => ''];
                    $a = $_POST['nombre'];
                    $c = $_POST['email'];
                    $fileName = $_FILES['foto']['name'];
                    $fileTmpName = $_FILES['foto']['tmp_name'];
                    $uploadDirectory = '../img_profile/';
                
                    if (!is_dir($uploadDirectory)) {
                        mkdir($uploadDirectory, 0755, true);
                    }
                
                    $filePath = $uploadDirectory . basename($fileName);
                
                    if (move_uploaded_file($fileTmpName, $filePath)) {
                        $check = "UPDATE usuario SET nombre='$a', foto='$filePath' WHERE email='$c'";
                        if ($cx->query($check) === TRUE) {
                            $valido['success'] = true;
                            $valido['mensaje'] = "SE GUARDÓ CORRECTAMENTE";
                            $valido['foto'] = $filePath;
                        } else {
                            $valido['success'] = false;
                            $valido['mensaje'] = "ALGO SALIÓ MAL EN LA ACTUALIZACIÓN";
                        }
                    } else {
                        $valido['success'] = false;
                        $valido['mensaje'] = "ALGO SALIÓ MAL AL SUBIR LA IMAGEN";
                    }
                
                    echo json_encode($valido);
                    break;
                
                        
    }
    
}else{
    $valido['success']=false;
    $valido['mensaje']="ERROR NO SE RECIBIO NADA";
}
?>