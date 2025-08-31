import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const StudentGrade = sequelize.define('StudentGrade', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  gradeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'grades',
      key: 'id'
    }
  },
  fechaInscripcion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'student_grades',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['studentId', 'gradeId']
    }
  ]
});

export default StudentGrade;
