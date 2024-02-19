import React from 'react';
import ChatWindow from "./components/ChatWindow";
import {Grid, ThemeProvider, Typography} from "@mui/material";
import {theme} from "./utils/Theme";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomMenu from "./components/CustomMenu";

function App() {

    function resetConversations(conversation) {
        return conversation = []
        toast.success('Conversations reset');
    }

    return (
        <ThemeProvider theme={theme}>
            <CustomMenu resetConversations={resetConversations}/>
            <Grid container alignItems={'center'} alignContent={'center'} direction={'column'} sx={{padding: 10}}>
                {/*<Grid item>*/}
                {/*    <Typography variant={'h2'} sx={{marginTop: 2}}>Azure SQL Chat GPT</Typography>*/}
                {/*</Grid>*/}
                <Grid item>
                    <ChatWindow resetConversations={resetConversations}/>
                </Grid>
            </Grid>
            <ToastContainer/>
        </ThemeProvider>
    );
}

export default App;
