// app/admin/page.js
"use client";

import Menu from '../../components/Menu';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

export default function AdminPanel() {
    const router = useRouter();

    return (
        <>
            <Menu />
            <Container className="mt-5">
                <h1 className="text-center mb-4">Painel Administrativo</h1>
                <Row className="justify-content-center">
                    <Col md={4}>
                        <Card className="text-center mb-3">
                            <Card.Body>
                                <Card.Title>Gerenciar Usuários</Card.Title>
                                <Card.Text>Acesse o CRUD para gerenciar usuários.</Card.Text>
                                <Button 
                                    variant="primary" 
                                    onClick={() => router.push('/admin/usuarios')}
                                >
                                    Acessar Usuários
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center mb-3">
                            <Card.Body>
                                <Card.Title>Gerenciar Produtos</Card.Title>
                                <Card.Text>Acesse o CRUD para gerenciar produtos.</Card.Text>
                                <Button 
                                    variant="primary" 
                                    onClick={() => router.push('/admin/produtos')}
                                >
                                    Acessar Produtos
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center mb-3">
                            <Card.Body>
                                <Card.Title>Gerenciar Acompanhamentos</Card.Title>
                                <Card.Text>Acesse o CRUD para gerenciar acompanhamentos.</Card.Text>
                                <Button 
                                    variant="primary" 
                                    onClick={() => router.push('/admin/acompanhamentos')}
                                >
                                    Acessar Acompanhamentos
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-4">
                    <Col md={6}>
                        <Card className="text-center">
                            <Card.Body>
                                <Card.Title>Editar Perfil</Card.Title>
                                <Card.Text>Altere suas informações de usuário.</Card.Text>
                                <Button 
                                    variant="secondary" 
                                    onClick={() => router.push('/admin/perfil')}
                                >
                                    Editar Perfil
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}