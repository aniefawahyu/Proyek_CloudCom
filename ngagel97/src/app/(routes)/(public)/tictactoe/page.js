'use client';

import { useSelector, useDispatch } from 'react-redux';
import { makeMove, resetGame, toggleGameMode } from '../../../redux/tictactoeSlice';
import { 
  Button, 
  Box, 
  Typography, 
  Paper,
  Container,
  Grid,
  Switch,
  FormControlLabel
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SmartToyIcon from '@mui/icons-material/SmartToy';

export default function TicTacToe() {
  const { board, xIsNext, winner, isVsBot } = useSelector((state) => state.tictactoe);
  const dispatch = useDispatch();

  const handleClick = (position) => {
    if (!board[position] && !winner) {
      dispatch(makeMove({ position }));
    }
  };

  const renderSquare = (position) => (
    <Button
      variant="outlined"
      sx={{
        width: 100,
        height: 100,
        m: 0.5,
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: board[position] === 'X' ? 'primary.main' : 'secondary.main',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
      }}
      onClick={() => handleClick(position)}
      disabled={board[position] || winner}
    >
      {board[position]}
    </Button>
  );

  const getStatusMessage = () => {
    if (winner === 'DRAW') return "It's a Draw!";
    if (winner) return `Winner: ${winner}`;
    return isVsBot ? 
      `Next player: ${xIsNext ? 'X (You)' : 'O (Bot)'}` :
      `Next player: ${xIsNext ? 'X' : 'O'}`;
  };

  return (
    <Container>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            maxWidth: 'fit-content',
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            Tic Tac Toe
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isVsBot}
                  onChange={() => dispatch(toggleGameMode())}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SmartToyIcon sx={{ mr: 1 }} />
                  {isVsBot ? "Play vs Bot" : "Player vs Player"}
                </Box>
              }
            />
          </Box>

          <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
            {getStatusMessage()}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Grid container direction="column" spacing={0}>
              {[0, 1, 2].map((row) => (
                <Grid item key={row} container justifyContent="center">
                  {[0, 1, 2].map((col) => (
                    <Grid item key={col}>
                      {renderSquare(row * 3 + col)}
                    </Grid>
                  ))}
                </Grid>
              ))}
            </Grid>
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            startIcon={<RestartAltIcon />}
            onClick={() => dispatch(resetGame())}
            sx={{ mt: 2 }}
          >
            Reset Game
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}