import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const sequelizeConfig: SequelizeModuleOptions = {
  dialect: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: '3vtvySP3UicEv37Gx/IA7A==',
  database: 'fans_crm',
  autoLoadModels: true,
  synchronize: true,
};

