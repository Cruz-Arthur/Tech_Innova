import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { sendContactEmails } from './services/sendEmail';

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://127.0.0.1:3002',
  'http://127.0.0.1:5500',
  'https://tech-innova-roan.vercel.app',
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

const frontendPath = path.resolve(process.cwd(), 'src/frontend');

app.use(express.static(frontendPath));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, 'pages/home/index.html'));
});

app.get('/quiz', (req, res) => {
  res.sendFile(path.join(frontendPath, 'pages/quiz/QuizService.html'));
});

app.get('/contact', (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, 'pages/contact/ContactUs.html'));
});

// Rota de envio de email
app.post('/send-email', async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false,
      message: 'Todos os campos são obrigatórios.' 
    });
  }

  try {
    await sendContactEmails({ name, email, message });
    return res.status(200).json({ 
      success: true,
      message: 'Email enviado com sucesso!' 
    });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Erro ao enviar email. Por favor, tente novamente mais tarde.' 
    });
  }
});

// Rota genérica (opcional, pode ajustar conforme necessidade)
app.get('*', (req: Request, res: Response) => {
  const filePath = path.join(frontendPath, req.path);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Página não encontrada');
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
