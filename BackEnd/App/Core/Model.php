<?php

namespace App\Core;

class Model{

    private static $conexao;

    public static function getConexao(){

        if(!isset(self::$conexao)){

            self::$conexao = new \PDO("mysql:host=localhost;port=3306;dbname=ProjetoIntegradoFastParking;", "root", "bcd127");
        }

        return self::$conexao;
    }
}
