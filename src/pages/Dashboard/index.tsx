import { useContext, useEffect, useState } from "react";
import { WhatsappLogo } from 'phosphor-react'

import { DeliveryContext } from "../../context/DeliveryContext";
import api from "../../services/api";
import { Report, User } from '../../shared/interfaces'

import { 
    BaseButton, 
    Container, 
    ContainerButtons, 
    ContainerInfo, 
    ContainerDeliveries, 
    ContainerOrder, 
    ContainerShopkeeper, 
    Delivery, 
    Link, 
    ShopkeeperInfo, 
    ShopkeeperProfileImage, 
    OrderActions,
    OrderButton,
    SelectContainer,
    ContainerImagem,
} from "./styles";
import { Loader } from '../../components/Loader';
import { StatusDelivery } from "../../shared/constants/enums.constants";

export function Dashboard() {
    const { token, permission } = useContext(DeliveryContext)
    api.defaults.headers.Authorization = `Bearer ${token}`

    
    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState([]);
    const [motoboys, setMotoboys] = useState([]);

    const [isFreeReport, setIsFreeReport] = useState(true)
    const [selectedMotoboy, setSelectedMotoboy] = useState('')

    // console.log(reports)
    console.log(motoboys)
    function onClickReportType(handleIsFree: boolean) {
        setIsFreeReport(handleIsFree)
        getData()
    }

    async function getData() {
        setLoading(true)
        console.log(isFreeReport)
        const status = isFreeReport ? StatusDelivery.PENDING : `${StatusDelivery.ONCOURSE},${StatusDelivery.COLLECTED}`
        try {
            const response = await api.get(`/delivery?status=${status}`)
            setReports(response.data.data)

            if (permission !== 'shopkeeper') {
                const motoboysRes = await api.get('/user?type=motoboy')
                setMotoboys(motoboysRes.data.data)
                
            }

            setLoading(false)
            console.log(reports)
            console.log(response.data.data)
        } catch (error) {
            alert(error.response.data.message)
        }
    }

    async function handlerNextStep(report: Report) {
        let data;
        let newStatus;

        if(report.status === StatusDelivery.PENDING){
            newStatus = StatusDelivery.ONCOURSE
            data = {
                'status': newStatus,
                'motoboyId': selectedMotoboy
            }
        } else if(report.status === StatusDelivery.ONCOURSE){
            newStatus = StatusDelivery.COLLECTED
            data = {
                'status': newStatus
            }
        } else if(report.status === StatusDelivery.COLLECTED){
            newStatus = StatusDelivery.FINISHED
            data = {
                'status': newStatus
            }
        }

        try {
            await api.put(`/delivery/${report.id}`, data)
            getData()
            alert(`Solicitação avançada para o passo ${newStatus}`)
        } catch (error) {
            alert(error.response.data.message)
        }
    }

    async function handlerSave(report: Report) {
        console.log(report)
    }

    async function handlerDelete(report: Report) {
        try {
            await api.delete(`/delivery/${report.id}`)
            alert('Solicitação apagada com sucesso.')
            getData()
        } catch (error) {
            alert(error.response.data.message)
        }
    }

    useEffect(() => {
        if(loading) {
            console.log('getData')
            getData()
        }
    })

    return (
        <Container>
            <ContainerButtons>
                    <BaseButton typeReport={isFreeReport} onClick={() => onClickReportType(true)}>Livres</BaseButton>
                    <BaseButton typeReport={!isFreeReport} onClick={() => onClickReportType(false)}>Atribuídos</BaseButton>
            </ContainerButtons>
            <ContainerDeliveries>
                {
                    loading ? 
                        <Loader size={40} biggestColor="green" smallestColor="gray" /> :
                        <>
                            { reports.map((report: Report) =>
                                <Delivery key={report.id} isfree={report.status === 'PENDENTE'}>
                                    <ContainerShopkeeper>
                                        <ContainerImagem>
                                            <ShopkeeperProfileImage src={report.establishmentImage} />
                                        </ContainerImagem>
                                        <ShopkeeperInfo>
                                            <p>{report.establishmentName}</p>
                                            <Link href="">
                                                {report.establishmentPhone} <WhatsappLogo size={18} />
                                            </Link>
                                            <Link href={report.establishmentLocation}>
                                                <p>Localização</p>
                                            </Link>
                                        </ShopkeeperInfo>
                                    </ContainerShopkeeper>

                                    {!isFreeReport &&
                                    <>
                                        <ContainerOrder>
                                            <p>Status: {report.status}</p>
                                            <p>Forma de pagamento: {report.payment}</p>
                                            <p>Valor: R$ {report.value}</p>
                                            <p>Pix: </p>
                                        </ContainerOrder>

                                        <ContainerInfo>
                                            <p>Cliente: {report.clientName} </p>
                                            <Link href="">
                                                {report.clientPhone} <WhatsappLogo size={18} />
                                            </Link>
                                        </ContainerInfo>

                                        <ContainerInfo>
                                            <p>Motoboy: {report.motoboyName} </p>
                                            <Link href="">
                                                {report.motoboyPhone} <WhatsappLogo size={18} />
                                            </Link>
                                        </ContainerInfo>

                                    </>
                                    }
                                    {
                                        permission !== "shopkeeper" && 
                                        <SelectContainer>
                                            <label htmlFor="motoboy">Motoboy:</label>
                                            <select 
                                                value={selectedMotoboy}
                                                onChange={e => setSelectedMotoboy(e.target.value)}
                                            >
                                                {
                                                    motoboys.map((motoboy: User) => 
                                                        <option key={motoboy.id} value={motoboy.id}>{motoboy.name}</option>
                                                    )
                                                }
                                            </select>
                                        </SelectContainer>
                                    }
                                    <OrderActions>
                                        {
                                            permission === "admin" && report.status === "ACAMINHO" &&
                                            <OrderButton typebutton={true} onClick={() => handlerSave(report)}>Salvar</OrderButton>
                                        }
                                        {
                                            permission !== "shopkeeper" &&
                                            <OrderButton typebutton={true} onClick={() => handlerNextStep(report)}>Avançar</OrderButton>
                                        }
                                        {
                                            permission !== "motoboy" && report.status === "PENDENTE" &&
                                            <OrderButton typebutton={false} onClick={() => handlerDelete(report)}>Apagar</OrderButton>
                                        }
                                    </OrderActions>
                                </Delivery>
                            )}
                        </>
                }
            </ContainerDeliveries>
        </Container>
    )
}