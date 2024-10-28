
"use client";

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const Cart = ({ show, onClose, cart, onRemoveItem, totalPrice }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showCadastroModal, setShowCadastroModal] = useState(false);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [nome, setNome] = useState('');
    const [usuarioNome, setUsuarioNome] = useState(null);
    const [nivelUsuario, setNivelUsuario] = useState(null);

    const handleShowLogin = () => setShowLoginModal(true);
    const handleCloseLogin = () => setShowLoginModal(false);
    
    const handleCloseCadastro = () => setShowCadastroModal(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/usuarios/login', {
                emailUsuario: email,
                senhaUsuario: senha,
            });

            if (response.data === 'Login bem-sucedido!') {
                console.log("teste");
                const usuarioResponse = await axios.get(`http://localhost:8080/usuarios/${email}`);
                const { nomeUsuario, nivelUsuario } = usuarioResponse.data;

                localStorage.setItem('nomeUsuario', nomeUsuario);
                localStorage.setItem('nivelUsuario', nivelUsuario);

                setUsuarioNome(nomeUsuario.split(' ')[0]);
                setNivelUsuario(nivelUsuario);
                handleCloseLogin();

                setShowPagamentoModal(true);
            } else {
                alert('Credenciais inválidas!');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao fazer login. Tente novamente.');
        }
    };

    const handleCadastroShow = async() => {
        setShowLoginModal(false);
        setShowCadastroModal(true);
    }
    const handleCadastro = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/usuarios/registrar', {
                nomeUsuario: nome,
                emailUsuario: email,
                senhaUsuario: senha,
                usuarioAtivo: 1,
                cpfUsuario: '',
                enderecoUsuario: '',
                cepUsuario: '',
                nivelUsuario: 1,
            });
    
            const response = await axios.post('http://localhost:8080/usuarios/login', {
                emailUsuario: email,
                senhaUsuario: senha,
            });
    
            if (response.data === 'Login bem-sucedido!') {
                const usuarioResponse = await axios.get(`http://localhost:8080/usuarios/${email}`);
                const { nomeUsuario, nivelUsuario } = usuarioResponse.data;
    
                localStorage.setItem('nomeUsuario', nomeUsuario);
                localStorage.setItem('nivelUsuario', nivelUsuario);
    
                setUsuarioNome(nomeUsuario.split(' ')[0]);
                setNivelUsuario(nivelUsuario);
    
                handleCloseCadastro();
                setShowPagamentoModal(true);
            } else {
                alert('Erro ao logar automaticamente após o cadastro.');
            }
        } catch (error) {
            console.error('Erro ao cadastrar ou logar usuário:', error);
            alert('Erro ao cadastrar ou logar usuário. Tente novamente.');
        }
    };

    const [showPagamentoModal, setShowPagamentoModal] = useState(false);
    const [usarEnderecoCadastrado, setUsarEnderecoCadastrado] = useState(false);
    const [enderecoCadastrado, setEnderecoCadastrado] = useState({});
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
    
        const savedEndereco = JSON.parse(localStorage.getItem('enderecoUsuario')) || {};
    
        if (savedEndereco.cep) {
            setEnderecoCadastrado(savedEndereco);
            setUsarEnderecoCadastrado(true); // Marcar o checkbox
            setCep(savedEndereco.cep); 
            setRua(savedEndereco.rua);
            setNumero(savedEndereco.numero);
            setComplemento(savedEndereco.complemento);
            calculateDistance(savedEndereco.cep); // Calcular frete com o CEP salvo
        }
    }, []);

    const handleCepChange = async (e) => {
        const novoCep = e.target.value;
        setCep(novoCep);

        if (novoCep.length === 8) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${novoCep}/json/`);
                if (response.data && !response.data.erro) {
                    setRua(response.data.logradouro);
                    calculateDistance(novoCep);
                } else {
                    alert('CEP não encontrado!');
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
            }
        }
    };

    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setUsarEnderecoCadastrado(isChecked);
    
        if (isChecked) {
            // Preencher campos com endereço salvo e recalcular frete
            setCep(enderecoCadastrado.cep);
            setRua(enderecoCadastrado.rua);
            setNumero(enderecoCadastrado.numero);
            setComplemento(enderecoCadastrado.complemento);
            calculateDistance(enderecoCadastrado.cep);
        } else {
            // Limpar campos para digitar um novo endereço
            setCep('');
            setRua('');
            setNumero('');
            setComplemento('');
            setDistancia(null);
            setFrete(0);
        }
    };

    const calculateDistance = async (cepDestino) => {
        try {
            const response = await axios.get(
                `http://localhost:8080/lojas/distancia?origem=${cepLoja}&destino=${cepDestino}`
            );
    
            const data = response.data;
            console.log('Resposta da API Distance Matrix:', data);
    
            if (
                data.rows &&
                data.rows.length > 0 &&
                data.rows[0].elements &&
                data.rows[0].elements.length > 0 &&
                data.rows[0].elements[0].status === 'OK'
            ) {
                const distanceInMeters = data.rows[0].elements[0].distance.value;
                const distanceInKm = Math.round(distanceInMeters / 1000); 
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
        if(!usuarioNome){
            handleShowLogin(true);
        }else{
            setShowPagamentoModal(true);
        }
        
    };

    const handleFinalizePurchase = () => {
        const endereco = usarEnderecoCadastrado
            ? `${enderecoCadastrado.rua}, ${enderecoCadastrado.numero} - ${enderecoCadastrado.complemento}, CEP: ${enderecoCadastrado.cep}`
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
                        <Form.Check 
                            type="checkbox" 
                            label="Usar endereço padrão" 
                            checked={usarEnderecoCadastrado}
                            onChange={handleCheckboxChange}
                        />
                            <>
                                <Row className="mt-3">
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>CEP</Form.Label>
                                            <Form.Control 
                                                type="number" 
                                                value={cep} 
                                                onChange={handleCepChange} 
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
                                    <Col md={4}>
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
                                    <Col md={8}>
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

            {/* Modal de Login */}
            <Modal show={showLoginModal} onHide={handleCloseLogin}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleLogin}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Digite seu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Digite sua senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                
                    <Modal.Footer>
                        <Button variant="primary" type="submit">
                                Entrar
                        </Button>
                        <Button variant="primary" onClick={handleCadastroShow}>
                                Cadastrar Usuario
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal de Cadastro */}
            <Modal show={showCadastroModal} onHide={handleCloseCadastro}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Usuário</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCadastro}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Digite seu nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Digite seu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Digite sua senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="success" type="submit">
                            Cadastrar
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

        </>
    );
};

export default Cart;