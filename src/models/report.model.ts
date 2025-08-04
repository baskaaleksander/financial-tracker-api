import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dateFrom: {
    type: Date,
    required: true,
  },
  dateTo: {
    type: Date,
    required: true,
  },
  totalIncome: {
    type: Number,
    default: 0,
  },
  totalExpenses: {
    type: Number,
    default: 0,
  },
  netBalance: {
    type: Number,
    default: 0,
  },
  incomeByCategory: [
    {
      categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
      totalAmount: {
        type: Number,
        default: 0,
      },
    },
  ],
  expensesByCategory: [
    {
      categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
      totalAmount: {
        type: Number,
        default: 0,
      },
    },
  ],
  dailyBreakdown: [
    {
      date: {
        type: Date,
        required: true,
      },
      totalIncome: {
        type: Number,
        default: 0,
      },
      totalExpenses: {
        type: Number,
        default: 0,
      },
      netBalance: {
        type: Number,
        default: 0,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
