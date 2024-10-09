"use client";

import Menu from '../components/Menu';
import Banner from '../components/Banner';
import Card from '../components/Card';
import Section from '../components/Section';
import Localizacao from '../components/Localizacao';
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Cart from '../components/Cart'; // Importando o componente Cart

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedAçai, setSelectedAçai] = useState(null);
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [cart, setCart] = useState([]); // Estado para o carrinho
    const [showCart, setShowCart] = useState(false); // Estado para exibir o carrinho

    // Array de tamanhos do açaí
    const normal = [
        { name: 'Pequeno', size: '300 ml', price: 11.00, qtdComplemento: 3 },
        { name: 'Médio', size: '450 ml', price: 15.00, qtdComplemento: 5 },
        { name: 'Grande', size: '600 ml', price: 18.00, qtdComplemento: 6 },
        { name: 'Família', size: '1 L', price: 25.00, qtdComplemento: 8 },
    ];

    // Complementos disponíveis
    const toppings = [
        { id: 1, name: 'Granola' },
        { id: 2, name: 'Leite Condensado' },
        { id: 3, name: 'Açaí em Pó' },
        { id: 4, name: 'Coco Ralado' },
        { id: 5, name: 'Banana' },
    ];

    const handleShow = (açai) => {
        setSelectedAçai(açai);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedToppings([]);
    };

    const handleCheckboxChange = (event) => {
        const { value } = event.target;
        if (selectedToppings.includes(value)) {
            setSelectedToppings(selectedToppings.filter(topping => topping !== value));
        } else {
            setSelectedToppings([...selectedToppings, value]);
        }
    };

    const handleAddToCart = () => {
        if (!selectedAçai) return; // Adicionando verificação para evitar undefined

        // Calcular o custo adicional baseado no número de complementos
        const additionalToppingsCount = selectedToppings.length;
        const additionalCost = additionalToppingsCount > selectedAçai.qtdComplemento ? (additionalToppingsCount - selectedAçai.qtdComplemento) * 2 : 0;

        // Armazene o açaí e os complementos
        const cartItem = {
            açaí: {
                ...selectedAçai,
                additionalCost // Adiciona o custo adicional ao item do carrinho
            },
            toppings: selectedToppings
        };

        // Adicione o item ao carrinho
        setCart([...cart, cartItem]);

        // Mostrar o modal de confirmação
        setShowConfirmationModal(true);
        handleClose(); // Fecha o modal de seleção de açaí
    };

    const handleFinalizePurchase = () => {
        setShowConfirmationModal(false);
        setShowCart(true); // Exibe o carrinho ao finalizar
    };

    const handleCloseCart = () => {
        setShowCart(false);
    };

    // Calcular o valor total do carrinho
    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => {
            // Verifica se item.açai e item.açai.price estão definidos
            if (item.açaí && typeof item.açaí.price === 'number') {
                const itemPrice = item.açaí.price + (item.açaí.additionalCost || 0); // Preço base + custo adicional
                return total + itemPrice;
            }
            return total; // Se não estiver definido, retorna o total sem alteração
        }, 0);
    };

    return (
        <div className="teste">
            <Menu />
            <Banner />
            <div className="container mt-5">
                <h2>Escolha seu tamanho</h2>
                <div className="row mt-5">
                    {normal.map((açai, index) => (
                        <div className="col-md-3 col-sm-6 mb-4" key={index}>
                            <Card 
                                name={açai.name} 
                                size={açai.size} 
                                price={açai.price} 
                                qtdComplemento={açai.qtdComplemento}
                                onShow={() => handleShow(açai)} // Passar função para abrir modal
                            />
                        </div>
                    ))}
                </div>
                <Section />
                <h2>Localização</h2>
                <Localizacao />
            </div>

            {/* Modal do Açaí */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Selecionar Complementos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Tamanho: {selectedAçai?.size}</h5>
                    <h5>Preço: R${selectedAçai?.price?.toFixed(2)}</h5>
                    <h6>Escolha seus complementos:</h6>
                    {toppings.map(topping => (
                        <div key={topping.id}>
                            <input 
                                type="checkbox" 
                                value={topping.name} 
                                checked={selectedToppings.includes(topping.name)}
                                onChange={handleCheckboxChange} 
                            />
                            {topping.name}
                        </div>
                    ))}
                    {/* Mensagem de alerta se exceder a quantidade de complementos */}
                    {selectedAçai && selectedToppings.length > selectedAçai.qtdComplemento && (
                        <p style={{ color: 'red' }}>
                            Você está escolhendo {selectedToppings.length - selectedAçai.qtdComplemento} complemento(s) extra!
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={handleAddToCart}>
                        Adicionar ao Carrinho
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Confirmação */}
            <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar ao Carrinho</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Açai: {selectedAçai?.name}</h5>
                    <h6>Complementos selecionados: {selectedToppings.join(', ')}</h6>
                    <h6>Total: R$
                        {selectedAçai ? (
                            (selectedAçai.price + (selectedToppings.length > selectedAçai.qtdComplemento ? (selectedToppings.length - selectedAçai.qtdComplemento) * 2 : 0)).toFixed(2)
                        ) : "0.00"}
                    </h6>
                    <p>
                        {selectedToppings.length > selectedAçai?.qtdComplemento &&
                        `Você escolheu ${selectedToppings.length - selectedAçai.qtdComplemento} complemento(s) adicional(is).`}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowConfirmationModal(false);
                        setShowModal(true); // Volta para a tela de seleção de açaí
                    }}>
                        Comprar mais
                    </Button>
                    <Button variant="primary" onClick={handleFinalizePurchase}>
                        Finalizar compra
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Carrinho */}
            {showCart && (
                <Cart 
                    cart={cart} 
                    totalPrice={calculateTotalPrice()} 
                    onClose={handleCloseCart} 
                />
            )}

            {/* Botão Finalizar Compra */}
            {cart.length > 0 && (
                <button 
                    className="btn btn-primary ctn" 
                    style={{
                        position: 'fixed', // Fixa o botão na tela
                        bottom: '20px',    // Distância do fundo da tela
                        right: '20px',      // Distância do lado esquerdo da tela
                        padding: '10px 20px', // Ajusta o tamanho do botão
                        fontSize: '16px'   // Tamanho da fonte do botão
                    }} 
                    onClick={() => setShowCart(true)} // Abre o modal do carrinho
                >
                    Finalizar compra
                </button>
            )}
        </div>
    );
};

export default Home;