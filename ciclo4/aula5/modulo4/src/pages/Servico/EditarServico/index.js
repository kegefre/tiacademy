import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { Alert, Button, Container, Form, FormGroup, Input, Label, Spinner } from "reactstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios"
import { api } from "../../../config"

export const EditarServico = (props) => {

    const [id] = useState(props.match.params.id);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');

    const [status, setStatus] = useState({
        formSave: false,
        type: '',
        message: ''
    });

    const edtServico = async e => {
        e.preventDefault();
        console.log("Editada");

        setStatus({
            formSave: true
        });

        const headers = {
            'Content-Type': 'application/json'
        }

        await axios.put(api + "/editarservico", { id, nome, descricao }, { headers })
            .then((response) => {
                if (response.data.error) {
                    setStatus({
                        formSave: false,
                        type: 'error',
                        message: response.data.message
                    });
                } else {
                    setStatus({
                        formSave: false,
                        type: 'success',
                        message: response.data.message
                    });
                }
            })
            .catch(() => {
                setStatus({
                    formSave: false,
                    type: 'error',
                    message: 'Erro: não Conectado com a API'
                });
            });
    };

    useEffect(() => {
        const getServico = async () => {

            await axios.get(api + "/servico/" + id)
                .then((response) => {
                    setNome(response.data.servico.nome);
                    setDescricao(response.data.servico.descricao);
                })
                .catch(() => {
                    console.log("Erro, não foi possivel conectar a API.");
                })
        }
        getServico();
    }, [id]);

    return (

        <div className="p-2">
            <Container>
                <div className="d-flex align-items-center">
                    <div className="mr-auto p-2">
                        <h1>Editar um serviço</h1>
                    </div>

                    <div>
                        <Link to={"/visualizarservico"}
                            className="btn btn-outline-primary btn-sm m-1">Listar</Link>
                        <Link to={"/servico/" + id}
                            className="btn btn-outline-primary btn-sm m-1">Consultar</Link>
                    </div>
                </div>
                <hr className="m-1" />
                {status.type === 'error' ? <Alert color="danger">{status.message}</Alert> : ""}
                {status.type === 'success' ? <Alert color="success">{status.message}</Alert> : ""}
                <Form className="p-2" onSubmit={edtServico}>
                    <FormGroup className="p-2">
                        <Label>Nome</Label>
                        <Input type="text" name="nome" placeholder="Nome do Serviço" value={nome} onChange={e => setNome(e.target.value)} />
                    </FormGroup>
                    <FormGroup className="p-2">
                        <Label>Descrição</Label>
                        <Input type="text" name="descricao" placeholder="Descrição do Serviço" value={descricao} onChange={e => setDescricao(e.target.value)} />
                    </FormGroup>

                    <FormGroup className="p-2">
                        <Button type="submit" outline color="warning" disabled={status.formSave}>
                            {status.formSave && <span>Salvando</span>}
                            {status.formSave && <Spinner
                                size="sm" children="" />}
                            {!status.formSave && <span>Salvar</span>}
                        </Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    )
}