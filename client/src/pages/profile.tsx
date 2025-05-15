import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalendarIcon, LockIcon, UserIcon, MailIcon, BellIcon, ActivityIcon } from 'lucide-react';

const ProfilePage: React.FC = () => {
  // We're getting user with ID 1 (John Doe) for demonstration purposes
  // In a real application, this would come from authentication
  const userId = 1;

  // Fetch user data
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: [`/api/users/${userId}`],
  });

  // Profile update form schema
  const profileFormSchema = z.object({
    fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  });

  // Password update form schema
  const passwordFormSchema = z.object({
    currentPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
    newPassword: z.string().min(8, { message: "New password must be at least 8 characters." }),
    confirmPassword: z.string().min(8, { message: "Confirm password must be at least 8 characters." }),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  // Initialize profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      username: user?.username || "",
    },
  });

  // Initialize password form
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update profile form when user data loads
  React.useEffect(() => {
    if (user) {
      profileForm.reset({
        fullName: user.fullName,
        email: user.email,
        username: user.username,
      });
    }
  }, [user, profileForm]);

  // Handle profile form submission
  const onProfileSubmit = (values: z.infer<typeof profileFormSchema>) => {
    console.log(values);
    // This would send an API request to update the user profile
  };

  // Handle password form submission
  const onPasswordSubmit = (values: z.infer<typeof passwordFormSchema>) => {
    console.log(values);
    // This would send an API request to update the user password
  };

  return (
    <DashboardLayout title="My Profile">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Profile</h1>
        <p className="text-neutral-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="text-2xl bg-primary text-white">
                    {user?.fullName?.split(' ').map(n => n[0]).join('') || 'JD'}
                  </AvatarFallback>
                </Avatar>
                <h2 className="font-semibold text-lg">{userLoading ? "Loading..." : user?.fullName}</h2>
                <p className="text-sm text-neutral-500">{userLoading ? "" : user?.email}</p>
                <p className="text-xs bg-blue-100 text-primary px-2 py-1 rounded-full mt-2">
                  {userLoading ? "" : user?.userType === 'patient' ? 'Patient' : 'Therapist'}
                </p>
              </div>

              <div className="mt-6 space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Account
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BellIcon className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ActivityIcon className="mr-2 h-4 w-4" />
                  Activity
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <LockIcon className="mr-2 h-4 w-4" />
                  Security
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Tabs defaultValue="account">
            <TabsList className="mb-4">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account details and profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <FormField
                        control={profileForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="johndoe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit">Save Changes</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Update your password and manage your account security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter current password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter new password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Confirm new password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit">Update Password</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Manage your notification preferences and other settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-neutral-500">Receive email about your therapy sessions</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor="email-notifications" className="sr-only">
                              Email Notifications
                            </Label>
                            <input
                              id="email-notifications"
                              type="checkbox"
                              className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
                              defaultChecked
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Session Reminders</p>
                            <p className="text-sm text-neutral-500">Get reminders before your scheduled sessions</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor="session-reminders" className="sr-only">
                              Session Reminders
                            </Label>
                            <input
                              id="session-reminders"
                              type="checkbox"
                              className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
                              defaultChecked
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Progress Updates</p>
                            <p className="text-sm text-neutral-500">Receive weekly updates on your recovery progress</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor="progress-updates" className="sr-only">
                              Progress Updates
                            </Label>
                            <input
                              id="progress-updates"
                              type="checkbox"
                              className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
                              defaultChecked
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Appearance</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Dark Mode</p>
                            <p className="text-sm text-neutral-500">Enable dark mode for the application</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor="dark-mode" className="sr-only">
                              Dark Mode
                            </Label>
                            <input
                              id="dark-mode"
                              type="checkbox"
                              className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button>Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
