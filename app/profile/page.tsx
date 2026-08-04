import DashboardLayout from "@/components/layout/DashboardLayout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import EditProfile from "@/components/profile/EditProfile";
import AccountSettings from "@/components/profile/AccountSettings";
import ProfileActivity from "@/components/profile/ProfileActivity";

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <ProfileHeader />

        <ProfileStats />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <EditProfile />
          </div>

          <AccountSettings />
        </div>

        <ProfileActivity />
      </div>
    </DashboardLayout>
  );
}