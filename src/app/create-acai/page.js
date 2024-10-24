"use client";

import React, { useState } from 'react';

const CriarProduto = () => {
    const [nomeProduto, setNomeProduto] = useState('');
    const [descricaoProduto, setDescricaoProduto] = useState('');
    const [precoProduto, setPrecoProduto] = useState('');
    const [qtdComplemento, setQtdComplemento] = useState('');
    const [isTrufado, setIsTrufado] = useState(false);
    const [tamanhoProduto, setTamanhoProduto] = useState('');
    const [isProdutoAtivo, setIsProdutoAtivo] = useState(1); // Definido como ativo por padrão (1)

    const handleSubmit = async (event) => {
        event.preventDefault();

        const novoProduto = {
            nomeProduto,
            descricaoProduto,
            precoProduto: parseFloat(precoProduto),
            qtdComplemento: qtdComplemento ? parseInt(qtdComplemento, 10) : null,
            isTrufado,
            tamanhoProduto: parseInt(tamanhoProduto, 10),
            isProdutoAtivo, // 1 para ativo, 0 para inativo
        };

        try {
            const response = await fetch('http://localhost:8080/produtos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoProduto),
            });

            if (!response.ok) {
                throw new Error('Erro ao criar Produto');
            }

            const data = await response.json();
            console.log('Produto criado com sucesso:', data);

            // Limpar o formulário
            setNomeProduto('');
            setDescricaoProduto('');
            setPrecoProduto('');
            setQtdComplemento('');
            setIsTrufado(false);
            setTamanhoProduto('');
            setIsProdutoAtivo(1);
        } catch (error) {
            console.error('Erro ao criar Produto:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nome do Produto:</label>
                <input 
                    type="text" 
                    value={nomeProduto} 
                    onChange={(e) => setNomeProduto(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>Descrição:</label>
                <input 
                    type="text" 
                    value={descricaoProduto} 
                    onChange={(e) => setDescricaoProduto(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>Preço:</label>
                <input 
                    type="number" 
                    step="0.01" 
                    value={precoProduto} 
                    onChange={(e) => setPrecoProduto(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>Quantidade de Complementos:</label>
                <input 
                    type="number" 
                    value={qtdComplemento} 
                    onChange={(e) => setQtdComplemento(e.target.value)} 
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
                <label>Tamanho do Produto:</label>
                <select value={tamanhoProduto} onChange={(e) => setTamanhoProduto(e.target.value)} required>
                    <option value="">Selecione um tamanho</option>
                    <option value="300">300ml</option>
                    <option value="500">500ml</option>
                    <option value="700">700ml</option>
                    <option value="1000">1L</option>
                </select>
            </div>
            <div>
                <label>Produto Ativo?</label>
                <select value={isProdutoAtivo} onChange={(e) => setIsProdutoAtivo(parseInt(e.target.value, 10))}>
                    <option value={1}>Sim</option>
                    <option value={0}>Não</option>
                </select>
            </div>
            <button type="submit">Criar Produto</button>
        </form>
    );
};

export default CriarProduto;