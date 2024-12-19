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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

const defaultFormValues = {
  firstName: "",
  lastName: "",
  userName: "",
  password: "",
  birthDate: null,
  gender: "",
  phoneNumber: "",
  address: "",
};

export default function StaffDialog({ open, setOpen, staff, onSuccess }) {
  const [calendarView, setCalendarView] = useState("days");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      ...defaultFormValues,
      birthDate: staff?.birthDate ? new Date(staff.birthDate) : null,
    },
  });

  const birthDate = watch("birthDate");
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 38 }, (_, i) => currentYear - 55 + i);

  useEffect(() => {
    if (staff && open) {
      // Populate form with staff data for editing
      Object.keys(staff).forEach((key) => {
        setValue(key, key === "birthDate" ? new Date(staff[key]) : staff[key]);
      });
    } else if (!staff && open) {
      reset(defaultFormValues);
    }
  }, [staff, open, setValue, reset]);

  useEffect(() => {
    if (birthDate) {
      setCalendarDate(birthDate);
    }
  }, [birthDate]);

  useEffect(() => {
    if (!open) {
      if (!staff) {
        reset(defaultFormValues);
      }
      setCalendarView("days");
      setShowPassword(false);
    }
  }, [open, reset, staff]);

  const onSubmit = async (data) => {
    try {
      if (staff) {
        await axios.put(
          `http://localhost:3000/api/user/update-profile/${staff._id}`,
          data,
          { withCredentials: true }
        );
        toast.success("Staff updated successfully");
      } else {
        await axios.post(
          "http://localhost:3000/api/admin/create-user",
          { ...data, role: "staff" },
          { withCredentials: true }
        );
        toast.success("Staff created successfully");
        reset(defaultFormValues);
      }
      setOpen(false);
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDialogClose = (openState) => {
    setOpen(openState);
    if (!openState) {
      reset(defaultFormValues);
      setCalendarView("days");
      setShowPassword(false);
    }
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    const minDate = new Date(
      today.getFullYear() - 55,
      today.getMonth(),
      today.getDate()
    );
    const maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    return date > maxDate || date < minDate;
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px] overflow-visible">
        <DialogHeader>
          <DialogTitle>{staff ? "Edit Staff" : "Add Staff"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...register("firstName", {
                  required: "First name is required",
                })}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...register("lastName", { required: "Last name is required" })}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userName">Username</Label>
            <Input
              id="userName"
              {...register("userName", { required: "Username is required" })}
            />
            {errors.userName && (
              <p className="text-sm text-red-500">{errors.userName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: !staff ? "Password is required" : false,
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,24}$)/,
                    message:
                      "Password must contain at least one lowercase letter, one uppercase letter, and one special character",
                  },
                })}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2 relative">
            <Label>Birth Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !birthDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDate ? (
                    format(birthDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 z-[999]"
                align="center"
                side="top"
                sideOffset={0}
                alignOffset={0}
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                {calendarView === "years" ? (
                  <div className="p-2">
                    <div className="grid grid-cols-4 gap-2 w-[320px]">
                      {years.map((year) => (
                        <Button
                          key={year}
                          onClick={() => {
                            const newDate = new Date(calendarDate);
                            newDate.setFullYear(year);
                            setCalendarDate(newDate);
                            setCalendarView("days");
                          }}
                          variant="ghost"
                          className="text-sm w-[70px]"
                        >
                          {year}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Calendar
                    mode="single"
                    selected={birthDate}
                    onSelect={(date) => setValue("birthDate", date)}
                    defaultMonth={calendarDate}
                    month={calendarDate}
                    onMonthChange={(month) => setCalendarDate(month)}
                    disabled={isDateDisabled}
                    initialFocus
                    className="rounded-md border"
                    footer={
                      <div className="flex justify-center p-2">
                        <Button
                          variant="outline"
                          className="text-xs"
                          onClick={() => setCalendarView("years")}
                        >
                          Select Year
                        </Button>
                      </div>
                    }
                  />
                )}
              </PopoverContent>
            </Popover>
            {errors.birthDate && (
              <p className="text-sm text-red-500">{errors.birthDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              onValueChange={(value) => setValue("gender", value)}
              defaultValue={staff?.gender}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              {...register("phoneNumber", {
                required: "Phone number is required",
              })}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
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
              {isSubmitting ? "Saving..." : staff ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
