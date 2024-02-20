import React from 'react';
import ChatWindow from "./components/ChatWindow";
import {ThemeProvider} from "@mui/material";
import {theme} from "./utils/Theme";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomMenu from "./components/CustomMenu";
import Box from "@mui/material/Box";

function App() {

    function resetConversations(conversation) {
        return conversation = []
        toast.success('Conversations reset');
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                height: '100vh',
                width: '100%',
                // backgroundImage: `url(${chatBackground})`,
                // backgroundSize: 'cover'
                backgroundColor: '#F8F8FF'
            }}>
                <CustomMenu resetConversations={resetConversations}/>
                <ChatWindow resetConversations={resetConversations}/>
                <ToastContainer/>
            </Box>
        </ThemeProvider>
    );
}

export default App;
