import { sequelize } from '@app/config/Sequelize';
import * as Sequelize from 'sequelize';
import IPostedCustomMenu from './IPostedCustomMenu';

interface IPostedCustomMenuInstance  extends Sequelize.Instance<IPostedCustomMenu>, IPostedCustomMenu {}
