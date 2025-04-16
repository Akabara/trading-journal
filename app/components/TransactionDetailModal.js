'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';
import JournalEntryView from './JournalEntryView';

export default function TransactionDetailModal({ isOpen, onClose, transactionId }) {
  const [transaction, setTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Format currency to VND with thousands separators
  const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN') + ' ₫';
  };

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Fetch transaction details
  useEffect(() => {
    if (!isOpen || !transactionId) return;

    const fetchTransaction = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/transactions/${transactionId}`);
        
        if (!response.ok) {
          throw new Error('Không thể tải thông tin giao dịch');
        }
        
        const data = await response.json();
        setTransaction(data);
      } catch (err) {
        console.error('Error fetching transaction:', err);
        setError('Lỗi khi tải thông tin giao dịch: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransaction();
  }, [isOpen, transactionId]);

  // Handle clicks on the backdrop (close the modal)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close on ESC key press
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold">Chi Tiết Giao Dịch</h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <p>Đang tải...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-md">
              <p>{error}</p>
            </div>
          ) : !transaction ? (
            <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md">
              <p>Không tìm thấy giao dịch</p>
            </div>
          ) : (
            <>
              {/* Transaction details */}
              <div className="bg-white rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Mã Cổ Phiếu</h3>
                    <p className="mt-1 text-lg font-semibold">{transaction.ticker}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Loại</h3>
                    <p className="mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        transaction.type === 'BUY' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type === 'BUY' ? 'Mua' : 'Bán'}
                      </span>
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Ngày</h3>
                    <p className="mt-1">
                      {format(new Date(transaction.transactionDate), 'dd MMMM, yyyy', { locale: vi })}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Số Lượng</h3>
                    <p className="mt-1">{transaction.quantity}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Giá</h3>
                    <p className="mt-1">{formatCurrency(transaction.price)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tổng Giá Trị</h3>
                    <p className="mt-1">
                      {formatCurrency(transaction.price * transaction.quantity)}
                    </p>
                  </div>
                  
                  {transaction.fee > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phí</h3>
                      <p className="mt-1">{formatCurrency(transaction.fee)}</p>
                    </div>
                  )}
                  
                  {transaction.calculatedPl !== null && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Lãi/Lỗ
                      </h3>
                      <p className={`mt-1 ${
                        transaction.calculatedPl >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.calculatedPl >= 0 ? '+' : ''}
                        {formatCurrency(Math.abs(transaction.calculatedPl))}
                      </p>
                    </div>
                  )}
                  
                  {transaction.notes && (
                    <div className="col-span-2">
                      <h3 className="text-sm font-medium text-gray-500">Ghi Chú</h3>
                      <p className="mt-1 whitespace-pre-line">{transaction.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-2 mt-6 mb-4">
                <Link 
                  href={`/transactions/${transaction.id}/edit`} 
                  className="btn-secondary"
                >
                  Chỉnh sửa
                </Link>
                {transaction.journalEntry ? (
                  <Link 
                    href={`/transactions/${transaction.id}/journal/edit`} 
                    className="btn-secondary"
                  >
                    Sửa Nhật Ký
                  </Link>
                ) : (
                  <Link 
                    href={`/transactions/${transaction.id}/journal/new`} 
                    className="btn-primary"
                  >
                    Thêm Nhật Ký
                  </Link>
                )}
              </div>
              
              {/* Journal entry section */}
              <div className="mt-6">
                <JournalEntryView transactionId={transaction.id} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 