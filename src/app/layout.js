// src/app/layout.js
import './globals.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../components/Footer';

export const metadata = {
    title: 'Açaí Mania',
    description: 'O melhor açaí da cidade',
};

export default function Layout({ children }) {
    return (
        <html lang="pt-BR">
            <body>
                {children}
                <Footer />
            </body>
        </html>
    );
}