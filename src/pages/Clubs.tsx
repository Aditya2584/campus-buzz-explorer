import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Palette, Music, Cpu, BookOpen, Trophy } from "lucide-react";

const clubs = [
  {
    id: 1,
    name: "Coding Club",
    icon: Code,
    description: "Learn programming, participate in hackathons, and build amazing projects.",
    members: 120,
    category: "Technical",
    color: "text-primary",
  },
  {
    id: 2,
    name: "Cultural Club",
    icon: Palette,
    description: "Express yourself through art, dance, drama, and cultural performances.",
    members: 95,
    category: "Cultural",
    color: "text-secondary",
  },
  {
    id: 3,
    name: "Music Society",
    icon: Music,
    description: "From classical to contemporary, explore all forms of musical expression.",
    members: 78,
    category: "Cultural",
    color: "text-accent",
  },
  {
    id: 4,
    name: "Robotics Club",
    icon: Cpu,
    description: "Design, build, and program robots for competitions and exhibitions.",
    members: 65,
    category: "Technical",
    color: "text-purple-500",
  },
  {
    id: 5,
    name: "Literary Society",
    icon: BookOpen,
    description: "Engage in debates, creative writing, poetry, and book discussions.",
    members: 88,
    category: "Academic",
    color: "text-pink-500",
  },
  {
    id: 6,
    name: "Sports Committee",
    icon: Trophy,
    description: "Organize tournaments, fitness sessions, and inter-college competitions.",
    members: 142,
    category: "Sports",
    color: "text-green-500",
  },
];

const Clubs = () => {
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
            const Icon = club.icon;
            return (
              <Card 
                key={club.id}
                className="shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-hover)] hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="mb-3 flex items-center justify-between">
                    <div className={`rounded-xl bg-muted p-3 ${club.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary">{club.category}</Badge>
                  </div>
                  <CardTitle className="text-xl">{club.name}</CardTitle>
                  <CardDescription>{club.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{club.members}</span>
                    members
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl border bg-muted/30 p-8 text-center">
          <h2 className="mb-3 text-2xl font-bold">Want to Join a Club?</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Sign in to see exclusive club activities, register for club events, and connect with members.
            Each club offers unique opportunities to learn, grow, and have fun!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Clubs;
