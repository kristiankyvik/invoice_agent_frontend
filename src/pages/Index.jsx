import React, { useState, useEffect } from "react";
import {
  useInvoicesDev,
  useDeleteInvoicesDev,
} from "@/integrations/supabase/index.js";
import InvoicePageTemplate from "../components/templates/InvoicePageTemplate";
import StampSheet from "@/components/StampSheet";
import InvoiceDetailsSheet from "@/components/InvoiceDetailsSheet";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";

const Index = () => {
  const { data: invoices, error, isLoading } = useInvoicesDev();
  const deleteInvoiceMutation = useDeleteInvoicesDev();
  const [statuses, setStatuses] = useState([]);
  const [isStampSheetOpen, setIsStampSheetOpen] = useState(false);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    if (invoices) {
      const uniqueStatuses = Array.from(
        new Set(invoices.map((invoice) => {
          if (invoice.status === "Empfangen") return "Unchecked";
          if (invoice.status === "Kontiert") return "Checked";
          return invoice.status;
        }))
      );
      setStatuses(uniqueStatuses);
    }
  }, [invoices]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading invoices: {error.message}</div>;

  const handleStampClick = (invoice) => {
    setSelectedInvoice(invoice);
    setIsStampSheetOpen(true);
  };

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailsSheetOpen(true);
  };

  const handleDelete = async (invoiceId) => {
    try {
      await deleteInvoiceMutation.mutateAsync(invoiceId);
      toast.success("Invoice deleted successfully", {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        className: "text-green-500",
      });
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice", {
        icon: <XCircle className="h-5 w-5 text-red-500" />,
        className: "text-red-500",
      });
    }
  };

  const updatedInvoices = invoices.map(invoice => ({
    ...invoice,
    status: invoice.status === "Empfangen" ? "Unchecked" : 
            invoice.status === "Kontiert" ? "Checked" : 
            invoice.status
  }));

  const filteredInvoices = updatedInvoices.filter(invoice => invoice.status !== "Marius_TEST");

  return (
    <div>
      <InvoicePageTemplate
        invoices={filteredInvoices}
        allInvoices={updatedInvoices}
        statuses={statuses}
        onViewDetails={handleViewDetails}
        onDelete={handleDelete}
        onStamp={handleStampClick}
      />

      <StampSheet
        isOpen={isStampSheetOpen}
        onOpenChange={setIsStampSheetOpen}
        invoice={selectedInvoice}
      />

      <InvoiceDetailsSheet
        isOpen={isDetailsSheetOpen}
        onOpenChange={setIsDetailsSheetOpen}
        invoice={selectedInvoice}
      />
    </div>
  );
};

export default Index;
