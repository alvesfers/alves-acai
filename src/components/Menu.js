// src/components/Menu.js
"use client"; // Adicione esta linha

import Link from 'next/link';
import { Navbar, Nav } from 'react-bootstrap';

const Menu = () => {
    return (
        <Navbar expand="lg">
            <div className="container"> {/* Adicione uma div container para centralizar o conteúdo */}
                <Navbar.Brand href="/" className="me-auto"> {/* A logo fica no canto esquerdo */}
                    Açaí Mania
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto"> {/* Use mx-auto para centralizar o menu */}
                        <Link href="/" passHref legacyBehavior>
                            <Nav.Link>Home</Nav.Link>
                        </Link>
                        <Link href="/tamanhos" passHref legacyBehavior>
                            <Nav.Link>Tamanhos de Açaí</Nav.Link>
                        </Link>
                        <Link href="/contato" passHref legacyBehavior>
                            <Nav.Link>Contato</Nav.Link>
                        </Link>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
};

export default Menu;