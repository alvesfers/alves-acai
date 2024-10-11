// src/components/Modal.js
"use client";

import React from 'react';

const Modal = ({ isOpen, onClose, açaíData }) => {
    if (!isOpen) return null;

    return (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>{açaíData.name}</h2>
                <p>Tamanho: {açaíData.size}</p>
                <p>Preço: R${açaíData.price.toFixed(2)}</p>
                <h4>Escolha seus complementos:</h4>
                {açaíData.complements.map((complement, index) => (
                    <div key={index}>
                        <label>{complement}</label>
                        <select>
                            <option value="">Selecione</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Modal;