import Footer from "../../components/footer/Footer";
import Navbar from "../../components/header/navbar-principal/Navbar";
import useFetchFaq from "../../admin/hooks/faq/useFecthFaq";

export default function Faq() {
    const { data } = useFetchFaq();

    return (
        <>
            <Navbar />
            <div className="container py-5" style={{
                minHeight: "85vh"
            }}>
                <h1>Questions fréquentes</h1>
                <div className="accordion mt-5" id="accordionExample">

                    {data.map((faq) => (
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className={`accordion-button ${faq.order !== 1 && "collapsed"}`} type="button" data-bs-toggle="collapse" data-bs-target={`#question${faq.order}`} aria-expanded={`${faq.order === 1 ? "true" : "false"}`} aria-controls={`question${faq.order}`}>
                                    <strong>{faq.question}</strong>
                                </button>
                            </h2>
                            <div id={`question${faq.order}`} className={`accordion-collapse collapse ${faq.order === 1 && "show"}`} data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
            <Footer />
        </>
    )
}
