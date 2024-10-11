// src/components/Section.js
import Image from 'next/image';

const Section = () => {
    return (
        <div className="container my-5">
            <div className="row">
                {/* Coluna para o texto */}
                <div className="col-md-6 d-flex align-items-center">
                    <div>
                        <h3>Experimente o Melhor Açaí!</h3>
                        <p>
                        Nosso açaí é feito com ingredientes cuidadosamente selecionados, de origem premium, para garantir frescor, sabor e qualidade em cada colherada. Aqui, você pode personalizar seu açaí do jeito que preferir, escolhendo entre uma variedade de complementos deliciosos e saudáveis. Seja qual for a sua escolha, garantimos uma explosão de sabores que vai te surpreender. Venha criar o açaí dos seus sonhos e aproveite uma experiência única, feita sob medida para você!
                        </p>
                    </div>
                </div>
                
                {/* Coluna para a imagem */}
                <div className="col-md-6 d-flex justify-content-center">
                    <Image 
                        src="/banner3.png" // Certifique-se de que a imagem está na pasta public
                        alt="Copo de Açaí"
                        layout="responsive"
                        width={300} // Ajuste conforme necessário
                        height={400} // Ajuste conforme necessário
                        objectFit="contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default Section;