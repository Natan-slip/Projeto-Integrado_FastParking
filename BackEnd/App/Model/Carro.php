<?php

use App\Core\Model;

class Carro{

    public $idCarro;
    public $idPreco;
    public $nome;
    public $placa;
    public $dataEntrada;
    public $horaEntrada;
    public $horaSaida;
    public $valorPago;
    

    public function listaTodos(){

        $sql = " SELECT idCarro,
        idPreco, 
        nome, 
        placa, 
        date_format(dataEntrada, '%d/%m/%Y') as dataEntrada,
        time_format(horaEntrada, '%H:%i') as horaEntrada,
        time_format(horaSaida, '%H:%i') as horaSaida,
        valorPago,
        FROM tblCarros ";

        $stmt = Model::getConexao()->prepare($sql);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $resultado = $stmt->fetchAll(PDO::FETCH_OBJ);

            return $resultado;
        } else {
            
            return [];
        }
    }


    public function inserir(){

        $sql = " INSERT INTO tblCarros
                 (nome, placa, idPreco, dataEntrada, horaEntrada)
                 VALUES
                 (curdate(), curtime(), ?, ?, ?, ?) ";

        $stmt = Model::getConexao()->prepare($sql);
        $stmt->bindValue(1, $this->nome);
        $stmt->bindValue(2, $this->placa);
        $stmt->bindValue(4, $this->idPreco);

        if ($stmt->execute()) {
            $this->idCarro = Model::getConexao()->lastInsertId();
            return $this;
        } else {
            return false;
        }
    }

    public function pegarPreco(){

        $sql = " SELECT MAX(idPreco) as idPreco, primeiraHora, demaisHoras  FROM tblPrecos ";

        $stmt = Model::getConexao()->prepare($sql);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $preco = $stmt->fetch(PDO::FETCH_OBJ);

            return $preco;
        } else {
            return [];
        }
    }

    public function buscarId($id){

        $sql = " SELECT idCarro,
        idPreco, 
        nome, 
        placa, 
        date_format(dataEntrada, '%d/%m/%Y') as dataEntrada,
        time_format(horaEntrada, '%H:%i') as horaEntrada,
        time_format(horaSaida, '%H:%i') as horaSaida,
        valorPago,
        FROM tblCarros WHERE idCarro = ? ";

        $stmt = Model::getConexao()->prepare($sql);
        $stmt->bindValue(1, $id);
        $stmt->execute();

        if($stmt->rowCount() > 0){
            $carro = $stmt->fetch(PDO::FETCH_OBJ);

            $this->idCarro = $carro->idCarro;
            $this->idPreco = $carro->idPreco;
            $this->nome = $carro->nome;
            $this->placa = $carro->placa;
            $this->dataEntrada = $carro->dataEntrada;
            $this->horaEntrada = $carro->horaEntrada;
            $this->horaSaida = $carro->horaSaida;
            $this->valorPago = $carro->valorPago;
           
            
            return $this;
        }else{
            return false;
        }
    }

    public function pegarDiferenca(){

        $sql = " SELECT timediff( ?, ? ) AS diferenca ";

        $stmt = Model::getConexao()->prepare($sql);
        $stmt->bindValue(1, $this->horaSaida);
        $stmt->bindValue(2, $this->horaEntrada);
        $stmt->execute();
  
        if ($stmt->rowCount() > 0) {
            $valor = $stmt->fetch(PDO::FETCH_OBJ);

            return $valor;
        } else {
            return [];
        }
    }

    public function pegarHora($hour){

        $sql = " SELECT time_format( '$hour', '%H') as hora";

        $stmt = Model::getConexao()->prepare($sql);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $hour = $stmt->fetch(PDO::FETCH_OBJ);

            return $hour;
        } else {
            return [];
        }
    }

    public function pegarHoraAgora(){

        $sql = " SELECT curtime() as hora";

        $stmt = Model::getConexao()->prepare($sql);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $hour = $stmt->fetch(PDO::FETCH_OBJ);

            return $hour;
        } else {
            return [];
        }
    }

    public function atualizar(){

        $sql = " UPDATE tblCarros SET nome = ?, placa = ? WHERE idCarro = ? ";

        $stmt = Model::getConexao()->prepare($sql);
        $stmt->bindValue(1, $this->nome);
        $stmt->bindValue(2, $this->placa);
        $stmt->bindValue(3, $this->idCarro);

        return $stmt->execute();
    }

    public function delete(){

        $sql = " UPDATE tblCarros SET horaSaida = curtime(), valorPago = ?, WHERE idCarro = ? ";

        $stmt = Model::getConexao()->prepare($sql);
        $stmt->bindValue(1, $this->valorPago);
        $stmt->bindValue(2, $this->idCarro);

        return $stmt->execute();
    }
}
