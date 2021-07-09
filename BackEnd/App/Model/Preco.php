<?php

use App\Core\Model;

class Preco{

    public $idPreco;
    public $primeiraHora;
    public $demaisHoras;

    public function listaTodos(){

        $sql = " SELECT * FROM tblPrecos ";

        $stmt = Model::getConexao()->prepare($sql);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {

            $result = $stmt->fetchAll(PDO::FETCH_OBJ);

            return $result;
        } else {
            return [];
        }
    }

    public function buscarId($id){

        $sql = " SELECT * FROM tblPrecos WHERE idPreco= ?";

        $stmt = Model::getConexao()->prepare($sql);
        $stmt->bindValue(1, $id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $preco = $stmt->fetch(PDO::FETCH_OBJ);

            $this->idPreco = $preco->idPreco;
            $this->primeiraHora = $preco->primeiraHora;
            $this->demaisHoras = $preco->demaisHoras;
            

            return $this;
        } else {
            return false;
        }
    }

    public function inserir(){

        $sql = " INSERT INTO tblPrecos (primeiraHora, demaisHoras) VALUES  (now(), ?, ?) ";

        $stmt = Model::getConexao()->prepare($sql);
        $stmt->bindValue(1, $this->primeiraHora);
        $stmt->bindValue(2, $this->demaisHoras);

        if ($stmt->execute()) {
            $this->idPreco = Model::getConexao()->lastInsertId();
            return $this;
        } else {
            return false;
        }
    }

    public function atualizar() {

        $sql = " UPDATE tblPrecos SET primeiraHora = ?, demaisHoras = ? WHERE idPreco = ? ";

        $stmt = Model::getConexao()->prepare($sql);
        $stmt->bindValue(1, $this->primeiraHora);
        $stmt->bindValue(2, $this->demaisHoras);
        $stmt->bindValue(3, $this->idPreco);

        return $stmt->execute();
    }
}
