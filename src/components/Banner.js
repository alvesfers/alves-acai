// src/components/Banner.js
import Image from 'next/image';

const Banner = () => {
    return (
        <div className="d-flex justify-content-between align-items-center position-relative py-4">
            <button className="btn btn-primary ctn text-center text-white position-absolute top-50 start-0 translate-middle-y ms-5 py-2 px-4"> {/* Ajuste o valor da margem esquerda se necessário */}
                Montar meu Pedido
            </button>
            <div className="flex-grow-1"> {/* Faz a imagem ocupar o espaço restante */}
                <Image 
                    src="/banner2.png" // Coloque sua imagem de banner na pasta public
                    alt="Banner do Açaí"
                    layout="responsive"
                    width={1800} // Ajuste conforme necessário
                    height={400} // Ajuste conforme necessário
                    objectFit="cover"
                />
            </div>
        </div>
    );
};

export default Banner;