'use client'
import { Box, Button, Stack, TextField, Collapse, Typography } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Kiah-tech support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false); 

  const messageEndRef = useRef(null); // Create a ref for the end of the message container

  useEffect(() => {
    // Scroll to the bottom of the message container
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // Only run when messages change

  const sendMessage = async () => {
    const currentMessage = message;  
    
    setMessage('');  
    
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: currentMessage },  
      { role: 'assistant', content: '' },  
    ]);
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: currentMessage }]),
      });
  
      const reader = response.body.getReader();  
      const decoder = new TextDecoder();  
      let result = '';
  
      const processText = async ({ done, value }) => {
        if (done) return result;
  
        const text = decoder.decode(value || new Uint8Array(), { stream: true });  
        result += text;
  
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];  
          const otherMessages = messages.slice(0, messages.length - 1);  
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },  
          ];
        });
  
        return reader.read().then(processText);  
      };
  
      await reader.read().then(processText);
  
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="black"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        '::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1%, rgba(255,255,255,0) 100%)',
          backgroundSize: '10px 10px',
          opacity: 0.6,
          animation: 'sparkles 2s infinite linear',
        },
      }}
    >
      <style>
        {`
          @keyframes sparkles {
            0%, 100% { transform: translate3d(0, 0, 0); }
            50% { transform: translate3d(-10px, -10px, 0); }
          }
        `}
      </style>

      <Box mb={4}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            align="center" 
            sx={{
              background: 'linear-gradient(to right, #4a00e0, #8e2de2, #d53369, #cbad6f)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            >
            Welcome to Kiah-Tech AI <br/> Your 24/7 Emotional Support Companion
          </Typography>
        </motion.div>
      </Box>

      <Button 
        variant="contained" 
        onClick={() => setOpen(!open)} 
        style={{
          marginBottom: 16,
          background: 'linear-gradient(to right, #000428, #004e92, #6a0dad)', 
          color: '#fff', 
          padding: '10px 20px',
          borderRadius: '12px',
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.7)', 
          transition: 'background 0.3s, box-shadow 0.3s',
          '&:hover': {
            background: 'linear-gradient(to right, #6a0dad, #004e92, #000428)', 
            boxShadow: '0 0 20px rgba(255, 255, 255, 1)', 
          }
        }}
      >
        {open ? 'Hide Support' : 'Kiah-Tech'}
      </Button>

      <Collapse in={open}>
        <Stack
          direction={'column'}
          width="500px"
          height="700px"
          border="1px solid black"
          p={2}
          spacing={3}
          bgcolor="#ADD8E6" 
          boxShadow="0 0 15px rgba(0, 150, 255, 0.75)" 
          borderRadius={2} 
        >
          <Stack
            direction={'column'}
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }
              >
                <Box
                  bgcolor={
                    message.role === 'assistant'
                      ? 'primary.main'
                      : 'secondary.main'
                  }
                  color="white"
                  borderRadius={16}
                  p={3}
                >
                  {message.content}
                </Box>
              </Box>
            ))}
            {/* Add a div to serve as a reference for scrolling */}
            <div ref={messageEndRef} />
          </Stack>
          <Stack direction={'row'} spacing={2}>
            <TextField
              label="Message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <Button 
              variant="contained" 
              onClick={sendMessage}
              style={{
                marginBottom: 16,
                background: 'linear-gradient(to right, #000428, #004e92, #6a0dad)', 
                color: '#fff', 
                padding: '10px 20px',
                borderRadius: '12px',
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.7)', 
                transition: 'background 0.3s, box-shadow 0.3s',
                '&:hover': {
                  background: 'linear-gradient(to right, #6a0dad, #004e92, #000428)',
                  boxShadow: '0 0 20px rgba(255, 255, 255, 1)', 
                }
              }}
            >
              Send
            </Button>
          </Stack>
        </Stack>
      </Collapse>
    </Box>
  );
}






