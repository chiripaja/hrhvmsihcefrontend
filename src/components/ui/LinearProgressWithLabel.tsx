import * as React from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props}  sx={{ height: 5 }}/>
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export default function LinearWithValueLabel({ nullCount, nonNullCount }: { nullCount: any; nonNullCount: any }) {
  const [progress, setProgress] = React.useState(0);

  const totalPatients = nullCount + nonNullCount;
  const finalProgress = totalPatients > 0 ? (nonNullCount / totalPatients) * 100 : 0;

  React.useEffect(() => {
    if (progress < finalProgress) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          const nextProgress = prevProgress + 1;
          if (nextProgress >= finalProgress) {
            clearInterval(interval);
            return finalProgress;
          }
          return nextProgress;
        });
      }, 20); // Ajusta este valor para controlar la velocidad de la animación (menor es más lento)
      
      return () => clearInterval(interval);
    }
  }, [progress, finalProgress]);

  return (
    <Box sx={{ width: '100%' }} className="mb-4">
      
      <LinearProgressWithLabel value={progress} />
    </Box>
  );
}
