import express from 'express';
import cors from 'cors';
import router from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// === ربط المسارات ===
app.use('/api', router);

app.get('/', (req, res) => {
  res.send('Pangea Tools Backend V2 is Running 🚀');
});

app.listen(PORT, () => {
  console.log(`\n\n==================================================`);
  console.log(`🚀 SERVER RESTARTED SUCCESSFULLY`);
  console.log(`✅ Running on: http://localhost:${PORT}`);
  console.log(`🔗 API Routes mounted at: http://localhost:${PORT}/api`);
  console.log(`==================================================\n\n`);
});
