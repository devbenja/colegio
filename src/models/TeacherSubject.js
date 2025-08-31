import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TeacherSubject = sequelize.define('TeacherSubject', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  subjectId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'subjects',
      key: 'id'
    }
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'teacher_subjects',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['teacherId', 'subjectId']
    }
  ]
});

export default TeacherSubject;
