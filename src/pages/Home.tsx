import { Button } from "@/components/ui/button";
import { Calendar, Users, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4ODg4ODgiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
        
        <div className="container relative py-24 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Your Campus, Connected
            </div>
            
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              <span className="bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent">
                CampusBuzz
              </span>
              <br />
              <span className="text-foreground">
                Discover Your Campus Life
              </span>
            </h1>
            
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Stay updated with all college events, workshops, and club activities in one place. 
              Never miss out on the experiences that matter.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="gap-2 text-base">
                <Link to="/events">
                  View Events
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" asChild className="gap-2 text-base">
                <Link to="/clubs">
                  <Users className="h-5 w-5" />
                  Explore Clubs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-3xl font-bold">Why CampusBuzz?</h2>
            
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-hover)]">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">All Events in One Place</h3>
                <p className="text-muted-foreground">
                  Browse workshops, seminars, cultural events, and competitions across all departments and clubs.
                </p>
              </div>
              
              <div className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-hover)]">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Club Activities</h3>
                <p className="text-muted-foreground">
                  Stay connected with your favorite clubs and never miss their exclusive activities and meetups.
                </p>
              </div>
              
              <div className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-hover)]">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <Sparkles className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Easy Registration</h3>
                <p className="text-muted-foreground">
                  Register for events with a single click and get instant confirmations and reminders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
