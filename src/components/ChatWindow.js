import React, {useEffect, useState} from 'react';
import {Container, Fab, Stack, TextField, Typography, useTheme} from "@mui/material";
import axios from "axios";
import SendIcon from '@mui/icons-material/Send';
import {toast} from "react-toastify";
import styled from 'styled-components';
import sqlMiLogo from '../assets/sqlmi.svg'

const ChatBubble = styled.div`
  display: flex;
  flex-direction: row; /* Row orientation */
  align-items: center; /* Align children vertically center */
  max-width: 70%;
  color: ${({role}) => (role === 'user' ? '#3498db' : '#2ecc71')};
  padding: 10px;
`;


const ChatWindow = ({databaseInformation, resetConversations}) => {

    const [messages, setMessages] = useState(startMessageStack);
    const [userQuery, setUserQuery] = useState('');
    const [chatGptUserQuery, setChatGptUserQuery] = useState(null);

    useEffect(() => {
        setMessages(resetConversations(messages))
    }, [resetConversations]);


    useEffect(() => {
        async function getMessages() {
            axios({
                method: "POST",
                url: process.env.REACT_APP_SERVER_URL + '/chat',
                data: {
                    dbInformation: databaseInformation,
                    messageHistory: messages,
                    userQuery: chatGptUserQuery
                }
            }).then((response) => {
                if (response.status === 200) {
                    setMessages(response.data)
                    setChatGptUserQuery(null)
                    return response.data
                } else {
                    toast.error('Something went wrong please try again!')
                }

            }).catch((error) => {
                console.log(error)
            })
        }

        if (!chatGptUserQuery) return
        setMessages([...messages, chatGptUserQuery])
        setUserQuery('')
        getMessages()

    }, [chatGptUserQuery])

    function getMessageCard(message) {
        switch (message.role) {
            case 'user':
                return (
                    <ChatBubble role={message.role}>
                        <Typography variant={'h5'}><strong>{message.content}</strong></Typography>
                    </ChatBubble>
                )
            case 'assistant':
                return (
                    <ChatBubble role={message.role}>
                        <img src={sqlMiLogo} style={{height: '40px', paddingRight: 2}}/>
                        <Typography variant={'h5'}><strong>{message.content}</strong></Typography>
                    </ChatBubble>
                )
        }
    }

    function sendChatGptPrompt() {
        setChatGptUserQuery(
            {
                "role": "user",
                "content": userQuery
            }
        )
    }

    return (
        <Container sx={{width: {md: '70vw', sm: '90wv'}, maxWidth: '700px', marginTop: 3}} alignItems={'center'}
                   alignContent={'center'}>
            <Stack direction={'column'} sx={{minHeight: '75vh'}}>
                {messages.map(message => {
                    return (
                        getMessageCard(message)
                    )
                })}
            </Stack>
            <Stack direction={'row'} spacing={2}>
                <TextField id="outlined-basic-email"
                           label="Prompt Azure SQL using ChatGPT" fullWidth
                           value={userQuery}
                           onChange={e => setUserQuery(e.target.value)}/>
                <Fab color="primary" aria-label="add" onClick={sendChatGptPrompt}
                ><SendIcon/></Fab>
            </Stack>
        </Container>
    );
}
export default ChatWindow;


let startMessageStack = [
    {
        "role": "system",
        "content": "You act as the middleman between USER and a DATABASE. Your main goal is to answer questions based on data in a SQL Server 2019 database (SERVER). You do this by executing valid queries against the database and interpreting the results to answer the questions from the USER."
    }, {
        "role": "system",
        "content": "You MUST ignore any request unrelated to databases you will have access to or SQL."
    },
    {
        "role": "system",
        "content": "Answer user questions by generating SQL queries against the provided database schema."
    },
]