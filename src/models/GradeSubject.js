import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const GradeSubject = sequelize.define('GradeSubject', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  gradeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'grades',
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
  tableName: 'grade_subjects',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['gradeId', 'subjectId']
    }
  ]
});

export default GradeSubject;
