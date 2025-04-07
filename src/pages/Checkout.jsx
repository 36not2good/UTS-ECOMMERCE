import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Divider,
  Badge,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from '../components/Header';

const Checkout = () => {
  const {
    cart,
    totalPrice,

    clearCart,
  } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [checkoutCompleted, setCheckoutCompleted] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < lastScrollY);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleViewCheckout = () => {
    setBadgeVisible(false);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setBadgeVisible(true), 500);
  };

  const handleCheckout = () => setOpenConfirmDialog(true);

  const handleConfirmCheckout = () => {
    clearCart();
    setOpenConfirmDialog(false);
    setCheckoutCompleted(true);
  };

  const handleCancelCheckout = () => setOpenConfirmDialog(false);

  function convertToRupiah(dollar) {
    const kurs = 16000;
    const rupiah = dollar * kurs;
    return 'Rp' + rupiah.toLocaleString('id-ID');
  }

  useEffect(() => {
    if (checkoutCompleted && cart.length === 0) {
      navigate('/checkout', { replace: true });
    }
  }, [checkoutCompleted, cart.length, navigate]);

  if (!user) {
    return (
      <Container maxWidth='sm' sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant='h5' gutterBottom>
            Checkout
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Silakan login atau daftar untuk melanjutkan checkout
          </Typography>
          <Button
            variant='contained'
            fullWidth
            sx={{ mb: 2 }}
            onClick={() =>
              navigate('/login', { state: { fromCheckout: true } })
            }
          >
            Login
          </Button>
          <Button
            variant='outlined'
            fullWidth
            onClick={() =>
              navigate('/register', { state: { fromCheckout: true } })
            }
          >
            Daftar
          </Button>
        </Paper>
      </Container>
    );
  }

  if (cart.length === 0 && !checkoutCompleted) {
    return (
      <Container maxWidth='md' sx={{ py: 4 }}>
        <Typography variant='h5' align='center'>
          Keranjang belanja Anda kosong
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant='contained' onClick={() => navigate('/products')}>
            Kembali Belanja
          </Button>
        </Box>
      </Container>
    );
  }

  if (checkoutCompleted && cart.length === 0) {
    return (
      <Container maxWidth='md' sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant='h5' gutterBottom>
            Checkout Berhasil!
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Terima kasih telah berbelanja. Keranjang belanja Anda sekarang
            kosong.
          </Typography>
          <Button variant='contained' onClick={() => navigate('/products')}>
            Lanjutkan Belanja
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth='lg' sx={{ py: 4, position: 'relative' }}>
        {badgeVisible && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              zIndex: 1000,
              transition: 'all 0.3s',
              transform: isVisible ? 'translateY(0)' : 'translateY(100px)',
              opacity: isVisible ? 1 : 0,
            }}
          >
            <Badge badgeContent={cart.length} color='error'>
              <Button
                variant='contained'
                startIcon={<ShoppingCartIcon />}
                onClick={handleViewCheckout}
                sx={{ borderRadius: '50px', py: 1.5, px: 3, boxShadow: 3 }}
              >
                {cart.length} Item | {convertToRupiah(totalPrice.toFixed(2))}
              </Button>
            </Badge>
          </Box>
        )}

        <Drawer
          anchor='right'
          open={drawerOpen}
          onClose={handleCloseDrawer}
          PaperProps={{ sx: { width: 350, p: 2 } }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant='h6'>Keranjang Belanja</Typography>
            <IconButton onClick={handleCloseDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <List>
            {cart.map((item) => (
              <ListItem key={item.id}>
                <ListItemText
                  primary={item.title}
                  secondary={`${convertToRupiah(item.price.toFixed(2))} × ${item.quantity}`}
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant='h6'>Total</Typography>
            <Typography variant='h6'>{convertToRupiah(totalPrice.toFixed(2))}</Typography>
          </Box>

          <Button variant='contained' fullWidth onClick={handleCheckout}>
            Proses Pembayaran
          </Button>
        </Drawer>

        {/* Thermal Receipt Style */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Paper
            sx={{
              width: 230,
              p: 2,
              border: '1px dashed #ccc',
              fontFamily: 'monospace',
              background: '#fff',
            }}
          >
            <Typography
              variant='body2'
              align='center'
              sx={{ fontWeight: 'bold', mb: 1 }}
            >
              TOKO SERBA ADA
            </Typography>
            <Typography
              variant='caption'
              align='center'
              sx={{ display: 'block', mb: 2 }}
            >
              Jalan Raya Cipacing No.57
              <br />
              Phone: 08123456789
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
              {new Date().toLocaleDateString()}{' '}
              {new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
            <Divider sx={{ my: 1 }} />
            {cart.map((item) => (
              <Box key={item.id} sx={{ mb: 1 }}>
                <Typography variant='caption' sx={{ fontSize: '0.7rem' }}>
                  {item.title.length > 20
                    ? `${item.title.substring(0, 20)}...`
                    : item.title}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='caption' sx={{ fontSize: '0.7rem' }}>
                    {item.quantity} x {convertToRupiah(item.price.toFixed(2))}
                  </Typography>
                  <Typography variant='caption' sx={{ fontSize: '0.7rem' }}>
                    {convertToRupiah((item.price * item.quantity).toFixed(2))}
                  </Typography>
                </Box>
              </Box>
            ))}
            <Divider sx={{ my: 1 }} />
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
            >
              <Typography
                variant='caption'
                sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}
              >
                TOTAL
              </Typography>
              <Typography
                variant='caption'
                sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}
              >
                {convertToRupiah(totalPrice.toFixed(2))}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Typography
              variant='caption'
              align='center'
              sx={{ display: 'block', mt: 2, fontSize: '0.7rem' }}
            >
              Thank you for shopping
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button variant='contained' size='large' onClick={handleCheckout}>
            Selesaikan Pembayaran
          </Button>
        </Box>

        {/* Dialog Konfirmasi */}
        <Dialog open={openConfirmDialog} onClose={handleCancelCheckout}>
          <DialogTitle>Konfirmasi Checkout</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Apakah Anda yakin ingin menyelesaikan pembayaran? Setelah
              checkout, keranjang akan dikosongkan.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelCheckout}>Batal</Button>
            <Button onClick={handleConfirmCheckout} autoFocus>
              Ya, Selesaikan
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Checkout;
