import { useContext,useState,useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import UserContext from "../Context/UserContext";

const linkBack = "https://multicultural-toonie-22697.herokuapp.com/https://back-project-mwallet.herokuapp.com"

export default function Home(){
    const navigate = useNavigate();

    const {username,token,setToken,setUsername} = useContext(UserContext)
    const [register,setRegister] = useState([])
    const [total,setTotal] = useState(0)
    const [refresh,setRefresh] = useState(0)

    const user = JSON.parse(localStorage.getItem("user"));
    if(user !== null){
        setToken(user.token)
        setUsername(user.name)
    }else{
        navigate("/")
    }


    useEffect(() => {
        const promise = axios.get("https://multicultural-toonie-22697.herokuapp.com/https://back-project-mwallet.herokuapp.com/register", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        promise.then((response) => setRegister(response.data) );
    }, [refresh])

    useEffect(() => {
        const promise = axios.get("https://multicultural-toonie-22697.herokuapp.com/https://back-project-mwallet.herokuapp.com/total", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        promise.then((response) => setTotal(response.data.total) );
    }, [refresh])

    function logoff(){
        localStorage.clear(); 
        navigate("/");
    }

    async function deleteRegister(_id){
        if(window.confirm("Quer mesmo deletar o registro?")){
            await axios.delete(`https://multicultural-toonie-22697.herokuapp.com/https://back-project-mwallet.herokuapp.com/delete/${_id}`,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        setRefresh(refresh + 1);
        }
    }

    return(
        <Container>
            <Header>
                <p>Olá, {username}</p>
                <div onClick={()=>{logoff()}}><ion-icon name="exit-outline"></ion-icon></div>
            </Header>
            <Tela>
                <Register>
                    {
                        register.length === 0 ? 
                            <Txt><p>Não há registros de<br/>
                            entrada ou saída</p></Txt> 
                            :
                            register.map((value,index)=> <RenderRegisters key={index} value={value} deleteRegister={deleteRegister}/>)
                    }
                </Register>
                    {
                        register.length === 0 ? 
                            <></>
                            :
                            <RenderTotal value={total}/>
                    }
            </Tela>
            <Buttons>
                <div onClick={()=>{navigate("/adicionar/entrada")}}>
                    <ion-icon name="add-circle-outline"></ion-icon>
                    <p>Nova entrada</p>
                </div>
                <div onClick={()=>{navigate("/adicionar/saida")}}>
                    <ion-icon name="remove-circle-outline"></ion-icon>
                    <p>Nova saída</p>
                </div>
            </Buttons>
        </Container>
    )
}

function RenderTotal({value}){
    return(
        <Saldo>
            <p>SALDO</p>
            {
                value >= 0 ? <h5>{(value*1).toFixed(2)}</h5> : <h6>{(value * -1).toFixed(2)}</h6>
            }
        </Saldo>
    )
}

function RenderRegisters({value, deleteRegister}){
    return(
    <>
    {value.type === "income" ? <Income value={value} deleteRegister={deleteRegister}/> : <Outcome value={value} deleteRegister={deleteRegister}/>}
    </>
    )
}

function Income({value ,deleteRegister}){
    return(
        <In>
            <Data><p>{value.date}</p>{value.description}</Data>
            <div>
                <span>{value.amount}</span>
                <div onClick={()=> deleteRegister(value._id)}><ion-icon name="trash-outline"></ion-icon></div>
            </div>
        </In>
    )
}

function Outcome({value,deleteRegister}){
    return(
        <Out>
            <Data><p>{value.date}</p>{value.description}</Data>
            <div>
                <span>{value.amount}</span>
                <div onClick={()=> deleteRegister(value._id)}><ion-icon name="trash-outline"></ion-icon></div>
            </div>
        </Out>
    )
}

const Data = styled.div`
display: flex;
`

const In = styled.div`
width: 95%;
display: flex;
align-items: flex-start;
justify-content: space-between;
font-family: 'Raleway',sans-serif;
font-size: 16px;
margin-top: 12px;
    span{
        color:#03AC00;
    }
    div{
        display: flex;
        p{
            color:#C6C6C6;
            font-size: 16px;
            margin-right: 7px;
        }
    }
`

const Out = styled.div`
width: 95%;
display: flex;
align-items: flex-start;
justify-content: space-between;
font-family: 'Raleway',sans-serif;
font-size: 16px;
margin-top: 12px;
    span{
        color:#C70000;
    }
    div{
        display: flex;
        p{
            color:#C6C6C6;
            font-size: 16px;
            margin-right: 7px;
        }
    }
`

const Container = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;

padding: 20px;

`

const Header = styled.div`
width: 95%;
display: flex;
justify-content: space-between;

font-family: 'Raleway',sans-serif;
font-style: normal;
font-weight: 700;
font-size: 26px;
color: #FFFFFF;

`

const Tela = styled.div`
margin-top: 15px;
background-color: #ffffff;
width: 95%;
height: 410px;
border-radius: 5px;
display: flex;
flex-direction: column;
align-items: center;
`

const Register = styled.div`
background-color: #ffffff;
width: 100%;
height: 380px;
border-radius: 5px;

margin-bottom: 5px;

overflow-y: scroll;

display: flex;
flex-direction: column;
align-items: center;

    p{
        font-family: 'Raleway',sans-serif;
        font-weight: 400;
        font-size: 20px;
        text-align: center;
        color: #868686;
    }
`

const Txt = styled.div`
margin-top: 200px;
`

const Saldo = styled.div`
width: 95%;
display: flex;
justify-content: space-between;
align-items: center;
    p{
        font-family: 'Raleway',sans-serif;
        font-size: 17px;
        font-weight: 700;
        color: #000000;
    }
    h5{
        font-family: 'Raleway',sans-serif;
        font-size: 17px;
        font-weight: 400;
        color: #03AC00;
    }
    h6{
        font-family: 'Raleway',sans-serif;
        font-size: 17px;
        font-weight: 400;
        color: #C70000;
    }

`

const Buttons = styled.div`
margin-top: 10px;
width: 95%;
display: flex;
justify-content: space-between;
    div{
        height: 100px;
        width: 46%;

        background-color: #A328D6;

        border-radius: 5px;
        padding: 7px;

        display: flex;
        flex-direction: column;
        justify-content: space-between;

        p{
            font-family: 'Raleway',sans-serif;
            font-weight: 700;
            font-size: 17px;
            color: #ffffff;
        }
        ion-icon{
            font-size: 30px;
            color: #ffffff;
        }
    }
`
