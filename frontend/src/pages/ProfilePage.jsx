import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Mail, User, Edit3, Check, X } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [bio, setBio] = useState(authUser?.bio || "");
  const [isEditingBio, setIsEditingBio] = useState(false);

  const handleUpdateBio = async () => {
    if (bio.trim() !== (authUser?.bio || "")) {
      await updateProfile({ bio: bio.trim() });
    }
    setIsEditingBio(false);
  };

  const handleCancelEdit = () => {
    setBio(authUser?.bio || "");
    setIsEditingBio(false);
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>

            {/* Bio Section */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4" />
                  Bio
                </div>
                {!isEditingBio && (
                  <button
                    onClick={() => setIsEditingBio(true)}
                    className="text-blue-500 hover:text-blue-400 text-xs flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                )}
              </div>

              {isEditingBio ? (
                <div className="space-y-3">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    maxLength={200}
                    className="w-full px-4 py-2.5 bg-base-200 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">
                      {bio.length}/200 characters
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancelEdit}
                        disabled={isUpdatingProfile}
                        className="px-3 py-1.5 text-sm bg-gray-600 hover:bg-gray-700 rounded-lg flex items-center gap-1 disabled:opacity-50"
                      >
                        <X className="w-3 h-3" />
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateBio}
                        disabled={isUpdatingProfile}
                        className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1 disabled:opacity-50"
                      >
                        <Check className="w-3 h-3" />
                        {isUpdatingProfile ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-2.5 bg-base-200 rounded-lg border min-h-[60px] flex items-center">
                  {authUser?.bio ? (
                    <p className="text-sm">{authUser.bio}</p>
                  ) : (
                    <p className="text-zinc-500 text-sm italic">
                      No bio added yet. Click edit to add one.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
