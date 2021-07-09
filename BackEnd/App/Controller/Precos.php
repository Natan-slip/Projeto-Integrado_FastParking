<?php

use App\Core\Controller;

class Precos extends Controller{

    public function index(){

        $precoModel = $this->Model("Preco");
        $precos = $precoModel->listaTodos();

        echo json_encode($precos, JSON_UNESCAPED_UNICODE);
    }

    public function store(){

        $novoPreco = $this->getRequestBody();

        $erros = $this->validarCampo($novoPreco->primeiraHora, $novoPreco->demaisHoras);
        if (count($erros) > 0) {
            http_response_code(404);
            echo json_encode($erros, JSON_UNESCAPED_UNICODE);

            exit();
        }

        $precoModel = $this->Model("Preco");
        $precoModel->primeiraHora = str_replace(",", ".", $novoPreco->primeiraHora);
        $precoModel->demaisHoras = str_replace(",", ".", $novoPreco->demaisHoras);

        $precoModel = $precoModel->insert();

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

    private function validarCampo($primeiraHora, $demaisHoras)
    {
        $erros = [];

        if (!isset($primeiraHora) && $primeiraHora == "") {
            $erros[] = "O campo primeira hora é obrigatório";
        } elseif (!is_numeric(str_replace(",", ".", $primeiraHora))) {
            $erros[] = "O campo primeira hora deve ser um número";
        }

        if (!isset($demaisHoras) && $demaisHoras == "") {
            $erros[] = "O campo demais horas é obrigatório";
        } elseif (!is_numeric(str_replace(",", ".", $demaisHoras))) {
            $erros[] = "O campo demais horas deve ser um número";
        }

        return $erros;
    }

}
