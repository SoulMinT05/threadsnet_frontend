import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { SocketContextProvider } from './context/SocketContext.jsx';

const styles = {
    global: (props) => ({
        body: {
            color: mode('gray.800', 'whiteAlpha.900')(props),
            bg: mode('gray.100', '#101010')(props),
        },
    }),
};

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: true,
};

const colors = {
    gray: {
        light: '#616161',
        dark: '#1e1e1e',
    },
};

const components = {
    Link: {
        baseStyle: {
            _focus: {
                boxShadow: 'none', // Loại bỏ border xanh khi focus
            },
        },
    },
    IconButton: {
        baseStyle: {
            _focus: {
                boxShadow: 'none', // Loại bỏ border xanh khi focus
            },
        },
    },

    Popover: {
        baseStyle: (props) => ({
            content: {
                bg: mode('#101010', '#262626')(props),
                color: mode('gray.800', 'whiteAlpha.900')(props),
                boxShadow: 'md',
                borderRadius: 'md',
                marginLeft: '60px',
                marginTop: '-60px',
                zIndex: 20,

                _focus: {
                    boxShadow: 'none', // Loại bỏ border xanh khi focus
                },
            },
            header: {
                bg: mode('#101010', '#262626')(props),
                fontWeight: 'bold',
                color: mode('gray.800', 'whiteAlpha.900')(props),
                _focus: {
                    boxShadow: 'none', // Loại bỏ border xanh khi focus
                },
            },
            body: {
                bg: mode('#101010', '#262626')(props),
                color: mode('gray.800', 'whiteAlpha.900')(props),
            },
            footer: {
                bg: mode('#101010', '#262626')(props),
                color: mode('gray.800', 'whiteAlpha.900')(props),
            },
        }),
    },
    Divider: {
        baseStyle: (props) => ({
            borderColor: mode('gray.300', 'whiteAlpha.300')(props),
        }),
    },
    Image: {
        baseStyle: {
            minHeight: '480px',
            objectFit: 'cover',
        },
    },
    Menu: {
        baseStyle: (props) => ({
            list: {
                bg: mode('gray.100', '#101010')(props),
                color: mode('gray.800', 'whiteAlpha.900')(props),
                transform: 'translate3d(428px, 51px, 0px)',
            },
            item: {
                bg: mode('gray.100', '#101010')(props),

                _hover: {
                    bg: mode('gray.200', '#1e1e1e')(props),
                    // Hiện tooltip khi hover vào item
                    position: 'relative',
                },
            },
        }),
    },
    Modal: {
        baseStyle: (props) => ({
            dialog: {
                bg: mode('gray.100', '#101010')(props),
                color: mode('gray.800', 'whiteAlpha.900')(props),
                minWidth: '560px',
                minHeight: '200px',
                marginLeft: '96px',
                // display: 'flex',
                // flexDirection: 'column',
                // justifyContent: 'center',
                // alignItems: 'center',
            },
            header: {
                bg: mode('gray.100', '#101010')(props),
                color: mode('gray.800', 'whiteAlpha.900')(props),
            },
            body: {
                bg: mode('gray.100', '#101010')(props),
                color: mode('gray.800', 'whiteAlpha.900')(props),
            },
            footer: {
                bg: mode('gray.100', '#101010')(props),
                color: mode('gray.800', 'whiteAlpha.900')(props),
            },
        }),
    },
};

const theme = extendTheme({ config, styles, colors, components });

createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <RecoilRoot>
        <BrowserRouter>
            <ChakraProvider theme={theme}>
                <ColorModeScript initialColorMode={theme.config.initialColorMode} />
                <SocketContextProvider>
                    <App />
                </SocketContextProvider>
            </ChakraProvider>
        </BrowserRouter>
    </RecoilRoot>,
    // </StrictMode>,
);
