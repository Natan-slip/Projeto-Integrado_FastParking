<?php

namespace App\Core;

class Controller{

    public function Model($model){
        require_once("../App/Model/" . $model . ".php");
        return new $model;
    }


    protected function getRequestBody(){
        $json = file_get_contents("php://input");
        $obj = json_decode($json);
        return $obj;
    }
}
