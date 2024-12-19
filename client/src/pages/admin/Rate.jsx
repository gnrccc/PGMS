import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import RateDialog from "@/components/dialog/RateDialog";
import Loading from "@/components/ui/loading";

export default function AdminRate() {
  const [rates, setRates] = useState([]);
  const [validities, setValidities] = useState([]);
  const [filteredRates, setFilteredRates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedRate, setSelectedRate] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [rateToDelete, setRateToDelete] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchValidities = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/admin/validities",
        { withCredentials: true }
      );
      setValidities(response.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch validities"
      );
    }
  };

  const fetchRates = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/admin/rates",
        { withCredentials: true }
      );
      const rateData = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setRates(rateData);
      setFilteredRates(rateData);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch rates");
      setRates([]);
      setFilteredRates([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchValidities();
    fetchRates();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(filteredRates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRates = filteredRates.slice(startIndex, endIndex);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/delete-rate/${id}`, {
        withCredentials: true,
      });
      toast.success("Rate deleted successfully");
      fetchRates();
      setCurrentPage(1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete rate");
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center">
            <Loading variant="spinner" size="sm" />
          </TableCell>
        </TableRow>
      );
    }

    if (currentRates.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={4}
            className="text-center py-10 text-muted-foreground"
          >
            No rates found
          </TableCell>
        </TableRow>
      );
    }

    return currentRates.map((rate) => (
      <TableRow key={rate._id}>
        <TableCell>{rate.name}</TableCell>
        <TableCell className="text-right">
          {formatAmount(rate.amount)}
        </TableCell>
        <TableCell className="text-center">
          {rate.validity ? rate.validity.validity : "Invalid Validity"}
        </TableCell>
        <TableCell className="text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedRate(rate);
                  setOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setRateToDelete(rate);
                  setShowDeleteDialog(true);
                }}
                className="flex items-center gap-2 text-red-600"
              >
                <Trash className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Rate Management</h2>
        <Button
          onClick={() => {
            setSelectedRate(null);
            setOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Rate
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Validity</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderTableContent()}</TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && filteredRates.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredRates.length)} of {filteredRates.length}{" "}
            entries
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <RateDialog
        open={open}
        setOpen={setOpen}
        rate={selectedRate}
        validities={validities}
        onSuccess={fetchRates}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {rateToDelete?.name}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                handleDelete(rateToDelete?._id);
                setShowDeleteDialog(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
