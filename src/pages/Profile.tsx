import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Calendar, LogOut } from "lucide-react";

interface Profile {
  full_name: string;
  email: string;
  created_at: string;
}

interface ClubMembership {
  id: string;
  club_id: string;
  joined_at: string;
  clubs: {
    name: string;
    category: string;
    icon: string;
  };
}

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [memberships, setMemberships] = useState<ClubMembership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);
    await fetchProfile(session.user.id);
    await fetchMemberships(session.user.id);
    setIsLoading(false);
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchMemberships = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('club_members')
        .select(`
          id,
          club_id,
          joined_at,
          clubs (
            name,
            category,
            icon
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      setMemberships(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading memberships",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-12 max-w-4xl">
        <div className="mb-10">
          <h1 className="mb-3 text-4xl font-bold">My Profile</h1>
          <p className="text-lg text-muted-foreground">
            View your information and club memberships
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{profile?.full_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{profile?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>
              </div>

              <Button 
                variant="destructive" 
                onClick={handleSignOut}
                className="w-full mt-4"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Club Memberships */}
          <Card>
            <CardHeader>
              <CardTitle>My Clubs</CardTitle>
              <CardDescription>
                {memberships.length > 0 
                  ? `You're a member of ${memberships.length} club${memberships.length !== 1 ? 's' : ''}`
                  : "You haven't joined any clubs yet"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {memberships.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Join clubs to see exclusive events and activities</p>
                  <Button onClick={() => navigate("/clubs")}>
                    Browse Clubs
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {memberships.map((membership) => (
                    <div 
                      key={membership.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <span className="text-2xl">{membership.clubs.icon}</span>
                        </div>
                        <div>
                          <p className="font-semibold">{membership.clubs.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Joined {new Date(membership.joined_at).toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">{membership.clubs.category}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
