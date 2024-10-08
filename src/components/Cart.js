// src/components/Cart.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const Cart = ({ cart, onClose }) => {
    return (
        <Modal show={cart.length > 0} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Carrinho de Compras</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {cart.map((item, index) => (
                    <div key={index}>
                        <h5>{item.açaí.name}</h5>
                        <p>Tamanho: {item.açaí.size}</p>
                        <p>Preço: R${item.açaí.price.toFixed(2)}</p>
                        <p>Complementos: {item.toppings.join(', ')}</p>
                        <hr />
                    </div>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Fechar
                </Button>
                <Button variant="primary" onClick={() => alert('Finalizando compra...')}>
                    Finalizar Compra
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Cart;