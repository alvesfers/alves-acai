import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const Cart = ({ cart, totalPrice, onClose, onRemoveItem }) => {
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [cep, setCep] = useState('');
    const [address, setAddress] = useState('');
    const [complement, setComplement] = useState('');
    const [distance, setDistance] = useState(0);

    const headquartersLocation = { lat: -23.5505, lng: -46.6333 }; // Exemplo: São Paulo, SP

    const handleFinalizePurchase = () => {
        // Aqui você deve chamar a função que fecha o modal do carrinho
        // E abrir o modal de entrega ao mesmo tempo
        setShowDeliveryModal(true);
    };

    const handleCepChange = (event) => {
        setCep(event.target.value);
    };

    const handleFetchAddress = async () => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            if (response.data && !response.data.erro) {
                setAddress(response.data.logradouro);
                // Aqui você pode fazer o cálculo da distância
                const userLocation = {
                    lat: response.data.lat, // Latitude do endereço, se disponível
                    lng: response.data.lng, // Longitude do endereço, se disponível
                };
                const distance = calculateDistance(headquartersLocation, userLocation);
                setDistance(distance);
            } else {
                alert('CEP não encontrado.');
            }
        } catch (error) {
            console.error('Erro ao buscar endereço:', error);
        }
    };

    const calculateDistance = (loc1, loc2) => {
        const R = 6371; // Raio da Terra em km
        const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
        const dLon = (loc2.lng - loc1.lng) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(loc1.lat * (Math.PI / 180)) * Math.cos(loc2.lat * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distância em km
    };

    const deliveryCost = distance; // R$ 1,00 por km

    return (
        <>
            <Modal show={cart.length > 0} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Carrinho de Compras</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {cart.map((item, index) => (
                        <div key={index}>
                            <h5>{item.açaí.name}</h5>
                            <p>Tamanho: {item.açaí.size}</p>
                            <p>Preço base: R${item.açaí.price.toFixed(2)}</p>
                            <p>Custo adicional: R${item.açaí.additionalCost.toFixed(2)}</p>
                            <p>Complementos: {item.toppings.join(', ')}</p>
                            <Button 
                                variant="danger" 
                                onClick={() => onRemoveItem(index)}
                            >
                                Remover
                            </Button>
                            <hr />
                        </div>
                    ))}
                    <h5>Total: R${(totalPrice + deliveryCost).toFixed(2)}</h5>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={() => {
                        onClose(); // Fechar o modal do carrinho
                        handleFinalizePurchase(); // Abrir o modal de entrega
                    }}>
                        Finalizar Compra
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Entrega */}
            <Modal show={showDeliveryModal} onHide={() => setShowDeliveryModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Entrega ou Retirada</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Selecione a opção:</h5>
                    <p>
                        <strong>Entrega</strong>
                    </p>
                    <input
                        type="text"
                        placeholder="Digite seu CEP"
                        value={cep}
                        onChange={handleCepChange}
                    />
                    <Button variant="primary" onClick={handleFetchAddress}>
                        Buscar Endereço
                    </Button>
                    {address && (
                        <div>
                            <h6>Endereço: {address}</h6>
                            <input
                                type="text"
                                placeholder="Complemento"
                                value={complement}
                                onChange={(e) => setComplement(e.target.value)}
                            />
                            <p>Distância: {distance.toFixed(2)} km</p>
                            <p>Custo de Entrega: R$ {deliveryCost.toFixed(2)}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeliveryModal(false)}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={() => alert('Compra finalizada com entrega!')}>
                        Confirmar Entrega
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Cart;