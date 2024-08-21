import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Sequelize } from 'sequelize-typescript';
import { User } from './user/user-model/user.model';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cors({
      origin: 'http://localhost:3001', // Your frontend origin
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Content-Type, Authorization',
    }),
  );
  await app.listen(3000);
}
bootstrap();

const sequelize = new Sequelize({
  dialect: 'mysql', // or another dialect
  host: 'localhost',
  username: 'root',
  password: '3vtvySP3UicEv37Gx/IA7A==',
  database: 'fans_crm',
  models: [User], // Add your models here
});

// Sync the models with the database
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });
