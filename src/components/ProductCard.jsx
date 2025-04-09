import React, { useContext } from 'react';
import {
  Card,
  CardMedia,
  Box,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import { CartContext } from '../context/CartContext';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const shortenProductName = (name) => {
  const maxLength = 12;
  if (name.length > maxLength) {
    return name.substring(0, maxLength) + '...';
  }
  return name;
};

const ProductCard = ({ product, isHome }) => {
  const { cart, addToCart } = useContext(CartContext);
  const isOutOfStock = product.stock === 0;
  const isInCart = cart.some(item => item.id === product.id);

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  function convertToRupiah(dollar) {
    const kurs = 16000;
    const rupiah = dollar * kurs;
    return 'Rp' + rupiah.toLocaleString('id-ID');
  }

  return (
    <Card
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          aspectRatio: '1/1',
          backgroundImage: `url(${product?.image})`,
          backgroundSize: '50%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderBottom: '1px solid #e0e0e0',
        }}
      ></Box>

      <Box
        sx={{
          p: 1.5,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Tooltip title={product.title} arrow>
          <Typography
            sx={{
              fontSize: '20px',
              fontWeight: 700,
              lineHeight: 1.2,
              height: '1.8em',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {shortenProductName(product.title)}
          </Typography>
        </Tooltip>

        {!isHome && (
          <Box>
            <Typography
              sx={{ fontWeight: 700, fontSize: '16px', color: '#1976d2' }}
            >
              {convertToRupiah(product.price)}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
              Stok: {product.stock}
              </Typography>
            <Button
              variant='contained'
              color='primary'
              size='small'
              sx={{
                fontSize: '14px',
                marginTop: '12px',
                width: '100%',
                bgcolor: isInCart ? '#4caf50' : isOutOfStock ? 'grey.400' : '#1976d2'
              }}
              endIcon={<AddShoppingCartIcon />}
              disabled={isOutOfStock || isInCart}
              onClick={handleAddToCart}
            >
              {isOutOfStock ? 'Stok Habis' : isInCart ? 'Sudah di Keranjang' : 'Tambah Keranjang'}
            </Button>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default ProductCard;
