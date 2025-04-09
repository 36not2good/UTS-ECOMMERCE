import React, { useState, useEffect, useContext } from 'react';
import {
  Grid,
  Container,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Badge,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [badgeVisible, setBadgeVisible] = useState(true);

  const { cart, totalPrice,updateQuantity,removeItem,decreaseQuantity } = useContext(CartContext);
  const navigate = useNavigate();
  const productsPerPage = 24;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        const productsWithStock = response.data.map(product => ({
          ...product,
          stock: 5 
        }));
        setProducts(productsWithStock);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
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

  const handleCheckout = () => {
    setDrawerOpen(false);
    navigate('/checkout');
  };

  function convertToRupiah(dollar) {
    const kurs = 16000;
    const rupiah = dollar * kurs;
    return 'Rp' + rupiah.toLocaleString('id-ID');
  }

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  if (loading)
    return (
      <Container maxWidth='lg' sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant='body1'>Loading products...</Typography>
      </Container>
    );

  return (
    <>
      <Header />
      {/* Sticky Cart Button */}
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
              color='primary'
              startIcon={<ShoppingCartIcon />}
              onClick={handleViewCheckout}
              sx={{
                borderRadius: '50px',
                py: 1.5,
                px: 3,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              {cart.length} Item | {convertToRupiah(totalPrice.toFixed(2))}
            </Button>
          </Badge>
        </Box>
      )}
      {/* Cart Drawer */}
      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
        sx: {
        width: 350,
        p: 2,
    },
  }}
>
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 2,
    }}
  >
    <Typography variant='h6'>Keranjang Belanja</Typography>
    <IconButton onClick={handleCloseDrawer}>
      <CloseIcon />
    </IconButton>
  </Box>

  <Divider sx={{ mb: 2 }} />

  <List>
    {cart.map((item) => (
      <ListItem 
        key={item.id}
        secondaryAction={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={() => decreaseQuantity(item.id)}
              disabled={item.quantity <= 1}
              size="small"
            >
              <RemoveIcon fontSize="small" />
            </IconButton>

            <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
            <IconButton 
              onClick={() => {
                const productInCatalog = products.find(p => p.id === item.id);
                if (productInCatalog && item.quantity < productInCatalog.stock) {
                  updateQuantity(item.id, item.quantity + 1);
                }
              }}
              disabled={item.quantity >= (products.find(p => p.id === item.id)?.stock || 0)}
              size="small"
            >
              <AddIcon fontSize="small" />
            </IconButton>

            <IconButton 
              onClick={() => removeItem(item.id)}
              size="small"
              sx={{ ml: 1 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        }
      >
        <ListItemText
                  primary={item.title}
                  secondary={
                    <>
                      {`${convertToRupiah(item.price.toFixed(2))} × ${item.quantity} = ${convertToRupiah((item.price * item.quantity).toFixed(2))}`}
                      <br />
                      {item.quantity >= item.stock && (
                        <Typography variant="caption" color="error">
                          Stok tersisa: {item.stock}
                        </Typography>
                      )}
                    </>
                  }
                />
          </ListItem>
    ))}
  </List>

  <Divider sx={{ my: 2 }} />

  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
    <Typography variant='h6'>Total</Typography>
    <Typography variant='h6'>{convertToRupiah(totalPrice.toFixed(2))}</Typography>
  </Box>

  <Button
    variant='contained'
    color='primary'
    fullWidth
    onClick={handleCheckout}
  >
    Lihat Pembayaran
  </Button>
</Drawer>
      <Container maxWidth='lg' sx={{ py: 12 }}>
        {/* Filter controls */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 2,
            alignItems: { sm: 'center' },
          }}
        >
          <TextField
            label='Search products'
            variant='outlined'
            size='small'
            sx={{ flex: 1 }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setSearchTerm(e.target.value);
              }
            }}
          />
          <FormControl size='small' sx={{ minWidth: 120 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label='Sort by'
            >
              <MenuItem value='price'>Price</MenuItem>
              <MenuItem value='title'>Name</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Product Grid */}
        <Grid container spacing={4}>
          {paginatedProducts.map((product) => (
            <Grid item size={{ xs: 6, sm: 6, md: 4, lg: 3 }} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              color='primary'
              size='small'
            />
          </Box>
        )}
      </Container>
    </>
  );
};

export default ProductList;
