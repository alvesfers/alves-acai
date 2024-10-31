"use client";

import Menu from '../../../components/Menu';
import { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';

export default function Produtos() {
    const [produtos, setProdutos] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [produtoAtual, setProdutoAtual] = useState({
        nomeProduto: '',
        descricaoProduto: '',
        precoProduto: 0,
        tamanhoProduto: '',
        tipoProduto: '1',
        qtdComplemento: 0,
    });

    useEffect(() => {
        fetchProdutos();
    }, []);

    const fetchProdutos = async () => {
        const response = await axios.get('http://localhost:8080/produtos');
        setProdutos(response.data);
    };

    const handleSave = async () => {
        if (produtoAtual.idProduto) {
            await axios.put(`http://localhost:8080/produtos/${produtoAtual.idProduto}`, produtoAtual);
        } else {
            await axios.post('http://localhost:8080/produtos', produtoAtual);
        }
        setShowModal(false);
        fetchProdutos();
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:8080/produtos/${id}`);
        fetchProdutos();
    };

    return (
        <>
            <Menu />
            <Container className="mt-5">
                <h1>Gerenciar Produtos</h1>
                <Form.Control
                    type="text"
                    placeholder="Buscar produto"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="mb-3"
                />
                <Button
                    variant="primary"
                    onClick={() => {
                        setShowModal(true);
                        setProdutoAtual({
                            nomeProduto: '',
                            descricaoProduto: '',
                            precoProduto: 0,
                            tamanhoProduto: '',
                            tipoProduto: '1',
                            qtdComplemento: 0,
                        });
                    }}
                >
                    Adicionar Produto
                </Button>
                <Table striped bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Descrição</th>
                            <th>Preço</th>
                            <th>Tamanho</th>
                            <th>Tipo</th>
                            <th>Qtd Complementos</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos
                            .filter((p) =>
                                p.nomeProduto.toLowerCase().includes(filtro.toLowerCase())
                            )
                            .map((produto) => (
                                <tr key={produto.idProduto}>
                                    <td>{produto.nomeProduto}</td>
                                    <td>{produto.descricaoProduto}</td>
                                    <td>{produto.precoProduto}</td>
                                    <td>{produto.tamanhoProduto}</td>
                                    <td>{produto.tipoProduto}</td>
                                    <td>{produto.qtdComplemento}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            onClick={() => {
                                                setProdutoAtual(produto);
                                                setShowModal(true);
                                            }}
                                        >
                                            Editar
                                        </Button>{' '}
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDelete(produto.idProduto)}
                                        >
                                            Excluir
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {produtoAtual.idProduto ? 'Editar' : 'Adicionar'} Produto
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                value={produtoAtual.nomeProduto}
                                onChange={(e) =>
                                    setProdutoAtual({
                                        ...produtoAtual,
                                        nomeProduto: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control
                                type="text"
                                value={produtoAtual.descricaoProduto}
                                onChange={(e) =>
                                    setProdutoAtual({
                                        ...produtoAtual,
                                        descricaoProduto: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Preço</Form.Label>
                            <Form.Control
                                type="number"
                                value={produtoAtual.precoProduto}
                                onChange={(e) =>
                                    setProdutoAtual({
                                        ...produtoAtual,
                                        precoProduto: parseFloat(e.target.value),
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Tamanho</Form.Label>
                            <Form.Control
                                type="text"
                                value={produtoAtual.tamanhoProduto}
                                onChange={(e) =>
                                    setProdutoAtual({
                                        ...produtoAtual,
                                        tamanhoProduto: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Tipo</Form.Label>
                            <Form.Select
                                value={produtoAtual.tipoProduto}
                                onChange={(e) =>
                                    setProdutoAtual({
                                        ...produtoAtual,
                                        tipoProduto: e.target.value,
                                    })
                                }
                            >
                                <option value="1">Açaí</option>
                                <option value="2">Salgados</option>
                                <option value="3">Bebidas</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Quantidade de Complementos</Form.Label>
                            <Form.Control
                                type="number"
                                value={produtoAtual.qtdComplemento}
                                onChange={(e) =>
                                    setProdutoAtual({
                                        ...produtoAtual,
                                        qtdComplemento: parseInt(e.target.value),
                                    })
                                }
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleSave}>
                            Salvar
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}
