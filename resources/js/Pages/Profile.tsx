import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateProfile } from "@/features/profile";

export default function Profile() {
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const canSwitchPrimaryRole = user?.roles?.includes('adviser') && user?.roles?.includes('coordinator');
  const currentRole = user?.roles?.includes('coordinator') ? 'coordinator' : 'adviser';
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: canSwitchPrimaryRole ? (currentRole as 'adviser' | 'coordinator') : undefined,
  });

  const handleRoleToggle = (checked: boolean) => {
    if (!canSwitchPrimaryRole) {
      return;
    }

    const nextRole = checked ? 'coordinator' : 'adviser';

    setFormData(prev => ({
      ...prev,
      role: nextRole,
    }));

    updateProfile.mutate({
      name: formData.name,
      email: formData.email,
      role: nextRole,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateProfile.mutate({
      name: formData.name,
      email: formData.email,
      ...(canSwitchPrimaryRole && formData.role ? { role: formData.role } : {}),
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Update your personal information and account settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Account Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input
                    value={user?.department?.name || 'N/A'}
                    disabled
                    className="bg-muted"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Roles</Label>
                  <Input
                    value={user?.roles?.join(', ') || 'N/A'}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </div>

            {canSwitchPrimaryRole && (
              <div className="rounded-lg border p-4 space-y-3">
                <div className="space-y-1">
                  <h4 className="font-medium">Role Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Switch your assigned role between adviser and coordinator.
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="role-toggle">Current selected role</Label>
                    <div className="text-sm text-muted-foreground">
                      {formData.role === 'coordinator' ? 'Research Coordinator' : 'Adviser'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={formData.role === 'adviser' ? 'text-sm font-medium' : 'text-sm text-muted-foreground'}>
                      Adviser
                    </span>
                    <Switch
                      id="role-toggle"
                      checked={formData.role === 'coordinator'}
                      disabled={updateProfile.isPending}
                      onCheckedChange={handleRoleToggle}
                    />
                    <span className={formData.role === 'coordinator' ? 'text-sm font-medium' : 'text-sm text-muted-foreground'}>
                      Research Coordinator
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <Separator />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
