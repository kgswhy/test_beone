// pages/transaction.tsx

"use client"; // Menandai ini sebagai komponen klien

import { useState } from 'react';
import { Button } from '@/components/ui/button'; // Pastikan Anda telah menginstal Shadcn UI
import { Input } from '@/components/ui/input'; 

const Transaction: React.FC = () => {
    const [customerId, setCustomerId] = useState('');
    const [amount, setAmount] = useState('');

    const handleTransactionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/middleware/v1/customers/transaction', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ customerId, amount }),
            });

            if (!response.ok) throw new Error('Error processing transaction');

            const result = await response.json();
             alert(result.message); // Tampilkan pesan sukses atau error
         } catch (error) {
             console.error(error);
             alert('Failed to process transaction');
         }
     };

     return (
         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
             <h2 className="text-2xl font-bold mb-4">Process Transaction</h2>
             <form onSubmit={handleTransactionSubmit} className='w-full max-w-sm'>
                 <Input
                     type='text'
                     placeholder='Customer ID'
                     value={customerId}
                     onChange={(e) => setCustomerId(e.target.value)}
                     required
                     className='mb-4'
                 />
                 <Input
                     type='number'
                     placeholder='Amount'
                     value={amount}
                     onChange={(e) => setAmount(e.target.value)}
                      required  
                      className='mb-4'   
                  />
                  <Button type='submit'>Process Transaction</Button>
              </form>
          </div>  
      );
};

export default Transaction;
