import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge from '../molecules/StatusBadge';
import ActionButtons from '../molecules/ActionButtons';

const InvoiceTable = ({ invoices, onViewDetails, onDelete, onStamp }) => {
  const renderSender = (sender) => {
    if (Array.isArray(sender) && sender.length > 1) {
      return (
        <div className="flex flex-col">
          <span>{sender[0]}</span>
          <span className="text-sm text-gray-500">{sender.slice(1).join(', ')}</span>
        </div>
      );
    }
    return Array.isArray(sender) ? sender.join(', ') : sender;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/4">Sender</TableHead>
          <TableHead className="w-1/4">Amount</TableHead>
          <TableHead className="w-1/4">Status</TableHead>
          <TableHead className="w-1/4">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice, index) => (
          <TableRow key={invoice.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <TableCell className="w-1/4">{renderSender(invoice.sender)}</TableCell>
            <TableCell className="w-1/4">{invoice.amount}</TableCell>
            <TableCell className="w-1/4">
              <StatusBadge status={invoice.status} />
            </TableCell>
            <TableCell className="w-1/4">
              <ActionButtons
                invoice={invoice}
                onViewDetails={onViewDetails}
                onDelete={onDelete}
                onStamp={onStamp}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InvoiceTable;