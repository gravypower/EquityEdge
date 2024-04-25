// src/components/EventForm.tsx
import React, { useState } from 'react';
import { AccountType, FinancialEvent } from '../simulation/financialTypes';


interface EventFormProps {
  addEvent: (event: FinancialEvent) => void;
}

const EventForm: React.FC<EventFormProps> = ({ addEvent }) => {
  const [date, setDate] = useState('');
  const [account, setAccount] = useState<AccountType>('Loan');
  const [action, setAction] = useState<'debit' | 'credit'>('debit');
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent({
      date,
      type: 'Custom',
      account,
      action,
      amount,
      description
    });
    // Reset form fields after submission
    setDate('');
    setAmount(0);
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <select value={account} onChange={e => setAccount(e.target.value as AccountType)}>
        <option value="Loan">Loan</option>
        <option value="Interest">Interest</option>
        <option value="Cash">Cash</option>
        <option value="Offset">Offset</option>
        <option value="Income">Income</option>
      </select>
      <select value={action} onChange={e => setAction(e.target.value as 'debit' | 'credit')}>
        <option value="debit">Debit</option>
        <option value="credit">Credit</option>
      </select>
      <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
      <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
      <button type="submit">Add Event</button>
    </form>
  );
};

export default EventForm;
