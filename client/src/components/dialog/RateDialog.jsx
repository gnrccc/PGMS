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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RateDialog({
  open,
  setOpen,
  rate,
  validities,
  onSuccess,
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      amount: "",
      validity: "",
    },
  });

  const filteredValidities = validities.filter(
    (validity) => validity.validity !== "1 Day"
  );

  useEffect(() => {
    if (rate && open) {
      reset({
        name: rate.name,
        amount: rate.amount,
        validity: rate.validity._id,
      });
    } else if (!rate && open) {
      reset({
        name: "",
        amount: "",
        validity: "",
      });
    }
  }, [rate, open, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        amount: Number(data.amount),
        validity: data.validity,
      };

      if (rate) {
        await axios.put(
          `http://localhost:3000/api/admin/update-rate/${rate._id}`,
          payload,
          { withCredentials: true }
        );
        toast.success("Rate updated successfully");
      } else {
        await axios.post(
          "http://localhost:3000/api/admin/create-rate",
          payload,
          { withCredentials: true }
        );
        toast.success("Rate created successfully");
      }
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
          <DialogTitle>{rate ? "Edit" : "Add"} Rate</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name", {
                required: "Name is required",
              })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              {...register("amount", {
                required: "Amount is required",
                min: { value: 0, message: "Amount must be positive" },
                valueAsNumber: true,
              })}
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="validity">Validity Period</Label>
            <Select
              onValueChange={(value) => setValue("validity", value)}
              defaultValue={rate?.validity._id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select validity period" />
              </SelectTrigger>
              <SelectContent>
                {filteredValidities.map((validity) => (
                  <SelectItem key={validity._id} value={validity._id}>
                    {validity.validity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.validity && (
              <p className="text-sm text-red-500">{errors.validity.message}</p>
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
              {isSubmitting ? "Saving..." : rate ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
