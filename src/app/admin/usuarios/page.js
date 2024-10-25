"use client";

import Menu from '../../../components/Menu';
import { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [usuarioAtual, setUsuarioAtual] = useState({ nomeUsuario: '', emailUsuario: '', nivelUsuario: 1 });

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        const response = await axios.get('http://localhost:8080/usuarios');
        setUsuarios(response.data);
    };

    const handleSave = async () => {
        if (usuarioAtual.idUsuario) {
            await axios.put(`http://localhost:8080/usuarios/${usuarioAtual.idUsuario}`, usuarioAtual);
        } else {
            await axios.post('http://localhost:8080/usuarios', usuarioAtual);
        }
        setShowModal(false);
        fetchUsuarios();
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:8080/usuarios/${id}`);
        fetchUsuarios();
    };

    return (
        <>
            <Menu />
            <Container className="mt-5">
                <h1>Gerenciar Usuários</h1>
                <Form.Control
                    type="text"
                    placeholder="Buscar usuário"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="mb-3"
                />
                <Button variant="primary" onClick={() => { setShowModal(true); setUsuarioAtual({ nomeUsuario: '', emailUsuario: '', nivelUsuario: 1 }); }}>
                    Adicionar Usuário
                </Button>
                <Table striped bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Nível</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.filter(u => u.nomeUsuario.toLowerCase().includes(filtro.toLowerCase())).map((usuario) => (
                            <tr key={usuario.idUsuario}>
                                <td>{usuario.nomeUsuario}</td>
                                <td>{usuario.emailUsuario}</td>
                                <td>{usuario.nivelUsuario === 2 ? 'Admin' : 'Usuário'}</td>
                                <td>
                                    <Button variant="warning" onClick={() => { setUsuarioAtual(usuario); setShowModal(true); }}>Editar</Button>{' '}
                                    <Button variant="danger" onClick={() => handleDelete(usuario.idUsuario)}>Excluir</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{usuarioAtual.idUsuario ? 'Editar' : 'Adicionar'} Usuário</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                value={usuarioAtual.nomeUsuario}
                                onChange={(e) => setUsuarioAtual({ ...usuarioAtual, nomeUsuario: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={usuarioAtual.emailUsuario}
                                onChange={(e) => setUsuarioAtual({ ...usuarioAtual, emailUsuario: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nível</Form.Label>
                            <Form.Select
                                value={usuarioAtual.nivelUsuario}
                                onChange={(e) => setUsuarioAtual({ ...usuarioAtual, nivelUsuario: parseInt(e.target.value) })}
                            >
                                <option value={1}>Usuário</option>
                                <option value={2}>Admin</option>
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" onClick={handleSave}>Salvar</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}