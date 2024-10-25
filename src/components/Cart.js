"use client";

import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const Cart = ({ show, onClose, cart, onRemoveItem, totalPrice }) => {
    return (
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
                            <Button 
                                variant="danger" 
                                onClick={() => onRemoveItem(index)}>
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
                <Button variant="primary" onClick={() => alert('Compra finalizada!')}>
                    Finalizar Compra
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Cart;