import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Palette, Music, Cpu, BookOpen, Trophy, Users, UserPlus, UserMinus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  member_count: number;
}

interface ClubMembership {
  club_id: string;
}

const iconMap: Record<string, any> = {
  Code,
  Palette,
  Music,
  Cpu,
  BookOpen,
  Trophy,
};

const Clubs = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [memberships, setMemberships] = useState<ClubMembership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchClubs();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    
    if (session?.user) {
      fetchMemberships(session.user.id);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchMemberships(session.user.id);
      } else {
        setMemberships([]);
      }
    });

    return () => subscription.unsubscribe();
  };

  const fetchClubs = async () => {
    try {
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .order('name');

      if (error) throw error;
      setClubs(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading clubs",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMemberships = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('club_members')
        .select('club_id')
        .eq('user_id', userId);

      if (error) throw error;
      setMemberships(data || []);
    } catch (error: any) {
      console.error('Error fetching memberships:', error);
    }
  };

  const isMember = (clubId: string) => {
    return memberships.some(m => m.club_id === clubId);
  };

  const handleJoinLeave = async (clubId: string, clubName: string, isCurrentlyMember: boolean) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to join clubs",
      });
      navigate("/auth");
      return;
    }

    try {
      if (isCurrentlyMember) {
        // Leave club
        const { error } = await supabase
          .from('club_members')
          .delete()
          .eq('user_id', user.id)
          .eq('club_id', clubId);

        if (error) throw error;

        setMemberships(memberships.filter(m => m.club_id !== clubId));
        toast({
          title: "Left club",
          description: `You've left ${clubName}`,
        });
      } else {
        // Join club
        const { error } = await supabase
          .from('club_members')
          .insert({
            user_id: user.id,
            club_id: clubId,
          });

        if (error) throw error;

        setMemberships([...memberships, { club_id: clubId }]);
        toast({
          title: "Joined club!",
          description: `Welcome to ${clubName}!`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Action failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">Loading clubs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-12">
        <div className="mb-10">
          <h1 className="mb-3 text-4xl font-bold">Campus Clubs</h1>
          <p className="text-lg text-muted-foreground">
            Join clubs that match your interests and connect with like-minded students
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club) => {
            const Icon = iconMap[club.icon] || Code;
            const memberStatus = isMember(club.id);
            
            return (
              <Card 
                key={club.id}
                className="shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-hover)] hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="rounded-xl bg-muted p-3 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary">{club.category}</Badge>
                  </div>
                  <CardTitle className="text-xl">{club.name}</CardTitle>
                  <CardDescription>{club.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="font-semibold text-foreground">{club.member_count}</span>
                    members
                  </div>

                  <Button 
                    className="w-full"
                    variant={memberStatus ? "secondary" : "default"}
                    onClick={() => handleJoinLeave(club.id, club.name, memberStatus)}
                  >
                    {memberStatus ? (
                      <>
                        <UserMinus className="mr-2 h-4 w-4" />
                        Leave Club
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Join Club
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl border bg-muted/30 p-8 text-center">
          <h2 className="mb-3 text-2xl font-bold">Why Join Clubs?</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {user 
              ? "Access exclusive club events, connect with members, and stay updated with club activities!"
              : "Sign in to join clubs, see exclusive events, and connect with like-minded students!"
            }
          </p>
          {!user && (
            <Button onClick={() => navigate("/auth")} className="mt-4">
              Sign In to Join
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clubs;
