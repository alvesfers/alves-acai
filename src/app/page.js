//page.js
"use client";

import Menu from '../components/Menu';
import Banner from '../components/Banner';
import Card from '../components/Card';
import Section from '../components/Section';
import Localizacao from '../components/Localizacao';
import { UserProvider } from './UserContext';
import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Cart from '../components/Cart';
import axios from 'axios';

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedAçai, setSelectedAçai] = useState(null);
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [additionalToppings, setAdditionalToppings] = useState([]);
    const [cart, setCart] = useState([]);
    const [showCartModal, setShowCartModal] = useState(false);
    const [acais, setAcais] = useState([]);
    const [acompanhamentos, setAcompanhamentos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const produtosResponse = await axios.get('http://localhost:8080/produtos');
                const acaisFiltrados = produtosResponse.data.filter(produto => produto.tipoProduto === 1);
                setAcais(acaisFiltrados);

                const acompanhamentosResponse = await axios.get('http://localhost:8080/acompanhamentos');
                setAcompanhamentos(acompanhamentosResponse.data);
            } catch (error) {
                console.error('Erro ao buscar dados da API:', error);
            }
        };
        fetchData();

        const savedCart = JSON.parse(localStorage.getItem('userCart')) || [];
        setCart(savedCart);
    }, []);

    useEffect(() => {
        localStorage.setItem('userCart', JSON.stringify(cart));
    }, [cart]);

    const handleShow = (açai) => {
        setSelectedAçai(açai);
        setShowModal(true);
        setSelectedToppings([]);
        setAdditionalToppings([]);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedToppings([]);
        setAdditionalToppings([]);
    };

    const handleCheckboxChange = (event, isAdditional = false) => {
        const { value } = event.target;
        const setFunction = isAdditional ? setAdditionalToppings : setSelectedToppings;
        const currentList = isAdditional ? additionalToppings : selectedToppings;

        if (currentList.includes(value)) {
            setFunction(currentList.filter(topping => topping !== value));
        } else {
            if (!isAdditional && selectedToppings.length >= selectedAçai.qtdComplemento) {
                alert(`Você atingiu o limite de ${selectedAçai.qtdComplemento} complementos.`);
                return;
            }
            setFunction([...currentList, value]);
        }
    };

    const calculateAdditionalCost = () => {
        return additionalToppings.reduce((total, toppingName) => {
            const topping = acompanhamentos.find(acomp => acomp.nomeAcompanhamento === toppingName);
            return topping ? total + topping.precoAcompanhamento : total;
        }, 0);
    };

    const calculateItemTotal = () => {
        if (!selectedAçai) return 0;
        const additionalCost = calculateAdditionalCost();
        return selectedAçai.precoProduto + additionalCost;
    };

    const handleAddToCart = () => {
        if (!selectedAçai) return;

        const additionalCost = calculateAdditionalCost();

        const cartItem = {
            id: new Date().getTime(),
            açaí: { ...selectedAçai, additionalCost },
            toppings: [...selectedToppings, ...additionalToppings],
        };

        const newCart = [...cart, cartItem];
        setCart(newCart);
        handleClose();
    };

    const handleRemoveItem = (index) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
    };

    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => {
            const itemPrice = item.açaí.precoProduto + (item.açaí.additionalCost || 0);
            return total + itemPrice;
        }, 0);
    };

    const handleShowCart = () => setShowCartModal(true);
    const handleCloseCart = () => setShowCartModal(false);

    const remainingAcompanhamentos = () => {
        return (acompanhamentos || []).filter(
            acomp => !selectedToppings.includes(acomp.nomeAcompanhamento)
        );
    };

    return (
        <UserProvider>
            <div className="teste">
                <Menu />
                <Banner />
                <div className="container mt-5">
                    <h2>Escolha seu tamanho</h2>
                    <div className="row mt-5">
                        {acais.map((açai, index) => (
                            <div className="col-md-3 col-sm-6 mb-4" key={index}>
                                <Card
                                    name={açai.nomeProduto}
                                    size={`${açai.tamanhoProduto} ml`}
                                    price={açai.precoProduto}
                                    qtdComplemento={açai.qtdComplemento}
                                    onShow={() => handleShow(açai)}
                                />
                            </div>
                        ))}
                    </div>
                    <Section />
                    <h2>Localização</h2>
                    <Localizacao />
                </div>

                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        {selectedAçai && (
                            <Modal.Title>
                                {selectedAçai.nomeProduto} {selectedAçai.tamanhoProduto}ml - R$
                                {selectedAçai.precoProduto.toFixed(2)}
                            </Modal.Title>
                        )}
                    </Modal.Header>
                    <Modal.Body>
                        <h6>Escolha seus complementos:</h6>
                        {acompanhamentos.map(acomp => (
                            <div key={acomp.idAcompanhamento}>
                                <input
                                    type="checkbox"
                                    value={acomp.nomeAcompanhamento}
                                    checked={selectedToppings.includes(acomp.nomeAcompanhamento)}
                                    onChange={handleCheckboxChange}
                                    disabled={
                                        selectedToppings.length >= selectedAçai?.qtdComplemento &&
                                        !selectedToppings.includes(acomp.nomeAcompanhamento)
                                    }
                                />
                                {acomp.nomeAcompanhamento}
                            </div>
                        ))}

                        {selectedToppings.length >= selectedAçai?.qtdComplemento && (
                            <>
                                <h6>Acompanhamentos Adicionais:</h6>
                                {remainingAcompanhamentos().map(acomp => (
                                    <div key={acomp.idAcompanhamento}>
                                        <input
                                            type="checkbox"
                                            value={acomp.nomeAcompanhamento}
                                            checked={additionalToppings.includes(acomp.nomeAcompanhamento)}
                                            onChange={(e) => handleCheckboxChange(e, true)}
                                        />
                                        {acomp.nomeAcompanhamento} - R$
                                        {acomp.precoAcompanhamento.toFixed(2)}
                                    </div>
                                ))}
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <h5>Total: R${calculateItemTotal().toFixed(2)}</h5>
                        <Button variant="secondary" onClick={handleClose}>
                            Fechar
                        </Button>
                        <Button variant="primary" onClick={handleAddToCart}>
                            Adicionar ao Carrinho
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Cart
                    show={showCartModal}
                    onClose={handleCloseCart}
                    cart={cart}
                    totalPrice={calculateTotalPrice()}
                    onRemoveItem={handleRemoveItem}
                />

                {cart.length > 0 && (
                    <button
                        className="btn btn-primary ctn"
                        style={{ position: 'fixed', bottom: '20px', right: '20px', padding: '10px 20px', fontSize: '16px' }}
                        onClick={handleShowCart}
                    >
                        Ver Carrinho
                    </button>
                )}
            </div>
        </UserProvider>
    );
};

export default Home;
