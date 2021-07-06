<?php

use App\Core\Controller;

class Carros extends Controller{

    public function index(){

        $carroModel = $this->model("Carro");
        $carros = $carroModel->listaTodos();


        echo json_encode($carros, JSON_UNESCAPED_UNICODE);
    }

    public function find($id){

        $carroModel = $this->model("Carro");
        $carro = $carroModel->buscarId($id);

        if ($carro) {
            echo json_encode($carro, JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(404);
            echo json_encode(["erro" => "Carro não encontrado"]);
        }
    }

    public function store(){

        $json = file_get_contents("php://input");
        $novoCarro = json_decode($json);

        $carroModel = $this->model("Carro");

        $carroModel->nome = $novoCarro->nome;
        $carroModel->placa = $novoCarro->placa;
        $carroModel->idPrecos = $novoCarro->idPrecos;

        $carroModel = $carroModel->inserir();

        if ($carroModel) {

            http_response_code(201);
            echo json_encode($carroModel, JSON_UNESCAPED_UNICODE);
        } else {

            http_response_code(500);
            echo json_encode(["erro" => "Problemas ao inserir um novo carro"]);
        }
    }

    public function update($id){

        $carroEditar = $this->getRequestBody();
        $carroModel = $this->model("Carro");
        $carroModel = $carroModel->buscarId($id);

        if (!$carroModel) {
            http_response_code(404);
            echo json_encode(["erro" => "Carro não encontrado"]);
            exit();
        }

        $carroModel->nome = $carroEditar->nome;
        $carroModel->placa = $carroEditar->placa;

        if ($carroModel->update()) {

            http_response_code(204);
        } else {

            http_response_code(500);
            echo json_encode(["erro " => "Problemas ao atualizar o carro"]);
        }
    }

    public function delete($id){

        $carroModel = $this->model("Carro");
        $carroModel = $carroModel->buscarId($id);

        if (!$carroModel) {
            http_response_code(404);
            echo json_encode(["erro" => "Carro não encontrado"]);
            exit();
        }

        if ($carroModel->delete()) {
            
            http_response_code(204);
        } else {

            http_response_code(500);
            echo json_encode(["erro " => "Problemas ao excluir esse carro"]);
        }
    }
}