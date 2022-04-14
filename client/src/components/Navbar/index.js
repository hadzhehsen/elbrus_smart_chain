import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import bifrost_logo from '../../bifrost_logo.png';
import './Styles.css';
import Footer from '../Footer';

const pages = [
  'connect',
  'generate',
  // 'Faces',
  'explore',
  'upload',
  'my-nfts',
  'listed-nfts',
];

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const navigateHandler = (e) => {
    navigate(`/${e.target.name}`);
  };
  const homeNav = () => {
    navigate('/');
  };

  return (
    <div style={{}}>
      <AppBar
        position='static'
        sx={{
          backgroundColor: 'black',
          displayPrint: 'flex',
          alignSelf: 'center',
          justifyContent: 'space-between',
          marginY: 1,
          marginBottom: 4,
        }}
      >
        <Container maxWidth='xl'>
          <Toolbar disableGutters>
            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              <img
                src={bifrost_logo}
                onClick={homeNav}
                style={{ width: 65, height: 65 }}
                alt='logo'
              />
            </Typography>

            {/* <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleCloseNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign='center'>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant='h6'
            noWrap
            component='div'
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            LOGO
          </Typography> */}
            {/* <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}> */}
            {pages.map((page) => (
              <Button
                key={page}
                name={page}
                onClick={navigateHandler}
                className='myNavButton'
                // sx={{
                //   my: 2,
                //   color: 'white',
                //   display: 'block',
                //   fontSize: '30px',
                //   fontFamily: 'Roboto Mono, monospace',
                //   marginX: 2,
                // }}
              >
                {page}
              </Button>
            ))}
            {/* </Box> */}
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
};
export default Navbar;
