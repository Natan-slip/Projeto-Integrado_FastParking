<?php

use App\Core\Controller;

class Precos extends Controller
{
    public function index(){

        $precoModel = $this->Model("Preco");
        $precos = $precoModel->listaTodos();

        echo json_encode($precos, JSON_UNESCAPED_UNICODE);
    }

    public function store(){

        $json = file_get_contents("php://input");
        $novoPreco = json_decode($json);

        $precoModel = $this->model("Preco");
        $precoModel->primeiraHora = $novoPreco->primeiraHora;
        $precoModel->demaisHoras = $novoPreco->demaisHoras;

        $precoModel = $precoModel->inserir();

        if ($precoModel) {

            http_response_code(201);
            echo json_encode($precoModel, JSON_UNESCAPED_UNICODE);
        } else {

            http_response_code(500);
            echo json_encode(["erro" => "Problemas ao inserir o preço"]);
        }
    }

    public function update($id){

        $precoEditar = $this->getRequestBody();
        $precoModel = $this->model("Preco");
        $precoModel = $precoModel->buscarPorId($id);

        if(!$precoModel){

            http_response_code(404);
            echo json_encode(["erro" => "Preço não encontrado"]);
            exit;
        }

        $precoModel->primeiraHora = $precoEditar->primeiraHora;
        $precoModel->demaisHoras = $precoEditar->demaisHoras;

        if($precoModel->atualizar()){

            http_response_code(204);
        } else{

            http_response_code(500);
            echo json_encode(["erro" => "Problemas ao atualizar os preços"]);
        }
    }
}
