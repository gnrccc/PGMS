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
import ValidityDialog from "@/components/dialog/ValidityDialog";
import Loading from "@/components/ui/loading";

export default function AdminValidity() {
  const [validities, setValidities] = useState([]);
  const [filteredValidities, setFilteredValidities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedValidity, setSelectedValidity] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [validityToDelete, setValidityToDelete] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchValidities = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/admin/validities",
        { withCredentials: true }
      );
      const validityData = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setValidities(validityData);
      setFilteredValidities(validityData);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch validities"
      );
      setValidities([]);
      setFilteredValidities([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchValidities();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(filteredValidities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentValidities = filteredValidities.slice(startIndex, endIndex);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/admin/delete-validity/${id}`,
        { withCredentials: true }
      );
      toast.success("Validity deleted successfully");
      fetchValidities();
      setCurrentPage(1); // Reset to first page after delete
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete validity");
    }
  };

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={2} className="text-center">
            <Loading variant="spinner" size="sm" />
          </TableCell>
        </TableRow>
      );
    }

    if (currentValidities.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={2}
            className="text-center py-10 text-muted-foreground"
          >
            No validities found
          </TableCell>
        </TableRow>
      );
    }

    return currentValidities.map((validity) => (
      <TableRow key={validity._id}>
        <TableCell className="text-center">{validity.validity}</TableCell>
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
                  setSelectedValidity(validity);
                  setOpen(true);
                }}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setValidityToDelete(validity);
                  setShowDeleteDialog(true);
                }}
                className="cursor-pointer text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" />
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
        <h2 className="text-2xl font-bold">Validity Management</h2>
        <Button
          onClick={() => {
            setSelectedValidity(null);
            setOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Validity
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80%] text-center">Validity</TableHead>
              <TableHead className="w-[20%] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderTableContent()}</TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && filteredValidities.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredValidities.length)} of{" "}
            {filteredValidities.length} entries
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

      <ValidityDialog
        open={open}
        setOpen={setOpen}
        validity={selectedValidity}
        onSuccess={fetchValidities}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              validity period.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                handleDelete(validityToDelete?._id);
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
