import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, Search, SortDesc } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  max_attendees: number;
}

interface Registration {
  event_id: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    fetchEvents();
    fetchRegistrations();

    return () => subscription.unsubscribe();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading events",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('user_id', session.user.id);

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error: any) {
      console.error('Error fetching registrations:', error);
    }
  };

  const handleRegister = async (eventId: string, eventTitle: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to register for events",
      });
      navigate("/auth");
      return;
    }

    if (registrations.some(r => r.event_id === eventId)) {
      toast({
        title: "Already Registered",
        description: `You're already registered for "${eventTitle}"`,
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: user.id,
        });

      if (error) throw error;

      setRegistrations([...registrations, { event_id: eventId }]);
      toast({
        title: "Registration Successful!",
        description: `You've successfully registered for "${eventTitle}"`,
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Workshop: "bg-primary/10 text-primary border-primary/20",
      Cultural: "bg-secondary/10 text-secondary border-secondary/20",
      Competition: "bg-accent/10 text-accent border-accent/20",
      Seminar: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  const isRegistered = (eventId: string) => {
    return registrations.some(r => r.event_id === eventId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#050b18] to-[#0a1428]">
      <Navigation />
      
      <div className="container py-12">
        <div className="mb-10">
          <h1 className="mb-3 text-4xl font-bold text-white">Upcoming Events</h1>
          <p className="text-lg text-blue-200">
            Discover and register for exciting events happening on campus
          </p>

          {/* Search and Sort Section */}
          <div className="flex items-center gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="bg-blue-950/30 text-white border-blue-800/50 hover:bg-blue-900/40"
            >
              <SortDesc className="mr-2 h-4 w-4" />
              Sort by Date
            </Button>
            
            <div className="flex-1 max-w-md"> {/* Reduced search width */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full px-10 py-1.5 rounded-full bg-blue-950/30 border border-blue-800/50 text-white placeholder-blue-300/70 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {events
            .sort((a, b) => sortOrder === "asc" 
              ? new Date(a.date).getTime() - new Date(b.date).getTime()
              : new Date(b.date).getTime() - new Date(a.date).getTime())
            .filter(event => 
              event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              event.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((event) => (
              <Card 
                key={event.id} 
                className="flex flex-col bg-[#050b18]/90 border-blue-900/30 backdrop-blur-sm text-white hover:bg-[#050b18]/95 transition-colors"
              >
                <CardHeader>
                  <div className="mb-2 flex items-start justify-between">
                    <Badge className={getCategoryColor(event.category)}>
                      {event.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{event.max_attendees}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{event.time}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex gap-3">
                  <Button 
                    className="flex-[2] bg-blue-700 hover:bg-blue-600 text-white"
                    onClick={() => handleRegister(event.id, event.title)}
                    disabled={isRegistered(event.id)}
                  >
                    {isRegistered(event.id) ? "Registered ✓" : "Register Now"}
                  </Button>
                  <Button
                    variant="outline"
                    className={`flex-1 text-lg border-blue-700 ${
                      wishlist.includes(event.id) 
                        ? "bg-blue-700 text-white" 
                        : "bg-transparent text-blue-500 hover:bg-blue-900/20"
                    }`}
                    onClick={() => {
                      setWishlist(prev => 
                        prev.includes(event.id)
                          ? prev.filter(id => id !== event.id)
                          : [...prev, event.id]
                      );
                    }}
                  >
                    {wishlist.includes(event.id) ? "❤️ Wishlisted" : "🤍 Add to Wishlist"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
