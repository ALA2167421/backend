import express from 'express';
import cors from 'cors';
import apiRoutes from './src/routes/api.routes';

const app = express();
app.use(cors());
app.use(express.json());

// ربط المسارات
app.use('/api', apiRoutes);

app.listen(3000, () => {
  console.log('🚀 Server ready at: http://localhost:3000');
});