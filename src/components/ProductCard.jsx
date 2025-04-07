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
  const { addToCart } = useContext(CartContext);
  const isOutOfStock = product.stock === 0;

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
      {/* Gambar Produk */}
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

      {/* Konten Card */}
      <Box
        sx={{
          p: 1.5,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Nama Produk Dipendekkan */}
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

        {/* Harga dan Tombol */}
        {!isHome && (
          <Box>
            <Typography
              sx={{ fontWeight: 700, fontSize: '16px', color: '#1976d2' }}
            >
              {convertToRupiah(product.price)}
            </Typography>
            <Button
              variant='contained'
              color='primary'
              size='small'
              sx={{
                fontSize: '14px',
                marginTop: '12px',
                width: '100%',
              }}
              endIcon={<AddShoppingCartIcon />}
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              Tambah Keranjang
            </Button>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default ProductCard;
