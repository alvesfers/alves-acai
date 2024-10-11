"use client";

import React, { useState } from 'react';

const CriarAcai = () => {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [qtdComplemento, setQtdComplemento] = useState(0);
    const [isTrufado, setIsTrufado] = useState(false);
    const [tamanho, setTamanho] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Convertendo os valores adequadamente
        const novoAcai = {
            nome: nome,
            descricao: descricao,
            preco: parseFloat(preco), 
            qtdComplemento: parseInt(qtdComplemento, 10),  // Certificando que é um número inteiro
            isTrufado: isTrufado,
            tamanho: tamanho
        };

        try {
            const response = await fetch('http://localhost:8080/acais', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoAcai),
            });

            if (!response.ok) {
                throw new Error('Erro ao criar Açai');
            }

            const data = await response.json();
            console.log('Açai criado com sucesso:', data);

            // Limpar o formulário
            setNome('');
            setDescricao('');
            setPreco('');
            setQtdComplemento(0);
            setIsTrufado(false);
            setTamanho('');
        } catch (error) {
            console.error('Erro ao criar Açai:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nome:</label>
                <input 
                    type="text" 
                    value={nome} 
                    onChange={(e) => setNome(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>Descrição:</label>
                <input 
                    type="text" 
                    value={descricao} 
                    onChange={(e) => setDescricao(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>Preço:</label>
                <input 
                    type="number" 
                    step="0.01"  // Permite inserir valores decimais
                    value={preco} 
                    onChange={(e) => setPreco(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>Quantidade de Complementos:</label>
                <input 
                    type="number" 
                    value={qtdComplemento} 
                    onChange={(e) => setQtdComplemento(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>É Trufado?</label>
                <input 
                    type="checkbox" 
                    checked={isTrufado} 
                    onChange={(e) => setIsTrufado(e.target.checked)} 
                />
            </div>
            <div>
                <label>Tamanho:</label>
                <select value={tamanho} onChange={(e) => setTamanho(e.target.value)} required>
                    <option value="">Selecione um tamanho</option>
                    <option value="Pequeno">Pequeno</option>
                    <option value="Médio">Médio</option>
                    <option value="Grande">Grande</option>
                    <option value="Família">Família</option>
                </select>
            </div>
            <button type="submit">Criar Açaí</button>
        </form>
    );
};

export default CriarAcai;