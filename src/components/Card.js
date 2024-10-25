// src/components/Card.js
"use client"; // Adicione esta linha

import React from 'react';
import { Button } from 'react-bootstrap';

const Card = ({ name, size, price, qtdComplemento, onShow }) => {
    return (
        <div className="card mb-4 card-acai" style={{ width: '100%' }}>
            <div className="card-body p-3">
                <h5 className="card-title">{name}</h5>
                <hr />
                <p className="card-text">Tamanho: {size}</p>
                <p className="card-text">Preço: R${price.toFixed(2)}</p>
                <p className="card-text">Quantidade de Complemento: {qtdComplemento}</p>
                <div className="row-flex btn-card p-4">
                    <Button variant="primary" onClick={onShow}>
                        Pedir {name}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Card;