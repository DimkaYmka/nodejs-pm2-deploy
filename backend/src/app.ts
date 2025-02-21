import 'dotenv/config';

import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import cors from 'cors';
import errorHandler from './middlewares/error-handler';
import { DB_ADDRESS } from './config';
import routes from './routes';

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect(DB_ADDRESS);

// Только для локальных тестов. Не используйте это в продакшене
// app.use(cors({
//   origin: 'https://mesto-ff.nomorepartiesco.ru', // Разрешаем запросы только с этого домена
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Разрешенные методы
//   allowedHeaders: ['Content-Type', 'Authorization'], // Разрешенные заголовки
//   credentials: true, // Если используете куки или авторизацию
// }));

app.use(cors({
  origin: 'https://mesto-ff.nomorepartiesco.ru', // Разрешаем запросы только с этого домена
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Разрешенные методы
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-Custom-Header'], // Разрешенные заголовки
  credentials: true, // Если используете куки или авторизацию
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(routes);
app.use(errors());
app.use(errorHandler);

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log('ok'));


