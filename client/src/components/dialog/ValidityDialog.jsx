import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ValidityDialog({ open, setOpen, validity, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      days: 0,
      months: 0,
    },
  });

  useEffect(() => {
    reset({
      days: validity?.days || 0,
      months: validity?.months || 0,
    });
  }, [validity, open, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        days: Number(data.days) || 0,
        months: Number(data.months) || 0,
      };

      if (payload.days === 0 && payload.months === 0) {
        toast.error("Please enter at least days or months");
        return;
      }

      const endpoint = validity
        ? `http://localhost:3000/api/admin/update-validity/${validity._id}`
        : "http://localhost:3000/api/admin/create-validity";

      const method = validity ? "put" : "post";

      await axios[method](endpoint, payload, { withCredentials: true });

      toast.success(
        `Validity ${validity ? "updated" : "created"} successfully`
      );
      setOpen(false);
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{validity ? "Edit" : "Add"} Validity</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="months">Months</Label>
            <Input
              id="months"
              type="number"
              min="0"
              {...register("months", {
                min: { value: 0, message: "Months cannot be negative" },
                valueAsNumber: true,
              })}
            />
            {errors.months && (
              <p className="text-sm text-red-500">{errors.months.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="days">Days</Label>
            <Input
              id="days"
              type="number"
              min="0"
              {...register("days", {
                min: { value: 0, message: "Days cannot be negative" },
                valueAsNumber: true,
              })}
            />
            {errors.days && (
              <p className="text-sm text-red-500">{errors.days.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : validity ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
