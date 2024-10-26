"use client";

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const GOOGLE_API_KEY = 'AIzaSyBahUObidgNkGPbsGIbs62XPlPpULrWKBU'; // Insira sua API Key do Google Maps

const Cart = ({ show, onClose, cart, onRemoveItem, totalPrice }) => {
    const [showPagamentoModal, setShowPagamentoModal] = useState(false);
    const [usarEnderecoCadastrado, setUsarEnderecoCadastrado] = useState(true);
    const [enderecoCadastrado, setEnderecoCadastrado] = useState('');
    const [cep, setCep] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [cupom, setCupom] = useState('');
    const [desconto, setDesconto] = useState(0);
    const [distancia, setDistancia] = useState(null);
    const [frete, setFrete] = useState(0);
    const [cepLoja, setCepLoja] = useState('');
    const [valorKM, setValorKM] = useState(0);

    // Busca CEP e valor por KM da loja no backend Spring Boot
    useEffect(() => {
        const fetchLojaData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/lojas');
                if (response.data.length > 0) {
                    const loja = response.data[0];
                    setCepLoja(loja.cepLoja);
                    setValorKM(loja.valorKM);
                }
            } catch (error) {
                console.error('Erro ao buscar dados da loja:', error);
            }
        };
        fetchLojaData();

        const savedEndereco = localStorage.getItem('enderecoUsuario');
        if (savedEndereco) setEnderecoCadastrado(savedEndereco);
    }, []);

    const handleCepChange = async (e) => {
        const novoCep = e.target.value;
        setCep(novoCep);

        if (novoCep.length === 8) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${novoCep}/json/`);
                if (response.data && !response.data.erro) {
                    setRua(response.data.logradouro);
                    calculateDistance(novoCep); // Calcula a distância
                } else {
                    alert('CEP não encontrado!');
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
            }
        }
    };

    const calculateDistance = async (cepDestino) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${cepLoja}&destinations=${cepDestino}&key=${GOOGLE_API_KEY}`
            );
    
            const data = response.data;
    
            // Validação para garantir que os dados estejam no formato esperado
            if (
                data.rows &&
                data.rows.length > 0 &&
                data.rows[0].elements &&
                data.rows[0].elements.length > 0 &&
                data.rows[0].elements[0].status === 'OK'
            ) {
                const distanceInMeters = data.rows[0].elements[0].distance.value;
                const distanceInKm = distanceInMeters / 1000; // Converte para KM
                setDistancia(distanceInKm);
    
                const custoFrete = distanceInKm * valorKM;
                setFrete(custoFrete);
            } else {
                console.error('Erro: Resposta inesperada da API Distance Matrix', data);
                alert('Não foi possível calcular a distância.');
            }
        } catch (error) {
            console.error('Erro ao calcular distância:', error);
            alert('Erro ao calcular distância. Verifique os dados e tente novamente.');
        }
    };

    const handleApplyCupom = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/cupons/${cupom}`);
            if (response.data && response.data.ativo) {
                const { valorDesconto, percentualDesconto } = response.data;
                const descontoCalculado = percentualDesconto > 0 
                    ? totalPrice * (percentualDesconto / 100) 
                    : valorDesconto;
                setDesconto(descontoCalculado);
                alert('Cupom aplicado com sucesso!');
            } else {
                alert('Cupom inválido ou expirado!');
            }
        } catch (error) {
            console.error('Erro ao aplicar cupom:', error);
        }
    };

    const calculateTotalWithDiscountAndFrete = () => {
        return totalPrice - desconto + frete;
    };

    const handlePagamento = () => {
        onClose();
        setShowPagamentoModal(true);
    };

    const handleFinalizePurchase = () => {
        const endereco = usarEnderecoCadastrado
            ? enderecoCadastrado
            : `${rua}, ${numero} - ${complemento}, CEP: ${cep}`;

        alert(`Pedido finalizado! Entrega para: ${endereco}`);
        localStorage.removeItem('userCart');
        setShowPagamentoModal(false);
    };

    return (
        <>
            <Modal show={show} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Carrinho de Compras</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {cart.length > 0 ? (
                        cart.map((item, index) => (
                            <div key={index}>
                                <h5>{item.açaí.nomeProduto}</h5>
                                <p>Tamanho: {item.açaí.tamanhoProduto} ml</p>
                                <p>Preço base: R${item.açaí.precoProduto.toFixed(2)}</p>
                                <p>Custo adicional: R${item.açaí.additionalCost.toFixed(2)}</p>
                                <p>Complementos: {item.toppings.join(', ')}</p>
                                <Button variant="danger" onClick={() => onRemoveItem(index)}>
                                    Remover
                                </Button>
                                <hr />
                            </div>
                        ))
                    ) : (
                        <p>Seu carrinho está vazio!</p>
                    )}
                    <h5>Total: R${totalPrice.toFixed(2)}</h5>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={handlePagamento}>
                        Pagamento/Entrega
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showPagamentoModal} onHide={() => setShowPagamentoModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Pagamento e Entrega</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <h4>Endereço de Entrega</h4>
                        <Form.Check 
                            type="checkbox" 
                            label="Usar endereço cadastrado" 
                            checked={usarEnderecoCadastrado}
                            onChange={(e) => setUsarEnderecoCadastrado(e.target.checked)}
                        />
                        {!usarEnderecoCadastrado && (
                            <>
                                <Row className="mt-3">
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>CEP</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                value={cep} 
                                                onChange={handleCepChange} 
                                                maxLength={8}
                                                placeholder="Digite o CEP" 
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={8}>
                                        <Form.Group>
                                            <Form.Label>Rua</Form.Label>
                                            <Form.Control type="text" value={rua} readOnly />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Número</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                value={numero} 
                                                onChange={(e) => setNumero(e.target.value)} 
                                                placeholder="Número da residência" 
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Complemento</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                value={complemento} 
                                                onChange={(e) => setComplemento(e.target.value)} 
                                                placeholder="Complemento (opcional)" 
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </>
                        )}

                        {distancia && <p>Distância até a loja: {distancia} km</p>}
                        <h5>Frete: R${frete.toFixed(2)}</h5>

                        <h4 className="mt-4">Cupom de Desconto</h4>
                        <Form.Group className="mb-3">
                            <Form.Control 
                                type="text" 
                                placeholder="Insira o código do cupom"
                                value={cupom}
                                onChange={(e) => setCupom(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="success" onClick={handleApplyCupom}>
                            Aplicar Cupom
                        </Button>

                        <h5 className="mt-4">
                            Total com Desconto e Frete: R${calculateTotalWithDiscountAndFrete().toFixed(2)}
                        </h5>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPagamentoModal(false)}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={handleFinalizePurchase}>
                        Finalizar Compra
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Cart;