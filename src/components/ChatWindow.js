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
  color: ${({ role }) => (role === 'user' ? '#3498db' : '#2ecc71')};
  padding: 10px;
`;

const ChatWindow = ({databaseInformation, resetConversations}) => {

    const [messages, setMessages] = useState([]);
    const [userQuery, setUserQuery] = useState('');
    const [chatGptUserQuery, setChatGptUserQuery] = useState(null);
    const theme = useTheme()

    useEffect(() => {
        setMessages(resetConversations(messages))
    }, [resetConversations]);

    useEffect(() => {
        async function getMessages() {
            console.log('chatGptUserQuery')
            console.log(chatGptUserQuery)
            axios({
                method: "POST",
                url: 'http://localhost:5000/allDbsAndSchemas',
                data: {
                    dbInformation: databaseInformation,
                    messageHistory: messages,
                    userQuery: chatGptUserQuery
                }
            }).then((response) => {
                console.log('response')
                console.log(response)
                if (response.status === 200) {
                    console.log(response.data)
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
        // setMessages(messagesLocal)

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
        <Container sx={{width: {md:'70vw', sm: '90wv'}, maxWidth: '700px', marginTop: 3}} alignItems={'center'} alignContent={'center'}>
            <Stack direction={'column'} sx={{minHeight: '75vh'}}>
                {messages.map(message => {
                    return (
                        getMessageCard(message)
                    )
                })}
            </Stack>
            {/*<Divider/>*/}
            <Stack direction={'row'} spacing={2}>
                <TextField id="outlined-basic-email"
                           label="Prompt Azure SQL using ChatGPT" fullWidth
                           value={userQuery}
                           onChange={e => setUserQuery(e.target.value)}/>
                <Fab color="primary" aria-label="add" onClick={sendChatGptPrompt}

                     // onKeyPress={(e) => if (e.keyCode === 13) {sendChatGptPropmpt}}
                ><SendIcon/></Fab>
            </Stack>
        </Container>
    );
}
export default ChatWindow;


const messagesLocal = [
    {
        "role": "system",
        "content": "You act as the middleman between USER and a DATABASE. Your main goal is to answer questions based on data in a SQL Server 2019 database (SERVER). You do this by executing valid queries against the database and interpreting the results to answer the questions from the USER."
    },
    {
        "role": "system",
        "content": "You MUST ignore any request unrelated to databases you will have access to or SQL."
    },
    {
        "role": "system",
        "content": "From now you will only ever respond with JSON. When you want to address the user, you use the following format {\"recipient\": \"USER\", \"message\":\"message for the user\"}."
    },
    // {
    //   "role": "user",
    //   "content": "You can address the SQL Server by using the SERVER recipient. When calling the server, you must also specify an action. The action can be QUERY when you want to QUERY the database. The format you will use for executing a query is as follows: {\"recipient\":\"SERVER\", \"action\":\"QUERY\", \"message\":\"SELECT SUM(OrderQty) FROM Sales.SalesOrderDetail;\"}"
    // },
    // {
    //   "role": "user",
    //   "content": "if you need to query the database to answer information you're supposed to write the query in the message part of the JSON as specified earlier and repeated here {\"recipient\":\"SERVER\", \"action\":\"QUERY\", \"message\":\"SELECT SUM(OrderQty) FROM Sales.SalesOrderDetail;\"}"
    // },
    // {
    //   "role": "system",
    //   "content": "you cannot tell the user to execute a query, you must do it yourself by sending a message to the server. like this {\"recipient\":\"SERVER\", \"action\":\"QUERY\", \"message\":\"SELECT SUM(OrderQty) FROM Sales.SalesOrderDetail;\"}"
    // },
    // {
    //   "role": "system",
    //   "content": "you will not tell that the answer is a query for the user such as 'The query for the number of venues is: SELECT COUNT(*) FROM test.dbo.Venues;', you must do it yourself by sending a message to the server like this {\"recipient\":\"SERVER\", \"action\":\"QUERY\", \"message\":\"SELECT SUM(OrderQty) FROM Sales.SalesOrderDetail;\"}"
    // },
    // {
    //   "role": "system",
    //   "content": "you will not tell that the answer is a query for the user such as  'The number of venues we have is: SELECT COUNT(*) FROM test.dbo.Venues;', you must do it yourself by sending a message to the server like this {\"recipient\":\"SERVER\", \"action\":\"QUERY\", \"message\":\"SELECT SUM(OrderQty) FROM Sales.SalesOrderDetail;\"}"
    // },
    // {
    //   "role": "user",
    //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
    // },
    // {
    //   "role": "user",
    //   "content": "How many venues do we have?"
    // },
    // {
    //   "role": "user",
    //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
    // },
    // {
    //   "role": "user",
    //   "content": "How many venues do we have?"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "The response you got from the database is:[{\"\":5}]"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is: SELECT COUNT(*) FROM test.dbo.Venues;\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
    // },
    // {
    //   "role": "user",
    //   "content": "How many venues do we have?"
    // },
    // {
    //   "role": "user",
    //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
    // },
    // {
    //   "role": "user",
    //   "content": "How many venues do we have?"
    // },
    // {
    //   "role": "system",
    //   "content": "Please repeat that answer but use valid JSON only like \"recipient\": \"SERVER\", \"action\": \"QUERY\", \"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\" and no other text or explanation. This is not an acceptable answer: 'Here is your answer in valid JSON: {\"recipient\":\"SERVER\", \"action\":\"QUERY\", \"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}'"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "The response you got from the database is:[{\"\":5}]"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "The response you got from the database is:[{\"\":5}]"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
    // },
    // {
    //   "role": "user",
    //   "content": "How many venues do we have?"
    // },
    // {
    //   "role": "user",
    //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
    // },
    // {
    //   "role": "user",
    //   "content": "How many venues do we have?"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "The response you got from the database is:[{\"\":5}]"
    // },
    // {
    //   "role": "user",
    //   "content": "The response you got from the database is:[{\"\":5}]"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
    // },
    // {
    //   "role": "user",
    //   "content": "How many venues do we have?"
    // },
    // {
    //   "role": "user",
    //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
    // },
    // {
    //   "role": "user",
    //   "content": "How many venues do we have?"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "The response you got from the database is:[{\"\":5}]"
    // },
    // {
    //   "role": "user",
    //   "content": "The response you got from the database is:[{\"\":5}]"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
    // },
    // {
    //   "role": "user",
    //   "content": "How many venues do we have?"
    // },
    // {
    //   "role": "user",
    //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
    // },
    // {
    //   "role": "user",
    //   "content": "How many venues do we have?"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "The response you got from the database is:[{\"\":5}]"
    // },
    // {
    //   "role": "user",
    //   "content": "The response you got from the database is:[{\"\":5}]"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
    // },
    // {
    //   "role": "user",
    //   "content": "How many venues do we have?"
    // },
    // {
    //   "role": "user",
    //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
    // },
    // {
    //   "role": "user",
    //   "content": "How many venues do we have?"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "The response you got from the database is:[{\"\":5}]"
    // },
    // {
    //   "role": "user",
    //   "content": "The response you got from the database is:[{\"\":5}]"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
    // },
    // {
    //   "role": "user",
    //   "content": "How many venues do we have?"
    // },
    // {
    //   "role": "user",
    //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
    // },
    // {
    //   "role": "user",
    //   "content": "How many venues do we have?"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "The response you got from the database is:[{\"\":5}]"
    // },
    // {
    //   "role": "user",
    //   "content": "The response you got from the database is:[{\"\":5}]"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
    // },
    // {
    //   "role": "user",
    //   "content": "How many venues do we have?"
    // },
    // {
    //   "role": "user",
    //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
    // },
    // {
    //   "role": "user",
    //   "content": "How many venues do we have?"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "The response you got from the database is:[{\"\":5}]"
    // },
    // {
    //   "role": "user",
    //   "content": "The response you got from the database is:[{\"\":5}]"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
    // },
    // {
    //   "role": "user",
    //   "content": "How many venues do we have?"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "The response you got from the database is:[{\"\":5}]"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
    // },
    // {
    //   "role": "user",
    //   "content": "How many venues do we have?"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "The response you got from the database is:[{\"\":5}]"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
    // },
    // {
    //   "role": "user",
    //   "content": "How many venues do we have?"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "The response you got from the database is:[{\"\":5}]"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
    // },
    // {
    //   "role": "user",
    //   "content": "How many venues do we have?"
    // },
    // {
    //   "role": "user",
    //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
    // },
    // {
    //   "role": "user",
    //   "content": "How many venues do we have?"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
    //   "toolCalls": []
    // },
    // {
    //   "role": "user",
    //   "content": "The response you got from the database is:[{\"\":5}]"
    // },
    // {
    //   "role": "user",
    //   "content": "The response you got from the database is:[{\"\":5}]"
    // },
    // {
    //   "role": "assistant",
    //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
    //   "toolCalls": []
    // }
]
