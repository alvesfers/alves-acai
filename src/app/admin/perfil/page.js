// pages/admin/perfil.js
"use client";

import { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';

export default function EditarPerfil() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const nomeUsuario = localStorage.getItem('nomeUsuario');
        setNome(nomeUsuario || '');
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const emailUsuario = localStorage.getItem('usuarioEmail');
        await axios.put(`http://localhost:8080/usuarios/${emailUsuario}`, {
            nomeUsuario: nome,
            emailUsuario: email,
        });
        alert('Perfil atualizado com sucesso!');
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center">Editar Perfil</h1>
            <Form onSubmit={handleUpdate}>
                <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Salvar Alterações
                </Button>
            </Form>
        </Container>
    );
}