import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { keyframes } from '@mui/material/styles';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

const float1 = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(45deg); }
  50% { transform: translate(15px, -20px) rotate(50deg); }
`;

const float2 = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(-30deg); }
  50% { transform: translate(-20px, 15px) rotate(-25deg); }
`;

const float3 = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(20deg); }
  50% { transform: translate(10px, 10px) rotate(25deg); }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.3); }
`;

export default function AuthClassicLayout({ children }: Props) {
  return (
    <Stack
      component="main"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29 0%, #1a1a3e 40%, #24243e 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative geometric shapes */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '15%',
          width: 200,
          height: 60,
          borderRadius: 30,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          transform: 'rotate(45deg)',
          animation: `${float1} 8s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '10%',
          width: 280,
          height: 70,
          borderRadius: 35,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
          transform: 'rotate(-30deg)',
          animation: `${float2} 10s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '55%',
          right: '5%',
          width: 160,
          height: 50,
          borderRadius: 25,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          transform: 'rotate(20deg)',
          animation: `${float3} 12s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '30%',
          left: '8%',
          width: 120,
          height: 40,
          borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          transform: 'rotate(60deg)',
          animation: `${float1} 14s ease-in-out infinite`,
        }}
      />

      {/* Star/cross decorations */}
      {[
        { top: '12%', left: '18%', delay: '0s', size: 14 },
        { top: '25%', right: '25%', delay: '2s', size: 10 },
        { bottom: '20%', right: '18%', delay: '4s', size: 12 },
        { bottom: '35%', left: '15%', delay: '1s', size: 8 },
        { top: '60%', left: '25%', delay: '3s', size: 10 },
        { top: '15%', right: '40%', delay: '5s', size: 6 },
      ].map((star, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            ...star,
            width: star.size,
            height: star.size,
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              background: 'rgba(255,255,255,0.4)',
              borderRadius: 1,
            },
            '&::before': {
              width: '100%',
              height: 2,
              top: '50%',
              transform: 'translateY(-50%)',
            },
            '&::after': {
              width: 2,
              height: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
            },
            animation: `${twinkle} 3s ease-in-out ${star.delay} infinite`,
          }}
        />
      ))}

      {/* Main card */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: { xs: '92%', sm: 480, md: 520 },
          borderRadius: 4,
          background: 'rgba(20, 20, 50, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
          px: { xs: 3, sm: 5, md: 6 },
          py: { xs: 4, sm: 5, md: 6 },
        }}
      >
        {children}
      </Box>
    </Stack>
  );
}
