'use client'
import { Box, Button, Stack, TextField, Collapse, Typography } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! to rate my professor. How can I help you today?",
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
    sx={{
      position: 'relative',
      overflow: 'hidden',
      backgroundImage: 'url("/Cute Hand Drawn Style Mathematics Education Pink Background, Rubber, Blank Paper, Pencil Background Image And Wallpaper for Free Download.jpeg")',  // Correct path from public folder
      backgroundSize: 'contain',  // Ensures the image maintains its aspect ratio and fits within the box
      backgroundPosition: 'center',  // Centers the image in the box
      backgroundRepeat: 'no-repeat',
    }}
  >  

    {/* Rest of your code remains the same */}
  
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
        background: 'linear-gradient(to right, #ff6699, #cc0066)',  // Pink gradient
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      Welcome to rate my professor AI
    </Typography>
  </motion.div>
</Box>


      <Button 
  variant="contained" 
  onClick={() => setOpen(!open)} 
  style={{
    marginBottom: 16,
    background: 'linear-gradient(to right, #ff6699, #cc0066)',  // Pink gradient
    color: '#fff', 
    padding: '10px 20px',
    borderRadius: '12px',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.7)', 
    transition: 'background 0.3s, box-shadow 0.3s',
    '&:hover': {
      background: 'linear-gradient(to right, #cc0066, #ff6699)',  // Reverse gradient on hover
      boxShadow: '0 0 20px rgba(255, 255, 255, 1)', 
    }
  }}
>
  {open ? 'Hide Support' : 'rate my professor'}
</Button>




      <Collapse in={open}>
        <Stack
          direction={'column'}
          width="500px"
          height="700px"
          border="1px solid black"
          p={2}
          spacing={3}
          bgcolor="#f5ecdc" 
          boxShadow="#f5ecdc" 
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
                    ? '#ffb3c6' // Lighter pink color
                    : '#ff99aa' // Another shade of light pink for secondary
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
                background: 'linear-gradient(to right, #ff6699, #cc0066)',  // Pink gradient
                color: '#fff', 
                padding: '10px 20px',
                borderRadius: '12px',
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.7)', 
                transition: 'background 0.3s, box-shadow 0.3s',
                '&:hover': {
                  background: 'linear-gradient(to right, #cc0066, #ff6699)',  // Reverse gradient on hover
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








