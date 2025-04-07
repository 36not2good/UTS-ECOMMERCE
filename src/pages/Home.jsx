import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  Stack,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import axios from 'axios';
import {
  ArrowForward,
  Storefront,
  Payment,
  HeadsetMic,
  Star,
} from '@mui/icons-material';

const Home = () => {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm] = useState('');
  const [sortBy] = useState('price');
  const [currentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const features = [
    {
      icon: <Storefront fontSize='large' color='primary' />,
      title: 'Produk Berkualitas',
      description: 'Barang original dengan garansi resmi',
    },
    {
      icon: <Payment fontSize='large' color='primary' />,
      title: 'Pembayaran Aman',
      description: 'Berbagai metode pembayaran terpercaya',
    },
    {
      icon: <HeadsetMic fontSize='large' color='primary' />,
      title: 'Layanan 24/7',
      description: 'Customer service siap membantu',
    },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <Container maxWidth='xl' disableGutters sx={{ margin: 0 }}>
        <Box
          sx={{
            height: 'calc(100vh - 64px)',
            display: 'flex',
            alignItems: 'center',
            backgroundImage: `url('/heropage.png')`,
            backgroundSize: 'cover',
          }}
        >
          <Container
            maxWidth='lg'
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: 'column',
              justifyContent: 'center',
              color: 'black',
              px: 2,
              mt: '-64px',
            }}
          >
            <Typography
              variant='h2'
              sx={{
                fontWeight: 700,
                mt: 6,
                fontSize: { xs: '1.5rem', md: '2.3rem' },
              }}
            >
              Selamat Datang di Toko Serba Ada
            </Typography>
            <Typography
              variant='h5'
              sx={{
                maxWidth: '800px',
                fontSize: { xs: '1.1rem', md: '1.5rem' },
              }}
            >
              Temukan produk terbaik dengan harga terbaik
            </Typography>
            <Stack direction='row' spacing={2} sx={{ mt: 2 }}>
              <Button
                variant='contained'
                color='primary'
                size='large'
                component={Link}
                to='/products'
                endIcon={<ArrowForward />}
                sx={{ px: 4, py: 1.5 }}
              >
                Belanja Sekarang
              </Button>
              {/* <Button
                variant='outlined'
                color='inherit'
                size='large'
                component={Link}
                to='/about'
                sx={{
                  px: 4,
                  py: 1.5,
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': { borderColor: 'white' },
                }}
              >
                Tentang Kami
              </Button> */}
            </Stack>
          </Container>
        </Box>

        <Container maxWidth='lg' sx={{ py: 8 }}>
          <Grid container spacing={4} justifyContent='center'>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 2,
                      mb: 2,
                      borderRadius: '50%',
                      bgcolor: 'primary.light',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant='h5'
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant='body1' color='text.secondary'>
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Container maxWidth='lg' sx={{ py: 4, px: 2 }}>
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              variant='h4'
              component='h2'
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Produk Pilihan
            </Typography>
            <Button
              variant='outlined'
              color='primary'
              size='large'
              component={Link}
              to='/products'
              endIcon={<ArrowForward />}
              sx={{ px: 6 }}
            >
              Lihat Semua Produk
            </Button>
          </Box>

          <Grid container spacing={3}>
            {paginatedProducts?.slice(0, 4)?.map((product) => (
              <Grid item size={{ xs: 6, sm: 6, md: 6, lg: 3 }} key={product.id}>
                <ProductCard isHome product={product} />
              </Grid>
            ))}
          </Grid>
        </Container>

        <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
          <Container>
            <Typography variant='h4' sx={{ mb: 6, fontWeight: 600 }}>
              Testimonial Pelanggan
            </Typography>
            <Grid container spacing={4}>
              {[1, 2, 3].map((item) => (
                <Grid item size={4} key={item}>
                  <Box
                    sx={{
                      p: 2,
                      height: '100%',
                      display: 'flex',
                      gap: 1,
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} color='primary' />
                      ))}
                    </Box>
                    <Typography sx={{ fontStyle: 'italic' }}>
                      "Produk berkualitas, pengiriman cepat dan packing rapi.
                      Sangat memuaskan!"
                    </Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                      - Pelanggan {item}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
        <Box
          sx={{
            py: 8,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          <Container maxWidth='md' sx={{ textAlign: 'center' }}>
            <Typography
              variant='h3'
              sx={{
                mb: 3,
                fontWeight: 700,
              }}
            >
              Siap Memulai Belanja?
            </Typography>
            <Typography variant='h5' sx={{ mb: 4 }}>
              Daftar sekarang dan borong produknya !
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent='center'
            >
              <Button
                variant='contained'
                color='secondary'
                size='large'
                component={Link}
                to='/register'
                sx={{
                  px: 6,
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
              >
                Daftar Sekarang
              </Button>
              <Button
                variant='outlined'
                color='inherit'
                size='large'
                component={Link}
                to='/products'
                sx={{
                  px: 6,
                  py: 1.5,
                  fontSize: '1.1rem',
                  color: 'primary.contrastText',
                  borderColor: 'primary.contrastText',
                  '&:hover': {
                    borderColor: 'primary.contrastText',
                  },
                }}
              >
                Lihat Produk
              </Button>
            </Stack>
          </Container>
        </Box>
      </Container>
    </>
  );
};

export default Home;
