"use client";

import Menu from '../../../components/Menu';
import { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';

export default function Acompanhamentos() {
    const [acompanhamentos, setAcompanhamentos] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [acompanhamentoAtual, setAcompanhamentoAtual] = useState({ nomeAcompanhamento: '', precoAcompanhamento: 0 });

    useEffect(() => {
        fetchAcompanhamentos();
    }, []);

    const fetchAcompanhamentos = async () => {
        const response = await axios.get('http://localhost:8080/acompanhamentos');
        setAcompanhamentos(response.data);
    };

    const handleSave = async () => {
        if (acompanhamentoAtual.idAcompanhamento) {
            await axios.put(`http://localhost:8080/acompanhamentos/${acompanhamentoAtual.idAcompanhamento}`, acompanhamentoAtual);
        } else {
            await axios.post('http://localhost:8080/acompanhamentos', acompanhamentoAtual);
        }
        setShowModal(false);
        fetchAcompanhamentos();
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:8080/acompanhamentos/${id}`);
        fetchAcompanhamentos();
    };

    return (
        <>
            <Menu />
            <Container className="mt-5">
                <h1>Gerenciar Acompanhamentos</h1>
                <Form.Control
                    type="text"
                    placeholder="Buscar acompanhamento"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="mb-3"
                />
                <Button variant="primary" onClick={() => { setShowModal(true); setAcompanhamentoAtual({ nomeAcompanhamento: '', precoAcompanhamento: 0 }); }}>
                    Adicionar Acompanhamento
                </Button>
                <Table striped bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Preço</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {acompanhamentos.filter(acomp =>
                            acomp.nomeAcompanhamento.toLowerCase().includes(filtro.toLowerCase())
                        ).map(acomp => (
                            <tr key={acomp.idAcompanhamento}>
                                <td>{acomp.nomeAcompanhamento}</td>
                                <td>{acomp.precoAcompanhamento.toFixed(2)}</td>
                                <td>
                                    <Button variant="warning" onClick={() => { setAcompanhamentoAtual(acomp); setShowModal(true); }}>Editar</Button>{' '}
                                    <Button variant="danger" onClick={() => handleDelete(acomp.idAcompanhamento)}>Excluir</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{acompanhamentoAtual.idAcompanhamento ? 'Editar' : 'Adicionar'} Acompanhamento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                value={acompanhamentoAtual.nomeAcompanhamento}
                                onChange={(e) => setAcompanhamentoAtual({ ...acompanhamentoAtual, nomeAcompanhamento: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Preço</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                value={acompanhamentoAtual.precoAcompanhamento}
                                onChange={(e) => setAcompanhamentoAtual({ ...acompanhamentoAtual, precoAcompanhamento: parseFloat(e.target.value) })}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleSave}>Salvar</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}