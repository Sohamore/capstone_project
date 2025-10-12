import React, { useState } from 'react';
import Layout from '@/components/Layout';

const Address = () => {
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Address submitted: ${address}`);
    // Add logic to save the address or move to the next step
  };

  return (
    <Layout>
      <section className="py-20 flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10 text-center">
          <h1 className="text-2xl font-bold mb-6">Enter Your Address</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Enter your address"
              className="border border-gray-300 p-3 rounded-lg w-full"
              rows={4}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
            >
              Submit Address
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Address;