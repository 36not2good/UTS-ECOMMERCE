import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  IconButton,
  Box,
} from '@mui/material';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { totalItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position='sticky'>
      <Toolbar>
        <Box display='flex' alignItems='center' flexGrow={1}>
          <img
            src='/logo.png'
            alt='Logo'
            style={{ width: 40, height: 40, marginRight: 8 }}
          />
          <Typography
            variant='h6'
            component={Link}
            to='/'
            style={{ color: 'white', textDecoration: 'none' }}
          >
            Toko Serba Ada
          </Typography>
        </Box>

        {user?.role !== 'admin' && (
          <>
            <Button color='inherit' component={Link} to='/'>
              Home
            </Button>
            <Button color='inherit' component={Link} to='/products'>
              Products
            </Button>
          </>
        )}

        {user ? (
          <>
            {user.role === 'admin' && (
              <Button color='inherit' component={Link} to='/admin-dashboard'>
                Admin Dashboard
              </Button>
            )}
            {user.role === 'cashier' && (
              <Button color='inherit' component={Link} to='/cashier-dashboard'>
                Cashier Dashboard
              </Button>
            )}
            <Button color='inherit' onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color='inherit' component={Link} to='/login'>
              Login
            </Button>
            <Button color='inherit' component={Link} to='/register'>
              Register
            </Button>
          </>
        )}

        <IconButton color='inherit' component={Link} to='/checkout'>
          <Badge badgeContent={totalItems} color='secondary'>
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
