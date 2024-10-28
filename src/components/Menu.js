//Menu.js
"use client";

import Link from 'next/link';
import { Navbar, Nav, Button, Modal, Form, Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Menu = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showCadastroModal, setShowCadastroModal] = useState(false);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [nome, setNome] = useState('');
    const [usuarioNome, setUsuarioNome] = useState(null);
    const [nivelUsuario, setNivelUsuario] = useState(null);
    const router = useRouter();

    // Verifica se há um usuário logado ao carregar o componente
    useEffect(() => {
        const nomeUsuario = localStorage.getItem('nomeUsuario');
        const nivel = localStorage.getItem('nivelUsuario');

        if (nomeUsuario) {
            setUsuarioNome(nomeUsuario.split(' ')[0]);
        }
        if (nivel) {
            setNivelUsuario(parseInt(nivel, 10));
        }
    }, []);

    const handleShowLogin = () => setShowLoginModal(true);
    const handleCloseLogin = () => setShowLoginModal(false);
    const handleShowCadastro = () => setShowCadastroModal(true);
    const handleCloseCadastro = () => setShowCadastroModal(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/usuarios/login', {
                emailUsuario: email,
                senhaUsuario: senha,
            });

            if (response.data === 'Login bem-sucedido!') {
                const usuarioResponse = await axios.get(`http://localhost:8080/usuarios/${email}`);
                const { nomeUsuario, nivelUsuario } = usuarioResponse.data;

                localStorage.setItem('nomeUsuario', nomeUsuario);
                localStorage.setItem('nivelUsuario', nivelUsuario);

                setUsuarioNome(nomeUsuario.split(' ')[0]);
                setNivelUsuario(nivelUsuario);
                handleCloseLogin();
            } else {
                alert('Credenciais inválidas!');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao fazer login. Tente novamente.');
        }
    };

    const handleCadastro = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/usuarios/registrar', {
                nomeUsuario: nome,
                emailUsuario: email,
                senhaUsuario: senha,
                usuarioAtivo: 1,
                cpfUsuario: '',
                enderecoUsuario: '',
                cepUsuario: '',
                nivelUsuario: 1, // Nível de usuário padrão
            });

            // Após o cadastro, realizar o login automaticamente
            const response = await axios.post('http://localhost:8080/usuarios/login', {
                emailUsuario: email,
                senhaUsuario: senha,
            });

            if (response.data === 'Login bem-sucedido!') {
                const usuarioResponse = await axios.get(`http://localhost:8080/usuarios/${email}`);
                const { nomeUsuario, nivelUsuario } = usuarioResponse.data;

                localStorage.setItem('nomeUsuario', nomeUsuario);
                localStorage.setItem('nivelUsuario', nivelUsuario);

                setUsuarioNome(nomeUsuario.split(' ')[0]);
                setNivelUsuario(nivelUsuario);

                alert('Cadastro e login realizados com sucesso!');
                handleCloseCadastro();
            } else {
                alert('Erro ao logar automaticamente após o cadastro.');
            }
        } catch (error) {
            console.error('Erro ao cadastrar ou logar usuário:', error);
            alert('Erro ao cadastrar ou logar usuário. Tente novamente.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('nomeUsuario');
        localStorage.removeItem('nivelUsuario');
        setUsuarioNome(null);
        setNivelUsuario(null);
        router.push('/');
    };

    return (
        <Navbar expand="lg">
            <Container>
                <Navbar.Brand href="/" className="me-auto">Açaí Mania</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Link href="/" passHref legacyBehavior>
                            <Nav.Link>Home</Nav.Link>
                        </Link>
                        <Link href="/tamanhos" passHref legacyBehavior>
                            <Nav.Link>Tamanhos de Açaí</Nav.Link>
                        </Link>
                        <Link href="/contato" passHref legacyBehavior>
                            <Nav.Link>Contato</Nav.Link>
                        </Link>
                        {nivelUsuario === 2 && (
                            <Link href="/admin" passHref legacyBehavior>
                                <Nav.Link>Painel Administrador</Nav.Link>
                            </Link>
                        )}
                    </Nav>

                    {!usuarioNome ? (
                        <>
                            <Button variant="outline-primary" onClick={handleShowLogin} className="me-2">
                                Logar
                            </Button>
                            <Button variant="outline-success" onClick={handleShowCadastro}>
                                Cadastrar
                            </Button>
                        </>
                    ) : (
                        <>
                            <span className="me-3">Bem-vindo, {usuarioNome}!</span>
                            <Button variant="outline-danger" onClick={handleLogout}>
                                Sair
                            </Button>
                        </>
                    )}
                </Navbar.Collapse>
            </Container>

            {/* Modal de Login */}
            <Modal show={showLoginModal} onHide={handleCloseLogin}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Digite seu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Digite sua senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Entrar
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal de Cadastro */}
            <Modal show={showCadastroModal} onHide={handleCloseCadastro}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Usuário</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCadastro}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Digite seu nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Digite seu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Digite sua senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="success" type="submit">
                            Cadastrar
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Navbar>
    );
};

export default Menu;