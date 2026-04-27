"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Camera } from "lucide-react";
import {
  useMyProfile,
  useUpdateProfile,
  useChangePassword,
} from "../hooks/useUsers";
import { toast } from "sonner";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  image: z.any().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function SettingsForm() {
  const { data: profileData, isLoading } = useMyProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (profileData?.data) {
      const user = profileData.data;
      profileForm.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImagePreview(user.image?.url || null);
    }
  }, [profileData, profileForm]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      profileForm.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onProfileSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("phone", values.phone);

      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      await updateProfileMutation.mutateAsync(formData);
      toast.success("Profile updated successfully");
      setIsEditingProfile(false);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success("Password changed successfully");
      passwordForm.reset();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  const user = profileData?.data;

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      {/* Profile Header */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-8 flex items-center gap-6">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Avatar className="w-24 h-24 border-4 border-white shadow-md">
              <AvatarImage src={imagePreview || undefined} />
              <AvatarFallback className="bg-primary text-white text-2xl">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-muted-foreground text-sm">Super Admin</p>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between px-8 pt-8">
          <CardTitle className="text-xl font-bold">
            Personal Information
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg bg-[#84c225] hover:bg-[#84c225]/90 text-white border-none gap-2 px-4"
            onClick={() => setIsEditingProfile(!isEditingProfile)}
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="p-8">
          <form
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold">First Name</label>
                <Input
                  {...profileForm.register("firstName")}
                  disabled={!isEditingProfile}
                  placeholder="Demo"
                  className="bg-card h-12 border-border/50"
                />
                {profileForm.formState.errors.firstName && (
                  <p className="text-xs text-destructive">
                    {profileForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Last Name</label>
                <Input
                  {...profileForm.register("lastName")}
                  disabled={!isEditingProfile}
                  placeholder="Name"
                  className="bg-card h-12 border-border/50"
                />
                {profileForm.formState.errors.lastName && (
                  <p className="text-xs text-destructive">
                    {profileForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Email Address</label>
                <Input
                  {...profileForm.register("email")}
                  disabled={!isEditingProfile}
                  placeholder="iwmsadvisors@example.com"
                  className="bg-card h-12 border-border/50"
                />
                {profileForm.formState.errors.email && (
                  <p className="text-xs text-destructive">
                    {profileForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Phone</label>
                <Input
                  {...profileForm.register("phone")}
                  disabled={!isEditingProfile}
                  placeholder="(307) 555-0133"
                  className="bg-card h-12 border-border/50"
                />
                {profileForm.formState.errors.phone && (
                  <p className="text-xs text-destructive">
                    {profileForm.formState.errors.phone.message}
                  </p>
                )}
              </div>
            </div>
            {isEditingProfile && (
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="bg-[#84c225] hover:bg-[#84c225]/90 text-white rounded-full px-8 h-12 font-bold"
                >
                  {updateProfileMutation.isPending
                    ? "Updating..."
                    : "Update Profile"}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-none shadow-sm">
        <CardHeader className="px-8 pt-8">
          <CardTitle className="text-xl font-bold">Change password</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold">Current Password</label>
                <Input
                  type="password"
                  {...passwordForm.register("currentPassword")}
                  placeholder="..............."
                  className="bg-card h-12 border-border/50"
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-xs text-destructive">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">New Password</label>
                <Input
                  type="password"
                  {...passwordForm.register("newPassword")}
                  placeholder="..............."
                  className="bg-card h-12 border-border/50"
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-xs text-destructive">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  {...passwordForm.register("confirmPassword")}
                  placeholder="..............."
                  className="bg-card h-12 border-border/50"
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="bg-[#84c225] hover:bg-[#84c225]/90 text-white rounded-full px-8 h-12 font-bold"
              >
                {changePasswordMutation.isPending
                  ? "Saving..."
                  : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
